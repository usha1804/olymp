import { Link } from "react-router-dom";
import { Calendar, Clock, BookOpen, ChevronRight } from "lucide-react";

interface ExamCardProps {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  image: string;
}

const ExamCard = ({ id, title, subject, date, duration, difficulty, image }: ExamCardProps) => {
  // Function to get the badge color based on difficulty
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 card-hover">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-500 ease-in-out hover:scale-110"
        />
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor()}`}>
            {difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <BookOpen size={16} className="mr-1" />
          <span>{subject}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-education-dark mb-3 line-clamp-2">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{duration}</span>
          </div>
        </div>
        
        <Link 
          to={`/exams/${id}`}
          className="inline-flex items-center text-education-blue hover:text-blue-700 font-medium transition-colors"
        >
          Learn More
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ExamCard;
