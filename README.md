# Assessment Arquitectura Salesforce - Chile

Herramienta interactiva para evaluar la arquitectura actual de Salesforce en Chile y preparar la base para futuras expansiones, desarrollada por NTT Data.

## Características

### 🎯 Funcionalidades Principales

- **Assessment Enfocado**: Evaluación de 4 módulos críticos con 22 preguntas enfocadas en la arquitectura actual de Chile
- **Interfaz Interactiva**: Formularios dinámicos con diferentes tipos de preguntas
- **Reportes Automáticos**: Generación de reportes en Excel con logo de NTT Data
- **Dashboard Visual**: Progreso en tiempo real con gráficos y métricas
- **Recomendaciones Inteligentes**: Generación automática de recomendaciones basadas en resultados

### 📊 Módulos Evaluados

#### **Módulos Específicos por Cloud**

1. **Sales Cloud**
   - **Funcionalidades Sales**: Gestión de oportunidades, leads, cuentas, productos, forecasting
   - **Implementación Técnica Sales**: Automatización de ventas, integraciones externas

2. **Service Cloud**
   - **Funcionalidades Service**: Gestión de casos, base de conocimientos, colas, SLA
   - **Implementación Técnica Service**: Automatización de servicio, omnicanal

3. **Marketing Cloud**
   - **Funcionalidades Marketing**: Email campaigns, Journey Builder, data extensions, personalización
   - **Implementación Técnica Marketing**: Automatización de marketing, integración con Sales/Service

#### **Aspectos Transversales**

4. **Aspectos Transversales**
   - **Arquitectura Funcional**: Jerarquía organizacional, multi-moneda, sharing model
   - **Arquitectura Técnica**: Modelo de datos, volumen de datos, calidad de datos
   - **Seguridad Funcional**: Perfiles y roles, sharing, controles de acceso
   - **Seguridad Técnica**: Cifrado, auditoría, GDPR/LGPD, clasificación de datos
   - **Integración Funcional**: Estrategia de APIs, middleware
   - **Integración Técnica**: Batch integration, error handling
   - **Framework de Automatización**: Flows, triggers, optimización, manejo de errores
   - **Escalabilidad Funcional**: Proyección de crecimiento, estrategia multi-org
   - **Escalabilidad Técnica**: Disaster recovery

## 🚀 Instalación

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd salesforce-assessment-tool
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación**
   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📖 Uso

### 1. Iniciar Assessment

1. Navega al Dashboard
2. Haz clic en "Iniciar Assessment"
3. Completa la información del cliente y assessor
4. Comienza la evaluación

### 2. Completar Evaluación

1. **Navegación por Módulos**: Usa el panel lateral para navegar entre módulos
2. **Tipos de Preguntas**:
   - **Escala**: Rating de 1-5 con opciones descriptivas
   - **Booleano**: Sí/No para preguntas simples
   - **Múltiple opción**: Selección de una opción
   - **Texto**: Respuestas libres

3. **Preguntas Críticas**: Marcadas con un ícono de advertencia rojo
4. **Progreso**: Visualiza el progreso en tiempo real

### 3. Generar Reporte

1. Completa todos los módulos o los que desees evaluar
2. Navega a la página de Reportes
3. Revisa los gráficos y métricas
4. Exporta el reporte en Excel

## 📊 Reportes

### Contenido del Excel

- **Resumen**: Score total y porcentajes por módulo
- **Resultados Detallados**: Respuestas específicas a cada pregunta
- **Recomendaciones Generadas**: Basadas en scores bajos
- **Puntos Críticos**: Identificación automática de problemas críticos

### Características del Reporte

