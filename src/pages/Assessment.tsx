import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Save as SaveIcon,
  CheckCircle as CompleteIcon,
  Warning as WarningIcon,
  TrendingUp as ProgressIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';

import QuestionCard from '../components/QuestionCard';

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateQuestion, saveAssessment } = useAssessment();
  const [activeModule, setActiveModule] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [saveNotification, setSaveNotification] = useState(false);

  if (!state.currentAssessment) {
    navigate('/');
    return null;
  }

  const currentModule = state.currentAssessment.modules[activeModule];
  const currentSection = currentModule?.sections[activeSection];

  const handleQuestionAnswer = (questionId: string, answer: any, score: number) => {
    if (currentModule && currentSection) {
      updateQuestion(currentModule.id, currentSection.id, questionId, answer, score);
    }
  };

  const handleSaveAssessment = () => {
    saveAssessment();
    setSaveNotification(true);
  };

  const handleNextSection = () => {
    if (currentModule && activeSection < currentModule.sections.length - 1) {
      setActiveSection(activeSection + 1);
    } else if (activeModule < state.currentAssessment!.modules.length - 1) {
      setActiveModule(activeModule + 1);
      setActiveSection(0);
    }
  };

  const handlePrevSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    } else if (activeModule > 0) {
      setActiveModule(activeModule - 1);
      const prevModule = state.currentAssessment!.modules[activeModule - 1];
      setActiveSection(prevModule.sections.length - 1);
    }
  };

  const getModuleStatus = (module: any) => {
    if (module.status === 'completed') return 'completed';
    if (module.score > 0) return 'in-progress';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CompleteIcon color="success" />;
      case 'in-progress':
        return <ProgressIcon color="warning" />;
      case 'pending':
        return <WarningIcon color="disabled" />;
      default:
        return <WarningIcon color="disabled" />;
    }
  };

  const getProgressPercentage = () => {
    const totalQuestions = state.currentAssessment!.modules.reduce((total, module) =>
      total + module.sections.reduce((sectionTotal, section) =>
        sectionTotal + section.questions.length, 0), 0);
    
    const answeredQuestions = state.currentAssessment!.modules.reduce((total, module) =>
      total + module.sections.reduce((sectionTotal, section) =>
        sectionTotal + section.questions.filter(q => q.answer !== undefined).length, 0), 0);
    
    return (answeredQuestions / totalQuestions) * 100;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Assessment: {state.currentAssessment.clientName}
          </Typography>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveAssessment}
            size="large"
          >
            Guardar Assessment
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Módulo: {currentModule?.name} • Sección: {currentSection?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          💾 La información se guarda automáticamente en el navegador (localStorage)
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progreso General
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(getProgressPercentage())}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getProgressPercentage()}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Módulos
              </Typography>
              <Box sx={{ mt: 2 }}>
                {state.currentAssessment.modules.map((module, index) => (
                  <Box
                    key={module.id}
                    sx={{
                      p: 2,
                      mb: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      cursor: 'pointer',
                      backgroundColor: index === activeModule ? 'primary.light' : 'transparent',
                      color: index === activeModule ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: index === activeModule ? 'primary.light' : 'grey.100',
                      },
                    }}
                    onClick={() => {
                      setActiveModule(index);
                      setActiveSection(0);
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getStatusIcon(getModuleStatus(module))}
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {module.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {module.score} / {module.maxScore} puntos
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  {currentSection?.name}
                </Typography>
                <Chip
                  label={`${currentSection?.score || 0} / ${currentSection?.maxScore || 0}`}
                  color="primary"
                />
              </Box>

                             {currentSection?.questions.map((question) => (
                 <QuestionCard
                   key={question.id}
                   question={question}
                   onAnswerChange={(answer, score) => handleQuestionAnswer(question.id, answer, score)}
                   moduleName={currentModule?.name}
                   sectionName={currentSection?.name}
                 />
               ))}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<PrevIcon />}
                  onClick={handlePrevSection}
                  disabled={activeModule === 0 && activeSection === 0}
                >
                  Anterior
                </Button>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveAssessment}
                  >
                    Guardar
                  </Button>
                  
                  <Button
                    variant="contained"
                    endIcon={<NextIcon />}
                    onClick={handleNextSection}
                    disabled={activeModule === state.currentAssessment.modules.length - 1 && 
                             activeSection === currentModule?.sections.length - 1}
                  >
                    Siguiente
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar open={saveNotification} autoHideDuration={6000} onClose={() => setSaveNotification(false)}>
        <Alert onClose={() => setSaveNotification(false)} severity="success" sx={{ width: '100%' }}>
          Assessment guardado exitosamente!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Assessment; 