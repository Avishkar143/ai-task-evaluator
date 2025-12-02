import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Calendar, 
  Code2, 
  FileText, 
  ChevronDown,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function MyTasks({ session }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [languageFilter, setLanguageFilter] = useState('All Languages');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setTasks(data);
    setLoading(false);
  };

  // Logic to handle filtering
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = (task.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const isCompleted = task.ai_feedback !== null;
    const matchesStatus = statusFilter === 'All Statuses' 
      ? true 
      : statusFilter === 'Completed' ? isCompleted : !isCompleted;

    const matchesLanguage = languageFilter === 'All Languages' 
      ? true 
      : (task.language || '').toLowerCase() === languageFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesLanguage;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-white text-black">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-black mb-1">My Tasks</h1>
          <p className="text-gray-500">Manage and track all your submitted coding tasks</p>
        </div>
        <Link to="/submit">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm">
            <Plus className="w-5 h-5" /> New Task
          </button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative md:w-48">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 appearance-none bg-white cursor-pointer"
          >
            <option>All Statuses</option>
            <option>Completed</option>
            <option>Evaluating</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Language Dropdown */}
        <div className="relative md:w-48">
          <select 
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-700 appearance-none bg-white cursor-pointer"
          >
            <option>All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading your tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
          <p className="text-gray-500 mb-4">No tasks found matching your filters.</p>
          <Link to="/submit" className="text-blue-600 font-bold hover:underline">Submit a new task</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTasks.map((task) => {
            const isCompleted = task.ai_feedback !== null;
            return (
              <div key={task.id} className="border border-gray-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-colors shadow-sm">
                
                {/* Top Row: Title & Badge */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{task.title || "Untitled Task"}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isCompleted 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                  }`}>
                    {isCompleted ? "Completed" : "Evaluating"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                  {task.description || "No description provided."}
                </p>

                {/* Meta Info Row */}
                <div className="flex flex-wrap gap-y-2 gap-x-8 text-xs text-gray-500 font-medium mb-6">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-500" />
                    <span className="capitalize">{task.language || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{new Date(task.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>{task.code_content?.length || 0} characters</span>
                  </div>
                </div>

                {/* Buttons Row */}
                <div className="flex flex-col md:flex-row gap-4">
                  <Link to={`/task/${task.id}`} className="flex-1">
                    <button className="w-full py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </Link>
                  <Link to={`/task/${task.id}`} className="flex-1">
                    <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors border border-transparent">
                      View Evaluation
                    </button>
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}