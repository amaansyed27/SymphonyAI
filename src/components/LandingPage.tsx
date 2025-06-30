import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Target, 
  Palette, 
  Code, 
  Rocket, 
  Users,
  CheckCircle,
  Star,
  Brain,
  Lightbulb
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Planning',
      description: 'Get intelligent suggestions for every aspect of your project using advanced AI technology.'
    },
    {
      icon: Target,
      title: 'Strategic Roadmap',
      description: 'Follow a proven 7-step process from concept to deployment with clear milestones.'
    },
    {
      icon: Palette,
      title: 'Design Intelligence',
      description: 'Generate color palettes, UI flows, and design systems tailored to your audience.'
    },
    {
      icon: Code,
      title: 'Tech Stack Optimization',
      description: 'Get personalized technology recommendations based on your budget and experience.'
    },
    {
      icon: Lightbulb,
      title: 'Feature Brainstorming',
      description: 'Discover essential features and innovative ideas through AI-powered conversations.'
    },
    {
      icon: Rocket,
      title: 'Deployment Ready',
      description: 'Get platform recommendations and step-by-step deployment guides.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Project Discovery',
      description: 'Answer a few questions about your vision, audience, and goals.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our AI analyzes your requirements and generates personalized recommendations.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '03',
      title: 'Interactive Planning',
      description: 'Work through each stage of the roadmap with AI-powered guidance.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      number: '04',
      title: 'Complete Documentation',
      description: 'Export comprehensive project documentation and implementation guides.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Startup Founder',
      content: 'Symphony helped me plan my entire SaaS platform in just 2 hours. The AI suggestions were spot-on!',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Freelance Developer',
      content: 'As a solo developer, Symphony gives me the strategic thinking of an entire product team.',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'Product Manager',
      content: 'The roadmap feature is incredible. It breaks down complex projects into manageable steps.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Logo and Brand */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-75"></div>
                <div className="relative bg-white rounded-2xl p-4">
                  <Sparkles className="h-12 w-12 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  Symphony
                </h1>
                <p className="text-xl text-blue-200 font-medium">AI Project Planner</p>
              </div>
            </div>

            {/* Hero Headline */}
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Turn Your Ideas Into
              <span className="block text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
                Perfect Plans
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              The world's most intelligent project planning assistant. Get AI-powered recommendations 
              for technology stacks, features, design, and deployment strategies in minutes, not weeks.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <button
                onClick={onGetStarted}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <span className="flex items-center">
                  Start Planning Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="px-8 py-4 border-2 border-white/20 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-blue-200">Projects Planned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">95%</div>
                <div className="text-blue-200">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">2hrs</div>
                <div className="text-blue-200">Average Planning Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Plan
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Your Perfect Project
              </span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial concept to deployment strategy, Symphony provides intelligent guidance 
              at every step of your project planning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Symphony Works
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent planning process guides you through every decision, 
              ensuring your project is set up for success from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 group"
              >
                <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300`}>
                  {step.number}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h4>
                  <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by Creators Worldwide
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of developers, entrepreneurs, and product managers 
              who trust Symphony to plan their projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to Build Something
            <span className="block text-transparent bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text">
              Amazing?
            </span>
          </h3>
          
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of creators who've turned their ideas into successful projects 
            with Symphony's AI-powered planning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={onGetStarted}
              className="group relative px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="flex items-center">
                Start Your Project Now
                <Zap className="ml-3 h-6 w-6 text-yellow-500" />
              </span>
            </button>
            
            <div className="flex items-center text-blue-200">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Free to start • No credit card required</span>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-6 w-6 text-blue-400" />
              <span className="text-blue-100">10,000+ Happy Users</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Zap className="h-6 w-6 text-yellow-400" />
              <span className="text-blue-100">Lightning Fast Setup</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span className="text-blue-100">Proven Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <Sparkles className="h-8 w-8 text-blue-400 mr-3" />
            <span className="text-2xl font-bold text-white">Symphony</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Symphony AI Project Planner. Turning ideas into perfect plans.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;