import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  BookOpen, 
  Users, 
  Star, 
  Filter,
  Search,
  Play,
  Trophy,
  Target,
  Zap
} from "lucide-react";

interface MockTest {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  totalQuestions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  participants: number;
  description: string;
  topics: string[];
  isPopular?: boolean;
  isFree?: boolean;
  image?: string;
}

const MockTestsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  
  // Track which test cards have expanded topics
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  // Toggle topics expansion for a specific test
  const toggleTopicsExpansion = (testId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [testId]: !prev[testId]
    }));
  };

  // Mock data for tests
  const mockTests: MockTest[] = [
    {
      id: "math-olympiad-1",
      title: "Mathematics Olympiad Practice Test 1",
      subject: "Mathematics",
      duration: 90,
      totalQuestions: 25,
      difficulty: "Medium",
      rating: 4.7,
      participants: 1250,
      description: "Comprehensive practice test covering algebra, geometry, and number theory concepts commonly found in mathematics olympiads.",
      topics: ["Algebra", "Geometry", "Number Theory", "Combinatorics"],
      isPopular: true,
      isFree: true,
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "physics-olympiad-1",
      title: "Physics Olympiad Mechanics",
      subject: "Physics",
      duration: 120,
      totalQuestions: 30,
      difficulty: "Hard",
      rating: 4.5,
      participants: 890,
      description: "Advanced mechanics problems designed to test your understanding of classical physics principles.",
      topics: ["Classical Mechanics", "Thermodynamics", "Waves", "Electromagnetism", "Quantum Physics", "Relativity"],
      isPopular: true,
      isFree: false
    },
    {
      id: "chemistry-basic",
      title: "Chemistry Fundamentals",
      subject: "Chemistry",
      duration: 60,
      totalQuestions: 20,
      difficulty: "Easy",
      rating: 4.3,
      participants: 2100,
      description: "Perfect for beginners to test their knowledge of basic chemistry concepts and reactions.",
      topics: ["Atomic Structure", "Chemical Bonding", "Stoichiometry", "Acids & Bases"],
      isFree: true
    },
    {
      id: "math-advanced",
      title: "Advanced Mathematics Challenge",
      subject: "Mathematics",
      duration: 150,
      totalQuestions: 40,
      difficulty: "Hard",
      rating: 4.8,
      participants: 567,
      description: "For serious mathematics competitors. Features complex problems in advanced topics.",
      topics: ["Calculus", "Linear Algebra", "Differential Equations", "Complex Analysis", "Real Analysis", "Abstract Algebra", "Topology"],
      isPopular: true,
      isFree: false
    },
    {
      id: "biology-olympiad",
      title: "Biology Olympiad Preparation",
      subject: "Biology",
      duration: 100,
      totalQuestions: 35,
      difficulty: "Medium",
      rating: 4.4,
      participants: 1456,
      description: "Comprehensive biology test covering molecular biology, ecology, and genetics.",
      topics: ["Molecular Biology", "Genetics", "Ecology", "Evolution", "Biochemistry", "Cell Biology"],
      isFree: true
    },
    {
      id: "computer-science",
      title: "Computer Science Algorithms",
      subject: "Computer Science",
      duration: 120,
      totalQuestions: 25,
      difficulty: "Hard",
      rating: 4.6,
      participants: 734,
      description: "Test your algorithmic thinking and programming problem-solving skills.",
      topics: ["Data Structures", "Algorithms", "Dynamic Programming", "Graph Theory", "Machine Learning", "Database Systems", "Software Engineering"],
      isFree: false
    }
  ];

  const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  // Filter tests based on search and filters
  const filteredTests = mockTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === "All" || test.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === "All" || test.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Component to render topics with expand/collapse functionality
  const TopicsSection = ({ test }: { test: MockTest }) => {
    const isExpanded = expandedTopics[test.id];
    const shouldShowMoreBadge = test.topics.length > 3;
    const topicsToShow = isExpanded ? test.topics : test.topics.slice(0, 3);
    const remainingCount = test.topics.length - 3;

    return (
      <div className="flex flex-wrap gap-1">
        {topicsToShow.map((topic, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {topic}
          </Badge>
        ))}
        {shouldShowMoreBadge && !isExpanded && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
            onClick={() => toggleTopicsExpansion(test.id)}
          >
            +{remainingCount} more
          </Badge>
        )}
        {isExpanded && shouldShowMoreBadge && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-colors"
            onClick={() => toggleTopicsExpansion(test.id)}
          >
            Show less
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="education-container py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mock Tests & Practice Exams
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Sharpen your skills with our comprehensive collection of mock tests. 
              Practice with real exam-like conditions and track your progress.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <span>Realistic Exam Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span>Detailed Performance Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="education-container py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search mock tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Subject Filter */}
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredTests.length}</span> mock tests
            {searchTerm && ` for "${searchTerm}"`}
            {selectedSubject !== "All" && ` in ${selectedSubject}`}
            {selectedDifficulty !== "All" && ` (${selectedDifficulty} difficulty)`}
          </p>
        </div>

        {/* Mock Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTests.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Card Header with Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
                {test.image ? (
                  <img 
                    src={test.image} 
                    alt={test.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white/80" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                  {test.isPopular && (
                    <Badge className="bg-orange-500 text-white border-none">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  {test.isFree && (
                    <Badge className="bg-green-500 text-white border-none">
                      Free
                    </Badge>
                  )}
                </div>

                {/* Difficulty Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className={getDifficultyColor(test.difficulty)}>
                    {test.difficulty}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {test.title}
                </CardTitle>
                <p className="text-sm text-gray-600">{test.subject}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-gray-700 line-clamp-3">
                  {test.description}
                </p>

                {/* Topics - Using the new TopicsSection component */}
                <TopicsSection test={test} />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{test.duration}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{test.totalQuestions}Q</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{test.participants}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">{test.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({test.participants} participants)
                  </span>
                </div>

                {/* Action Button */}
                <Link to={`/mock-tests/${test.id}`} className="block w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Play className="h-4 w-4 mr-2" />
                    Start Mock Test
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mock tests found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedSubject("All");
                setSelectedDifficulty("All");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Additional Info Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Practice with Mock Tests?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Mock tests are essential for exam preparation. They help you understand the exam pattern, 
              improve time management, and identify areas that need more focus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Realistic Experience</h3>
              <p className="text-sm text-gray-600">
                Experience the exact same environment and time pressure as the real exam.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Performance Analysis</h3>
              <p className="text-sm text-gray-600">
                Get detailed insights into your performance with comprehensive analytics.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">
                Receive immediate feedback and detailed explanations for all questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTestsPage;