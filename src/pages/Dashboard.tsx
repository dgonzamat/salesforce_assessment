import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  PlayArrow as StartIcon,
  TrendingUp as ProgressIcon,
  CheckCircle as CompleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { moduleConfigs } from '../config/modules';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state, startAssessment } = useAssessment();
  const [openDialog, setOpenDialog] = useState(false);
  const [clientName, setClientName] = useState('');
  const [assessor, setAssessor] = useState('');

  const handleStartAssessment = () => {
    if (clientName.trim() && assessor.trim()) {
      startAssessment(clientName.trim(), assessor.trim());
      setOpenDialog(false);
      setClientName('');
      setAssessor('');
      navigate('/assessment');
    }
  };

  const getModuleStatus = (moduleId: string) => {
    if (!state.currentAssessment) return 'pending';
    const module = state.currentAssessment.modules.find(m => m.id === moduleId);
    return module?.status || 'pending';
  };

  const getModuleProgress = (moduleId: string) => {
    if (!state.currentAssessment) return 0;
    const module = state.currentAssessment.modules.find(m => m.id === moduleId);
    if (!module) return 0;
    return (module.score / module.maxScore) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'pending':
        return 'default';
      default:
        return 'default';
    }
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

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Assessment Arquitectura Salesforce - Chile
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Evaluación de la arquitectura actual de Salesforce en Chile para preparar futuras expansiones
        </Typography>

        {!state.currentAssessment ? (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Iniciar Assessment Arquitectura
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Evalúa la arquitectura actual de Chile para preparar futuras expansiones
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<StartIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{ mt: 2 }}
              >
                Iniciar Assessment Arquitectura
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Assessment en Progreso
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cliente: {state.currentAssessment.clientName} | 
                    Assessor: {state.currentAssessment.assessor} |
                    Fecha: {new Date(state.currentAssessment.assessmentDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Chip
                  label={`Score: ${state.currentAssessment.overallScore}`}
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={(state.currentAssessment.overallScore / 
                  state.currentAssessment.modules.reduce((total, m) => total + m.maxScore, 0)) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        )}
      </Box>

      <Grid container spacing={3}>
        {moduleConfigs.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
              onClick={() => {
                if (state.currentAssessment) {
                  navigate('/assessment');
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: module.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <AssessmentIcon />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {module.name}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(getModuleStatus(module.id))}
                      label={getModuleStatus(module.id).replace('-', ' ')}
                      color={getStatusColor(getModuleStatus(module.id))}
                      size="small"
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {module.sections.length} secciones • {module.sections.reduce((total, section) => 
                    total + section.questions.length, 0)} preguntas
                </Typography>

                {state.currentAssessment && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Progreso
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(getModuleProgress(module.id))}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getModuleProgress(module.id)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Iniciar Assessment Arquitectura
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Nombre del Cliente"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              sx={{ mb: 3 }}
              required
            />
            <TextField
              fullWidth
              label="Nombre del Assessor"
              value={assessor}
              onChange={(e) => setAssessor(e.target.value)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleStartAssessment}
            variant="contained"
            disabled={!clientName.trim() || !assessor.trim()}
          >
            Iniciar Assessment Arquitectura
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 