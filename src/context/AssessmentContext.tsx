import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AssessmentData, ModuleAssessment } from '../types';
import { moduleConfigs } from '../config/modules';

interface AssessmentState {
  currentAssessment: AssessmentData | null;
  isLoading: boolean;
  error: string | null;
}

type AssessmentAction =
  | { type: 'START_ASSESSMENT'; payload: { clientName: string; assessor: string } }
  | { type: 'UPDATE_QUESTION'; payload: { moduleId: string; sectionId: string; questionId: string; answer: any; score: number } }
  | { type: 'COMPLETE_MODULE'; payload: { moduleId: string } }
  | { type: 'SAVE_ASSESSMENT' }
  | { type: 'LOAD_ASSESSMENT'; payload: AssessmentData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AssessmentState = {
  currentAssessment: null,
  isLoading: false,
  error: null,
};

function createInitialAssessment(clientName: string, assessor: string): AssessmentData {
  const modules: ModuleAssessment[] = moduleConfigs.map(moduleConfig => ({
    id: moduleConfig.id,
    name: moduleConfig.name,
    description: '',
    score: 0,
    maxScore: moduleConfig.sections.reduce((total, section) => 
      total + section.questions.reduce((sectionTotal, question) => 
        sectionTotal + question.maxScore, 0), 0),
    status: 'pending',
    sections: moduleConfig.sections.map(section => ({
      id: section.id,
      name: section.name,
      description: '',
      score: 0,
      maxScore: section.questions.reduce((total, question) => total + question.maxScore, 0),
      status: 'pending',
      questions: section.questions.map(question => ({
        id: question.id,
        question: question.question,
        description: question.description,
        type: question.type,
        options: question.options,
        answer: undefined,
        score: 0,
        maxScore: question.maxScore,
        weight: question.weight,
        category: question.category,
        critical: question.critical,
      })),
    })),
  }));

  return {
    id: Date.now().toString(),
    clientName,
    assessor,
    assessmentDate: new Date().toISOString(),
    modules,
    recommendations: [],
    criticalPoints: [],
    overallScore: 0,
  };
}

function assessmentReducer(state: AssessmentState, action: AssessmentAction): AssessmentState {
  switch (action.type) {
    case 'START_ASSESSMENT':
      return {
        ...state,
        currentAssessment: createInitialAssessment(action.payload.clientName, action.payload.assessor),
        error: null,
      };

    case 'UPDATE_QUESTION': {
      if (!state.currentAssessment) return state;

      const { moduleId, sectionId, questionId, answer, score } = action.payload;
      
      const updatedModules = state.currentAssessment.modules.map(module => {
        if (module.id !== moduleId) return module;

        const updatedSections = module.sections.map(section => {
          if (section.id !== sectionId) return section;

          const updatedQuestions = section.questions.map(question => {
            if (question.id !== questionId) return question;
            return { ...question, answer, score };
          });

          const sectionScore = updatedQuestions.reduce((total, q) => total + (q.score || 0), 0);
          let sectionStatus: 'pending' | 'in-progress' | 'completed' = sectionScore > 0 ? 'in-progress' : 'pending';
          if (sectionScore === section.maxScore) sectionStatus = 'completed';

          return {
            ...section,
            questions: updatedQuestions,
            score: sectionScore,
            status: sectionStatus,
          };
        });

        const moduleScore = updatedSections.reduce((total, s) => total + s.score, 0);
        let moduleStatus: 'pending' | 'in-progress' | 'completed' = moduleScore > 0 ? 'in-progress' : 'pending';
        if (moduleScore === module.maxScore) moduleStatus = 'completed';

        return {
          ...module,
          sections: updatedSections,
          score: moduleScore,
          status: moduleStatus,
        };
      });

      const overallScore = updatedModules.reduce((total, module) => total + module.score, 0);

      return {
        ...state,
        currentAssessment: {
          ...state.currentAssessment,
          modules: updatedModules,
          overallScore,
        },
      };
    }

    case 'COMPLETE_MODULE': {
      if (!state.currentAssessment) return state;

      const updatedModules = state.currentAssessment.modules.map(module => {
        if (module.id !== action.payload.moduleId) return module;
        return { ...module, status: 'completed' as const };
      });

      return {
        ...state,
        currentAssessment: {
          ...state.currentAssessment,
          modules: updatedModules,
        },
      };
    }

    case 'SAVE_ASSESSMENT':
      return {
        ...state,
        isLoading: true,
      };

    case 'LOAD_ASSESSMENT':
      return {
        ...state,
        currentAssessment: action.payload,
        isLoading: false,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
}

interface AssessmentContextType {
  state: AssessmentState;
  dispatch: React.Dispatch<AssessmentAction>;
  startAssessment: (clientName: string, assessor: string) => void;
  updateQuestion: (moduleId: string, sectionId: string, questionId: string, answer: any, score: number) => void;
  completeModule: (moduleId: string) => void;
  saveAssessment: () => void;
  loadAssessment: (assessment: AssessmentData) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  const startAssessment = (clientName: string, assessor: string) => {
    dispatch({ type: 'START_ASSESSMENT', payload: { clientName, assessor } });
  };

  const updateQuestion = (moduleId: string, sectionId: string, questionId: string, answer: any, score: number) => {
    dispatch({ type: 'UPDATE_QUESTION', payload: { moduleId, sectionId, questionId, answer, score } });
  };

  const completeModule = (moduleId: string) => {
    dispatch({ type: 'COMPLETE_MODULE', payload: { moduleId } });
  };

  const saveAssessment = () => {
    dispatch({ type: 'SAVE_ASSESSMENT' });
    // Here you would typically save to localStorage or send to a server
    if (state.currentAssessment) {
      localStorage.setItem('currentAssessment', JSON.stringify(state.currentAssessment));
    }
  };

  const loadAssessment = (assessment: AssessmentData) => {
    dispatch({ type: 'LOAD_ASSESSMENT', payload: assessment });
  };

  const value: AssessmentContextType = {
    state,
    dispatch,
    startAssessment,
    updateQuestion,
    completeModule,
    saveAssessment,
    loadAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
} 