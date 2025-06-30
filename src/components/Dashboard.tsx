import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProjectData } from '../types';
import Logo from './Logo';
import { 
  Plus, 
  FolderOpen, 
  Trash2, 
  Calendar, 
  User, 
  Globe, 
  CheckCircle, 
  Clock,
  Star,
  Search,
  Filter,
  ArrowRight,
  Download,
  Upload
} from 'lucide-react';

interface DashboardProps {
  onCreateNew: () => void;
  onLoadProject: (project: ProjectData) => void;
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateNew, onLoadProject, onBack }) => {
  const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'web' | 'mobile' | 'desktop' | 'proprietary'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'progress'>('recent');

  useEffect(() => {
    loadSavedProjects();
  }, []);

  const loadSavedProjects = () => {
    const projects: ProjectData[] = [];
    
    // Load all projects from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('symphony-project-')) {
        try {
          const projectData = JSON.parse(localStorage.getItem(key) || '');
          if (projectData && projectData.id) {
            projects.push(projectData);
          }
        } catch (error) {
          console.error('Error loading project:', error);
        }
      }
    }
    
    setSavedProjects(projects);
  };

  const deleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      localStorage.removeItem(`symphony-project-${projectId}`);
      loadSavedProjects();
    }
  };

  const calculateProgress = (project: ProjectData): number => {
    let completed = 0;
    let total = 7; // Total stages
    
    if (project.name && project.slogan) completed++;
    if (project.techStack) completed++;
    if (project.decidedFeatures && project.decidedFeatures.length > 0) completed++;
    if (project.uiStyle) completed++;
    if (project.uiFlow && project.uiFlow.length > 0) completed++;
    if (project.builderTools) completed++;
    if (project.deployment) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-400 bg-green-500/20';
    if (progress >= 50) return 'text-yellow-400 bg-yellow-500/20';
    if (progress >= 20) return 'text-blue-400 bg-blue-500/20';
    return 'text-gray-400 bg-gray-500/20';
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'web': return <Globe className="h-4 w-4" />;
      case 'mobile': return <User className="h-4 w-4" />;
      case 'desktop': return <FolderOpen className="h-4 w-4" />;
      case 'proprietary': return <Star className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const exportProject = (project: ProjectData) => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name || 'project'}-export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const projectData = JSON.parse(e.target?.result as string);
            // Generate new ID to avoid conflicts
            projectData.id = 'project-' + Date.now();
            projectData.name = `${projectData.name} (Imported)`;
            
            // Save to localStorage
            localStorage.setItem(`symphony-project-${projectData.id}`, JSON.stringify(projectData));
            loadSavedProjects();
          } catch (error) {
            alert('Error importing project. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const filteredProjects = savedProjects
    .filter(project => {
      const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.projectType?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || project.platform === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'progress':
          return calculateProgress(b) - calculateProgress(a);
        case 'recent':
        default:
          return parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]);
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center px-3 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                Back
              </button>
              <div className="h-8 w-px bg-slate-600" />
              <Logo size={40} showText textSize="lg" />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={importProject}
                className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </button>
              <button
                onClick={onCreateNew}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Your Project Dashboard</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Manage all your Symphony projects in one place. Continue working on existing projects or start something new.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center">
              <FolderOpen className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{savedProjects.length}</p>
                <p className="text-gray-400">Total Projects</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">
                  {savedProjects.filter(p => calculateProgress(p) === 100).length}
                </p>
                <p className="text-gray-400">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">
                  {savedProjects.filter(p => calculateProgress(p) > 0 && calculateProgress(p) < 100).length}
                </p>
                <p className="text-gray-400">In Progress</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">
                  {Math.round(savedProjects.reduce((acc, p) => acc + calculateProgress(p), 0) / (savedProjects.length || 1))}%
                </p>
                <p className="text-gray-400">Avg Progress</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                >
                  <option value="all">All Platforms</option>
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="desktop">Desktop</option>
                  <option value="proprietary">Proprietary</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              >
                <option value="recent">Most Recent</option>
                <option value="name">Name</option>
                <option value="progress">Progress</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => {
              const progress = calculateProgress(project);
              const createdDate = new Date(parseInt(project.id.split('-')[1]));
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6 hover:border-blue-400/50 transition-all duration-200 group cursor-pointer"
                  onClick={() => onLoadProject(project)}
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {getPlatformIcon(project.platform)}
                        <h3 className="text-lg font-semibold text-white truncate">
                          {project.name || 'Unnamed Project'}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm truncate">
                        {project.projectType || 'No description'}
                      </p>
                      {project.slogan && (
                        <p className="text-blue-300 text-xs mt-1 truncate">
                          "{project.slogan}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportProject(project);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Export Project"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(project.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">Progress</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${getProgressColor(progress)}`}>
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress >= 80 ? 'bg-green-500' :
                          progress >= 50 ? 'bg-yellow-500' :
                          progress >= 20 ? 'bg-blue-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Platform:</span>
                      <span className="text-white capitalize">{project.platform}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Experience:</span>
                      <span className="text-white capitalize">{project.experience}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Features:</span>
                      <span className="text-white">
                        {project.decidedFeatures?.length || 0} selected
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="flex items-center text-xs text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {createdDate.toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                      Open Project
                      <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-16"
          >
            <FolderOpen className="h-24 w-24 text-gray-500 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">
              {searchTerm || filterType !== 'all' ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start your journey by creating your first project with Symphony\'s AI-powered planning assistant.'
              }
            </p>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Project
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;