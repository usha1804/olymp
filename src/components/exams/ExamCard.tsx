
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
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getDifficultyColor()}`}>
            {difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="text-sm font-medium text-education-blue mb-2">{subject}</div>
        <h3 className="text-xl font-semibold mb-3 text-education-dark">{title}</h3>
        
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar size={16} className="mr-2" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock size={16} className="mr-2" />
            <span>{duration}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <Link 
            to={`/mock-tests/${id}`}
            className="text-education-teal hover:text-teal-700 font-medium flex items-center text-sm"
          >
            <BookOpen size={16} className="mr-1" /> Try Mock Test
          </Link>
          <Link 
            to={`/exams/${id}`}
            className="text-education-blue hover:text-blue-700 font-medium flex items-center text-sm"
          >
            View Details <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
