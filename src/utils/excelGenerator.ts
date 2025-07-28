import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AssessmentData, Recommendation, CriticalPoint } from '../types';

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

export const generateExcelReport = (assessment: AssessmentData) => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['Salesforce Assessment Report', '', '', '', ''],
    ['', '', '', '', ''],
    ['Cliente:', assessment.clientName, '', '', ''],
    ['Assessor:', assessment.assessor, '', '', ''],
    ['Fecha:', new Date(assessment.assessmentDate).toLocaleDateString(), '', '', ''],
    ['', '', '', '', ''],
    ['Resumen General', '', '', '', ''],
    ['Score Total:', assessment.overallScore, '', '', ''],
    ['Porcentaje:', `${((assessment.overallScore / assessment.modules.reduce((total, m) => total + m.maxScore, 0)) * 100).toFixed(2)}%`, '', '', ''],
    ['', '', '', '', ''],
  ];

  // Add module scores
  summaryData.push(['Módulos', 'Score', 'Max Score', 'Porcentaje', 'Estado']);
  assessment.modules.forEach(module => {
    const percentage = ((module.score / module.maxScore) * 100).toFixed(2);
    summaryData.push([
      module.name,
      module.score,
      module.maxScore,
      `${percentage}%`,
      module.status
    ]);
  });

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen');

  // Detailed results sheet
  const detailedData = [
    ['Resultados Detallados', '', '', '', '', ''],
    ['', '', '', '', '', ''],
  ];

  assessment.modules.forEach(module => {
    detailedData.push([`Módulo: ${module.name}`, '', '', '', '', '']);
    detailedData.push(['Sección', 'Pregunta', 'Respuesta', 'Score', 'Max Score', 'Crítico']);
    
    module.sections.forEach(section => {
      section.questions.forEach(question => {
        let answerText = 'No respondida';
        let scoreText = String(question.score || 0);
        
        if (question.answer !== undefined && question.answer !== null) {
          if (question.answer === 'unknown' || question.answer === 'No tengo información' || question.answer === 'No tengo información disponible') {
            answerText = 'No tengo información disponible';
            scoreText = 'N/A';
          } else if (Array.isArray(question.answer)) {
            if (question.answer.length === 0) {
              answerText = 'No seleccionado';
            } else {
              answerText = question.answer.join(', ');
            }
          } else if (typeof question.answer === 'boolean') {
            answerText = question.answer ? 'Sí' : 'No';
          } else {
            answerText = String(question.answer);
          }
        }
        
        detailedData.push([
          section.name,
          question.question,
          answerText,
          scoreText,
          String(question.maxScore),
          question.critical ? 'Sí' : 'No'
        ]);
      });
    });
    detailedData.push(['', '', '', '', '', '']);
  });

  const detailedSheet = XLSX.utils.aoa_to_sheet(detailedData);
  XLSX.utils.book_append_sheet(wb, detailedSheet, 'Resultados Detallados');

  // Missing information summary sheet
  const missingInfoData = [
    ['Preguntas Sin Información Disponible', '', '', ''],
    ['', '', '', ''],
    ['Módulo', 'Sección', 'Pregunta', 'Tipo'],
  ];

  let missingInfoCount = 0;
  assessment.modules.forEach(module => {
    module.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.answer === 'unknown' || question.answer === 'No tengo información' || question.answer === 'No tengo información disponible') {
          missingInfoData.push([
            module.name,
            section.name,
            question.question,
            question.type
          ]);
          missingInfoCount++;
        }
      });
    });
  });

  if (missingInfoCount > 0) {
    missingInfoData.splice(2, 0, ['', '', '', '']);
    missingInfoData.splice(3, 0, [`Total de preguntas sin información: ${missingInfoCount}`, '', '', '']);
    missingInfoData.splice(4, 0, ['', '', '', '']);
    
    const missingInfoSheet = XLSX.utils.aoa_to_sheet(missingInfoData);
    XLSX.utils.book_append_sheet(wb, missingInfoSheet, 'Información Faltante');
  }

  // Recommendations sheet
  if (assessment.recommendations.length > 0) {
    const recommendationsData = [
      ['Recomendaciones', '', '', '', ''],
      ['', '', '', '', ''],
      ['Título', 'Descripción', 'Prioridad', 'Módulo', 'Esfuerzo Estimado'],
    ];

    assessment.recommendations.forEach(rec => {
      recommendationsData.push([
        rec.title,
        rec.description,
        rec.priority,
        rec.module,
        rec.estimatedEffort
      ]);
    });

    const recommendationsSheet = XLSX.utils.aoa_to_sheet(recommendationsData);
    XLSX.utils.book_append_sheet(wb, recommendationsSheet, 'Recomendaciones');
  }

  // Critical points sheet
  if (assessment.criticalPoints.length > 0) {
    const criticalData = [
      ['Puntos Críticos', '', '', ''],
      ['', '', '', ''],
      ['Título', 'Descripción', 'Severidad', 'Impacto'],
    ];

    assessment.criticalPoints.forEach(point => {
      criticalData.push([
        point.title,
        point.description,
        point.severity,
        point.impact
      ]);
    });

    const criticalSheet = XLSX.utils.aoa_to_sheet(criticalData);
    XLSX.utils.book_append_sheet(wb, criticalSheet, 'Puntos Críticos');
  }

  // Generate recommendations based on assessment results
  const recommendations = generateRecommendations(assessment);
  const criticalPoints = generateCriticalPoints(assessment);

  // Add generated recommendations
  if (recommendations.length > 0) {
    const generatedRecData = [
      ['Recomendaciones Generadas', '', '', '', ''],
      ['', '', '', '', ''],
      ['Título', 'Descripción', 'Prioridad', 'Módulo', 'Esfuerzo Estimado'],
    ];

    recommendations.forEach(rec => {
      generatedRecData.push([
        rec.title,
        rec.description,
        rec.priority,
        rec.module,
        rec.estimatedEffort
      ]);
    });

    const generatedRecSheet = XLSX.utils.aoa_to_sheet(generatedRecData);
    XLSX.utils.book_append_sheet(wb, generatedRecSheet, 'Recomendaciones Generadas');
  }

  // Add generated critical points
  if (criticalPoints.length > 0) {
    const generatedCriticalData = [
      ['Puntos Críticos Generados', '', '', ''],
      ['', '', '', ''],
      ['Título', 'Descripción', 'Severidad', 'Impacto'],
    ];

    criticalPoints.forEach(point => {
      generatedCriticalData.push([
        point.title,
        point.description,
        point.severity,
        point.impact
      ]);
    });

    const generatedCriticalSheet = XLSX.utils.aoa_to_sheet(generatedCriticalData);
    XLSX.utils.book_append_sheet(wb, generatedCriticalSheet, 'Puntos Críticos Generados');
  }

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const fileName = `Salesforce_Assessment_${assessment.clientName}_${new Date().toISOString().split('T')[0]}.xlsx`;
  saveAs(data, fileName);
};

