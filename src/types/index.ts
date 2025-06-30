export interface ProjectData {
  id: string;
  name?: string;
  slogan?: string;
  logo?: string;
  platform: 'web' | 'mobile' | 'desktop' | 'proprietary' | '';
  targetAudience: string;
  projectType: string;
  budget: 'low' | 'medium' | 'high' | '';
  timeline: 'weeks' | 'months' | 'year' | '';
  experience: 'beginner' | 'intermediate' | 'expert' | '';
  features: Feature[];
  decidedFeatures: Feature[];
  techStack?: TechStack;
  uiStyle?: UIStyle;
  uiFlow?: FlowNode[];
  builderTools?: BuilderTool[];
  deployment?: DeploymentOption;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface TechStack {
  frontend: string;
  backend: string;
  database: string;
  hosting: string;
  priceRange: string;
}

export interface UIStyle {
  colorPalette: string[];
  designStyle: string;
  inspiration: string[];
  selectedPalette?: any;
  selectedStyle?: any;
}

export interface FlowNode {
  id: string;
  name: string;
  type: 'screen' | 'action' | 'decision';
  connections: string[];
  position: { x: number; y: number };
}

export interface BuilderTool {
  name: string;
  type: 'frontend' | 'backend' | 'database';
  description: string;
  prompts: string[];
}

export interface DeploymentOption {
  platform: string;
  reasoning: string;
  steps: string[];
}

export interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  icon: string;
  position: { x: number; y: number };
}

export interface LogoGenerationResult {
  imageUrl: string;
  imageData: string;
  mimeType: string;
}