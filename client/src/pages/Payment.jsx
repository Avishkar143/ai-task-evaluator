import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { ArrowLeft, CreditCard, Lock, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export default function Payment({ session }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
  }, [id]);

  const fetchTaskDetails = async () => {
    const { data } = await supabase.from('tasks').select('*').eq('id', id).single();
    if (data) setTask(data);
    setLoading(false);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // 1. Create Order on Server
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 499 }) // ₹499
      });
      const orderData = await orderRes.json();

      if (!orderData.id) throw new Error("Order creation failed");

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Smart Task Evaluator",
        description: "Unlock Detailed Code Report",
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify Payment on Server
          const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              taskId: id,
              userId: session.user.id
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            navigate(`/task/${id}`);
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: session.user.email, // Auto-fill user email
          email: session.user.email,
        },
        theme: {
          color: "#2563EB"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error(error);
      alert("Payment initiation failed.");
    }
    setProcessing(false);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
        <Link to={`/task/${id}`} className="flex items-center text-gray-500 mb-6 font-bold"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
        
        <h1 className="text-3xl font-extrabold mb-2">Unlock Report</h1>
        <p className="text-gray-500 mb-8">Pay ₹499 to access full AI analysis.</p>

        <div className="border border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-lg mb-4">{task?.title || "Untitled Task"}</h3>
          <ul className="space-y-2 text-sm text-gray-600">
             <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Detailed Code Review</li>
             <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Security Audit</li>
             <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Refactored Solution</li>
          </ul>
        </div>

        <button 
          onClick={handlePayment} 
          disabled={processing}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg flex justify-center gap-2"
        >
          {processing ? <Loader2 className="animate-spin" /> : <Lock className="w-5 h-5" />}
          Pay ₹499 via Razorpay
        </button>
        
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4" /> Secured by Razorpay
        </div>
      </div>
    </div>
  );
}