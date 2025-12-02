import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, AlertCircle, CheckCircle2, Terminal, ScanLine } from 'lucide-react';

export default function HeroAnimation() {
  const [step, setStep] = useState(0);

  // The Animation Sequence
  useEffect(() => {
    const sequence = [
      setTimeout(() => setStep(1), 1000), // Step 1: Start Scanning
      setTimeout(() => setStep(2), 2500), // Step 2: Detect Bug (Red)
      setTimeout(() => setStep(3), 4000), // Step 3: Fix Bug (Green)
      setTimeout(() => setStep(4), 5500), // Step 4: Show Score
    ];
    return () => sequence.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      
      {/* --- Main Code Window --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-[#0F172A] rounded-xl border border-gray-800 shadow-2xl overflow-hidden font-mono text-sm"
      >
        {/* Window Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Terminal className="w-3 h-3" /> task_evaluator.js
          </div>
        </div>

        {/* Code Content */}
        <div className="p-6 space-y-2 relative text-left">
          
          {/* Scanning Laser Beam */}
          {step === 1 && (
            <motion.div 
              initial={{ top: 0, opacity: 0 }}
              animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.5, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] z-10"
            />
          )}

          {/* Line 1 */}
          <div className="text-gray-400">
            <span className="text-purple-400">function</span> <span className="text-blue-400">calculateTotal</span>(items) {'{'}
          </div>

          {/* Line 2: The Buggy Line */}
          <motion.div 
            className="flex items-center"
            animate={{ 
              backgroundColor: step === 2 ? "rgba(239, 68, 68, 0.1)" : step >= 3 ? "rgba(34, 197, 94, 0.1)" : "transparent"
            }}
          >
            <span className="text-gray-500 mr-4">2</span>
            <span className="text-gray-300">let total = </span>
            
            {step < 3 ? (
              // The Bug
              <span className={`${step === 2 ? 'text-red-400 font-bold' : 'text-gray-300'}`}>0</span> 
            ) : (
              // The Fix
              <motion.span 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 font-bold"
              >
                0
              </motion.span>
            )}
            <span className="text-gray-300">;</span>

            {/* Error Badge */}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="ml-auto bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" /> Memory Leak
              </motion.div>
            )}

            {/* Fix Badge */}
            {step >= 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="ml-auto bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" /> Fixed
              </motion.div>
            )}
          </motion.div>

          {/* Line 3 */}
          <div className="text-gray-400">
            <span className="text-gray-500 mr-4">3</span>
            <span className="text-purple-400">return</span> items.reduce((a, b) ={'>'} a + b, 0);
          </div>

          <div className="text-gray-400">{'}'}</div>
        </div>

        {/* AI Processing Status */}
        <div className="border-t border-gray-800 bg-gray-900/50 p-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs">
            {step < 3 ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                  <ScanLine className="w-3 h-3 text-blue-400" />
                </motion.div>
                <span className="text-blue-400">AI Analysis in progress...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span className="text-green-400">Code Optimized</span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-600 font-mono">14ms</div>
        </div>
      </motion.div>

      {/* --- Floating Score Card (Pop-up) --- */}
      {step >= 4 && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="absolute -right-6 -bottom-6 bg-white p-4 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-4 z-20"
        >
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="#f3f4f6" strokeWidth="4" fill="none" />
              <motion.circle 
                cx="24" cy="24" r="20" stroke="#22c55e" strokeWidth="4" fill="none"
                strokeDasharray="125"
                initial={{ strokeDashoffset: 125 }}
                animate={{ strokeDashoffset: 5 }} 
                transition={{ duration: 1, delay: 0.2 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-green-600 text-sm">
              98
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Quality Score</div>
            <div className="text-sm font-bold text-gray-900">Excellent</div>
          </div>
        </motion.div>
      )}

      {/* Background Glow Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-3xl -z-10" />
    </div>
  );
}