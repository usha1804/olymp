import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, BookOpen, Clock, School } from "lucide-react";
import UpcomingExams from "../components/Dashbordspages/Upcomingexams";
import ExamResults from "../components/Dashbordspages/examresults";
import DashboardLayout from "../components/dashboard/DashboardLayout";

interface School {
  id: string;
  name: string;
  totalStudents: number;
}

const SchoolDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'exams' | 'students'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const schools: School[] = [
    {
      id: '1',                 
      name: 'Delhi Public School',
      totalStudents: 1500,
    },
    {
      id: '2',
      name: 'St. Xavier’s School',
      totalStudents: 1200,
    },
    {
      id: '3',
      name: 'Ryan International School',
      totalStudents: 1800,
    },
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    const handleDashboardNavigation = (event: CustomEvent) => {
      const { section, userType } = event.detail;
      if (userType === 'admin') {
        if (section === 'dashboard') {
          setActiveSection('dashboard');
        } else if (section === 'schools') {
          navigate('/admin/schools');
        } else if (section === 'exam results') {
          setActiveSection('students');
        } else if (section === 'tasks') {
          setActiveSection('exams');
        }
      }
    };

    document.addEventListener('dashboard-navigation', handleDashboardNavigation as EventListener);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
      document.removeEventListener('dashboard-navigation', handleDashboardNavigation as EventListener);
    };
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSchoolClick = (schoolId: string) => {
    navigate(`/admin/school/${schoolId}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'exams':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Task Management</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="flex border-b border-gray-200">
                <button className="px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                  Manage Tasks
                </button>
              </div>
              <UpcomingExams userType="admin" />
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Exam Results</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex border-b border-gray-200">
                <button className="px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                  Manage Results
                </button>
              </div>
              <ExamResults userType="admin" />
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <div className="mb-4 md:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                  <p className="text-2xl font-semibold">12,845</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <UserCheck className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Schools</h3>
                  <p className="text-2xl font-semibold">256</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <BookOpen className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Exams</h3>
                  <p className="text-2xl font-semibold">68</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Test Attempts</h3>
                  <p className="text-2xl font-semibold">24,632</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Schools</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {schools.map((school) => (
                  <div
                    key={school.id}
                    onClick={() => handleSchoolClick(school.id)}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <School className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{school.name}</h3>
                        <p className="text-sm text-gray-600">Students: {school.totalStudents}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">Exam Management</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add new exams, delete exams, or update existing exam information.
                </p>
                <button
                  onClick={() => setActiveSection('students')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Manage Exams
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">Task Management</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Assign tasks to team members and monitor their progress.
                </p>
                <button
                  onClick={() => setActiveSection('exams')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Manage Tasks
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout
      userType="admin"
      title="Admin Dashboard"
      userName="Rahul Gupta"
    >
      <div className="mb-4 md:mb-6 flex border-b border-gray-200 bg-white overflow-x-auto">
        <button
          onClick={() => setActiveSection('dashboard')}
          className={`px-6 py-3 text-sm font-medium ${
            activeSection === 'dashboard'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveSection('exams')}
          className={`px-6 py-3 text-sm font-medium ${
            activeSection === 'exams'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setActiveSection('students')}
          className={`px-6 py-3 text-sm font-medium ${
            activeSection === 'students'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Exam Results
        </button>
      </div>

      {renderContent()}
    </DashboardLayout>
  );
};

export default SchoolDashboard;