- Logo de NTT Data incluido
- Múltiples hojas de cálculo
- Formato profesional
- Recomendaciones específicas por módulo

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI)
- **Gráficos**: Recharts
- **Excel**: xlsx + file-saver
- **Routing**: React Router DOM
- **Estado**: Context API + useReducer

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.tsx
│   └── QuestionCard.tsx
├── config/             # Configuración de módulos
│   └── modules.ts
├── context/            # Contexto de estado
│   └── AssessmentContext.tsx
├── pages/              # Páginas principales
│   ├── Dashboard.tsx
│   ├── Assessment.tsx
│   └── Report.tsx
├── types/              # Tipos TypeScript
│   └── index.ts
├── utils/              # Utilidades
│   └── excelGenerator.ts
└── App.tsx             # Componente principal
```

## 🎨 Características de UX

- **Diseño Responsivo**: Funciona en desktop y móvil
- **Navegación Intuitiva**: Flujo claro entre páginas
- **Feedback Visual**: Indicadores de progreso y estado
- **Accesibilidad**: Cumple estándares de accesibilidad web
- **Tema Personalizado**: Colores y branding de NTT Data

## 🔧 Configuración Avanzada

### Personalizar Módulos

Edita `src/config/modules.ts` para:
- Agregar nuevos módulos
- Modificar preguntas existentes
- Cambiar pesos y puntuaciones
- Ajustar categorías

### Personalizar Reportes

Modifica `src/utils/excelGenerator.ts` para:
- Cambiar formato del Excel
- Agregar nuevas hojas
- Personalizar recomendaciones
- Incluir branding adicional

## 📈 Métricas y KPIs

La herramienta genera automáticamente:

- **Score Total**: Puntuación general del assessment
- **Porcentaje de Completitud**: Progreso por módulo
- **Puntos Críticos**: Identificación de problemas urgentes
- **Recomendaciones**: Sugerencias de mejora priorizadas
- **Tendencias**: Comparación de scores por módulo

## 🎯 Enfoque del Assessment

### **Evaluación de Arquitectura Actual**
- **Módulos Específicos**: 3 módulos por Cloud (Sales, Service, Marketing)
- **Aspectos Transversales**: 1 módulo con 9 secciones críticas
- **Preguntas Totales**: 22 preguntas enfocadas
- **Objetivo**: Entender la configuración actual de Chile
- **Propósito**: Preparar base para futuras expansiones

### **Enfoque Funcional-Técnico**
- **Levantamiento Funcional**: Qué hace el sistema (configuración, procesos, funcionalidades)
- **Implementación Técnica**: Cómo está implementado (arquitectura, optimización, monitoreo)
- **Priorización**: Funcional primero, técnico después para mejor comprensión

### **Beneficios del Enfoque**
- 🎯 **Enfoque en arquitectura actual** de Chile
- ⚡ **Evaluación rápida** con 22 preguntas críticas
- 📊 **Mejor experiencia del usuario** con preguntas relevantes
- 🎯 **Mayor precisión** al evaluar solo lo aplicable
- 🚀 **Base sólida** para planificación de expansión

## 📋 Funcionalidades Específicas por Módulo

### **1. Arquitectura Actual (10 preguntas)**

#### **Levantamiento Funcional (3 preguntas)**
- **`org-hierarchy`**: Evalúa la estructura organizacional actual de Chile
  - **Propósito**: Entender roles, perfiles y jerarquía de cuentas
  - **Impacto en Migración**: Determina si la estructura es escalable para nuevas regiones
  - **Funcionalidad**: Configuración de roles, perfiles, jerarquía de cuentas

- **`multi-currency`**: Evalúa configuración multi-moneda
  - **Propósito**: Verificar preparación para expansión internacional
  - **Impacto en Migración**: Crítico para operaciones en diferentes monedas
  - **Funcionalidad**: Configuración de monedas, conversiones, reportes multi-moneda

- **`sharing-model`**: Evalúa modelo de compartir datos
  - **Propósito**: Entender cómo se comparten los datos entre usuarios
  - **Impacto en Migración**: Determina complejidad de configuración de permisos
  - **Funcionalidad**: Private, Public Read/Write, basado en roles

#### **Implementación Técnica (3 preguntas)**
- **`data-model-design`**: Evalúa diseño del modelo de datos
  - **Propósito**: Verificar que sigue mejores prácticas de Salesforce
  - **Impacto en Migración**: Determina facilidad de replicación y escalabilidad
  - **Funcionalidad**: Normalización, relaciones, campos calculados, roll-up summaries

- **`data-volume-analysis`**: Evalúa análisis de volumen de datos
  - **Propósito**: Entender proyecciones de crecimiento y límites de storage
  - **Impacto en Migración**: Crítico para planificación de capacidad
  - **Funcionalidad**: Proyecciones de datos, storage limits, archiving strategy

- **`data-quality-framework`**: Evalúa framework de calidad de datos
  - **Propósito**: Verificar procesos de validación y limpieza de datos
  - **Impacto en Migración**: Determina calidad de datos a migrar
  - **Funcionalidad**: Validación, deduplicación, data cleansing, data governance

#### **Framework de Automatización (4 preguntas)**
- **`automation-framework`**: Evalúa framework de automatización
  - **Propósito**: Verificar uso consistente de herramientas de automatización
  - **Impacto en Migración**: Determina complejidad de replicación de procesos
  - **Funcionalidad**: Flows, Process Builder, Workflow Rules, Apex Triggers

- **`trigger-framework`**: Evalúa framework de triggers
  - **Propósito**: Verificar escalabilidad y mantenibilidad de triggers
  - **Impacto en Migración**: Crítico para replicación de lógica de negocio
  - **Funcionalidad**: Trigger patterns, bulkification, governor limit compliance

- **`flow-optimization`**: Evalúa optimización de Flows
  - **Propósito**: Verificar que los Flows están optimizados para rendimiento
  - **Impacto en Migración**: Determina eficiencia de procesos automatizados
  - **Funcionalidad**: Flow complexity, element count, bulk processing

- **`error-handling`**: Evalúa framework de manejo de errores
  - **Propósito**: Verificar robustez en manejo de errores
  - **Impacto en Migración**: Crítico para estabilidad de procesos
  - **Funcionalidad**: Error handling, logging, notification, retry mechanisms

### **2. Arquitectura de Seguridad (7 preguntas)**

#### **Seguridad Funcional (3 preguntas)**
- **`profiles-roles-design`**: Evalúa diseño de perfiles y roles
  - **Propósito**: Verificar modelo de seguridad bien diseñado y documentado
  - **Impacto en Migración**: Determina complejidad de configuración de permisos
  - **Funcionalidad**: Role hierarchy, profile design, permission sets, field-level security

- **`sharing-architecture`**: Evalúa arquitectura de sharing
  - **Propósito**: Verificar optimización de sharing para rendimiento
  - **Impacto en Migración**: Determina eficiencia de acceso a datos
  - **Funcionalidad**: Sharing rules, criteria-based sharing, manual sharing, Apex sharing

- **`access-controls`**: Evalúa controles de acceso
  - **Propósito**: Verificar implementación de controles de acceso robustos
  - **Impacto en Migración**: Crítico para seguridad en nuevas regiones
  - **Funcionalidad**: MFA, SSO, conditional access, privileged access management

#### **Seguridad Técnica (4 preguntas)**
- **`encryption-strategy`**: Evalúa estrategia de cifrado
  - **Propósito**: Verificar protección de datos sensibles
  - **Impacto en Migración**: Crítico para cumplimiento regulatorio
  - **Funcionalidad**: Field-level encryption, platform encryption, custom encryption

- **`audit-trail`**: Evalúa sistema de auditoría
  - **Propósito**: Verificar trazabilidad completa de cambios
  - **Impacto en Migración**: Crítico para cumplimiento y seguridad
  - **Funcionalidad**: Field history tracking, login history, setup audit trail, custom audit

- **`gdpr-compliance`**: Evalúa preparación para GDPR/LGPD
  - **Propósito**: Verificar cumplimiento de regulaciones de privacidad
  - **Impacto en Migración**: Crítico para operaciones internacionales
  - **Funcionalidad**: Data subject rights, consent management, data retention, deletion

- **`data-classification`**: Evalúa clasificación de datos
  - **Propósito**: Verificar identificación y manejo de datos sensibles
  - **Impacto en Migración**: Crítico para cumplimiento regulatorio
  - **Funcionalidad**: Data classification, PII identification, sensitive data handling

### **3. Arquitectura de Integración (4 preguntas)**

#### **Integración Funcional (2 preguntas)**
- **`api-strategy`**: Evalúa estrategia de APIs
  - **Propósito**: Verificar diseño y gobernanza de APIs
  - **Impacto en Migración**: Determina facilidad de integración con sistemas externos
  - **Funcionalidad**: REST APIs, SOAP APIs, custom APIs, API governance

- **`middleware-strategy`**: Evalúa estrategia de middleware
  - **Propósito**: Verificar arquitectura de integración entre sistemas
  - **Impacto en Migración**: Crítico para conectividad con sistemas legacy
  - **Funcionalidad**: MuleSoft, Informatica, custom middleware, ETL tools

#### **Integración Técnica (2 preguntas)**
- **`batch-integration`**: Evalúa optimización de integraciones por lotes
  - **Propósito**: Verificar eficiencia en procesamiento de grandes volúmenes
  - **Impacto en Migración**: Crítico para sincronización de datos
  - **Funcionalidad**: Bulk API, batch processing, data synchronization

- **`error-handling-integration`**: Evalúa manejo de errores en integraciones
  - **Propósito**: Verificar robustez en manejo de errores de integración
  - **Impacto en Migración**: Crítico para estabilidad de integraciones
  - **Funcionalidad**: Error handling, retry logic, dead letter queues, monitoring

### **4. Arquitectura de Escalabilidad (3 preguntas)**

#### **Escalabilidad Funcional (2 preguntas)**
- **`growth-projection`**: Evalúa proyección de crecimiento
  - **Propósito**: Verificar planificación de crecimiento de datos y usuarios
  - **Impacto en Migración**: Crítico para planificación de capacidad
  - **Funcionalidad**: Data growth, user growth, transaction volume, storage needs

- **`multi-org-strategy`**: Evalúa estrategia multi-org
  - **Propósito**: Verificar planificación para separación de organizaciones
  - **Impacto en Migración**: Crítico para estrategia de expansión
  - **Funcionalidad**: Org separation, data sharing, user management, integration

#### **Escalabilidad Técnica (1 pregunta)**
- **`disaster-recovery`**: Evalúa plan de disaster recovery
  - **Propósito**: Verificar preparación para continuidad del negocio
  - **Impacto en Migración**: Crítico para operaciones confiables
  - **Funcionalidad**: Backup strategy, recovery time objectives, business continuity

## 🎯 Criterios de Evaluación por Funcionalidad

### **Escala de Evaluación (1-5)**
- **1 - No configurado/No existe**: Funcionalidad completamente ausente
- **2 - Básico**: Implementación mínima, requiere mejoras significativas
- **3 - Intermedio**: Implementación funcional pero con oportunidades de mejora
- **4 - Avanzado**: Buena implementación con algunas optimizaciones pendientes
- **5 - Óptimo**: Implementación de excelencia siguiendo mejores prácticas

### **Preguntas Críticas**
- Marcadas con ícono de advertencia rojo
- Requieren atención prioritaria en caso de scores bajos
- Impactan directamente la capacidad de migración exitosa

### **Categorización Funcional-Técnica**
- **Funcional**: Qué hace el sistema (configuración, procesos, funcionalidades)
- **Técnico**: Cómo está implementado (arquitectura, optimización, monitoreo)
- **Automation**: Procesos automatizados y frameworks
- **Security**: Aspectos de seguridad y cumplimiento
- **Integration**: Conectividad y integración con sistemas externos
- **Scalability**: Preparación para crecimiento y expansión

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está desarrollado por NTT Data para uso interno y de clientes.

## 🆘 Soporte

Para soporte técnico o preguntas sobre la herramienta, contacta al equipo de desarrollo de NTT Data.

---

**Desarrollado con ❤️ por NTT Data** 