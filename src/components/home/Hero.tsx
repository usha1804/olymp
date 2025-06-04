
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Award, Users } from "lucide-react";
import { useState, useEffect } from "react";

const ExamCard = ({ exam }: { exam: {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  image: string;
}}) => {
  return (
    <Link to={`/exams/${exam.id}`} className="lg:w-5/12 lg:pl-8">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <img 
          src={exam.image} 
          alt={exam.title} 
          className="w-full h-64 object-cover object-center"
        />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-blue-100 text-education-blue text-xs font-semibold px-3 py-1 rounded-full">
              {exam.subject}
            </span>
            <span className="text-sm text-gray-500">Starts {exam.date}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
          <p className="text-gray-600 mb-4">Prepare for this {exam.difficulty.toLowerCase()} {exam.subject.toLowerCase()} exam with our comprehensive mock tests and study materials.</p>
          <Link to={`/exams/${exam.id}`} className="text-education-blue font-medium hover:underline flex items-center">
            Learn More <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </Link>
  );
};

const Hero = () => {
  const [currentExamIndex, setCurrentExamIndex] = useState(0);
  
  const exams = [
    {
      id: "science-olympiad",
      title: "National Science Olympiad",
      subject: "Science",
      date: "May 15, 2025",
      duration: "3 hours",
      difficulty: "Hard" as const,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExamIndex((prevIndex) => (prevIndex + 1) % 6);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-20">
      <div className="education-container">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-education-dark mb-6 leading-tight">
              Elevate Your <span className="text-education-blue">Academic</span> Journey
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              Join thousands of students preparing for exams through our comprehensive platform. Expert-designed mock tests, personalized feedback, and proven results.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="btn-primary text-center py-3 px-8 text-lg">
                Get Started
              </Link>
              <Link to="/exams" className="btn-outline text-center py-3 px-8 text-lg flex items-center justify-center">
                Explore Exams <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>

          <div className="lg:w-5/12 lg:pl-8 relative overflow-hidden" style={{ height: '520px' }}>
            {exams.slice(0, 6).map((exam, index) => (
              <div
                key={exam.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentExamIndex
                    ? 'transform translate-x-0 opacity-100' 
                    : 'transform translate-x-full opacity-0'
                }`}
              >
                <ExamCard exam={exam} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-education-blue" />
            </div>
            <h3 className="text-2xl font-bold text-education-dark mb-2">500+</h3>
            <p className="text-gray-600">Mock Tests Available</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-education-blue" />
            </div>
            <h3 className="text-2xl font-bold text-education-dark mb-2">50,000+</h3>
            <p className="text-gray-600">Students Enrolled</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={32} className="text-education-blue" />
            </div>
            <h3 className="text-2xl font-bold text-education-dark mb-2">95%</h3>
            <p className="text-gray-600">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