const generateRecommendations = (assessment: AssessmentData): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  assessment.modules.forEach(module => {
    const percentage = (module.score / module.maxScore) * 100;

    // Arquitectura Actual
    if (module.id === 'current-architecture') {
      if (percentage < 60) {
        recommendations.push({
          id: `rec-${module.id}-1`,
          title: 'Implementar monitoreo de Governor Limits',
          description: 'Establecer framework de monitoreo para CPU time, heap size, SOQL queries y DML operations para prevenir errores en producción.',
          priority: 'critical',
          module: module.name,
          estimatedEffort: '2-3 semanas',
          businessImpact: 'Alto',
          technicalComplexity: 'Media',
          implementation: [
            'Implementar logging de governor limits',
            'Configurar alertas automáticas',
            'Crear dashboard de monitoreo',
            'Documentar límites por org'
          ]
        });
      }

      if (percentage < 40) {
        recommendations.push({
          id: `rec-${module.id}-2`,
          title: 'Rediseñar arquitectura de datos',
          description: 'Revisar y optimizar el modelo de datos siguiendo las mejores prácticas de Salesforce para escalabilidad.',
          priority: 'high',
          module: module.name,
          estimatedEffort: '4-6 semanas',
          businessImpact: 'Alto',
          technicalComplexity: 'Alta',
          implementation: [
            'Auditoría completa del modelo de datos',
            'Optimizar relaciones y campos calculados',
            'Implementar roll-up summaries',
            'Configurar Big Objects para datos históricos'
          ]
        });
      }
    }

    // Arquitectura de Seguridad
    if (module.id === 'security-architecture') {
      if (percentage < 70) {
        recommendations.push({
          id: `rec-${module.id}-1`,
          title: 'Implementar cifrado de datos sensibles',
          description: 'Configurar field-level encryption y platform encryption para datos sensibles según regulaciones peruanas.',
          priority: 'high',
          module: module.name,
          estimatedEffort: '3-4 semanas',
          businessImpact: 'Alto',
          technicalComplexity: 'Media',
          implementation: [
            'Identificar campos sensibles',
            'Configurar field-level encryption',
            'Implementar platform encryption',
            'Validar cumplimiento LGPD'
          ]
        });
      }

      if (percentage < 50) {
        recommendations.push({
          id: `rec-${module.id}-2`,
          title: 'Rediseñar modelo de seguridad',
          description: 'Reestructurar perfiles, roles y sharing rules para optimizar rendimiento y seguridad.',
          priority: 'critical',
          module: module.name,
          estimatedEffort: '6-8 semanas',
          businessImpact: 'Crítico',
          technicalComplexity: 'Alta',
          implementation: [
            'Auditoría completa de seguridad',
            'Rediseñar role hierarchy',
            'Optimizar sharing rules',
            'Implementar permission sets'
          ]
        });
      }
    }

    // Arquitectura de Integración
    if (module.id === 'integration-architecture') {
      if (percentage < 60) {
        recommendations.push({
          id: `rec-${module.id}-1`,
          title: 'Implementar integración con SUNAT',
          description: 'Desarrollar integración con sistemas de SUNAT para e-invoicing y reportes fiscales.',
          priority: 'critical',
          module: module.name,
          estimatedEffort: '8-12 semanas',
          businessImpact: 'Crítico',
          technicalComplexity: 'Alta',
          implementation: [
            'Análisis de requerimientos SUNAT',
            'Desarrollo de APIs de integración',
            'Implementación de e-invoicing',
            'Testing con ambiente de SUNAT'
          ]
        });
      }

      if (percentage < 40) {
        recommendations.push({
          id: `rec-${module.id}-2`,
          title: 'Establecer estrategia de middleware',
          description: 'Implementar solución de middleware robusta para manejar integraciones complejas.',
          priority: 'high',
          module: module.name,
          estimatedEffort: '6-10 semanas',
          businessImpact: 'Alto',
          technicalComplexity: 'Alta',
          implementation: [
            'Evaluar opciones de middleware',
            'Diseñar arquitectura de integración',
            'Implementar MuleSoft o similar',
            'Configurar error handling'
          ]
        });
      }
    }

    // Arquitectura de Rendimiento
    if (module.id === 'performance-architecture') {
      if (percentage < 60) {
        recommendations.push({
          id: `rec-${module.id}-1`,
          title: 'Optimizar consultas SOQL',
          description: 'Revisar y optimizar todas las consultas SOQL para mejorar rendimiento y evitar governor limits.',
          priority: 'high',
          module: module.name,
          estimatedEffort: '3-4 semanas',
          businessImpact: 'Alto',
          technicalComplexity: 'Media',
          implementation: [
            'Auditoría de todas las consultas SOQL',
            'Optimizar índices y selectividad',
            'Implementar bulk queries',
            'Configurar query monitoring'
          ]
        });
      }

      if (percentage < 40) {
        recommendations.push({
          id: `rec-${module.id}-2`,
          title: 'Implementar estrategia multi-org',
          description: 'Diseñar e implementar arquitectura multi-org para separar operaciones por país.',
          priority: 'critical',
          module: module.name,
          estimatedEffort: '12-16 semanas',
          businessImpact: 'Crítico',
          technicalComplexity: 'Alta',
          implementation: [
            'Diseñar arquitectura multi-org',
            'Configurar org separation',
            'Implementar data sharing',
            'Configurar user management'
          ]
        });
      }
    }

    // Configuración Regional
    if (module.id === 'regional-configuration') {
      if (percentage < 70) {
        recommendations.push({
          id: `rec-${module.id}-1`,
          title: 'Configurar sistema de impuestos peruano',
          description: 'Implementar configuración completa de impuestos para Perú incluyendo IGV y códigos fiscales.',
          priority: 'high',
          module: module.name,
          estimatedEffort: '2-3 semanas',
          businessImpact: 'Alto',
          technicalComplexity: 'Media',
          implementation: [
            'Configurar tax codes peruanos',
            'Implementar cálculo de IGV',
            'Configurar reportes fiscales',
            'Validar con contadores locales'
          ]
        });
      }

      if (percentage < 50) {
        recommendations.push({
          id: `rec-${module.id}-2`,
          title: 'Implementar residencia de datos',
          description: 'Configurar almacenamiento local de datos para cumplir con regulaciones peruanas.',
          priority: 'critical',
          module: module.name,
          estimatedEffort: '4-6 semanas',
          businessImpact: 'Crítico',
          technicalComplexity: 'Alta',
          implementation: [
            'Evaluar requerimientos de residencia',
            'Configurar data storage local',
            'Implementar data classification',
            'Validar cumplimiento legal'
          ]
        });
      }
    }

    // Análisis de Funcionalidades
    if (module.id === 'functionality-analysis') {
      if (percentage < 60) {
        recommendations.push({
          id: `rec-${module.id}-1`,
          title: 'Crear plan de migración de funcionalidades',
          description: 'Desarrollar estrategia detallada para migrar funcionalidades críticas a Perú.',
          priority: 'critical',
          module: module.name,
          estimatedEffort: '8-12 semanas',
          businessImpact: 'Crítico',
          technicalComplexity: 'Alta',
          implementation: [
            'Identificar funcionalidades críticas',
            'Evaluar dependencias y riesgos',
            'Crear roadmap de migración',
            'Definir criterios de éxito'
          ]
        });
      }

      if (percentage < 40) {
        recommendations.push({
          id: `rec-${module.id}-2`,
          title: 'Rediseñar funcionalidades no migrables',
          description: 'Rediseñar funcionalidades que no pueden migrarse directamente a Perú.',
          priority: 'high',
          module: module.name,
          estimatedEffort: '12-16 semanas',
          businessImpact: 'Alto',
          technicalComplexity: 'Alta',
          implementation: [
            'Identificar funcionalidades no migrables',
            'Diseñar alternativas compatibles',
            'Desarrollar nuevas funcionalidades',
            'Testing exhaustivo'
          ]
        });
      }
    }

    // Recomendaciones generales para scores bajos
    if (percentage < 30) {
      recommendations.push({
        id: `rec-${module.id}-3`,
        title: `Reconfiguración crítica de ${module.name}`,
        description: `El módulo ${module.name} requiere reconfiguración urgente debido al bajo score (${percentage.toFixed(1)}%).`,
        priority: 'critical',
        module: module.name,
        estimatedEffort: '4-6 semanas',
        businessImpact: 'Crítico',
        technicalComplexity: 'Alta',
        implementation: [
          'Análisis completo del módulo',
          'Identificación de gaps críticos',
          'Rediseño de arquitectura',
          'Implementación y validación'
        ]
      });
    }
  });

  return recommendations;
};

