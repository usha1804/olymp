import React, { useState, useEffect } from "react";
import ExamResults from "../components/Dashbordspages/examresults";
import UpcomingExams from "../components/Dashbordspages/Upcomingexams";
import { useLocation } from "react-router-dom";

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'results' | 'upcoming'>('results');
  const location = useLocation();

  // Listen for navigation events from the DashboardLayout
  useEffect(() => {
    const handleDashboardNavigation = (event: CustomEvent) => {
      const { section, userType } = event.detail;
      if (userType === 'student') {
        if (section === 'exam results') {
          setActiveTab('results');
        } else if (section === 'tests') {
          setActiveTab('upcoming');
        }
      }
    };

    // Add event listener
    document.addEventListener('dashboard-navigation', handleDashboardNavigation as EventListener);
    
    // Clean up
    return () => document.removeEventListener('dashboard-navigation', handleDashboardNavigation as EventListener);
  }, []);
  
  // Check URL path to determine active tab on initial load
  useEffect(() => {
    if (location.pathname === '/student-exam-results') {
      setActiveTab('results');
    } else if (location.pathname === '/upcoming-exams') {
      setActiveTab('upcoming');
    }
  }, [location.pathname]);

  return (
    <div className="p-3 sm:p-4 md:p-6">
      
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 text-sm font-medium ${activeTab === 'results' ? 'text-education-blue border-b-2 border-education-blue' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('results')}
          >
            Exam Results
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${activeTab === 'upcoming' ? 'text-education-blue border-b-2 border-education-blue' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Exams
          </button>
        </div>
        
        <div className="overflow-hidden">
          {activeTab === 'results' ? (
            <ExamResults userType="student" />
          ) : (
            <UpcomingExams userType="student" />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
