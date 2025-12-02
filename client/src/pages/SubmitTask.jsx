import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Code2, UploadCloud } from 'lucide-react';

export default function SubmitTask({ session }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', description: '', language: '', code: '', expectedOutput: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, ...formData })
      });
      const data = await response.json();
      if (data.success) {
        navigate(`/task/${data.taskId}`);
      } else {
        alert("Error: " + (data.details || "Unknown error"));
      }
    } catch (error) {
      alert("Server connection failed.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-white min-h-full">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-black mb-3">Submit Coding Task</h1>
        <p className="text-gray-500 text-lg">Upload your code for comprehensive AI-powered evaluation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-8 text-blue-600 font-bold text-lg border-b border-gray-100 pb-4">
            <Code2 className="w-5 h-5" />
            <h2>Task Details</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Task Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., React Component Implementation" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Task Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the task..." className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Programming Language *</label>
              <select name="language" value={formData.language} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" required>
                <option value="">Select a language</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Code Content *</label>
              <textarea name="code" value={formData.code} onChange={handleChange} placeholder="Paste code here..." className="w-full p-3 border border-gray-300 rounded-lg h-64 font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Expected Output (Optional)</label>
              <textarea name="expectedOutput" value={formData.expectedOutput} onChange={handleChange} placeholder="Describe expected behavior..." className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 pt-6">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-70 flex justify-center items-center gap-2">
              {loading ? 'Analyzing...' : <><UploadCloud className="w-5 h-5" /> Submit Task</>}
            </button>
            <Link to="/dashboard" className="px-8 py-3.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors">Cancel</Link>
          </div>
        </div>
      </form>
    </div>
  );
}