const generateCriticalPoints = (assessment: AssessmentData): CriticalPoint[] => {
  const criticalPoints: CriticalPoint[] = [];

  assessment.modules.forEach(module => {
    const percentage = (module.score / module.maxScore) * 100;

    // Puntos críticos específicos por módulo
    if (module.id === 'current-architecture' && percentage < 50) {
      criticalPoints.push({
        id: `critical-${module.id}-1`,
        title: 'Governor Limits no monitoreados',
        description: 'Falta monitoreo de governor limits que puede causar errores en producción durante el roll out.',
        severity: 'critical',
        impact: 'Alto',
        module: module.name,
        risk: 'Errores en producción, interrupciones del servicio',
        mitigation: 'Implementar framework de monitoreo inmediatamente'
      });
    }

    if (module.id === 'security-architecture' && percentage < 60) {
      criticalPoints.push({
        id: `critical-${module.id}-1`,
        title: 'Cumplimiento GDPR/LGPD en riesgo',
        description: 'Falta implementación de controles de privacidad requeridos para operaciones en Perú.',
        severity: 'critical',
        impact: 'Alto',
        module: module.name,
        risk: 'Multas legales, pérdida de confianza del cliente',
        mitigation: 'Implementar controles de privacidad urgentemente'
      });
    }

    if (module.id === 'integration-architecture' && percentage < 50) {
      criticalPoints.push({
        id: `critical-${module.id}-1`,
        title: 'Integración SUNAT no implementada',
        description: 'Falta integración crítica con SUNAT para cumplimiento fiscal peruano.',
        severity: 'critical',
        impact: 'Alto',
        module: module.name,
        risk: 'Incumplimiento fiscal, multas gubernamentales',
        mitigation: 'Desarrollar integración SUNAT como prioridad máxima'
      });
    }

    if (module.id === 'performance-architecture' && percentage < 40) {
      criticalPoints.push({
        id: `critical-${module.id}-1`,
        title: 'Riesgo de escalabilidad',
        description: 'Arquitectura actual no soporta el crecimiento esperado para Perú.',
        severity: 'critical',
        impact: 'Alto',
        module: module.name,
        risk: 'Pérdida de rendimiento, interrupciones del servicio',
        mitigation: 'Implementar estrategia de escalabilidad inmediatamente'
      });
    }

    if (module.id === 'regional-configuration' && percentage < 60) {
      criticalPoints.push({
        id: `critical-${module.id}-1`,
        title: 'Configuración fiscal peruana incompleta',
        description: 'Falta configuración de impuestos y documentos peruanos requeridos.',
        severity: 'critical',
        impact: 'Alto',
        module: module.name,
        risk: 'Incumplimiento fiscal, problemas operativos',
        mitigation: 'Completar configuración fiscal peruana urgentemente'
      });
    }

    if (module.id === 'functionality-analysis' && percentage < 50) {
      criticalPoints.push({
        id: `critical-${module.id}-1`,
        title: 'Funcionalidades críticas no migrables',
        description: 'Identificadas funcionalidades críticas que no pueden migrarse directamente a Perú.',
        severity: 'critical',
        impact: 'Alto',
        module: module.name,
        risk: 'Interrupción de operaciones, pérdida de funcionalidad',
        mitigation: 'Desarrollar plan de migración y alternativas inmediatamente'
      });
    }

    // Puntos críticos generales para scores muy bajos
    if (percentage < 20) {
      criticalPoints.push({
        id: `critical-${module.id}-2`,
        title: `Módulo ${module.name} en estado crítico`,
        description: `El módulo ${module.name} requiere atención inmediata debido al score extremadamente bajo (${percentage.toFixed(1)}%).`,
        severity: 'critical',
        impact: 'Crítico',
        module: module.name,
        risk: 'Fallo total del sistema, pérdida de datos',
        mitigation: 'Revisión completa y reconfiguración del módulo'
      });
    }
  });

  return criticalPoints;
};

