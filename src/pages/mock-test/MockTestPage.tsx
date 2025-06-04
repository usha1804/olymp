import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { mockExamData, mockQuestions } from "./data";
import { Question, MockTestState } from "./types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Components
import Instructions from "./components/Instructions";
import QuestionContent from "./components/QuestionContent";
import TimerProgress from "./components/TimerProgress";
import QuestionPalette from "./components/QuestionPalette";

const MockTestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use mock data but override ID if provided
  const examData = {
    ...mockExamData,
    id: id || mockExamData.id
  };
  
  // State variables
  const [state, setState] = useState<MockTestState>({
    currentQuestion: 0,
    selectedAnswers: Array(mockQuestions.length).fill(null),
    markedForReview: Array(mockQuestions.length).fill(false),
    timeLeft: examData.duration * 60, // in seconds
    testSubmitted: false
  });

  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Timer effect
  useEffect(() => {
    if (state.timeLeft > 0 && !state.testSubmitted && !showInstructions) {
      const timer = setTimeout(() => 
        setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 })), 
      1000);
      return () => clearTimeout(timer);
    } else if (state.timeLeft === 0 && !state.testSubmitted) {
      handleSubmitTest();
    }
  }, [state.timeLeft, state.testSubmitted, showInstructions]);

  // Auto-save answers to localStorage
  useEffect(() => {
    if (!showInstructions) {
      localStorage.setItem(`mocktest_${id}_answers`, JSON.stringify(state.selectedAnswers));
      localStorage.setItem(`mocktest_${id}_marked`, JSON.stringify(state.markedForReview));
      localStorage.setItem(`mocktest_${id}_current`, state.currentQuestion.toString());
    }
  }, [state.selectedAnswers, state.markedForReview, state.currentQuestion, id, showInstructions]);

  // Load saved progress on mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`mocktest_${id}_answers`);
    const savedMarked = localStorage.getItem(`mocktest_${id}_marked`);
    const savedCurrent = localStorage.getItem(`mocktest_${id}_current`);
    
    if (savedAnswers && savedMarked && savedCurrent) {
      setState(prev => ({
        ...prev,
        selectedAnswers: JSON.parse(savedAnswers),
        markedForReview: JSON.parse(savedMarked),
        currentQuestion: parseInt(savedCurrent)
      }));
    }
  }, [id]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Prevent page refresh/close during test
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!state.testSubmitted && !showInstructions) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.testSubmitted, showInstructions]);
  
  // Calculate progress
  const answeredQuestions = state.selectedAnswers.filter(answer => answer !== null).length;
  const progress = (answeredQuestions / mockQuestions.length) * 100;
  const reviewedQuestions = state.markedForReview.filter(marked => marked).length;
  
  // Handle question navigation
  const goToQuestion = (index: number) => {
    setState(prev => ({ ...prev, currentQuestion: index }));
  };
  
  // Handle answer selection
  const handleSelectAnswer = (answerIndex: number) => {
    setState(prev => {
      const newAnswers = [...prev.selectedAnswers];
      newAnswers[prev.currentQuestion] = answerIndex;
      return { ...prev, selectedAnswers: newAnswers };
    });
  };
  
  // Toggle mark for review
  const toggleMarkForReview = () => {
    setState(prev => {
      const newMarked = [...prev.markedForReview];
      newMarked[prev.currentQuestion] = !newMarked[prev.currentQuestion];
      return { ...prev, markedForReview: newMarked };
    });
  };
  
  // Handle save and next
  const handleSaveAndNext = () => {
    if (state.currentQuestion < mockQuestions.length - 1) {
      setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    }
  };
  
  // Handle previous question
  const handlePrevious = () => {
    if (state.currentQuestion > 0) {
      setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }));
    }
  };

  // Start test (close instructions)
  const handleStartTest = () => {
    setShowInstructions(false);
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(console.error);
    }
  };
  
  // Handle submit test confirmation
  const confirmSubmitTest = () => {
    setShowSubmitDialog(true);
  };

  // Handle actual submit test
  const handleSubmitTest = () => {
    setState(prev => ({ ...prev, testSubmitted: true }));
    setShowSubmitDialog(false);
    
    // Clear saved progress
    localStorage.removeItem(`mocktest_${id}_answers`);
    localStorage.removeItem(`mocktest_${id}_marked`);
    localStorage.removeItem(`mocktest_${id}_current`);

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }
    
    toast({
      title: "Mock Test Submitted Successfully! 🎉",
      description: "Your answers have been saved. Redirecting to results...",
    });
    
    // Navigate to results page with answers data
    setTimeout(() => {
      navigate(`/exam-results/${id}`, { 
        state: { 
          answers: state.selectedAnswers,
          questions: mockQuestions,
          examTitle: examData.title,
          timeSpent: examData.duration * 60 - state.timeLeft
        } 
      });
    }, 2000);
  };

  // Show instructions modal
  if (showInstructions) {
    return (
      <Instructions 
        examData={examData}
        onStartTest={handleStartTest}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="education-container py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{examData.title}</h1>
              <p className="text-sm text-gray-600">Question {state.currentQuestion + 1} of {mockQuestions.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-green-600">{answeredQuestions}</span> Answered • 
                <span className="font-medium text-orange-600 ml-1">{reviewedQuestions}</span> Marked
              </div>
              {!isFullscreen && (
                <button
                  onClick={() => document.documentElement.requestFullscreen?.()}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Enter Fullscreen
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="education-container py-6">
        {/* Progress Bar */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main test area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question and options */}
          <div className="lg:col-span-3">
            <QuestionContent
              question={mockQuestions[state.currentQuestion]}
              currentQuestion={state.currentQuestion}
              totalQuestions={mockQuestions.length}
              selectedAnswer={state.selectedAnswers[state.currentQuestion]}
              testSubmitted={state.testSubmitted}
              handleSelectAnswer={handleSelectAnswer}
              handlePrevious={handlePrevious}
              handleSaveAndNext={handleSaveAndNext}
              toggleMarkForReview={toggleMarkForReview}
              isMarkedForReview={state.markedForReview[state.currentQuestion]}
            />
          </div>
          
          {/* Sidebar with timer and palette */}
          <div className="lg:col-span-1 space-y-6">
            <TimerProgress 
              timeLeft={state.timeLeft}
              progress={progress}
              answeredQuestions={answeredQuestions}
              totalQuestions={mockQuestions.length}
            />
            
            <QuestionPalette
              totalQuestions={mockQuestions.length}
              currentQuestion={state.currentQuestion}
              selectedAnswers={state.selectedAnswers}
              markedForReview={state.markedForReview}
              goToQuestion={goToQuestion}
              handleSubmitTest={confirmSubmitTest}
            />

            {/* Summary Card */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Test Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-medium">{mockQuestions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-medium text-green-600">{answeredQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Not Answered:</span>
                  <span className="font-medium text-red-600">{mockQuestions.length - answeredQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marked for Review:</span>
                  <span className="font-medium text-orange-600">{reviewedQuestions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Mock Test?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to submit your test? This action cannot be undone.</p>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>Answered: <span className="font-medium text-green-600">{answeredQuestions}</span></div>
                  <div>Not Answered: <span className="font-medium text-red-600">{mockQuestions.length - answeredQuestions}</span></div>
                  <div>Marked for Review: <span className="font-medium text-orange-600">{reviewedQuestions}</span></div>
                  <div>Time Left: <span className="font-medium text-blue-600">{Math.floor(state.timeLeft / 60)}:{(state.timeLeft % 60).toString().padStart(2, '0')}</span></div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Again</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitTest} className="bg-green-600 hover:bg-green-700">
              Submit Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MockTestPage;
