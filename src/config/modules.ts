import { ModuleConfig } from '../types';

export const moduleConfigs: ModuleConfig[] = [
  {
    id: 'sales-cloud',
    name: 'Sales Cloud',
    icon: 'sales',
    color: '#1976d2',
    sections: [
      {
        id: 'sales-functional',
        name: 'Funcionalidades Sales',
        questions: [
          {
            id: 'lead-management',
            question: '¿Está implementada la gestión de Leads?',
            description: 'Evaluar si el sistema de gestión de leads está configurado y funcionando (Alcance actual: 150 oportunidades mensuales)',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'sales-functional',
            critical: true
          },
          {
            id: 'producto-oferta',
            question: '¿Está implementado el objeto personalizado "Producto de la oferta"?',
            description: 'Evaluar si existe el objeto custom para gestionar productos en ofertas',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'sales-functional',
            critical: true
          },
          {
            id: 'account-hierarchy',
            question: '¿Está configurada la jerarquía de cuentas?',
            description: 'Evaluar si las jerarquías de cuentas están configuradas (Alcance: 300 clientes)',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'sales-functional',
            critical: true
          },
          {
            id: 'opportunity-management',
            question: '¿Está implementada la gestión de oportunidades?',
            description: 'Evaluar si el sistema de gestión de oportunidades está configurado',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'sales-functional',
            critical: true
          },
          {
            id: 'quote-management',
            question: '¿Está implementada la gestión de cotizaciones?',
            description: 'Evaluar si el sistema de cotizaciones está configurado',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'sales-functional',
            critical: true
          },
          {
            id: 'contract-management',
            question: '¿Está implementada la gestión de contratos?',
            description: 'Evaluar si el sistema de contratos está configurado',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'sales-functional',
            critical: true
          }
        ]
      },
      {
        id: 'sales-integrations',
        name: 'Integraciones Sales',
        questions: [
          {
            id: 'sales-portal-integration',
            question: '¿Está integrado Sales Lightning con el Portal?',
            description: 'Evaluar la integración Sales - Lightning → Portal',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'sales-integrations',
            critical: true
          },
          {
            id: 'sales-risk-analysis',
            question: '¿Está integrado Sales con Análisis de Riesgo?',
            description: 'Evaluar la integración Sales → Análisis Riesgo',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'sales-integrations',
            critical: true
          },
          {
            id: 'devops-github',
            question: '¿Está configurada la integración DevOps → GitHub?',
            description: 'Evaluar la integración con GitHub para DevOps',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'sales-integrations',
            critical: false
          },
          {
            id: 'app-exchange',
            question: '¿Se utilizan aplicaciones de AppExchange?',
            description: 'Evaluar el uso de aplicaciones de AppExchange',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 3,
            weight: 1,
            category: 'sales-integrations',
            critical: false
          }
        ]
      }
    ]
  },
  {
    id: 'service-cloud',
    name: 'Service Cloud',
    icon: 'support',
    color: '#d32f2f',
    sections: [
      {
        id: 'service-functional',
        name: 'Funcionalidades Service',
        questions: [
          {
            id: 'case-management',
            question: '¿Está implementado el sistema de gestión de casos?',
            description: 'Evaluar si el sistema de gestión de casos está configurado y funcionando (Alcance actual: 500-1000 casos mensuales)',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'service-functional',
            critical: true
          },
          {
            id: 'case-escalation',
            question: '¿Está configurado el sistema de escalamiento de casos?',
            description: 'Evaluar si existe un sistema de escalamiento para casos críticos',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'service-functional',
            critical: true
          },
          {
            id: 'sla-management',
            question: '¿Están configurados los SLAs para casos?',
            description: 'Evaluar si existen SLAs definidos para diferentes tipos de casos',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'service-functional',
            critical: true
          },
          {
            id: 'queue-management',
            question: '¿Están configuradas las colas de casos?',
            description: 'Evaluar si existen colas para distribución de casos',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'service-functional',
            critical: true
          }
        ]
      },
      {
        id: 'service-automation',
        name: 'Automatización Service',
        questions: [
          {
            id: 'case-automation',
            question: '¿Existen flujos automatizados para casos?',
            description: 'Evaluar si hay automatización en el procesamiento de casos',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'service-automation',
            critical: true
          },
          {
            id: 'case-routing',
            question: '¿Está implementado el enrutamiento automático de casos?',
            description: 'Evaluar si los casos se asignan automáticamente',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'service-automation',
            critical: true
          },
          {
            id: 'notification-system',
            question: '¿Existe un sistema de notificaciones para casos?',
            description: 'Evaluar si hay notificaciones automáticas para casos',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'service-automation',
            critical: false
          }
        ]
      }
    ]
  },
  {
    id: 'marketing-cloud',
    name: 'Marketing Cloud',
    icon: 'marketing',
    color: '#9c27b0',
    sections: [
      {
        id: 'marketing-functional',
        name: 'Funcionalidades Marketing',
        questions: [
          {
            id: 'campaign-management',
            question: '¿Está implementado el sistema de gestión de campañas?',
            description: 'Evaluar si el sistema de campañas está configurado',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'marketing-functional',
            critical: true
          },
          {
            id: 'email-automation',
            question: '¿Está implementada la automatización de emails?',
            description: 'Evaluar si existe automatización para envío de emails',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'marketing-functional',
            critical: true
          },
          {
            id: 'customer-segmentation',
            question: '¿Está implementada la segmentación de clientes?',
            description: 'Evaluar si existe segmentación para campañas',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'marketing-functional',
            critical: true
          },
          {
            id: 'journey-builder',
            question: '¿Está implementado Journey Builder?',
            description: 'Evaluar si se utiliza Journey Builder para automatización',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'marketing-functional',
            critical: false
          }
        ]
      }
    ]
  },
  {
    id: 'experience-cloud',
    name: 'Experience Cloud',
    icon: 'portal',
    color: '#ff5722',
    sections: [
      {
        id: 'portal-functional',
        name: 'Funcionalidades Portal',
        questions: [
          {
            id: 'customer-portal',
            question: '¿Está implementado el portal de clientes?',
            description: 'Evaluar si existe un portal para clientes',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'portal-functional',
            critical: true
          },
          {
            id: 'case-creation-portal',
            question: '¿Pueden los clientes crear casos desde el portal?',
            description: 'Evaluar si los clientes pueden crear casos',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'portal-functional',
            critical: true
          },
          {
            id: 'case-tracking-portal',
            question: '¿Pueden los clientes hacer seguimiento de casos?',
            description: 'Evaluar si los clientes pueden ver el estado de sus casos',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'portal-functional',
            critical: true
          }
        ]
      }
    ]
  },
  {
    id: 'custom-development',
    name: 'Desarrollo Personalizado',
    icon: 'development',
    color: '#ff9800',
    sections: [
      {
        id: 'custom-objects',
        name: 'Objetos Personalizados',
        questions: [
          {
            id: 'producto-oferta-object',
            question: '¿Está implementado el objeto personalizado "Producto de la oferta"?',
            description: 'Evaluar si existe el objeto custom para gestionar productos en ofertas',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'custom-objects',
            critical: true
          },
          {
            id: 'custom-fields',
            question: '¿Están implementados campos personalizados críticos?',
            description: 'Evaluar si existen campos personalizados para procesos específicos',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'custom-objects',
            critical: true
          },
          {
            id: 'custom-objects-count',
            question: 'Cantidad de objetos personalizados implementados',
            description: 'Seleccionar la cantidad de objetos personalizados implementados',
            type: 'multiple-choice',
            options: ['1-5', '6-10', '11-20', 'Más de 20'],
            maxScore: 5,
            weight: 1,
            category: 'custom-objects',
            critical: false
          }
        ]
      },
      {
        id: 'custom-code',
        name: 'Código Personalizado',
        questions: [
          {
            id: 'apex-classes',
            question: '¿Están implementadas clases Apex personalizadas?',
            description: 'Evaluar si existen clases Apex para lógica de negocio',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'custom-code',
            critical: true
          },
          {
            id: 'apex-triggers',
            question: '¿Están implementados triggers Apex?',
            description: 'Evaluar si existen triggers para automatización de procesos',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'custom-code',
            critical: true
          },
          {
            id: 'apex-flows',
            question: '¿Están implementados flujos de Process Builder/Flow?',
            description: 'Evaluar si existen flujos para automatización de procesos',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'custom-code',
            critical: true
          },
          {
            id: 'custom-components',
            question: 'Componentes de código personalizado implementados',
            description: 'Seleccionar los componentes de código personalizado implementados',
            type: 'checkbox',
            options: ['Clases Apex', 'Triggers', 'Process Builder', 'Flows', 'Lightning Components', 'Visualforce Pages', 'Custom Controllers', 'Batch Jobs'],
            maxScore: 5,
            weight: 1,
            category: 'custom-code',
            critical: false
          }
        ]
      }
    ]
  },
  {
    id: 'automation-framework',
    name: 'Framework de Automatización',
    icon: 'automation',
    color: '#607d8b',
    sections: [
      {
        id: 'automation-tools',
        name: 'Herramientas de Automatización',
        questions: [
          {
            id: 'automation-framework',
            question: '¿Existe un framework de automatización bien definido?',
            description: 'Evaluar si existe un framework de automatización bien definido',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'automation',
            critical: true
          },
          {
            id: 'automation-tools',
            question: 'Herramientas de automatización implementadas',
            description: 'Seleccionar las herramientas de automatización que están implementadas',
            type: 'checkbox',
            options: ['Flows', 'Process Builder', 'Workflow Rules', 'Apex Triggers', 'Scheduled Jobs', 'Platform Events'],
            maxScore: 5,
            weight: 1,
            category: 'automation',
            critical: true
          },
          {
            id: 'trigger-framework',
            question: '¿Está implementado un framework de triggers escalable?',
            description: 'Evaluar si está implementado un framework de triggers escalable',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'automation',
            critical: true
          },
          {
            id: 'flow-optimization',
            question: '¿Los Flows están optimizados para rendimiento y escalabilidad?',
            description: 'Evaluar si los Flows están optimizados para rendimiento',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'automation',
            critical: true
          },
          {
            id: 'error-handling',
            question: '¿Existe un framework robusto de manejo de errores?',
            description: 'Evaluar si existe un framework robusto de manejo de errores',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'automation',
            critical: true
          },
          {
            id: 'error-handling-components',
            question: 'Componentes de manejo de errores implementados',
            description: 'Seleccionar los componentes de manejo de errores que están implementados',
            type: 'checkbox',
            options: ['Error Handling', 'Logging', 'Notification', 'Retry Mechanisms', 'Error Recovery', 'Monitoring'],
            maxScore: 5,
            weight: 1,
            category: 'automation',
            critical: true
          }
        ]
      }
    ]
  },
  {
    id: 'scalability-functional',
    name: 'Escalabilidad Funcional',
    icon: 'scalability',
    color: '#795548',
    sections: [
      {
        id: 'growth-projection',
        name: 'Proyección de Crecimiento',
        questions: [
          {
            id: 'growth-projection',
            question: '¿Está proyectado el crecimiento de datos y usuarios?',
            description: 'Evaluar si está proyectado el crecimiento de datos y usuarios',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'scalability-functional',
            critical: true
          },
          {
            id: 'growth-metrics',
            question: 'Métricas de crecimiento proyectadas',
            description: 'Seleccionar las métricas de crecimiento que están proyectadas',
            type: 'checkbox',
            options: ['Data Growth', 'User Growth', 'Transaction Volume', 'Storage Needs', 'API Usage', 'Integration Volume'],
            maxScore: 5,
            weight: 1,
            category: 'scalability-functional',
            critical: true
          },
          {
            id: 'multi-org-strategy',
            question: '¿Está planificada la estrategia multi-org?',
            description: 'Evaluar si está planificada la estrategia multi-org',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'scalability-functional',
            critical: true
          },
          {
            id: 'multi-org-components',
            question: 'Componentes de estrategia multi-org planificados',
            description: 'Seleccionar los componentes de estrategia multi-org que están planificados',
            type: 'checkbox',
            options: ['Org Separation', 'Data Sharing', 'User Management', 'Integration Strategy', 'Governance Model', 'Compliance Framework'],
            maxScore: 5,
            weight: 1,
            category: 'scalability-functional',
            critical: true
          }
        ]
      }
    ]
  },
  {
    id: 'scalability-technical',
    name: 'Escalabilidad Técnica',
    icon: 'performance',
    color: '#3f51b5',
    sections: [
      {
        id: 'disaster-recovery',
        name: 'Disaster Recovery',
        questions: [
          {
            id: 'disaster-recovery',
            question: '¿Está implementado un plan de disaster recovery?',
            description: 'Evaluar si está implementado un plan de disaster recovery',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'scalability-technical',
            critical: true
          },
          {
            id: 'disaster-recovery-components',
            question: 'Componentes de disaster recovery implementados',
            description: 'Seleccionar los componentes de disaster recovery que están implementados',
            type: 'checkbox',
            options: ['Backup Strategy', 'Recovery Time Objectives', 'Business Continuity', 'Data Replication', 'Failover Systems', 'Recovery Procedures'],
            maxScore: 5,
            weight: 1,
            category: 'scalability-technical',
            critical: true
          },
          {
            id: 'performance-monitoring',
            question: '¿Está implementado el monitoreo de rendimiento?',
            description: 'Evaluar si está implementado el monitoreo de rendimiento',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'scalability-technical',
            critical: true
          },
          {
            id: 'performance-metrics',
            question: 'Métricas de rendimiento monitoreadas',
            description: 'Seleccionar las métricas de rendimiento que están monitoreadas',
            type: 'checkbox',
            options: ['API Response Times', 'Database Performance', 'User Experience', 'System Availability', 'Error Rates', 'Resource Utilization'],
            maxScore: 5,
            weight: 1,
            category: 'scalability-technical',
            critical: true
          }
        ]
      }
    ]
  },
  {
    id: 'data-volumetry',
    name: 'Volumetría de Datos',
    icon: 'data',
    color: '#4caf50',
    sections: [
      {
        id: 'current-volume',
        name: 'Volumen Actual',
        questions: [
          {
            id: 'user-count',
            question: '¿Cuál es el número actual de usuarios?',
            description: 'Evaluar el número de usuarios activos (Alcance actual: 15 usuarios estimados)',
            type: 'multiple-choice',
            options: ['1-10', '11-20', '21-50', 'Más de 50'],
            maxScore: 5,
            weight: 1,
            category: 'current-volume',
            critical: true
          },
          {
            id: 'customer-count',
            question: '¿Cuál es el número actual de clientes?',
            description: 'Evaluar el número de clientes (Alcance actual: 300 clientes)',
            type: 'multiple-choice',
            options: ['1-100', '101-300', '301-500', 'Más de 500'],
            maxScore: 5,
            weight: 1,
            category: 'current-volume',
            critical: true
          },
          {
            id: 'monthly-cases',
            question: '¿Cuál es el volumen mensual de casos?',
            description: 'Evaluar el volumen de casos mensuales (Alcance actual: 500-1000 casos mensuales)',
            type: 'multiple-choice',
            options: ['1-500', '501-1000', '1001-2000', 'Más de 2000'],
            maxScore: 5,
            weight: 1,
            category: 'current-volume',
            critical: true
          },
          {
            id: 'monthly-opportunities',
            question: '¿Cuál es el volumen mensual de oportunidades?',
            description: 'Evaluar el volumen de oportunidades mensuales (Alcance actual: 150 oportunidades mensuales)',
            type: 'multiple-choice',
            options: ['1-100', '101-200', '201-500', 'Más de 500'],
            maxScore: 5,
            weight: 1,
            category: 'current-volume',
            critical: true
          }
        ]
      },
      {
        id: 'growth-projection',
        name: 'Proyección de Crecimiento',
        questions: [
          {
            id: 'growth-readiness',
            question: '¿Está preparada la arquitectura para el crecimiento proyectado?',
            description: 'Evaluar si la arquitectura puede manejar el crecimiento esperado',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'growth-projection',
            critical: true
          },
          {
            id: 'scalability-assessment',
            question: '¿Está evaluada la escalabilidad de la solución actual?',
            description: 'Evaluar si se ha analizado la escalabilidad de la solución',
            type: 'boolean',
            options: ['Sí', 'No'],
            maxScore: 5,
            weight: 1,
            category: 'growth-projection',
            critical: true
          }
        ]
      }
    ]
  }
]; 