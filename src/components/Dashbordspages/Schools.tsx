import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, MapPin, Phone, Mail, Plus, Trash2, PenLine, Building, User, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SchoolData {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  studentsCount: number;
  status: 'active' | 'pending' | 'inactive';
}

interface SchoolsProps {
  userType: 'admin' | 'sales' | 'student' | 'school';
}

const Schools: React.FC<SchoolsProps> = ({ userType }) => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<SchoolData[]>([
    {
      id: '1',
      name: 'Delhi Public School',
      address: '123 Education Lane, New Delhi',
      contactPerson: 'Rajesh Kumar',
      contactEmail: 'principal@dps.edu',
      contactPhone: '+91 9876543210',
      studentsCount: 2500,
      status: 'active',
    },
    {
      id: '2',
      name: 'Ryan International',
      address: '456 Academy Road, Mumbai',
      contactPerson: 'Priya Singh',
      contactEmail: 'admin@ryan.edu',
      contactPhone: '+91 9876543211',
      studentsCount: 1800,
      status: 'active',
    },
    {
      id: '3',
      name: 'Kendriya Vidyalaya',
      address: '789 Learning Street, Bangalore',
      contactPerson: 'Amit Sharma',
      contactEmail: 'principal@kv.edu',
      contactPhone: '+91 9876543212',
      studentsCount: 3200,
      status: 'pending',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolData | null>(null);
  const [newSchool, setNewSchool] = useState<Omit<SchoolData, 'id' | 'studentsCount'>>({
    name: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    status: 'pending',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingSchool) {
      setEditingSchool((prev) =>
        prev
          ? {
              ...prev,
              [name]: name === 'studentsCount' ? parseInt(value) || 0 : value,
            }
          : null
      );
    } else {
      setNewSchool((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    const school = {
      ...newSchool,
      id: Math.random().toString(36).substr(2, 9),
      studentsCount: 0,
    };
    setSchools([...schools, school]);
    setShowAddForm(false);
    setNewSchool({
      name: '',
      address: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      status: 'pending',
    });
  };

  const handleEditSchool = (school: SchoolData) => {
    setEditingSchool(school);
  };

  const handleUpdateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchool) return;
    setSchools(schools.map((s) => (s.id === editingSchool.id ? editingSchool : s)));
    setEditingSchool(null);
  };

  const handleCancelEdit = () => {
    setEditingSchool(null);
  };

  const handleDeleteSchool = (id: string) => {
    setSchools(schools.filter((school) => school.id !== id));
  };

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: 'active' | 'pending' | 'inactive') => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schools Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-education-blue text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add School
        </button>
      </div>

      {(showAddForm || editingSchool) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingSchool ? 'Edit School' : 'Add New School'}</h2>
          <form onSubmit={editingSchool ? handleUpdateSchool : handleAddSchool}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <School className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={editingSchool ? editingSchool.name : newSchool.name}
                    onChange={handleInputChange}
                    placeholder="Enter school name"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={editingSchool ? editingSchool.address : newSchool.address}
                    onChange={handleInputChange}
                    placeholder="Enter school address"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="contactPerson"
                    value={editingSchool ? editingSchool.contactPerson : newSchool.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Enter contact person name"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="contactEmail"
                    value={editingSchool ? editingSchool.contactEmail : newSchool.contactEmail}
                    onChange={handleInputChange}
                    placeholder="Enter contact email"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="contactPhone"
                    value={editingSchool ? editingSchool.contactPhone : newSchool.contactPhone}
                    onChange={handleInputChange}
                    placeholder="Enter contact phone"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                    required
                  />
                </div>
              </div>
              {editingSchool && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Students</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="studentsCount"
                      value={editingSchool.studentsCount}
                      onChange={handleInputChange}
                      placeholder="Enter number of students"
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                      required
                      min="0"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editingSchool ? editingSchool.status : newSchool.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={editingSchool ? handleCancelEdit : () => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-education-blue text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingSchool ? 'Update School' : 'Add School'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold">Schools List</h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Desktop view - Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="px-4 py-3 text-sm font-medium text-gray-500">School Name</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Address</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Contact Person</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Contact</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Students</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((school) => (
                <tr key={school.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-sm">{school.name}</td>
                  <td className="px-4 py-3 text-sm">{school.address}</td>
                  <td className="px-4 py-3 text-sm">{school.contactPerson}</td>
                  <td className="px-4 py-3 text-sm">
                    <div>{school.contactEmail}</div>
                    <div>{school.contactPhone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{school.studentsCount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(school.status)}`}>
                      {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditSchool(school)}
                        className="text-education-blue hover:text-blue-700"
                        title="Edit School"
                      >
                        <PenLine size={16} />
                      </button>
                      <button
                        onClick={() => navigate(`/school/${school.id}`)}
                        className="text-blue-500 hover:text-blue-700"
                        title="View Details"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view - Cards */}
        <div className="md:hidden">
          <div className="space-y-4">
            {filteredSchools.map((school) => (
              <div key={school.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-education-blue" />
                    <h3 className="font-medium">{school.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(school.status)}`}>
                    {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{school.address}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <User className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{school.contactPerson}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{school.contactEmail}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{school.contactPhone}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditSchool(school)}
                    className="p-2 bg-gray-100 text-education-blue rounded-md"
                    title="Edit School"
                  >
                    <PenLine size={16} />
                  </button>
                  <button
                    onClick={() => navigate(`/school/${school.id}`)}
                    className="p-2 bg-gray-100 text-blue-500 rounded-md"
                    title="View Details"
                  >
                    <School size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSchool(school.id)}
                    className="p-2 bg-gray-100 text-red-500 rounded-md"
                    title="Delete School"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredSchools.length === 0 && (
          <div className="text-center py-8">
            <School className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No schools found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schools;