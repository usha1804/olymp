import React, { useState } from 'react';

interface ExamResult {
  id: string;
  examName: string;
  subject: string;
  examType: string;
  createdBy: string;
  duration: string;
  score: string;
  date: string;
  status: 'completed' | 'pending';
}

interface ExamResultsPageProps {
  userType: 'student' | 'admin' | 'school' | 'sales';
}

const ExamResultsPage: React.FC<ExamResultsPageProps> = ({ userType = 'student' }) => {
  const [results, setResults] = useState<ExamResult[]>([
    {
      id: '1',
      examName: 'Circles',
      subject: 'Mathematics',
      examType: 'Objective',
      createdBy: 'Oswal Experts',
      duration: '90 MIN',
      score: '40/50',
      date: '2025-05-10',
      status: 'completed'
    },
    {
      id: '2',
      examName: 'Electromagnetic Waves',
      subject: 'Physics',
      examType: 'Objective',
      createdBy: 'Oswal Experts',
      duration: '90 MIN',
      score: '35/50',
      date: '2025-05-05',
      status: 'completed'
    },
    {
      id: '3',
      examName: 'Organic Chemistry',
      subject: 'Chemistry',
      examType: 'Objective',
      createdBy: 'Oswal Experts',
      duration: '90 MIN',
      score: '42/50',
      date: '2025-04-28',
      status: 'completed'
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newResult, setNewResult] = useState<Omit<ExamResult, 'id'>>({ 
    examName: '',
    subject: '',
    examType: 'Objective',
    createdBy: '',
    duration: '',
    score: '',
    date: new Date().toISOString().split('T')[0],
    status: 'completed'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewResult(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddResult = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = (results.length + 1).toString();
    setResults(prev => [...prev, { ...newResult, id: newId }]);
    setShowAddForm(false);
    setNewResult({ 
      examName: '',
      subject: '',
      examType: 'Objective',
      createdBy: '',
      duration: '',
      score: '',
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    });
  };

  return (
    <div>
        
        <div className="p-3 sm:p-4 md:p-6">
          <div className="mb-4 md:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Exams</h3>
              <p className="text-2xl font-semibold">{results.length}</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Average Score</h3>
              <p className="text-2xl font-semibold">
                {Math.round(
                  results.reduce((acc, curr) => {
                    const [scored, total] = curr.score.split('/');
                    return acc + (parseInt(scored) / parseInt(total)) * 100;
                  }, 0) / results.length
                )}
                <span className="text-sm text-gray-500">%</span>
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Best Score</h3>
              <p className="text-2xl font-semibold">
                {results.reduce((best, curr) => {
                  const [scored, total] = curr.score.split('/');
                  const percentage = (parseInt(scored) / parseInt(total)) * 100;
                  return percentage > best ? percentage : best;
                }, 0).toFixed(0)}
                <span className="text-sm text-gray-500">%</span>
              </p>
            </div>
          </div>
          
          <div className="mb-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
              <h2 className="text-lg font-semibold">Exam Results</h2>
              {userType !== 'student' && (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-education-blue text-white rounded-md text-sm font-medium w-full sm:w-auto hover:bg-blue-700 transition-colors"
                >
                  Add New Result
                </button>
              )}
            </div>

            {showAddForm && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <form onSubmit={handleAddResult}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                      <input
                        type="text"
                        name="examName"
                        value={newResult.examName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={newResult.subject}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                      <select
                        name="examType"
                        value={newResult.examType}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="Objective">Objective</option>
                        <option value="Subjective">Subjective</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                      <input
                        type="text"
                        name="createdBy"
                        value={newResult.createdBy}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g. 90 MIN)</label>
                      <input
                        type="text"
                        name="duration"
                        value={newResult.duration}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Score (e.g. 40/50)</label>
                      <input
                        type="text"
                        name="score"
                        value={newResult.score}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                        pattern="\d+/\d+"
                        title="Format should be like 40/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={newResult.date}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md w-full sm:w-auto mb-2 sm:mb-0 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-education-blue text-white rounded-md w-full sm:w-auto hover:bg-blue-700 transition-colors"
                    >
                      Save Result
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Desktop table view - hidden on mobile */}
            <div className="hidden md:block overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full table-auto min-w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Exam Name</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Subject</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Exam Type</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Created By</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Duration</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Score</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm">{result.examName}</td>
                      <td className="px-4 py-3 text-sm">{result.subject}</td>
                      <td className="px-4 py-3 text-sm">{result.examType}</td>
                      <td className="px-4 py-3 text-sm">{result.createdBy}</td>
                      <td className="px-4 py-3 text-sm">{result.duration}</td>
                      <td className="px-4 py-3 text-sm">{new Date(result.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm">{result.score}</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="px-3 py-1 bg-amber-50 text-amber-500 rounded-md text-xs font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile card view - only visible on mobile */}
            <div className="md:hidden space-y-3 mt-4">
              {results.map((result) => (
                <div key={result.id} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{result.examName}</h3>
                    <span className="text-sm bg-amber-50 text-amber-500 px-2 py-1 rounded">{result.score}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                    <div>
                      <p className="text-gray-500">Subject</p>
                      <p>{result.subject}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p>{result.examType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p>{new Date(result.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p>{result.duration}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-3 py-2 bg-education-blue text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 mt-4 md:mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-4 gap-2 sm:gap-0">
              <h2 className="text-lg font-semibold">Upcoming Exams</h2>
              <button className="text-sm text-education-blue hover:text-blue-700 font-medium">View Calendar</button>
            </div>
            <ul className="space-y-3">
              <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 rounded-md gap-2 shadow-sm">
                <div>
                  <h3 className="font-medium">Chemistry Olympiad</h3>
                  <p className="text-sm text-gray-500">June 1, 2025 • 10:00 AM</p>
                </div>
                <button className="px-3 py-2 bg-education-blue text-white rounded-md text-sm font-medium w-full sm:w-auto hover:bg-blue-700 transition-colors">Prepare</button>
              </li>
              <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 rounded-md gap-2 shadow-sm">
                <div>
                  <h3 className="font-medium">Mathematics Olympiad</h3>
                  <p className="text-sm text-gray-500">June 15, 2025 • 2:00 PM</p>
                </div>
                <button className="px-3 py-2 bg-education-blue text-white rounded-md text-sm font-medium w-full sm:w-auto hover:bg-blue-700 transition-colors">Prepare</button>
              </li>
            </ul>
          </div>
        </div>
    </div>
  );
};

export default ExamResultsPage;
