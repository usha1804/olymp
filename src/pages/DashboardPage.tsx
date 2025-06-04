
import { useState } from "react";
import {
  ChevronDown,
  BarChart2,
  Calendar,
  BookOpen,
  Award,
  Clock,
  User,
  Bell,
  Settings,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const DashboardPage = () => {
  const [userType] = useState("student"); // This could be dynamic based on auth
  
  // Sample user data
  const userData = {
    name: "John Smith",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    role: "Student",
    progress: 75,
    completedExams: 8,
    upcomingExams: 3,
    results: [
      { id: 1, examName: "Mathematics Olympiad", score: "85/100", grade: "A", date: "March 15, 2025" },
      { id: 2, examName: "Science Challenge", score: "92/100", grade: "A+", date: "February 28, 2025" },
      { id: 3, examName: "History Quiz", score: "78/100", grade: "B+", date: "January 20, 2025" }
    ],
    upcomingEvents: [
      { id: 1, title: "Physics Mock Test", date: "May 10, 2025", type: "exam" },
      { id: 2, title: "Chemistry Revision", date: "May 15, 2025", type: "study" },
      { id: 3, title: "Final Mathematics Exam", date: "May 20, 2025", type: "exam" }
    ]
  };

  // Dashboard views for different user types
  const renderDashboardContent = () => {
    switch (userType) {
      case "student":
        return (
          <>
            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <BookOpen size={24} className="text-education-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-education-dark">Completed Exams</h3>
                    <p className="text-3xl font-bold text-education-blue">{userData.completedExams}</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-education-blue rounded-full"
                    style={{ width: `${userData.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <Award size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-education-dark">Average Score</h3>
                    <p className="text-3xl font-bold text-green-600">85%</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="text-green-500 font-medium">↑ 5%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 p-2 rounded-full mr-4">
                    <Calendar size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-education-dark">Upcoming Exams</h3>
                    <p className="text-3xl font-bold text-yellow-600">{userData.upcomingExams}</p>
                  </div>
                </div>
                <a href="#" className="text-education-blue hover:underline text-sm font-medium flex items-center">
                  View schedule <ChevronDown size={16} className="ml-1" />
                </a>
              </div>
            </div>
            
            {/* Recent Results */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-education-dark">Recent Results</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Name</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userData.results.map((result) => (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-education-dark">{result.examName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{result.score}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            result.grade.startsWith('A') 
                              ? 'bg-green-100 text-green-800' 
                              : result.grade.startsWith('B') 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {result.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-education-blue hover:text-blue-700">View Details</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-100 text-center">
                <a href="#" className="text-education-blue hover:text-blue-700 font-medium">
                  View All Results
                </a>
              </div>
            </div>
            
            {/* Upcoming Events and Recommended Tests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-education-dark">Upcoming Events</h2>
                </div>
                <div className="p-6">
                  <ul className="divide-y divide-gray-100">
                    {userData.upcomingEvents.map((event) => (
                      <li key={event.id} className="py-3">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full mr-3 ${
                              event.type === 'exam' ? 'bg-yellow-100' : 'bg-blue-100'
                            }`}>
                              {event.type === 'exam' ? (
                                <Clock size={16} className="text-yellow-600" />
                              ) : (
                                <BookOpen size={16} className="text-blue-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-education-dark">{event.title}</h4>
                              <p className="text-sm text-gray-500">{event.date}</p>
                            </div>
                          </div>
                          <a href="#" className="text-education-blue hover:underline text-sm">
                            Details
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 border-t border-gray-100 text-center">
                  <a href="#" className="text-education-blue hover:text-blue-700 font-medium">
                    View Calendar
                  </a>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-education-dark">Recommended Tests</h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    <li className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-education-dark">Advanced Mathematics</h4>
                          <p className="text-sm text-gray-500">Based on your previous performance</p>
                        </div>
                        <a href="#" className="btn-primary py-1.5 px-3 text-sm">
                          Take Test
                        </a>
                      </div>
                    </li>
                    <li className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-education-dark">Physics Fundamentals</h4>
                          <p className="text-sm text-gray-500">Prepare for your upcoming exam</p>
                        </div>
                        <a href="#" className="btn-primary py-1.5 px-3 text-sm">
                          Take Test
                        </a>
                      </div>
                    </li>
                    <li className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-education-dark">English Literature</h4>
                          <p className="text-sm text-gray-500">Improve your comprehension skills</p>
                        </div>
                        <a href="#" className="btn-primary py-1.5 px-3 text-sm">
                          Take Test
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="p-4 border-t border-gray-100 text-center">
                  <a href="#" className="text-education-blue hover:text-blue-700 font-medium">
                    Browse All Tests
                  </a>
                </div>
              </div>
            </div>
          </>
        );
      case "parent":
        // Parent dashboard content would go here
        return <div>Parent Dashboard Content</div>;
      case "school":
        // School dashboard content would go here
        return <div>School Dashboard Content</div>;
      case "admin":
        // Admin dashboard content would go here
        return <div>Admin Dashboard Content</div>;
      default:
        return <div>Invalid user type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="education-container flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={userData.avatar}
                alt="User avatar"
                className="w-10 h-10 rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h3 className="font-medium text-education-dark">Welcome, {userData.name}</h3>
              <p className="text-sm text-gray-500">{userData.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-education-blue">
              <Bell size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-education-blue">
              <User size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-education-blue">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="education-container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-education-dark">Dashboard</h1>
          <div className="flex space-x-3">
            <button className="btn-outline py-1.5 px-3 text-sm">
              <Clock size={16} className="inline-block mr-1" /> Last 30 Days
            </button>
            <button className="btn-primary py-1.5 px-3 text-sm">
              <BarChart2 size={16} className="inline-block mr-1" /> View Reports
            </button>
          </div>
        </div>
        
        {/* Main Dashboard Content */}
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default DashboardPage;
