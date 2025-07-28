import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,

  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  FileDownload,
  Save,
  Storage,
  Security,
  Search,
  AccountTree,
  Layers,
  Code,
  Timeline,
  Visibility,
  Edit,
  Delete,
  Add
} from '@mui/icons-material';

import { generateChileDiscoveryReport } from '../utils/excelGenerator';

interface ModelData {
  id: string;
  name: string;
  type: 'object' | 'field' | 'validation' | 'automation' | 'integration';
  status: 'discovered' | 'analyzed' | 'mapped' | 'implemented';
  description: string;
  source: string;
  target?: string;
  complexity: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
  dependencies: string[];
  estimatedEffort: number;
  actualEffort?: number;
}

interface DiscoverySession {
  id: string;
  name: string;
  date: string;
  models: ModelData[];
  summary: {
    total: number;
    discovered: number;
    analyzed: number;
    mapped: number;
    implemented: number;
  };
}

const ChileModelDiscovery: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<DiscoverySession | null>(null);
  const [models, setModels] = useState<ModelData[]>([]);
  const [filteredModels, setFilteredModels] = useState<ModelData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockModels: ModelData[] = [
      {
        id: '1',
        name: 'Account',
        type: 'object',
        status: 'discovered',
        description: 'Objeto estándar de Cuentas con campos personalizados',
        source: 'Chile Org',
        complexity: 'medium',
        priority: 'high',
        notes: 'Incluye campos personalizados para segmentación de clientes',
        dependencies: ['Contact', 'Opportunity'],
        estimatedEffort: 8
      },
      {
        id: '2',
        name: 'Contact',
        type: 'object',
        status: 'analyzed',
        description: 'Objeto de Contactos con validaciones personalizadas',
        source: 'Chile Org',
        target: 'Peru Org',
        complexity: 'low',
        priority: 'high',
        notes: 'Validaciones de email y teléfono requeridas',
        dependencies: ['Account'],
        estimatedEffort: 4
      },
      {
        id: '3',
        name: 'Opportunity',
        type: 'object',
        status: 'mapped',
        description: 'Oportunidades con flujos de aprobación complejos',
        source: 'Chile Org',
        target: 'Peru Org',
        complexity: 'high',
        priority: 'critical',
        notes: 'Flujos de aprobación por monto y tipo de producto',
        dependencies: ['Account', 'Product'],
        estimatedEffort: 16
      },
      {
        id: '4',
        name: 'Email Validation',
        type: 'validation',
        status: 'implemented',
        description: 'Validación de formato de email en Contactos',
        source: 'Chile Org',
        target: 'Peru Org',
        complexity: 'low',
        priority: 'medium',
        notes: 'Implementado con fórmula de validación',
        dependencies: ['Contact'],
        estimatedEffort: 2,
        actualEffort: 1
      },
      {
        id: '5',
        name: 'Lead Conversion',
        type: 'automation',
        status: 'analyzed',
        description: 'Flujo de conversión de Leads a Cuentas/Oportunidades',
        source: 'Chile Org',
        target: 'Peru Org',
        complexity: 'medium',
        priority: 'high',
        notes: 'Incluye asignación automática de propietario',
        dependencies: ['Lead', 'Account', 'Contact', 'Opportunity'],
        estimatedEffort: 12
      }
    ];

    setModels(mockModels);
    setFilteredModels(mockModels);

    const mockSession: DiscoverySession = {
      id: 'session-1',
      name: 'Chile Model Discovery - Session 1',
      date: new Date().toISOString(),
      models: mockModels,
      summary: {
        total: mockModels.length,
        discovered: mockModels.filter(m => m.status === 'discovered').length,
        analyzed: mockModels.filter(m => m.status === 'analyzed').length,
        mapped: mockModels.filter(m => m.status === 'mapped').length,
        implemented: mockModels.filter(m => m.status === 'implemented').length
      }
    };

    setCurrentSession(mockSession);
  }, []);

  useEffect(() => {
    let filtered = models;

    if (searchTerm) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(model => model.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(model => model.type === typeFilter);
    }

    setFilteredModels(filtered);
  }, [models, searchTerm, statusFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'discovered': return 'default';
      case 'analyzed': return 'info';
      case 'mapped': return 'warning';
      case 'implemented': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

                const getTypeIcon = (type: string) => {
                switch (type) {
                  case 'object': return <Storage />;
                  case 'field': return <Layers />;
                  case 'validation': return <Security />;
                  case 'automation': return <Timeline />;
                  case 'integration': return <AccountTree />;
                  default: return <Code />;
                }
              };

  const handleExportExcel = async () => {
    if (!currentSession) return;
    
    setLoading(true);
    try {
      generateChileDiscoveryReport(currentSession, 'Chile Model Discovery Report');
    } catch (error) {
      console.error('Error exporting Excel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSession = () => {
    // Save session to localStorage or backend
    localStorage.setItem('chileModelDiscoverySession', JSON.stringify(currentSession));
  };

  const handleEditModel = (model: ModelData) => {
    setSelectedModel(model);
  };

  const handleAddModel = () => {
    // TODO: Implement add model functionality
    console.log('Add model functionality to be implemented');
  };

  const getStatusStats = () => {
    if (!currentSession) return null;

    const stats = [
      { label: 'Total', value: currentSession.summary.total, color: 'primary' },
      { label: 'Descubiertos', value: currentSession.summary.discovered, color: 'info' },
      { label: 'Analizados', value: currentSession.summary.analyzed, color: 'warning' },
      { label: 'Mapeados', value: currentSession.summary.mapped, color: 'secondary' },
      { label: 'Implementados', value: currentSession.summary.implemented, color: 'success' }
    ];

    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={2.4} key={stat.label}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color={stat.color as any}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Chile Model Discovery Tool
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Herramienta para descubrir y mapear modelos de Salesforce de Chile a Perú
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddModel}
              sx={{ mr: 1 }}
            >
              Agregar Modelo
            </Button>
            <Button
              variant="outlined"
              startIcon={<Save />}
              onClick={handleSaveSession}
              sx={{ mr: 1 }}
            >
              Guardar
            </Button>
                                    <Button
                          variant="contained"
                          startIcon={loading ? <CircularProgress size={20} /> : <FileDownload />}
                          onClick={handleExportExcel}
                          disabled={loading}
                        >
                          Exportar Excel
                        </Button>
          </Box>
        </Box>

        {getStatusStats()}

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar modelos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Filtrar por estado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="discovered">Descubierto</option>
              <option value="analyzed">Analizado</option>
              <option value="mapped">Mapeado</option>
              <option value="implemented">Implementado</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Filtrar por tipo"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              <option value="object">Objeto</option>
              <option value="field">Campo</option>
              <option value="validation">Validación</option>
              <option value="automation">Automatización</option>
              <option value="integration">Integración</option>
            </TextField>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {filteredModels.map((model) => (
            <Grid item xs={12} md={6} lg={4} key={model.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getTypeIcon(model.type)}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {model.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip
                        label={model.status}
                        color={getStatusColor(model.status) as any}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={model.priority}
                        color={getPriorityColor(model.priority) as any}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {model.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Fuente: {model.source}
                    </Typography>
                    {model.target && (
                      <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                        Destino: {model.target}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                      Complejidad: {model.complexity}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Esfuerzo: {model.estimatedEffort}h
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Tooltip title="Ver detalles">
                      <IconButton size="small" onClick={() => setSelectedModel(model)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleEditModel(model)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredModels.length === 0 && (
          <Alert severity="info" sx={{ mt: 3 }}>
            No se encontraron modelos que coincidan con los filtros aplicados.
          </Alert>
        )}
      </Paper>

      {/* Model Detail Dialog */}
      <Dialog
        open={!!selectedModel}
        onClose={() => setSelectedModel(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedModel && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getTypeIcon(selectedModel.type)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedModel.name}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Información General
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Tipo"
                        secondary={selectedModel.type}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Estado"
                        secondary={selectedModel.status}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Complejidad"
                        secondary={selectedModel.complexity}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Prioridad"
                        secondary={selectedModel.priority}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Esfuerzo y Dependencias
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Esfuerzo Estimado"
                        secondary={`${selectedModel.estimatedEffort} horas`}
                      />
                    </ListItem>
                    {selectedModel.actualEffort && (
                      <ListItem>
                        <ListItemText
                          primary="Esfuerzo Real"
                          secondary={`${selectedModel.actualEffort} horas`}
                        />
                      </ListItem>
                    )}
                    <ListItem>
                      <ListItemText
                        primary="Dependencias"
                        secondary={selectedModel.dependencies.join(', ')}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Descripción
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedModel.description}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Notas
                  </Typography>
                  <Typography variant="body2">
                    {selectedModel.notes}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedModel(null)}>
                Cerrar
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleEditModel(selectedModel);
                  setSelectedModel(null);
                }}
              >
                Editar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ChileModelDiscovery; 