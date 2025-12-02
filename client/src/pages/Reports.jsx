import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  Lock, 
  Unlock,
  TrendingUp,
  Calendar,
  ChevronRight
} from 'lucide-react';

export default function Reports({ session }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, unlocked: 0, avgScore: 0 });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setReports(data);
      
      // Calculate Stats
      const total = data.length;
      const unlocked = data.filter(r => r.is_paid).length;
      const scores = data.map(r => r.ai_feedback?.score || 0);
      const avg = total > 0 ? (scores.reduce((a, b) => a + b, 0) / total).toFixed(1) : 0;

      setStats({ total, unlocked, avgScore: avg });
    }
    setLoading(false);
  };

  const filteredReports = reports.filter(report => 
    (report.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen bg-white">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-black mb-2">Evaluation Reports</h1>
        <p className="text-gray-500 text-lg">Access your AI-generated code evaluation reports</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          label="Total Reports" 
          value={stats.total} 
          icon={FileText} 
          color="blue" 
        />
        <StatCard 
          label="Unlocked Reports" 
          value={stats.unlocked} 
          icon={Unlock} 
          color="green" 
        />
        <StatCard 
          label="Average Score" 
          value={stats.avgScore} 
          icon={TrendingUp} 
          color="orange" 
        />
      </div>

      {/* Search Bar */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search reports..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-gray-700 bg-white placeholder-gray-400"
        />
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">No reports found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              
              {/* Card Header */}
              <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title || "Untitled Task"}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
                    {report.ai_feedback?.summary_feedback || report.description || "No summary available."}
                  </p>
                </div>
                
                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap ${
                  report.is_paid 
                    ? 'bg-green-50 text-green-700 border border-green-100' 
                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}>
                  {report.is_paid ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {report.is_paid ? 'Unlocked' : 'Locked'}
                </span>
              </div>

              {/* Meta Data Row */}
              <div className="flex items-center gap-6 mb-8 text-sm border-b border-gray-50 pb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${report.ai_feedback?.score > 70 ? 'text-green-500' : 'text-orange-500'}`} />
                  <span className="font-bold text-gray-700">Score:</span>
                  <span className={`font-black ${report.ai_feedback?.score > 70 ? 'text-green-600' : 'text-orange-600'}`}>
                    {report.ai_feedback?.score || 0}/100
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* View Summary Button */}
                <Link to={`/task/${report.id}`}>
                  <button className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors bg-white">
                    View Summary
                  </button>
                </Link>

                {/* Main Action Button */}
                <Link to={`/task/${report.id}`}>
                  <button className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 ${
                    report.is_paid 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}>
                    {report.is_paid ? 'View Full Report' : 'Unlock Full Report'}
                  </button>
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper Component for the Top Stats
const StatCard = ({ label, value, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};