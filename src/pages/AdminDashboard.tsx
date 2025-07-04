import React, { useState, useEffect } from "react";
import { Users, BookOpen, BarChart3 } from "lucide-react";
import Schools from "../components/Dashbordspages/Schools";
import UpcomingExams from "../components/Dashbordspages/Upcomingexams";
import Tasks from "../components/Dashbordspages/Tasks";
import { useLocation } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'schools' | 'exams' | 'tasks'>('dashboard');
  const location = useLocation();

  // Listen for navigation events from the DashboardLayout
  useEffect(() => {
    const handleDashboardNavigation = (event: CustomEvent) => {
      const { section, userType } = event.detail;
      
      if (userType === 'admin') {
        if (section === 'dashboard') {
          setActiveSection('dashboard');
        } else if (section === 'schools') {
          setActiveSection('schools');
        } else if (section === 'exam results') {
          setActiveSection('exams');
        } else if (section === 'tasks') {
          setActiveSection('tasks');
        }
      }
    };
    
    document.addEventListener('dashboard-navigation', handleDashboardNavigation as EventListener);
    
    // Clean up
    return () => document.removeEventListener('dashboard-navigation', handleDashboardNavigation as EventListener);
  }, []);
  
  // Check URL path to determine active section on initial load
  useEffect(() => {
    if (location.pathname === '/admin-dashboard') {
      setActiveSection('dashboard');
    } else if (location.pathname === '/schools') {
      setActiveSection('schools');
    } else if (location.pathname === '/upcoming-exams' || location.pathname === '/admin-exam-results') {
      setActiveSection('exams');
    } else if (location.pathname === '/tasks') {
      setActiveSection('tasks');
    }
  }, [location.pathname]);

  const renderContent = () => {
    switch(activeSection) {
      case 'schools':
        return <Schools userType="admin" />;
      case 'exams':
        return <UpcomingExams userType="admin" />;
      case 'tasks':
        return <Tasks userType="admin" />;
      default:
        return (
          <div className="p-6">
            <div className="mb-4 md:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-education-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
                  <p className="text-2xl font-semibold">12,845</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-education-teal" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Schools</h3>
                  <p className="text-2xl font-semibold">256</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                  <BookOpen className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Exams</h3>
                  <p className="text-2xl font-semibold">68</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Test Attempts</h3>
                  <p className="text-2xl font-semibold">24,632</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex border-b border-gray-200">
                  <button className="px-6 py-3 text-sm font-medium text-education-blue border-b-2 border-education-blue">
                    School Management
                  </button>
                </div>
                <div className="p-6">
                  <button 
                    onClick={() => setActiveSection('schools')}
                    className="w-full bg-education-blue text-white p-3 rounded-md hover:bg-blue-700 transition-colors mb-4"
                  >
                    Manage Schools
                  </button>
                  <p className="text-gray-600 text-sm">
                    Add new schools, remove schools, or update existing school information.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex border-b border-gray-200">
                  <button className="px-6 py-3 text-sm font-medium text-education-blue border-b-2 border-education-blue">
                    Exam Management
                  </button>
                </div>
                <div className="p-6">
                  <button 
                    onClick={() => setActiveSection('exams')}
                    className="w-full bg-education-blue text-white p-3 rounded-md hover:bg-blue-700 transition-colors mb-4"
                  >
                    Manage Exams
                  </button>
                  <p className="text-gray-600 text-sm">
                    Add new exams, delete exams, or update existing exam information.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex border-b border-gray-200">
                  <button className="px-6 py-3 text-sm font-medium text-education-blue border-b-2 border-education-blue">
                    Task Management
                  </button>
                </div>
                <div className="p-6">
                  <button 
                    onClick={() => setActiveSection('tasks')}
                    className="w-full bg-education-blue text-white p-3 rounded-md hover:bg-blue-700 transition-colors mb-4"
                  >
                    Manage Tasks
                  </button>
                  <p className="text-gray-600 text-sm">
                    Assign tasks to sales team members and monitor their progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* <div className="mb-4 md:mb-6 flex border-b border-gray-200 bg-white overflow-x-auto">
        <button
          onClick={() => setActiveSection('dashboard')}
          className={`px-6 py-3 text-sm font-medium ${activeSection === 'dashboard' 
            ? 'text-education-blue border-b-2 border-education-blue' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveSection('schools')}
          className={`px-6 py-3 text-sm font-medium ${activeSection === 'schools' 
            ? 'text-education-blue border-b-2 border-education-blue' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Schools
        </button>
        <button
          onClick={() => setActiveSection('exams')}
          className={`px-6 py-3 text-sm font-medium ${activeSection === 'exams' 
            ? 'text-education-blue border-b-2 border-education-blue' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Exams
        </button>
        <button
          onClick={() => setActiveSection('tasks')}
          className={`px-6 py-3 text-sm font-medium ${activeSection === 'tasks' 
            ? 'text-education-blue border-b-2 border-education-blue' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Tasks
        </button>
      </div> */}

      {renderContent()}
    </>
  );
};

export default AdminDashboard;