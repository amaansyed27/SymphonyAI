import React, { useState } from 'react';
import { ProjectData } from '../types';
import { ChevronRight, Sparkles, Play } from 'lucide-react';

interface QuestionnaireProps {
  onComplete: (data: Partial<ProjectData>) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<ProjectData>>({
    platform: '',
    targetAudience: '',
    projectType: '',
    budget: '',
    timeline: '',
    experience: ''
  });

  // Demo project data
  const demoProject = {
    platform: 'web',
    projectType: 'Social media platform for fitness enthusiasts',
    targetAudience: 'Fitness enthusiasts, personal trainers, and health-conscious individuals aged 18-45',
    budget: 'medium',
    timeline: 'months',
    experience: 'intermediate'
  };

  const questions = [
    {
      id: 'platform',
      question: 'What platform are you building for?',
      options: [
        { value: 'web', label: 'Web Application', description: 'Browser-based application' },
        { value: 'mobile', label: 'Mobile App', description: 'iOS/Android application' },
        { value: 'desktop', label: 'Desktop App', description: 'Windows/Mac/Linux application' },
        { value: 'proprietary', label: 'Proprietary System', description: 'Custom enterprise solution' }
      ]
    },
    {
      id: 'projectType',
      question: 'What type of project are you building?',
      type: 'text',
      placeholder: 'e.g., Social media platform, E-commerce store, Portfolio website...'
    },
    {
      id: 'targetAudience',
      question: 'Who is your target audience?',
      type: 'text',
      placeholder: 'e.g., Small business owners, College students, Gaming enthusiasts...'
    },
    {
      id: 'budget',
      question: 'What\'s your budget range?',
      options: [
        { value: 'low', label: 'Low Budget', description: '$0 - $500/month' },
        { value: 'medium', label: 'Medium Budget', description: '$500 - $2000/month' },
        { value: 'high', label: 'High Budget', description: '$2000+/month' }
      ]
    },
    {
      id: 'timeline',
      question: 'What\'s your timeline?',
      options: [
        { value: 'weeks', label: 'Few Weeks', description: 'Quick MVP or prototype' },
        { value: 'months', label: 'Few Months', description: 'Full-featured application' },
        { value: 'year', label: 'Year+', description: 'Complex enterprise solution' }
      ]
    },
    {
      id: 'experience',
      question: 'What\'s your technical experience level?',
      options: [
        { value: 'beginner', label: 'Beginner', description: 'New to development' },
        { value: 'intermediate', label: 'Intermediate', description: 'Some coding experience' },
        { value: 'expert', label: 'Expert', description: 'Experienced developer' }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    const question = questions[currentStep];
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const loadDemoProject = () => {
    setAnswers(demoProject);
    onComplete(demoProject);
  };

  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentQuestion.id as keyof ProjectData];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Symphony</h1>
          </div>
          <p className="text-blue-200 text-lg">AI-Powered Project Planning</p>
          
          {/* Demo Project Button */}
          <div className="mt-6">
            <button
              onClick={loadDemoProject}
              className="flex items-center mx-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Try Demo Project
            </button>
            <p className="text-blue-300 text-sm mt-2">
              Skip the questionnaire with a pre-filled fitness social media platform
            </p>
          </div>

          <div className="mt-6 bg-blue-800/30 rounded-full h-2 w-full">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="text-blue-300 mt-2 text-sm">
            Question {currentStep + 1} of {questions.length}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">
            {currentQuestion.question}
          </h2>

          {currentQuestion.options ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    currentAnswer === option.value
                      ? 'border-blue-400 bg-blue-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-blue-100 hover:border-blue-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium mb-1">{option.label}</div>
                  <div className="text-sm opacity-70">{option.description}</div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <textarea
                value={currentAnswer as string || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-none"
                rows={4}
              />
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-2 text-blue-200 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={nextStep}
              disabled={!currentAnswer}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {currentStep === questions.length - 1 ? 'Start Planning' : 'Next'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Demo Project Info Card */}
        <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-medium mb-2">Demo Project Details:</h3>
          <div className="text-sm text-blue-200 space-y-1">
            <p><span className="text-blue-300">Platform:</span> Web Application</p>
            <p><span className="text-blue-300">Type:</span> Social media platform for fitness enthusiasts</p>
            <p><span className="text-blue-300">Audience:</span> Fitness enthusiasts, personal trainers, health-conscious individuals</p>
            <p><span className="text-blue-300">Budget:</span> Medium ($500-$2000/month)</p>
            <p><span className="text-blue-300">Timeline:</span> Few months</p>
            <p><span className="text-blue-300">Experience:</span> Intermediate developer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;