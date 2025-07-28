import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  TextField,
  Box,
  Chip,
  Rating,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Warning as CriticalIcon,
  Lightbulb as SuggestionIcon,
  AutoAwesome as AutoCompleteIcon,
} from '@mui/icons-material';
import { AssessmentQuestion } from '../types';
import { 
  generateSuggestions, 
  getQuickSuggestions,
  AutocompleteContext 
} from '../utils/autocompleteService';

interface QuestionCardProps {
  question: AssessmentQuestion;
  onAnswerChange: (answer: any, score: number) => void;
  moduleName?: string;
  sectionName?: string;
}



const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onAnswerChange, 
  moduleName, 
  sectionName 
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generar sugerencias inteligentes basadas en el contexto
  useEffect(() => {
    const generateIntelligentSuggestions = () => {
      const context: AutocompleteContext = {
        moduleName: moduleName || '',
        sectionName: sectionName || '',
        questionText: question.question,
        questionType: question.type
      };

      // Obtener sugerencias del servicio inteligente
      const intelligentSuggestions = generateSuggestions(context);
      const quickSuggestions = getQuickSuggestions(context);
      
      // Combinar sugerencias inteligentes con rápidas
      const allSuggestions = [
        ...intelligentSuggestions.map(s => s.text),
        ...quickSuggestions
      ];

      // Filtrar duplicados y limitar
      const uniqueSuggestions = Array.from(new Set(allSuggestions)).slice(0, 10);
      setSuggestions(uniqueSuggestions);
    };

    generateIntelligentSuggestions();
  }, [question, moduleName, sectionName]);

  const handleAnswerChange = (value: any) => {
    let score = 0;
    
    if (question.type === 'boolean') {
      if (value === true) {
        score = question.maxScore;
      } else if (value === false) {
        score = 0;
      } else if (value === 'unknown') {
        score = 0; // No score for unknown information
      }
    } else if (question.type === 'scale') {
      score = value * (question.maxScore / (question.options?.length || 5));
    } else if (question.type === 'multiple-choice') {
      if (value === 'No tengo información') {
        score = 0; // No score for unknown information
      } else {
        const selectedIndex = question.options?.indexOf(value) || 0;
        score = (selectedIndex + 1) * (question.maxScore / (question.options?.length || 1));
      }
    } else if (question.type === 'checkbox') {
      if (value === 'unknown') {
        score = 0; // No score for unknown information
      } else if (Array.isArray(value)) {
        score = Math.min(question.maxScore, value.length * (question.maxScore / (question.options?.length || 1)));
      }
    } else if (question.type === 'text' || question.type === 'autocomplete') {
      if (value === 'No tengo información disponible') {
        score = 0; // No score for unknown information
      } else if (typeof value === 'string' && value.trim().length > 0) {
        score = Math.min(question.maxScore, Math.floor(value.length / 10) + 1);
      }
    }
    
    onAnswerChange(value, score);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleAnswerChange(suggestion);
    setShowSuggestions(false);
  };

  const getQuestionContext = () => {
    const contextInfo = {
      module: moduleName || 'Salesforce',
      section: sectionName || 'General',
      relevance: '',
      impact: '',
      considerations: '',
      icon: '📋',
      urgency: ''
    };

    // Contexto específico por tipo de pregunta
    switch (question.type) {
      case 'boolean':
        contextInfo.relevance = 'Evaluación de implementación actual';
        contextInfo.considerations = 'Determina si la funcionalidad está lista para el assessment de Chile';
        contextInfo.icon = '✅';
        break;
      case 'checkbox':
        contextInfo.relevance = 'Análisis de componentes implementados';
        contextInfo.considerations = 'Identifica qué elementos están disponibles para evaluación';
        contextInfo.icon = '📋';
        break;
      case 'multiple-choice':
        contextInfo.relevance = 'Evaluación de configuración específica';
        contextInfo.considerations = 'Define el estado actual de la configuración en Chile';
        contextInfo.icon = '⚙️';
        break;
      case 'text':
      case 'autocomplete':
        contextInfo.relevance = 'Descripción detallada de implementación';
        contextInfo.considerations = 'Proporciona contexto para evaluación de arquitectura en Chile';
        contextInfo.icon = '📝';
        break;
      case 'scale':
        contextInfo.relevance = 'Evaluación de madurez';
        contextInfo.considerations = 'Mide el nivel de preparación de la arquitectura en Chile';
        contextInfo.icon = '📊';
        break;
      default:
        contextInfo.relevance = 'Evaluación general';
        contextInfo.considerations = 'Información para análisis de arquitectura';
        contextInfo.icon = '📋';
    }

    // Contexto específico por módulo
    if (moduleName?.includes('Sales Cloud')) {
      contextInfo.relevance += ' - Procesos de ventas';
      contextInfo.considerations += ' - Evaluar configuración de procesos comerciales en Chile';
      contextInfo.icon = '💰';
    } else if (moduleName?.includes('Service Cloud')) {
      contextInfo.relevance += ' - Atención al cliente';
      contextInfo.considerations += ' - Evaluar configuración de servicio al cliente en Chile';
      contextInfo.icon = '🎧';
    } else if (moduleName?.includes('Marketing Cloud')) {
      contextInfo.relevance += ' - Campañas de marketing';
      contextInfo.considerations += ' - Evaluar configuración de marketing en Chile';
      contextInfo.icon = '📢';
    } else if (moduleName?.includes('Aspectos Transversales')) {
      contextInfo.relevance += ' - Arquitectura y configuración';
      contextInfo.considerations += ' - Base para evaluación completa de la arquitectura en Chile';
      contextInfo.icon = '🏗️';
    }

    // Contexto específico para preguntas críticas
    if (question.critical) {
      contextInfo.urgency = '🚨 Pregunta Crítica';
      contextInfo.impact = 'Crítico - Requiere atención inmediata en el assessment';
    } else {
      contextInfo.urgency = '📋 Pregunta Estándar';
      contextInfo.impact = 'Importante - Considerar en la evaluación';
    }

    return contextInfo;
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'boolean':
        return (
          <RadioGroup
            value={question.answer === true ? 'Sí' : question.answer === false ? 'No' : question.answer === 'unknown' ? 'No tengo información' : ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'Sí') {
                handleAnswerChange(true);
              } else if (value === 'No') {
                handleAnswerChange(false);
              } else if (value === 'No tengo información') {
                handleAnswerChange('unknown');
              }
            }}
          >
            <FormControlLabel value="Sí" control={<Radio />} label="Sí" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
            <FormControlLabel value="No tengo información" control={<Radio />} label="No tengo información" />
          </RadioGroup>
        );

      case 'scale':
        return (
          <Box>
            <Rating
              value={question.answer || 0}
              onChange={(_, value) => handleAnswerChange(value || 0)}
              max={question.options?.length || 5}
              size="large"
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {question.options?.[(question.answer || 1) - 1] || ''}
            </Typography>
          </Box>
        );

      case 'multiple-choice':
        return (
          <FormControl component="fieldset">
            <RadioGroup
              value={question.answer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
            >
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
              <FormControlLabel
                value="No tengo información"
                control={<Radio />}
                label="No tengo información disponible"
              />
            </RadioGroup>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl component="fieldset">
            {question.options?.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={Array.isArray(question.answer) ? question.answer.includes(option) : false}
                    onChange={(e) => {
                      const currentAnswers = Array.isArray(question.answer) ? question.answer : [];
                      const newAnswers = e.target.checked
                        ? [...currentAnswers, option]
                        : currentAnswers.filter(item => item !== option);
                      handleAnswerChange(newAnswers);
                    }}
                  />
                }
                label={option}
              />
            ))}
            <FormControlLabel
              control={
                <Checkbox
                  checked={question.answer === 'unknown'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleAnswerChange('unknown');
                    } else {
                      handleAnswerChange([]);
                    }
                  }}
                />
              }
              label="No tengo información disponible"
            />
          </FormControl>
        );

      case 'autocomplete':
        return (
          <Box>
            <Autocomplete
              freeSolo
              options={suggestions}
              value={question.answer || ''}
              onChange={(_, value) => handleAnswerChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Escribe o selecciona una respuesta..."
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Box>
                        {params.InputProps.endAdornment}
                        <Tooltip title="Sugerencias inteligentes">
                          <IconButton
                            size="small"
                            onClick={() => setShowSuggestions(!showSuggestions)}
                          >
                            <SuggestionIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ),
                  }}
                />
              )}
            />
            
            <Box sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleAnswerChange('No tengo información disponible')}
                sx={{ mr: 1 }}
              >
                No tengo información
              </Button>
            </Box>
            
            {/* Panel de sugerencias expandible */}
            <Collapse in={showSuggestions}>
              <Card sx={{ mt: 1, bgcolor: 'grey.50' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AutoCompleteIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle2" color="primary">
                      Sugerencias basadas en {moduleName || 'Salesforce'}:
                    </Typography>
                  </Box>
                  <List dense>
                    {suggestions.map((suggestion, index) => (
                      <ListItem
                        key={index}
                        button
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{ borderRadius: 1, mb: 0.5 }}
                      >
                        <ListItemIcon>
                          <SuggestionIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={suggestion}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Collapse>
          </Box>
        );

      case 'text':
        return (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={question.answer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              variant="outlined"
              InputProps={{
                endAdornment: suggestions.length > 0 && (
                  <Tooltip title="Ver sugerencias">
                    <IconButton
                      size="small"
                      onClick={() => setShowSuggestions(!showSuggestions)}
                    >
                      <SuggestionIcon />
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
            
            <Box sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleAnswerChange('No tengo información disponible')}
                sx={{ mr: 1 }}
              >
                No tengo información
              </Button>
            </Box>
            
            {/* Panel de sugerencias para texto */}
            <Collapse in={showSuggestions}>
              <Card sx={{ mt: 1, bgcolor: 'grey.50' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AutoCompleteIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle2" color="primary">
                      Sugerencias inteligentes:
                    </Typography>
                  </Box>
                  <List dense>
                    {suggestions.slice(0, 5).map((suggestion, index) => (
                      <ListItem
                        key={index}
                        button
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{ borderRadius: 1, mb: 0.5 }}
                      >
                        <ListItemIcon>
                          <SuggestionIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={suggestion}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Collapse>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Card sx={{ mb: 2, border: question.critical ? '2px solid #f44336' : '1px solid #e0e0e0' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {question.question}
          </Typography>
          {question.critical && (
            <Chip
              icon={<CriticalIcon />}
              label="Crítico"
              color="error"
              size="small"
            />
          )}
        </Box>

        {/* Contexto de la pregunta */}
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid #e0e0e0' }}>
          {(() => {
            const context = getQuestionContext();
            return (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mr: 1 }}>
                    {context.icon} Contexto para Chile
                  </Typography>
                  <Chip 
                    label={context.urgency} 
                    size="small" 
                    color={question.critical ? 'error' : 'default'}
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Módulo:</strong> {context.module} • <strong>Sección:</strong> {context.section}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Relevancia:</strong> {context.relevance}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Consideraciones:</strong> {context.considerations}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Impacto:</strong> {context.impact}
                </Typography>
              </>
            );
          })()}
        </Box>

        {question.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {question.description}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          {renderQuestionInput()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Puntuación: {question.score || 0} / {question.maxScore}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Categoría: {question.category}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuestionCard; 