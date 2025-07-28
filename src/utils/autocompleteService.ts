// Servicio de autocompletado inteligente para assessments de Salesforce

export interface AutocompleteSuggestion {
  text: string;
  category: string;
  confidence: number;
  tags: string[];
}

export interface AutocompleteContext {
  moduleName: string;
  sectionName: string;
  questionText: string;
  questionType: string;
  previousAnswers?: Record<string, any>;
}

// Base de conocimiento expandida para autocompletado
const KNOWLEDGE_BASE = {
  // Configuraciones específicas de Sales Cloud
  'sales-cloud': {
    'lead-management': {
      'lead-scoring': [
        { text: 'Lead scoring implementado con criterios personalizados', category: 'implementation', confidence: 0.9, tags: ['lead-scoring', 'automation'] },
        { text: 'Puntuación basada en comportamiento del lead', category: 'implementation', confidence: 0.8, tags: ['lead-scoring', 'behavior'] },
        { text: 'Integración con Marketing Cloud para scoring', category: 'integration', confidence: 0.7, tags: ['marketing-cloud', 'integration'] }
      ],
      'lead-sources': [
        { text: 'Fuentes de leads configuradas: Web, Email, Eventos', category: 'configuration', confidence: 0.9, tags: ['lead-sources', 'tracking'] },
        { text: 'Tracking de ROI por fuente de lead', category: 'analytics', confidence: 0.8, tags: ['roi', 'analytics'] }
      ],
      'lead-qualification': [
        { text: 'Proceso de calificación automática implementado', category: 'automation', confidence: 0.9, tags: ['qualification', 'automation'] },
        { text: 'Criterios de calificación personalizados por industria', category: 'customization', confidence: 0.8, tags: ['qualification', 'customization'] }
      ]
    },
    'opportunity-management': {
      'pipeline-stages': [
        { text: 'Etapas de pipeline personalizadas para el sector energético', category: 'customization', confidence: 0.9, tags: ['pipeline', 'energy-sector'] },
        { text: 'Flujos de aprobación por monto y tipo de producto', category: 'approval', confidence: 0.9, tags: ['approval', 'workflow'] },
        { text: 'Forecasting habilitado con modelos predictivos', category: 'analytics', confidence: 0.8, tags: ['forecasting', 'predictive'] }
      ],
      'products-pricing': [
        { text: 'Catálogo de productos configurado con precios dinámicos', category: 'configuration', confidence: 0.9, tags: ['products', 'pricing'] },
        { text: 'CPQ implementado para cotizaciones complejas', category: 'implementation', confidence: 0.9, tags: ['cpq', 'quotes'] }
      ]
    }
  },
  
  // Configuraciones específicas de Service Cloud
  'service-cloud': {
    'case-management': {
      'case-types': [
        { text: 'Tipos de caso configurados: Técnico, Comercial, Facturación', category: 'configuration', confidence: 0.9, tags: ['case-types', 'categorization'] },
        { text: 'SLAs por tipo de caso y prioridad', category: 'sla', confidence: 0.9, tags: ['sla', 'priority'] },
        { text: 'Escalamiento automático para casos críticos', category: 'automation', confidence: 0.8, tags: ['escalation', 'automation'] }
      ],
      'queues': [
        { text: 'Colas de trabajo automatizadas por especialidad', category: 'automation', confidence: 0.9, tags: ['queues', 'automation'] },
        { text: 'Asignación automática basada en skills', category: 'automation', confidence: 0.8, tags: ['assignment', 'skills'] }
      ]
    },
    'knowledge-base': {
      'content-management': [
        { text: 'Base de conocimiento con artículos categorizados', category: 'content', confidence: 0.9, tags: ['knowledge', 'categorization'] },
        { text: 'Búsqueda avanzada con filtros inteligentes', category: 'search', confidence: 0.8, tags: ['search', 'filters'] },
        { text: 'Contenido multilingüe para atención internacional', category: 'localization', confidence: 0.7, tags: ['multilingual', 'localization'] }
      ]
    }
  },
  
  // Configuraciones específicas de Marketing Cloud
  'marketing-cloud': {
    'email-studio': {
      'campaigns': [
        { text: 'Campañas de email configuradas con segmentación avanzada', category: 'campaigns', confidence: 0.9, tags: ['email', 'segmentation'] },
        { text: 'Templates personalizados con branding corporativo', category: 'templates', confidence: 0.8, tags: ['templates', 'branding'] },
        { text: 'A/B testing implementado para optimización', category: 'testing', confidence: 0.8, tags: ['ab-testing', 'optimization'] }
      ]
    },
    'journey-builder': {
      'automation': [
        { text: 'Journeys de onboarding activos para nuevos clientes', category: 'automation', confidence: 0.9, tags: ['onboarding', 'automation'] },
        { text: 'Automatización de nurturing por etapa del funnel', category: 'automation', confidence: 0.9, tags: ['nurturing', 'funnel'] },
        { text: 'Triggers de comportamiento para personalización', category: 'personalization', confidence: 0.8, tags: ['triggers', 'personalization'] }
      ]
    }
  },
  
  // Integraciones específicas
  'integrations': {
    'external-systems': {
      'erp-integration': [
        { text: 'SAP ERP integrado con sincronización bidireccional', category: 'integration', confidence: 0.9, tags: ['sap', 'erp', 'sync'] },
        { text: 'Sistema de facturación conectado en tiempo real', category: 'integration', confidence: 0.9, tags: ['billing', 'real-time'] },
        { text: 'CRM legacy migrado con mapeo de datos', category: 'migration', confidence: 0.8, tags: ['migration', 'data-mapping'] }
      ],
      'apis': [
        { text: 'APIs externas configuradas con autenticación OAuth', category: 'security', confidence: 0.9, tags: ['apis', 'oauth', 'security'] },
        { text: 'Webhooks implementados para eventos críticos', category: 'automation', confidence: 0.8, tags: ['webhooks', 'events'] }
      ]
    }
  },
  
  // Respuestas genéricas inteligentes
  'generic': {
    'implementation-status': [
      { text: 'Completamente implementado y en producción', category: 'status', confidence: 0.9, tags: ['implemented', 'production'] },
      { text: 'Parcialmente implementado, requiere configuración adicional', category: 'status', confidence: 0.8, tags: ['partial', 'configuration'] },
      { text: 'En desarrollo, estimado de finalización en 2 semanas', category: 'status', confidence: 0.7, tags: ['development', 'timeline'] },
      { text: 'No implementado, requiere análisis de requerimientos', category: 'status', confidence: 0.6, tags: ['not-implemented', 'analysis'] }
    ],
    'complexity-assessment': [
      { text: 'Baja complejidad: configuración estándar de Salesforce', category: 'complexity', confidence: 0.9, tags: ['low', 'standard'] },
      { text: 'Complejidad media: requiere personalización moderada', category: 'complexity', confidence: 0.8, tags: ['medium', 'customization'] },
      { text: 'Alta complejidad: desarrollo personalizado requerido', category: 'complexity', confidence: 0.7, tags: ['high', 'development'] },
      { text: 'Muy alta complejidad: integración con sistemas legacy', category: 'complexity', confidence: 0.6, tags: ['very-high', 'legacy'] }
    ],
    'priority-level': [
      { text: 'Crítica: impacto directo en operaciones del negocio', category: 'priority', confidence: 0.9, tags: ['critical', 'business-impact'] },
      { text: 'Alta: afecta procesos importantes pero no críticos', category: 'priority', confidence: 0.8, tags: ['high', 'important'] },
      { text: 'Media: mejora de eficiencia y experiencia de usuario', category: 'priority', confidence: 0.7, tags: ['medium', 'efficiency'] },
      { text: 'Baja: optimización y mejoras menores', category: 'priority', confidence: 0.6, tags: ['low', 'optimization'] }
    ]
  }
};

