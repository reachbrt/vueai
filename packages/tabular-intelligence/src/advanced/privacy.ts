/**
 * Data Privacy & Compliance
 * PII detection, anonymization, compliance checking
 */

import type {
  PIIDetectionResult,
  AnonymizationResult,
  ComplianceReport
} from '../types';

/**
 * Detect PII (Personally Identifiable Information)
 */
export async function detectPII(data: any[]): Promise<PIIDetectionResult> {
  const columns = Object.keys(data[0] || {});
  const piiColumns: PIIDetectionResult['piiColumns'] = [];

  for (const column of columns) {
    const values = data.map(row => String(row[column])).filter(v => v && v !== 'null' && v !== 'undefined');
    const sampleValues = values.slice(0, 5);

    // Email detection
    if (values.some(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))) {
      piiColumns.push({
        column,
        type: 'email',
        confidence: 0.95,
        sampleValues: sampleValues.slice(0, 3).map(v => maskEmail(v)),
        count: values.length
      });
    }

    // Phone detection
    if (values.some(v => /^\+?[\d\s\-()]{10,}$/.test(v))) {
      piiColumns.push({
        column,
        type: 'phone',
        confidence: 0.85,
        sampleValues: sampleValues.slice(0, 3).map(v => maskPhone(v)),
        count: values.length
      });
    }

    // SSN detection (US format)
    if (values.some(v => /^\d{3}-\d{2}-\d{4}$/.test(v))) {
      piiColumns.push({
        column,
        type: 'ssn',
        confidence: 0.99,
        sampleValues: ['***-**-****'],
        count: values.length
      });
    }

    // Credit card detection
    if (values.some(v => /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/.test(v))) {
      piiColumns.push({
        column,
        type: 'credit_card',
        confidence: 0.95,
        sampleValues: ['****-****-****-****'],
        count: values.length
      });
    }

    // Name detection (simple heuristic)
    if (column.toLowerCase().includes('name') || column.toLowerCase().includes('fullname')) {
      piiColumns.push({
        column,
        type: 'name',
        confidence: 0.7,
        sampleValues: sampleValues.slice(0, 3).map(() => '[REDACTED]'),
        count: values.length
      });
    }
  }

  const riskLevel = piiColumns.length > 5 ? 'high' : piiColumns.length > 2 ? 'medium' : 'low';

  return {
    piiColumns,
    recommendations: generatePIIRecommendations(piiColumns),
    riskLevel
  };
}

/**
 * Anonymize data
 */
export async function anonymizeData(
  data: any[],
  options: {
    method: 'masking' | 'hashing' | 'generalization' | 'differential_privacy' | 'tokenization';
    columns?: string[];
  }
): Promise<AnonymizationResult> {
  const { method, columns } = options;
  const targetColumns = columns || Object.keys(data[0]);

  const anonymizedData = data.map(row => {
    const newRow = { ...row };
    for (const column of targetColumns) {
      newRow[column] = anonymizeValue(row[column], method);
    }
    return newRow;
  });

  return {
    data: anonymizedData,
    method,
    columns: targetColumns,
    reversible: method === 'tokenization',
    privacyLevel: calculatePrivacyLevel(method)
  };
}

/**
 * Check compliance with standards
 */
export async function checkCompliance(
  data: any[],
  standard: 'GDPR' | 'CCPA' | 'HIPAA' | 'SOC2'
): Promise<ComplianceReport> {
  const piiResult = await detectPII(data);
  const violations: ComplianceReport['violations'] = [];

  // Check for PII without proper handling
  if (piiResult.piiColumns.length > 0) {
    violations.push({
      rule: `${standard} - PII Protection`,
      description: `Found ${piiResult.piiColumns.length} columns containing PII`,
      severity: 'critical',
      affectedColumns: piiResult.piiColumns.map(c => c.column),
      remediation: 'Implement anonymization or encryption for PII columns'
    });
  }

  const compliant = violations.length === 0;
  const score = Math.max(0, 100 - violations.length * 20);

  return {
    standard,
    compliant,
    score,
    violations,
    recommendations: [
      'Implement data encryption at rest and in transit',
      'Add access controls and audit logging',
      'Create data retention and deletion policies'
    ],
    timestamp: new Date()
  };
}

// Helper functions
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain}`;
}

function maskPhone(phone: string): string {
  return phone.replace(/\d/g, (d, i) => i < phone.length - 4 ? '*' : d);
}

function anonymizeValue(value: any, method: string): any {
  if (value === null || value === undefined) return value;

  switch (method) {
    case 'masking':
      return '***MASKED***';
    case 'hashing':
      return hashValue(String(value));
    case 'generalization':
      return typeof value === 'number' ? Math.floor(value / 10) * 10 : '[GENERALIZED]';
    case 'tokenization':
      return `TOKEN_${Math.random().toString(36).substr(2, 9)}`;
    default:
      return value;
  }
}

function hashValue(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `HASH_${Math.abs(hash).toString(16)}`;
}

function calculatePrivacyLevel(method: string): number {
  const levels: Record<string, number> = {
    'masking': 60,
    'hashing': 80,
    'generalization': 50,
    'differential_privacy': 95,
    'tokenization': 70
  };
  return levels[method] || 50;
}

function generatePIIRecommendations(piiColumns: any[]): string[] {
  const recommendations: string[] = [];

  if (piiColumns.length > 0) {
    recommendations.push('Implement data anonymization for PII columns');
    recommendations.push('Add access controls to restrict PII access');
    recommendations.push('Enable audit logging for PII access');
  }

  if (piiColumns.some(c => c.type === 'ssn' || c.type === 'credit_card')) {
    recommendations.push('CRITICAL: Encrypt sensitive financial/identity data');
  }

  return recommendations;
}

