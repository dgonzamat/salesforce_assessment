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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  ExpandMore as ExpandIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { generateExcelReport } from '../utils/excelGenerator';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Report: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAssessment();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  if (!state.currentAssessment) {
    navigate('/');
    return null;
  }

  const assessment = state.currentAssessment;
  const totalMaxScore = assessment.modules.reduce((total, m) => total + m.maxScore, 0);
  const percentage = ((assessment.overallScore / totalMaxScore) * 100).toFixed(2);

  const chartData = assessment.modules.map(module => ({
    name: module.name,
    score: module.score,
    maxScore: module.maxScore,
    percentage: ((module.score / module.maxScore) * 100).toFixed(1),
  }));

  const pieData = assessment.modules.map((module, index) => ({
    name: module.name,
    value: module.score,
    color: COLORS[index % COLORS.length],
  }));

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



  const handleExportExcel = () => {
    generateExcelReport(assessment);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Reporte de Assessment
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportExcel}
            size="large"
          >
            Exportar Excel
          </Button>
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                    {assessment.overallScore}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Score Total
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="secondary" sx={{ fontWeight: 700 }}>
                    {percentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Porcentaje
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="info.main" sx={{ fontWeight: 700 }}>
                    {assessment.modules.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Módulos Evaluados
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                    {assessment.modules.filter(m => m.status === 'completed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Módulos Completados
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribución de Scores por Módulo
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Comparación de Scores
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#8884d8" name="Score Actual" />
                  <Bar dataKey="maxScore" fill="#82ca9d" name="Score Máximo" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Resultados Detallados por Módulo
          </Typography>
          
          {assessment.modules.map((module) => (
            <Accordion
              key={module.id}
              expanded={expandedModule === module.id}
              onChange={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
            >
              <AccordionSummary expandIcon={<ExpandIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <AssessmentIcon color="primary" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {module.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {module.score} / {module.maxScore} puntos ({((module.score / module.maxScore) * 100).toFixed(1)}%)
                    </Typography>
                  </Box>
                  <Chip
                    label={module.status}
                    color={getStatusColor(module.status)}
                    size="small"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={(module.score / module.maxScore) * 100}
                    sx={{ height: 8, borderRadius: 4, mb: 2 }}
                  />
                  
                  {module.sections.map((section) => (
                    <Box key={section.id} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {section.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {section.score} / {section.maxScore} puntos
                      </Typography>
                      
                      <List dense>
                        {section.questions.map((question) => (
                          <ListItem key={question.id} sx={{ pl: 0 }}>
                            <ListItemIcon>
                              <CircleIcon
                                color={question.critical ? 'error' : 'primary'}
                                sx={{ fontSize: 12 }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={question.question}
                              secondary={
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Respuesta: {question.answer || 'No respondida'}
                                  </Typography>
                                  <br />
                                  <Typography variant="caption" color="text.secondary">
                                    Score: {question.score || 0} / {question.maxScore}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Información del Assessment
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Cliente:</strong> {assessment.clientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Assessor:</strong> {assessment.assessor}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Fecha:</strong> {new Date(assessment.assessmentDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>ID Assessment:</strong> {assessment.id}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Report; 