
import { useState } from "react";
import { Search, Filter, BookOpen, Calendar, Clock, Award } from "lucide-react";
import ExamCard from "../components/exams/ExamCard";

const ExamsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  // Sample data for exams
  const exams = [
    {
      id: "math-olympiad",
      title: "Mathematics Olympiad",
      subject: "Mathematics",
      date: "June 10, 2025",
      duration: "2 hours",
      difficulty: "Medium" as const,
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "science-challenge",
      title: "National Science Challenge",
      subject: "Science",
      date: "July 15, 2025",
      duration: "2.5 hours",
      difficulty: "Hard" as const,
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "english-proficiency",
      title: "English Proficiency Test",
      subject: "English",
      date: "May 28, 2025",
      duration: "1.5 hours",
      difficulty: "Easy" as const,
      image: "https://images.unsplash.com/photo-1456513080867-f24f76ced9b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "physics-championship",
      title: "Physics Championship",
      subject: "Physics",
      date: "August 5, 2025",
      duration: "3 hours",
      difficulty: "Hard" as const,
      image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "chemistry-quiz",
      title: "Chemistry Quiz Competition",
      subject: "Chemistry",
      date: "September 12, 2025",
      duration: "1 hour",
      difficulty: "Medium" as const,
      image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "history-challenge",
      title: "World History Challenge",
      subject: "History",
      date: "October 3, 2025",
      duration: "2 hours",
      difficulty: "Easy" as const,
      image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
  ];

  // Filter the exams based on search term, subject, and difficulty
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject ? exam.subject === selectedSubject : true;
    const matchesDifficulty = selectedDifficulty ? exam.difficulty === selectedDifficulty : true;
    
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  // Get unique subjects
  const subjects = [...new Set(exams.map(exam => exam.subject))];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="education-container">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-education-dark mb-4">Available Exams</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Browse our collection of exams and mock tests to help you prepare for your upcoming academic challenges.
          </p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search bar */}
            <div className="relative mt-[21px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search exams..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Subject filter */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            {/* Difficulty filter */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-education-blue focus:border-transparent"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Exam Categories */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-education-dark mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-all cursor-pointer">
              <div className="bg-blue-100 p-2 rounded-full">
                <BookOpen size={24} className="text-education-blue" />
              </div>
              <span className="font-medium">Mathematics</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-all cursor-pointer">
              <div className="bg-green-100 p-2 rounded-full">
                <BookOpen size={24} className="text-green-600" />
              </div>
              <span className="font-medium">Science</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-all cursor-pointer">
              <div className="bg-yellow-100 p-2 rounded-full">
                <BookOpen size={24} className="text-yellow-600" />
              </div>
              <span className="font-medium">English</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-all cursor-pointer">
              <div className="bg-purple-100 p-2 rounded-full">
                <BookOpen size={24} className="text-purple-600" />
              </div>
              <span className="font-medium">History</span>
            </div>
          </div>
        </div>
        
        {/* Exams Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-education-dark">All Exams</h2>
            <div className="text-gray-500 text-sm">
              Showing {filteredExams.length} of {exams.length} exams
            </div>
          </div>
          
          {filteredExams.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExams.map((exam) => (
                <ExamCard key={exam.id} {...exam} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-4 text-gray-400">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-education-dark mb-2">No exams found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
            </div>
          )}
        </div>
        
        {/* Why Take Our Exams Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-education-dark mb-4">Why Take Our Exams?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our exams and mock tests are designed to help you achieve academic excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">
                <Calendar size={32} className="text-education-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-education-dark">Structured Timeline</h3>
              <p className="text-gray-600">
                Our exams follow a structured timeline that helps you prepare systematically for your final assessments.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">
                <Clock size={32} className="text-education-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-education-dark">Real Exam Conditions</h3>
              <p className="text-gray-600">
                Experience real exam conditions with our timed tests and authentic question formats.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="mb-4">
                <Award size={32} className="text-education-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-education-dark">Recognized Certifications</h3>
              <p className="text-gray-600">
                Earn certifications that are recognized by educational institutions and employers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsPage;
