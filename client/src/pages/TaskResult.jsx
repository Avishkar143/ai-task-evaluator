import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
  ArrowLeft, Calendar, FileText, TrendingUp, CheckCircle2, 
  Lock, Unlock, AlertCircle, Bug, Code2
} from 'lucide-react';

export default function TaskResult() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    const { data } = await supabase.from('tasks').select('*').eq('id', id).single();
    if (data) setTask(data);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading Report...</div>;
  if (!task) return <div className="text-center py-20 text-red-500">Report not found.</div>;

  const score = task.ai_feedback?.score || 0;
  const getScoreColor = (s) => {
    if (s >= 80) return "text-green-500 bg-green-50 border-green-200";
    if (s >= 60) return "text-yellow-500 bg-yellow-50 border-yellow-200";
    return "text-red-500 bg-red-50 border-red-200";
  };
  const scoreColorClass = getScoreColor(score);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 bg-white min-h-screen">
      <Link to="/reports" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Reports
      </Link>

      <div className="mb-10">
        {/* TASK TITLE DISPLAY */}
        <h1 className="text-4xl font-extrabold text-black mb-4">{task.title || "Untitled Task Evaluation"}</h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Calendar className="w-4 h-4" /> <span>{new Date(task.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 uppercase font-bold">
            <Code2 className="w-4 h-4" /> <span>{task.language || "Unknown"}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-xl ${scoreColorClass.split(' ')[1]}`}>
            <TrendingUp className={`w-6 h-6 ${scoreColorClass.split(' ')[0]}`} />
          </div>
          <div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">Overall Score</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black ${scoreColorClass.split(' ')[0]}`}>{score}</span>
              <span className="text-gray-400 font-bold text-xl">/100</span>
            </div>
          </div>
        </div>
        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
          <div style={{ width: `${score}%` }} className={`h-full rounded-full transition-all duration-1000 ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-12">
        <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold text-lg">
          <FileText className="w-5 h-5" /> <h2>Feedback Summary</h2>
        </div>
        <p className="text-gray-600 leading-relaxed text-lg">{task.ai_feedback?.summary_feedback || "No summary available."}</p>
        {task.ai_feedback?.strengths && (
           <div className="mt-6 space-y-2">
             <h3 className="font-bold text-gray-900 text-sm uppercase mb-3">Key Strengths</h3>
             {task.ai_feedback.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                   <span className="text-gray-700">{s}</span>
                </div>
             ))}
           </div>
        )}
      </div>

      <div className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${task.is_paid ? 'bg-gray-900 text-white' : 'bg-black text-white'}`}>
        <div className="p-10 relative z-10">
           <div className="flex items-center gap-3 mb-6">
              {task.is_paid ? <Unlock className="w-6 h-6 text-green-400" /> : <Lock className="w-6 h-6 text-purple-400" />}
              <h2 className="text-2xl font-bold">{task.is_paid ? "Full Detailed Report" : "Unlock Full Detailed Report"}</h2>
           </div>

           {!task.is_paid && (
             <div className="space-y-6">
                <p className="text-gray-400 text-lg">Get comprehensive analysis including:</p>
                <ul className="grid md:grid-cols-2 gap-4 text-gray-300">
                   {["Detailed code quality assessment", "Best practices recommendations", "Performance optimization", "Security vulnerability analysis", "Line-by-line code review"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> {item}</li>
                   ))}
                </ul>
                <div className="pt-6">
                  {/* NAVIGATION TO PAYMENT PAGE */}
                  <Link to={`/payment/${id}`}>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-lg font-bold transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2">
                      <Unlock className="w-5 h-5" /> Unlock Now - ₹499
                    </button>
                  </Link>
                </div>
             </div>
           )}

           {task.is_paid && (
             <div className="space-y-8 animate-in fade-in duration-700">
                <div>
                   <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2"><Code2 className="w-5 h-5" /> Recommended Solution</h3>
                   <div className="bg-gray-950 rounded-xl border border-gray-800 p-6 overflow-x-auto font-mono text-sm text-gray-300">
                      <pre>{task.full_report?.refactored_code || "// No code suggestions provided."}</pre>
                   </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                   <div>
                      <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><Bug className="w-5 h-5" /> Issues Detected</h3>
                      <ul className="space-y-3">
                         {task.full_report?.bugs_found?.map((bug, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                               <AlertCircle className="w-4 h-4 text-red-500 mt-1 shrink-0" /> <span>{bug}</span>
                            </li>
                         ))}
                      </ul>
                   </div>
                   <div>
                      <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Detailed Analysis</h3>
                      <p className="text-gray-300 leading-relaxed bg-gray-800/50 p-4 rounded-lg">{task.full_report?.detailed_analysis}</p>
                   </div>
                </div>
             </div>
           )}
        </div>
        {!task.is_paid && <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />}
      </div>
    </div>
  );
}