import React, { useState, useRef } from 'react';
import { Clock, Calendar, Info, Download, Plus, Upload, X, FileText, Check, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  date: string;
  time: string;
  subject: string;
  description?: string;
  image?: string; // Add image field
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
      description: 'Annual mathematics competition covering algebra, geometry, and calculus.',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: '2', 
      title: 'Science Quiz', 
      date: '2025-07-05', 
      time: '2:00 PM', 
      subject: 'Science',
      description: 'Science quiz covering physics, chemistry, and biology concepts.',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: '3', 
      title: 'English Literature', 
      date: '2025-07-22', 
      time: '11:00 AM', 
      subject: 'English',
      description: 'Literature and grammar assessment for all grades.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
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
  
  // Image upload states
  const [imageUploadType, setImageUploadType] = useState<'url' | 'file'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    title: '',
    date: '',
    time: '',
    subject: '',
    description: '',
    image: ''
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

  // Handle image file upload
  const handleImageFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (PNG, JPG, or JPEG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setNewExam(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image URL input
  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
    setNewExam(prev => ({ ...prev, image: url }));
  };

  // Upload image to server (if needed)
  const uploadImageToServer = async (file: File): Promise<string> => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:8081/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.imageUrl; // Assuming the server returns { imageUrl: "..." }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddExam = async () => {
    if (newExam.title && newExam.date && newExam.time && newExam.subject) {
      try {
        setIsProcessing(true);
        
        let finalImageUrl = newExam.image || '';

        // If user uploaded a file, upload it to server first
        if (imageUploadType === 'file' && imageFile) {
          try {
            finalImageUrl = await uploadImageToServer(imageFile);
          } catch (error) {
            // If image upload fails, continue without image or use the preview
            console.warn('Image upload failed, proceeding without server upload');
            finalImageUrl = imagePreview;
          }
        }

        const examData = {
          title: newExam.title,
          date: newExam.date,
          time: newExam.time,
          subject: newExam.subject,
          description: newExam.description,
          image: finalImageUrl,
        };

        const response = await fetch('http://localhost:8081/api/exams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(examData),
        });

        if (!response.ok) {
          throw new Error('Failed to add exam');
        }

        const newExamData = await response.json();
        setExams([...exams, newExamData]);
        
        // Reset form
        setNewExam({
          title: '',
          date: '',
          time: '',
          subject: '',
          description: '',
          image: ''
        });
        setImageFile(null);
        setImagePreview('');
        setShowAddExam(false);
        
      } catch (error) {
        console.error('Error adding exam:', error);
        alert('Failed to add exam. Please try again.');
      } finally {
        setIsProcessing(false);
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

      {/* Enhanced Add Exam Form */}
      {showAddExam && (userType === 'admin' || userType === 'school') && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Exam</h2>
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title *</label>
              <input
                type="text"
                value={newExam.title}
                onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                placeholder="Enter exam title"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                value={newExam.subject}
                onChange={(e) => setNewExam({...newExam, subject: e.target.value})}
                placeholder="Enter subject"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
              <input
                type="time"
                value={newExam.time}
                onChange={(e) => setNewExam({...newExam, time: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newExam.description}
              onChange={(e) => setNewExam({...newExam, description: e.target.value})}
              placeholder="Enter exam description"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
            />
          </div>

          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Exam Image</label>
            
            {/* Upload Type Selector */}
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setImageUploadType('url')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                  imageUploadType === 'url' 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LinkIcon size={16} />
                Image URL
              </button>
              <button
                type="button"
                onClick={() => setImageUploadType('file')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                  imageUploadType === 'file' 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Upload size={16} />
                Upload File
              </button>
            </div>

            {/* URL Input */}
            {imageUploadType === 'url' && (
              <div>
                <input
                  type="url"
                  placeholder="Enter image URL (https://...)"
                  value={newExam.image || ''}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a direct link to an image (PNG, JPG, JPEG)
                </p>
              </div>
            )}

            {/* File Upload */}
            {imageUploadType === 'file' && (
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Choose Image File
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </div>
                </div>
                {imageFile && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                    Selected: {imageFile.name}
                  </div>
                )}
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Exam preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA9TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjOTk5IiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                      e.currentTarget.alt = 'Failed to load image';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                      setNewExam(prev => ({ ...prev, image: '' }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setShowAddExam(false);
                setImagePreview('');
                setImageFile(null);
                setNewExam({
                  title: '',
                  date: '',
                  time: '',
                  subject: '',
                  description: '',
                  image: ''
                });
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddExam}
              disabled={isProcessing || isUploadingImage}
              className="px-4 py-2 bg-education-blue text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing || isUploadingImage ? 'Adding...' : 'Add Exam'}
            </button>
          </div>
        </div>
      )}

      {/* Exam List with Images */}
      <div className="grid grid-cols-1 gap-4">
        {exams.map(exam => (
          <div key={exam.id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Exam Image */}
              {exam.image && (
                <div className="md:w-48 h-48 md:h-auto overflow-hidden">
                  <img 
                    src={exam.image} 
                    alt={exam.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Exam Content */}
              <div className="flex-1 p-6">
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
