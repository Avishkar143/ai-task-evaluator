import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, TrendingUp, Plus, List, FileBarChart, ArrowRight } from 'lucide-react';

export default function Dashboard({ session }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, reports: 0, avgScore: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (data) {
      setTasks(data);
      const total = data.length;
      const scores = data.map(t => t.ai_feedback?.score || 0);
      const avg = total > 0 ? (scores.reduce((a, b) => a + b, 0) / total).toFixed(1) : 0;
      setStats({ total, completed: total, reports: total, avgScore: avg });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 min-h-full">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome back, Developer</h1>
        <p className="text-gray-500">Track your coding tasks and evaluation progress</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Total Tasks" value={stats.total} icon={FileText} color="blue" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle} color="green" />
        <StatCard label="Reports" value={stats.reports} icon={FileBarChart} color="purple" />
        <StatCard label="Avg Score" value={stats.avgScore} icon={TrendingUp} color="orange" />
      </div>
      <div className="mb-12">
        <h2 className="text-xl font-bold text-black mb-4">Quick Actions</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Link to="/submit" className="flex-1">
            <button className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <Plus className="w-5 h-5" /> Submit New Task
            </button>
          </Link>
          <Link to="/reports" className="flex-1 bg-white border border-gray-300 text-gray-700 p-4 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <List className="w-5 h-5" /> View All Tasks
          </Link>
          <Link to="/reports" className="flex-1 bg-white border border-gray-300 text-gray-700 p-4 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <FileBarChart className="w-5 h-5" /> View Reports
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-black">Recent Tasks</h2>
            <Link to="/reports" className="text-sm text-blue-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-4">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{task.title || "Untitled Task"}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Completed</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-black">Recent Reports</h2>
            <Link to="/reports" className="text-sm text-blue-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-4">
            {tasks.slice(0, 3).map((task) => (
              <Link to={`/task/${task.id}`} key={task.id} className="block group">
                <div className="p-4 border border-gray-100 rounded-xl hover:bg-blue-50 transition-colors group-hover:border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-700">Evaluation Report</h3>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${task.is_paid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {task.is_paid ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">Score: {task.ai_feedback?.score}/100</span>
                    <div className="h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
                      <div style={{ width: `${task.ai_feedback?.score}%` }} className="h-full bg-blue-600 rounded-full" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colors = { blue: "bg-blue-50 text-blue-600", green: "bg-green-50 text-green-600", purple: "bg-purple-50 text-purple-600", orange: "bg-orange-50 text-orange-600" };
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div><p className="text-sm text-gray-500 font-medium mb-1">{label}</p><h3 className="text-3xl font-extrabold text-gray-900">{value}</h3></div>
      <div className={`p-3 rounded-xl ${colors[color]}`}><Icon className="w-6 h-6" /></div>
    </div>
  );
};