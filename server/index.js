require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");

const app = express();

// Enable CORS for frontend
app.use(
  cors({
    origin: "*", // Allow any domain (Vercel, Localhost, etc.)
    credentials: true,
  })
);

app.use(express.json());

// --- CONFIGURATION ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- 1. EVALUATION ENDPOINT ---
app.post("/api/evaluate", async (req, res) => {
  const { userId, code, description, title, language, expectedOutput } =
    req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a Senior Technical Interviewer. 
      Evaluate the following coding task submission.
      
      TASK DETAILS:
      - Title: ${title}
      - Language: ${language}
      - Description: ${description}
      - Expected Output: ${expectedOutput || "Not provided"}

      CODE SUBMISSION:
      ${code}

      CRITICAL INSTRUCTION: Output RAW JSON only. Do not use markdown.
      
      JSON STRUCTURE:
      {
        "public_data": { 
          "score": (0-100), 
          "strengths": ["string", "string", "string"], 
          "summary_feedback": "string" 
        },
        "premium_data": { 
          "detailed_analysis": "string", 
          "bugs_found": ["string", "string"], 
          "refactored_code": "string" 
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean JSON - Remove markdown formatting if AI adds it
    const jsonStartIndex = responseText.indexOf("{");
    const jsonEndIndex = responseText.lastIndexOf("}");
    if (jsonStartIndex === -1) throw new Error("Invalid AI Response");

    const cleanJson = responseText.substring(jsonStartIndex, jsonEndIndex + 1);
    const aiResponse = JSON.parse(cleanJson);

    // Save to Supabase
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        title: title,
        language: language,
        expected_output: expectedOutput,
        code_content: code,
        description: description,
        ai_feedback: aiResponse.public_data,
        full_report: aiResponse.premium_data,
        is_paid: false,
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, taskId: data.id });
  } catch (error) {
    console.error("Evaluation Error:", error);
    res
      .status(500)
      .json({ error: "Evaluation failed", details: error.message });
  }
});

// --- 2. RAZORPAY: CREATE ORDER ---
app.post("/api/create-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- 3. RAZORPAY: VERIFY PAYMENT & SAVE RECORD ---
app.post("/api/verify-payment", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    taskId,
    userId,
  } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    try {
      // 1. Log the Payment in the 'payments' table
      const { error: paymentError } = await supabase.from("payments").insert({
        user_id: userId,
        task_id: taskId,
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        amount: 499, // Store as 499 INR
        status: "success",
      });

      if (paymentError) {
        console.error("Failed to log payment:", paymentError);
        // We continue even if logging fails, to ensure the user gets their content
      }

      // 2. Unlock the Report (Update 'tasks' table)
      const { error: taskError } = await supabase
        .from("tasks")
        .update({ is_paid: true })
        .eq("id", taskId)
        .eq("user_id", userId);

      if (taskError) throw taskError;

      res.json({ success: true });
    } catch (dbError) {
      console.error("DB Update Failed:", dbError);
      res.status(500).json({ error: "Payment verified but DB update failed" });
    }
  } else {
    res.status(400).json({ error: "Invalid Signature" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
