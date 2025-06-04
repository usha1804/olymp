
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import TestimonialCard from "../components/home/TestimonialCard";
import { Link } from "react-router-dom";
import {
  ArrowRight, School,
  Users,
  BarChart3,
  Star,
} from "lucide-react";
import ExamCard from "../components/exams/ExamCard";

const HomePage = () => {
  // Sample data for featured exams
  const featuredExams = [
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
  ];

  // Sample data for testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Student, Grade 10",
      content: "EduVerse helped me prepare for my science olympiad. The mock tests were incredibly similar to the actual exam, which gave me the confidence I needed to succeed.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Parent",
      content: "As a parent, I appreciate the detailed progress reports that help me understand where my child needs additional support. The platform is intuitive and comprehensive.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 4
    },
    {
      name: "Emma Wilson",
      role: "School Coordinator",
      content: "Managing multiple students through EduVerse has streamlined our exam preparation process. The analytics provide valuable insights for our teaching strategy.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5
    }
  ];

  return (
    <div>
      <Hero />
      <Features />

      {/* Featured Exams Section */}
      <section className="py-16 bg-gray-50">
        <div className="education-container">
          <div className="flex justify-between items-center mb-10">
            <Link to="/exams">
              <h2 className="text-3xl font-bold text-education-dark">Featured Exams</h2>
            </Link>
            <Link to="/exams" className="text-education-blue hover:text-blue-700 flex items-center font-medium">
              View All <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredExams.map((exam) => (
              <ExamCard key={exam.id} {...exam} />
            ))}
          </div>
        </div>
      </section>

<section className="py-16 bg-gray-50">
        <div className="education-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-education-dark">Skill Development</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Empower students with essential academic, cognitive, communication, personal, and social skills for lifelong success.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Academic Skills */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center mb-4 text-education-blue text-2xl">
                <span className="mr-3 text-3xl">📚</span>
                <h3 className="text-xl font-semibold">Academic Skills</h3>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Reading comprehension</li>
                <li>Writing and grammar</li>
                <li>Mathematics and logical reasoning</li>
                <li>Scientific thinking</li>
                <li>Digital literacy</li>
              </ul>
            </div>
            {/* Cognitive & Thinking Skills */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center mb-4 text-education-blue text-2xl">
                <span className="mr-3 text-3xl">🧠</span>
                <h3 className="text-xl font-semibold">Cognitive & Thinking Skills</h3>
              </div>
              <p className="text-gray-600 mb-2 text-sm">These skills support decision-making, problem-solving, and creativity.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Critical thinking</li>
                <li>Problem-solving</li>
                <li>Creativity and innovation</li>
                <li>Analytical reasoning</li>
                <li>Memory strategies</li>
              </ul>
            </div>
            {/* Communication Skills */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center mb-4 text-education-blue text-2xl">
                <span className="mr-3 text-3xl">🗣</span>
                <h3 className="text-xl font-semibold">Communication Skills</h3>
              </div>
              <p className="text-gray-600 mb-2 text-sm">Enable students to express ideas clearly and build relationships.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Speaking and listening</li>
                <li>Reading and writing</li>
                <li>Public speaking</li>
                <li>Interpersonal communication</li>
                <li>Digital communication (email, chat, etc.)</li>
              </ul>
            </div>
            {/* Personal & Life Skills */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center mb-4 text-education-blue text-2xl">
                <span className="mr-3 text-3xl">💡</span>
                <h3 className="text-xl font-semibold">Personal & Life Skills</h3>
              </div>
              <p className="text-gray-600 mb-2 text-sm">Help students grow into responsible, independent individuals.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Time management</li>
                <li>Goal setting</li>
                <li>Self-discipline</li>
                <li>Adaptability</li>
                <li>Basic financial literacy (9&10)</li>
              </ul>
            </div>
            {/* Social & Emotional Skills */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center mb-4 text-education-blue text-2xl">
                <span className="mr-3 text-3xl">🌍</span>
                <h3 className="text-xl font-semibold">Social & Emotional Skills</h3>
              </div>
              <p className="text-gray-600 mb-2 text-sm">Support students' well-being and relationships with others.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Empathy and kindness</li>
                <li>Teamwork and cooperation</li>
                <li>Conflict resolution</li>
                <li>Resilience and stress management</li>
                <li>Respect for diversity</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="education-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-education-dark">For Schools</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Partner with us to provide your students with comprehensive exam preparation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 - School Registration */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex items-center mb-4 text-education-blue">
                <School size={32} className="mr-3" />
                <h3 className="text-xl font-semibold">School Registration</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Register your school as a partner and gain access to our comprehensive exam preparation platform.
              </p>
              <Link to="/school-registration" className="text-education-blue hover:text-blue-700 flex items-center font-medium">
                Learn More <ArrowRight size={18} className="ml-1" />
              </Link>
            </div>

            {/* Card 2 - Bulk Registration */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex items-center mb-4 text-education-blue">
                <Users size={32} className="mr-3" />
                <h3 className="text-xl font-semibold">Bulk Registration</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Register multiple students at once and manage their accounts from a central dashboard.
              </p>
              <Link to="/bulk-registration" className="text-education-blue hover:text-blue-700 flex items-center font-medium">
                Learn More <ArrowRight size={18} className="ml-1" />
              </Link>
            </div>

            {/* Card 3 - Performance Tracking */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex items-center mb-4 text-education-blue">
                <BarChart3 size={32} className="mr-3" />
                <h3 className="text-xl font-semibold">Performance Tracking</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Monitor your students' progress and performance with detailed analytics and reports.
              </p>
              <Link to="/performance-tracking" className="text-education-blue hover:text-blue-700 flex items-center font-medium">
                Learn More <ArrowRight size={18} className="ml-1" />
              </Link>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              to="/signup"
              className="bg-education-blue text-white hover:bg-blue-700 font-semibold py-3 px-8 rounded-md transition-all shadow-md"
            >
              Become a Partner School
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
  <div className="education-container text-center bg-education-blue text-white rounded-[50px] border border-white py-12 px-6">  <h2 className="text-3xl md:text-4xl font-bold mb-6">Become an Olympiad Coordinator</h2>
    <p className="text-lg mb-8 max-w-2xl mx-auto">
      Join our team of dedicated educators and help students excel in competitive exams. As a coordinator, you'll organize exams, provide guidance, and connect schools with our platform.
    </p>
    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
      <Link
        to="/coordinator-application"
        className="bg-white text-education-blue hover:bg-gray-100 font-semibold py-3 px-8 rounded-md transition-all shadow-md"
      >
        Apply Now
      </Link>
      <Link
        to="/contact"
        className="border border-white text-white hover:bg-blue-700 font-semibold py-3 px-8 rounded-md transition-all"
      >
        Contact Us
      </Link>
    </div>
  </div>
</section>


      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="education-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-education-dark mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from students, parents, and schools who have experienced success with EduVerse.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

    

    </div>
  );
};

export default HomePage;
