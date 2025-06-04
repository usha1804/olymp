import React, { useState, useRef } from 'react';
import { Clock, Calendar, Info, Download, Plus, Upload, X, FileText, Check } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  date: string;
  time: string;
  subject: string;
  description?: string;
}

interface UpcomingExamsProps {
  userType: 'student' | 'school' | 'admin' | 'sales';
}

interface StudentData {
  name: string;
  percentage: number;
  eligible: boolean;
}

const UpcomingExams: React.FC<UpcomingExamsProps> = ({ userType }) => {
  const [exams, setExams] = useState<Exam[]>([
    { 
      id: '1', 
      title: 'Mathematics Olympiad', 
      date: '2025-06-15', 
      time: '10:00 AM', 
      subject: 'Mathematics',
      description: 'Annual mathematics competition covering algebra, geometry, and calculus.'
    },
    { 
      id: '2', 
      title: 'Science Quiz', 
      date: '2025-07-05', 
      time: '2:00 PM', 
      subject: 'Science',
      description: 'Science quiz covering physics, chemistry, and biology concepts.' 
    },
    { 
      id: '3', 
      title: 'English Literature', 
      date: '2025-07-22', 
      time: '11:00 AM', 
      subject: 'English',
      description: 'Literature and grammar assessment for all grades.' 
    },
  ]);

  const [showAddExam, setShowAddExam] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    title: '',
    date: '',
    time: '',
    subject: '',
    description: ''
  });

  // Template options
  const certificateTemplates = [
    {
      id: 1,
      name: 'Classic Gold',
      description: 'Traditional certificate with gold borders and elegant fonts',
      preview: '/templates/template1-preview.jpg'
    },
    {
      id: 2,
      name: 'Modern Blue',
      description: 'Contemporary design with blue accents and clean layout',
      preview: '/templates/template2-preview.jpg'
    },
    {
      id: 3,
      name: 'Academic Green',
      description: 'Formal academic style with green elements',
      preview: '/templates/template3-preview.jpg'
    }
  ];

  const handleAddExam = async () => {
    if (newExam.title && newExam.date && newExam.time && newExam.subject) {
      try {
        const response = await fetch('http://localhost:8081/api/exams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newExam.title,
            date: newExam.date,
            time: newExam.time,
            subject: newExam.subject,
            description: newExam.description,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add exam');
        }

        const newExamData = await response.json();
        setExams([...exams, newExamData]);
        setNewExam({
          title: '',
          date: '',
          time: '',
          subject: '',
          description: '',
        });
        setShowAddExam(false);
      } catch (error) {
        console.error('Error adding exam:', error);
        alert('Failed to add exam. Please try again.');
      }
    }
};

  const handleDeleteExam = (id: string) => {
    setExams(exams.filter(exam => exam.id !== id));
  };

  const handleGenerateCertificate = (examId: string, examTitle: string) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      setSelectedExam(exam);
      setShowCertificateModal(true);
      setStudentData([]);
      setCsvFile(null);
      setShowPreview(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      parseCSV(file);
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  const parseCSV = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const data: StudentData[] = [];
      
      // Skip header row and parse data
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const [name, percentageStr] = line.split(',').map(item => item.trim());
          const percentage = parseFloat(percentageStr);
          
          if (name && !isNaN(percentage)) {
            data.push({
              name: name.replace(/"/g, ''), // Remove quotes if present
              percentage: percentage,
              eligible: percentage >= 75
            });
          }
        }
      }
      
      setStudentData(data);
      setIsProcessing(false);
      setShowPreview(true);
    };
    
    reader.readAsText(file);
  };

  const handleGenerateCertificates = async () => {
    if (!selectedExam || studentData.length === 0) return;
    
    setIsProcessing(true);
    
    const eligibleStudents = studentData.filter(student => student.eligible);
    
    try {
      // Simulate certificate generation process
      for (let i = 0; i < eligibleStudents.length; i++) {
        const student = eligibleStudents[i];
        
        // Here you would typically:
        // 1. Load the selected PPTX template
        // 2. Replace placeholders with student data
        // 3. Convert to PDF
        // 4. Save or download the certificate
        
        console.log(`Generating certificate for ${student.name} with ${student.percentage}% using template ${selectedTemplate}`);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      alert(`Successfully generated ${eligibleStudents.length} certificates!`);
      setShowCertificateModal(false);
      
    } catch (error) {
      console.error('Error generating certificates:', error);
      alert('Error generating certificates. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const downloadSampleCSV = () => {
    const csvContent = "Student Name,Percentage\nJohn Doe,85\nJane Smith,92\nMike Johnson,67\nSarah Wilson,78";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_student_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Upcoming Exams</h1>
        {(userType === 'admin' || userType === 'school') && (
          <button 
            onClick={() => setShowAddExam(!showAddExam)}
            className="flex items-center gap-2 px-4 py-2 bg-education-blue text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Exam
          </button>
        )}
      </div>

      {/* Certificate Generation Modal */}
      {showCertificateModal && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowCertificateModal(false)}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">
                    Generate Certificates - {selectedExam?.title}
                  </h2>
                  <button
                    onClick={() => setShowCertificateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6">
                  {/* Step 1: Template Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Step 1: Select Certificate Template</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {certificateTemplates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedTemplate === template.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                            <FileText size={48} className="text-gray-400" />
                          </div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          {selectedTemplate === template.id && (
                            <div className="mt-2 flex items-center text-blue-600">
                              <Check size={16} className="mr-1" />
                              <span className="text-sm">Selected</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: CSV Upload */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Step 2: Upload Student Data (CSV)</h3>
                    
                    <div className="mb-4">
                      <button
                        onClick={downloadSampleCSV}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Download Sample CSV Format
                      </button>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Choose CSV File
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          Upload a CSV file with columns: Student Name, Percentage
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Only students with 75% or above will receive certificates
                        </p>
                      </div>
                    </div>

                    {csvFile && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-800">
                          File uploaded: <strong>{csvFile.name}</strong>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Preview Data */}
                  {showPreview && studentData.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4">Step 3: Preview Student Data</h3>
                      
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800">Total Students</h4>
                          <p className="text-2xl font-bold text-blue-600">{studentData.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800">Eligible for Certificate</h4>
                          <p className="text-2xl font-bold text-green-600">
                            {studentData.filter(s => s.eligible).length}
                          </p>
                        </div>
                      </div>

                      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                        <table className="w-full">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Student Name</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Percentage</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {studentData.map((student, index) => (
                              <tr key={index} className={student.eligible ? 'bg-green-50' : 'bg-red-50'}>
                                <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{student.percentage}%</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    student.eligible 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {student.eligible ? 'Eligible' : 'Not Eligible'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowCertificateModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerateCertificates}
                      disabled={!showPreview || studentData.filter(s => s.eligible).length === 0 || isProcessing}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Generating...' : 
                       `Generate ${studentData.filter(s => s.eligible).length} Certificates`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Rest of the existing component code... */}
      {showAddExam && (userType === 'admin' || userType === 'school') && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Exam</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title</label>
              <input
                type="text"
                value={newExam.title}
                onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                placeholder="Enter exam title"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={newExam.subject}
                onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                placeholder="Enter subject"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={newExam.time}
                onChange={(e) => setNewExam({...newExam, time: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newExam.description}
              onChange={(e) => setNewExam({...newExam, description: e.target.value})}
              placeholder="Enter exam description"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowAddExam(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddExam}
              className="px-4 py-2 bg-education-blue text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Exam
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {exams.map(exam => (
          <div key={exam.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{exam.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-education-blue" />
                    <span>{formatDate(exam.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-education-blue" />
                    <span>{exam.time}</span>
                  </div>
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-1 text-education-blue" />
                    <span>{exam.subject}</span>
                  </div>
                </div>
                {exam.description && (
                  <p className="text-sm text-gray-500 mb-4">{exam.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                {userType === 'student' && (
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-education-blue text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                    <Download size={16} />
                    Materials
                  </button>
                )}
                {(userType === 'admin' || userType === 'school') && (
                  <>
                    <button 
                      onClick={() => handleGenerateCertificate(exam.id, exam.title)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                    >
                      Generate Certificates
                    </button>
                    <button 
                      onClick={() => handleDeleteExam(exam.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">No upcoming exams at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingExams;