export const generateChileDiscoveryReport = (session: DiscoverySession, filename: string = 'Chile Model Discovery Report') => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['Chile Model Discovery Report', '', '', '', ''],
    ['', '', '', '', ''],
    ['Sesión:', session.name, '', '', ''],
    ['Fecha:', new Date(session.date).toLocaleDateString(), '', '', ''],
    ['', '', '', '', ''],
    ['Resumen General', '', '', '', ''],
    ['Total de Modelos:', session.summary.total, '', '', ''],
    ['Descubiertos:', session.summary.discovered, '', '', ''],
    ['Analizados:', session.summary.analyzed, '', '', ''],
    ['Mapeados:', session.summary.mapped, '', '', ''],
    ['Implementados:', session.summary.implemented, '', '', ''],
    ['', '', '', '', ''],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen');

  // Models sheet
  const modelsData = [
    ['Modelos Descubiertos', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['ID', 'Nombre', 'Tipo', 'Estado', 'Descripción', 'Fuente', 'Destino', 'Complejidad', 'Prioridad', 'Esfuerzo Estimado', 'Esfuerzo Real'],
  ];

  session.models.forEach(model => {
    modelsData.push([
      model.id,
      model.name,
      model.type,
      model.status,
      model.description,
      model.source,
      model.target || '',
      model.complexity,
      model.priority,
      model.estimatedEffort.toString(),
      model.actualEffort?.toString() || ''
    ]);
  });

  const modelsSheet = XLSX.utils.aoa_to_sheet(modelsData);
  XLSX.utils.book_append_sheet(wb, modelsSheet, 'Modelos');

  // Dependencies sheet
  const dependenciesData = [
    ['Dependencias y Notas', '', '', '', ''],
    ['', '', '', '', ''],
    ['Modelo', 'Dependencias', 'Notas', 'Riesgos', 'Mitigación'],
  ];

  session.models.forEach(model => {
    dependenciesData.push([
      model.name,
      model.dependencies.join(', '),
      model.notes,
      model.priority === 'critical' ? 'Alto riesgo de migración' : 
      model.priority === 'high' ? 'Riesgo moderado' : 'Riesgo bajo',
      model.complexity === 'high' ? 'Requiere análisis detallado' :
      model.complexity === 'medium' ? 'Requiere planificación' : 'Migración directa'
    ]);
  });

  const dependenciesSheet = XLSX.utils.aoa_to_sheet(dependenciesData);
  XLSX.utils.book_append_sheet(wb, dependenciesSheet, 'Dependencias');

  // Status analysis sheet
  const statusAnalysisData = [
    ['Análisis por Estado', '', '', ''],
    ['', '', '', ''],
    ['Estado', 'Cantidad', 'Porcentaje', 'Próximos Pasos'],
  ];

  const statusAnalysis = [
    { status: 'discovered', label: 'Descubiertos', nextSteps: 'Análisis detallado requerido' },
    { status: 'analyzed', label: 'Analizados', nextSteps: 'Mapeo a Perú requerido' },
    { status: 'mapped', label: 'Mapeados', nextSteps: 'Implementación en Perú' },
    { status: 'implemented', label: 'Implementados', nextSteps: 'Validación y testing' }
  ];

  statusAnalysis.forEach(analysis => {
    const count = session.models.filter(m => m.status === analysis.status).length;
    const percentage = ((count / session.summary.total) * 100).toFixed(1);
    statusAnalysisData.push([
      analysis.label,
      count.toString(),
      `${percentage}%`,
      analysis.nextSteps
    ]);
  });

  const statusAnalysisSheet = XLSX.utils.aoa_to_sheet(statusAnalysisData);
  XLSX.utils.book_append_sheet(wb, statusAnalysisSheet, 'Análisis por Estado');

  // Save the file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `${filename}.xlsx`);
}; 