// Función principal para generar sugerencias inteligentes
export function generateSuggestions(context: AutocompleteContext): AutocompleteSuggestion[] {
  const suggestions: AutocompleteSuggestion[] = [];
  
  // Normalizar nombres de módulo y sección
  const moduleKey = context.moduleName.toLowerCase().replace(/\s+/g, '-');
  const sectionKey = context.sectionName.toLowerCase().replace(/\s+/g, '-');
  const questionText = context.questionText.toLowerCase();
  
  // Buscar sugerencias específicas del módulo y sección
  const moduleKnowledge = KNOWLEDGE_BASE[moduleKey as keyof typeof KNOWLEDGE_BASE];
  if (moduleKnowledge && moduleKnowledge[sectionKey as keyof typeof moduleKnowledge]) {
    const sectionSuggestions = moduleKnowledge[sectionKey as keyof typeof moduleKnowledge];
    
    // Buscar sugerencias que coincidan con palabras clave de la pregunta
    Object.keys(sectionSuggestions).forEach(key => {
      if (questionText.includes(key.replace('-', ' '))) {
        const keySuggestions = (sectionSuggestions as any)[key];
        if (Array.isArray(keySuggestions)) {
          suggestions.push(...keySuggestions);
        }
      }
    });
    
    // Si no hay coincidencias específicas, tomar todas las sugerencias de la sección
    if (suggestions.length === 0) {
      Object.values(sectionSuggestions).forEach(sectionSuggestionArray => {
        if (Array.isArray(sectionSuggestionArray)) {
          suggestions.push(...sectionSuggestionArray);
        }
      });
    }
  }
  
  // Agregar sugerencias genéricas basadas en palabras clave
  if (questionText.includes('implementado') || questionText.includes('configurado')) {
    suggestions.push(...KNOWLEDGE_BASE.generic['implementation-status']);
  }
  
  if (questionText.includes('complejidad') || questionText.includes('complejo')) {
    suggestions.push(...KNOWLEDGE_BASE.generic['complexity-assessment']);
  }
  
  if (questionText.includes('prioridad') || questionText.includes('importante')) {
    suggestions.push(...KNOWLEDGE_BASE.generic['priority-level']);
  }
  
  // Filtrar duplicados y ordenar por confianza
  const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
    index === self.findIndex(s => s.text === suggestion.text)
  );
  
  return uniqueSuggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 8); // Limitar a 8 sugerencias
}

