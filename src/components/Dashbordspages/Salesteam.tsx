import React, { useState, useEffect } from "react";
import DashboardSidebar from '../dashboard/DashboardSidebar';
import DashboardHeader from '../dashboard/DashboardHeader';

type TaskStatus = "Contacted" | "Interested" | "Not Interested" | "On Board";

interface Task {
  id: number;
  schoolName: string;
  status: TaskStatus;
}

const SalesDashboard: React.FC = () => {
  // Form state for adding a school
  const [schoolName, setSchoolName] = useState("");

  // Mock task list (would come from backend in real app)
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, schoolName: "Greenwood High", status: "Contacted" },
    { id: 2, schoolName: "Springfield Academy", status: "Interested" },
  ]);

  // Add school handler
  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;
    alert(`School "${schoolName}" added (mock)`);
    setSchoolName("");
  };

  // Update task status handler
  const handleStatusChange = (id: number, newStatus: TaskStatus) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, status: newStatus } : task
    );
    setTasks(updated);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden">
      <DashboardSidebar userType="sales" isSidebarOpen={isSidebarOpen} onClose={toggleSidebar} />
      
      {/* Dark overlay when sidebar is open on mobile */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      <div className="flex-1 pb-16 w-full max-w-full">
        <DashboardHeader 
          title="Sales Dashboard" 
          onMenuToggle={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="p-6">

      {/* Add School Section */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New School</h2>
        <form onSubmit={handleAddSchool} className="flex gap-4">
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="Enter School Name"
            className="border px-3 py-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </form>
      </div>

      {/* Tasks Section */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">School Name</th>
              <th className="p-2 border">Current Status</th>
              <th className="p-2 border">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="p-2 border">{task.schoolName}</td>
                <td className="p-2 border">{task.status}</td>
                <td className="p-2 border">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value as TaskStatus)
                    }
                    className="border p-2 rounded"
                  >
                    <option>Contacted</option>
                    <option>Interested</option>
                    <option>Not Interested</option>
                    <option>On Board</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
