export interface AssessmentData {
  id: string;
  clientName: string;
  assessmentDate: string;
  assessor: string;
  modules: ModuleAssessment[];
  recommendations: Recommendation[];
  criticalPoints: CriticalPoint[];
  overallScore: number;
}

export interface ModuleAssessment {
  id: string;
  name: string;
  description: string;
  score: number;
  maxScore: number;
  sections: AssessmentSection[];
  status: 'pending' | 'in-progress' | 'completed';
}

export interface AssessmentSection {
  id: string;
  name: string;
  description: string;
  questions: AssessmentQuestion[];
  score: number;
  maxScore: number;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  description?: string;
  type: 'boolean' | 'scale' | 'text' | 'multiple-choice' | 'checkbox' | 'autocomplete';
  options?: string[];
  answer?: any;
  score?: number;
  maxScore: number;
  weight: number;
  category: string;
  critical: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  module: string;
  estimatedEffort: string;
  businessImpact: string;
  technicalComplexity: string;
  implementation: string[];
}

export interface CriticalPoint {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  module: string;
  impact: string;
  risk: string;
  mitigation: string;
}

export interface ReportData {
  assessment: AssessmentData;
  charts: ChartData[];
  summary: ReportSummary;
}

export interface ChartData {
  type: 'pie' | 'bar' | 'line' | 'radar';
  data: any;
  options: any;
}

export interface ReportSummary {
  totalScore: number;
  maxScore: number;
  percentage: number;
  criticalIssues: number;
  highPriorityRecommendations: number;
  modulesCompleted: number;
  totalModules: number;
}

export interface ModuleConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  sections: SectionConfig[];
}

export interface SectionConfig {
  id: string;
  name: string;
  questions: QuestionConfig[];
}

export interface QuestionConfig {
  id: string;
  question: string;
  description?: string;
  type: 'boolean' | 'scale' | 'text' | 'multiple-choice' | 'checkbox' | 'autocomplete';
  options?: string[];
  maxScore: number;
  weight: number;
  category: string;
  critical: boolean;
} 