// Función para generar sugerencias basadas en respuestas anteriores
export function generateContextualSuggestions(
  context: AutocompleteContext,
  previousAnswers: Record<string, any>
): AutocompleteSuggestion[] {
  const suggestions: AutocompleteSuggestion[] = [];
  
  // Analizar respuestas anteriores para generar sugerencias contextuales
  const answeredQuestions = Object.keys(previousAnswers);
  
  // Si hay respuestas sobre implementaciones, sugerir configuraciones relacionadas
  const implementationAnswers = answeredQuestions.filter(q => 
    previousAnswers[q] && 
    typeof previousAnswers[q] === 'string' && 
    previousAnswers[q].toLowerCase().includes('implementado')
  );
  
  if (implementationAnswers.length > 0) {
    suggestions.push({
      text: 'Configuración avanzada requerida para optimización',
      category: 'optimization',
      confidence: 0.8,
      tags: ['advanced', 'optimization']
    });
  }
  
  // Si hay respuestas sobre integraciones, sugerir configuraciones de seguridad
  const integrationAnswers = answeredQuestions.filter(q => 
    previousAnswers[q] && 
    typeof previousAnswers[q] === 'string' && 
    previousAnswers[q].toLowerCase().includes('integrado')
  );
  
  if (integrationAnswers.length > 0) {
    suggestions.push({
      text: 'Configuración de seguridad y autenticación requerida',
      category: 'security',
      confidence: 0.9,
      tags: ['security', 'authentication']
    });
  }
  
  return suggestions;
}

// Función para obtener sugerencias rápidas (one-liners)
export function getQuickSuggestions(context: AutocompleteContext): string[] {
  const questionText = context.questionText.toLowerCase();
  
  if (questionText.includes('implementado')) {
    return [
      'Completamente implementado',
      'Parcialmente implementado',
      'En desarrollo',
      'No implementado'
    ];
  }
  
  if (questionText.includes('complejidad')) {
    return [
      'Baja complejidad',
      'Complejidad media',
      'Alta complejidad',
      'Muy alta complejidad'
    ];
  }
  
  if (questionText.includes('prioridad')) {
    return [
      'Crítica',
      'Alta',
      'Media',
      'Baja'
    ];
  }
  
  return [];
} 