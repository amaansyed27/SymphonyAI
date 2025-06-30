import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';
import Logo from './Logo';
import { 
  ArrowRight, Zap, Target, Palette, Code, 
  Rocket, Users, CheckCircle, Star, Brain, Lightbulb
} from 'lucide-react';

// Reusable component for scroll-triggered animations
type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.8, delay }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// The Enhanced Landing Page Component
type LandingPageProps = {
  onGetStarted: () => void;
};

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    { icon: Brain, title: 'AI-Powered Planning', description: 'Get intelligent suggestions for every aspect of your project.', layout: 'col-span-1 md:col-span-2' },
    { icon: Target, title: 'Strategic Roadmap', description: 'Follow a proven 7-step process from concept to deployment.', layout: 'col-span-1' },
    { icon: Palette, title: 'Design Intelligence', description: 'Generate color palettes and UI flows tailored to your brand.', layout: 'col-span-1' },
    { icon: Code, title: 'Tech Stack Optimization', description: 'Personalized technology recommendations for your needs.', layout: 'col-span-1 md:col-span-2' },
    { icon: Lightbulb, title: 'Feature Brainstorming', description: 'Discover essential and innovative features through AI.', layout: 'col-span-1' },
    { icon: Rocket, title: 'Deployment Ready', description: 'Get platform recommendations and deployment guides.', layout: 'col-span-1 md:col-span-3' },
  ];

  const steps = [
    { number: '01', title: 'Project Discovery', description: 'Answer a few questions about your vision, audience, and goals.', color: 'from-blue-500 to-cyan-400' },
    { number: '02', title: 'AI Analysis', description: 'Our AI analyzes your requirements and generates personalized recommendations.', color: 'from-purple-500 to-pink-500' },
    { number: '03', title: 'Interactive Planning', description: 'Work through each stage of the roadmap with AI-powered guidance.', color: 'from-green-400 to-emerald-500' },
    { number: '04', title: 'Complete Documentation', description: 'Export comprehensive project documentation and implementation guides.', color: 'from-orange-500 to-red-500' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'Startup Founder', content: 'Symphony helped me plan my entire SaaS platform in just 2 hours. The AI suggestions were spot-on!', rating: 5 },
    { name: 'Marcus Rodriguez', role: 'Freelance Developer', content: 'As a solo developer, Symphony gives me the strategic thinking of an entire product team.', rating: 5 },
    { name: 'Emily Watson', role: 'Product Manager', content: 'The roadmap feature is incredible. It breaks down complex projects into manageable steps.', rating: 5 },
  ];

  // State for the sticky header
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden">
      {/* --- Flowing Aurora Background --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-pink-500 to-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      </div>
      
      {/* --- Sticky Header --- */}
      <motion.header 
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300", 
          isScrolled ? "bg-slate-900/50 backdrop-blur-lg shadow-lg" : "bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo size={32} showText />
            <button
              onClick={onGetStarted}
              className="group hidden sm:flex items-center space-x-2 px-6 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors duration-300"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.header>

      <main>
        {/* --- Hero Section --- */}
        <section className="relative pt-48 pb-32 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                Turn Your Ideas Into
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mt-2">
                  Perfect Plans
                </span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                The world's most intelligent project planning assistant. Get AI-powered recommendations 
                for technology, features, design, and deployment in minutes, not weeks.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={onGetStarted}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
              >
                <span className="absolute h-0 w-0 rounded-full bg-blue-500 transition-all duration-500 ease-out group-hover:h-56 group-hover:w-56"></span>
                <span className="relative flex items-center">
                  Start Planning Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              <button className="px-8 py-4 text-lg font-semibold text-slate-300 border-2 border-slate-700 rounded-full hover:bg-slate-800/50 hover:border-slate-500 transition-all duration-300 backdrop-blur-sm">
                Watch Demo
              </button>
            </motion.div>
          </div>
        </section>

        {/* --- Features Section (Bento Grid) --- */}
        <section className="py-24 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold">
                An Entire Product Team,
                <span className="block bg-gradient-to-r from-green-300 to-cyan-300 text-transparent bg-clip-text mt-2">
                  Powered by AI
                </span>
              </h2>
              <p className="mt-6 text-lg text-slate-400 max-w-3xl mx-auto">
                From initial concept to deployment strategy, Symphony provides intelligent guidance at every step of your project planning journey.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={clsx(
                    "group relative p-8 rounded-2xl bg-slate-800/50 border border-slate-700 overflow-hidden",
                    feature.layout
                  )}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
                  
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- How It Works Section (Vertical Timeline) --- */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold">Four Steps to a Perfect Plan</h2>
              <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
                Our intelligent process guides you through every decision, ensuring your project is set up for success from day one.
              </p>
            </AnimatedSection>

            <div className="relative">
              <div className="absolute left-8 top-8 bottom-8 w-1 bg-slate-700/50 rounded-full" aria-hidden="true"></div>
              {steps.map((step, index) => (
                 <AnimatedSection key={index} className="flex items-start space-x-6 mb-12 group">
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-8 ring-slate-900 z-10 group-hover:scale-110 transition-transform duration-300`}>
                    {step.number}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
        
        {/* --- Testimonials Section --- */}
        <section className="py-24 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold">Loved by Creators Worldwide</h2>
              <p className="mt-6 text-lg text-slate-400 max-w-3xl mx-auto">
                Join thousands of developers, entrepreneurs, and product managers who trust Symphony.
              </p>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                   <div className="h-full bg-slate-800/50 rounded-2xl p-8 border border-slate-700 flex flex-col justify-between hover:border-purple-500/50 transition-colors duration-300">
                    <div>
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-300 mb-6 italic">"{testimonial.content}"</p>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-slate-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-purple-900/30 to-slate-900 -z-10"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white">
                Ready to Build Something
                <span className="block bg-gradient-to-r from-blue-400 to-pink-400 text-transparent bg-clip-text mt-2">
                  Amazing?
                </span>
              </h2>
              <p className="mt-8 text-xl text-slate-300 max-w-2xl mx-auto">
                Start for free and see how Symphony can transform your idea into a successful project. No credit card required.
              </p>
              <div className="mt-12">
                <button
                  onClick={onGetStarted}
                  className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 animate-pulse-cta"
                >
                  <span className="flex items-center">
                    Start Your Project Now <Zap className="ml-3 h-6 w-6" />
                  </span>
                </button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Logo size={28} showText />
          <p className="text-slate-400 mt-4">© {new Date().getFullYear()} Symphony AI. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;