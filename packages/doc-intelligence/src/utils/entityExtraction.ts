export interface ExtractedEntity {
  type: string;
  value: string;
  confidence: number;
  position?: {
    start: number;
    end: number;
  };
}

export interface ExtractedData {
  dates: ExtractedEntity[];
  amounts: ExtractedEntity[];
  names: ExtractedEntity[];
  emails: ExtractedEntity[];
  phones: ExtractedEntity[];
  addresses: ExtractedEntity[];
  invoiceNumbers: ExtractedEntity[];
  taxIds: ExtractedEntity[];
  other: ExtractedEntity[];
}

// Regular expressions for entity extraction
const PATTERNS = {
  // Date patterns (various formats)
  date: [
    /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g,
    /\b\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}\b/g,
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/gi,
    /\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/gi
  ],
  
  // Amount patterns (currency)
  amount: [
    /\$\s*\d+(?:,\d{3})*(?:\.\d{2})?/g,
    /\b\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:USD|EUR|GBP|CAD|AUD)\b/gi,
    /\b(?:USD|EUR|GBP|CAD|AUD)\s*\d+(?:,\d{3})*(?:\.\d{2})?\b/gi
  ],
  
  // Email pattern
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  
  // Phone patterns (various formats)
  phone: [
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    /\b\(\d{3}\)\s*\d{3}[-.\s]?\d{4}\b/g,
    /\b\+\d{1,3}\s*\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g
  ],
  
  // Invoice number patterns
  invoiceNumber: [
    /\b(?:invoice|inv|bill)\s*#?\s*[A-Z0-9-]+\b/gi,
    /\b[A-Z]{2,}\d{4,}\b/g
  ],
  
  // Tax ID patterns
  taxId: [
    /\b\d{2}-\d{7}\b/g, // EIN format
    /\b\d{3}-\d{2}-\d{4}\b/g // SSN format
  ]
};

/**
 * Extract dates from text
 */
export function extractDates(text: string): ExtractedEntity[] {
  const dates: ExtractedEntity[] = [];
  
  for (const pattern of PATTERNS.date) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      dates.push({
        type: 'date',
        value: match[0],
        confidence: 0.9,
        position: {
          start: match.index || 0,
          end: (match.index || 0) + match[0].length
        }
      });
    }
  }
  
  return dates;
}

/**
 * Extract monetary amounts from text
 */
export function extractAmounts(text: string): ExtractedEntity[] {
  const amounts: ExtractedEntity[] = [];
  
  for (const pattern of PATTERNS.amount) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      amounts.push({
        type: 'amount',
        value: match[0],
        confidence: 0.95,
        position: {
          start: match.index || 0,
          end: (match.index || 0) + match[0].length
        }
      });
    }
  }
  
  return amounts;
}

/**
 * Extract email addresses from text
 */
export function extractEmails(text: string): ExtractedEntity[] {
  const emails: ExtractedEntity[] = [];
  const matches = text.matchAll(PATTERNS.email);
  
  for (const match of matches) {
    emails.push({
      type: 'email',
      value: match[0],
      confidence: 0.98,
      position: {
        start: match.index || 0,
        end: (match.index || 0) + match[0].length
      }
    });
  }
  
  return emails;
}

/**
 * Extract phone numbers from text
 */
export function extractPhones(text: string): ExtractedEntity[] {
  const phones: ExtractedEntity[] = [];
  
  for (const pattern of PATTERNS.phone) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      phones.push({
        type: 'phone',
        value: match[0],
        confidence: 0.9,
        position: {
          start: match.index || 0,
          end: (match.index || 0) + match[0].length
        }
      });
    }
  }
  
  return phones;
}

/**
 * Extract invoice numbers from text
 */
export function extractInvoiceNumbers(text: string): ExtractedEntity[] {
  const invoiceNumbers: ExtractedEntity[] = [];

  for (const pattern of PATTERNS.invoiceNumber) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      invoiceNumbers.push({
        type: 'invoiceNumber',
        value: match[0],
        confidence: 0.85,
        position: {
          start: match.index || 0,
          end: (match.index || 0) + match[0].length
        }
      });
    }
  }

  return invoiceNumbers;
}

/**
 * Extract tax IDs from text
 */
export function extractTaxIds(text: string): ExtractedEntity[] {
  const taxIds: ExtractedEntity[] = [];

  for (const pattern of PATTERNS.taxId) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      taxIds.push({
        type: 'taxId',
        value: match[0],
        confidence: 0.8,
        position: {
          start: match.index || 0,
          end: (match.index || 0) + match[0].length
        }
      });
    }
  }

  return taxIds;
}

/**
 * Extract names using simple heuristics
 */
export function extractNames(text: string): ExtractedEntity[] {
  const names: ExtractedEntity[] = [];

  // Look for capitalized words that might be names
  const namePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
  const matches = text.matchAll(namePattern);

  for (const match of matches) {
    // Filter out common non-name phrases
    const value = match[0];
    if (!value.match(/^(Invoice|Receipt|Total|Date|Address|Phone|Email|Tax)/i)) {
      names.push({
        type: 'name',
        value,
        confidence: 0.6, // Lower confidence for name extraction
        position: {
          start: match.index || 0,
          end: (match.index || 0) + match[0].length
        }
      });
    }
  }

  return names;
}

/**
 * Extract addresses using simple heuristics
 */
export function extractAddresses(text: string): ExtractedEntity[] {
  const addresses: ExtractedEntity[] = [];

  // Look for patterns like street addresses
  const addressPattern = /\b\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct))\b/gi;
  const matches = text.matchAll(addressPattern);

  for (const match of matches) {
    addresses.push({
      type: 'address',
      value: match[0],
      confidence: 0.75,
      position: {
        start: match.index || 0,
        end: (match.index || 0) + match[0].length
      }
    });
  }

  return addresses;
}

/**
 * Extract all entities from text
 */
export function extractAllEntities(text: string): ExtractedData {
  return {
    dates: extractDates(text),
    amounts: extractAmounts(text),
    names: extractNames(text),
    emails: extractEmails(text),
    phones: extractPhones(text),
    addresses: extractAddresses(text),
    invoiceNumbers: extractInvoiceNumbers(text),
    taxIds: extractTaxIds(text),
    other: []
  };
}

/**
 * Extract entities using AI for better accuracy
 */
export async function extractEntitiesWithAI(
  text: string,
  aiClient: any
): Promise<ExtractedData> {
  try {
    const prompt = `Extract structured data from the following text. Identify:
- Dates
- Monetary amounts
- Names
- Email addresses
- Phone numbers
- Addresses
- Invoice/receipt numbers
- Tax IDs

Text:
${text.substring(0, 2000)}

Respond with JSON in this format:
{
  "dates": [{"value": "01/15/2024", "confidence": 0.95}],
  "amounts": [{"value": "$1,234.56", "confidence": 0.98}],
  "names": [{"value": "John Doe", "confidence": 0.85}],
  "emails": [{"value": "john@example.com", "confidence": 0.99}],
  "phones": [{"value": "555-123-4567", "confidence": 0.90}],
  "addresses": [{"value": "123 Main St", "confidence": 0.80}],
  "invoiceNumbers": [{"value": "INV-2024-001", "confidence": 0.92}],
  "taxIds": [{"value": "12-3456789", "confidence": 0.85}]
}`;

    const response = await aiClient.chat(prompt);
    const result = JSON.parse(response);

    // Convert AI response to ExtractedData format
    const convertEntities = (entities: any[], type: string): ExtractedEntity[] => {
      return entities.map(e => ({
        type,
        value: e.value,
        confidence: e.confidence
      }));
    };

    return {
      dates: convertEntities(result.dates || [], 'date'),
      amounts: convertEntities(result.amounts || [], 'amount'),
      names: convertEntities(result.names || [], 'name'),
      emails: convertEntities(result.emails || [], 'email'),
      phones: convertEntities(result.phones || [], 'phone'),
      addresses: convertEntities(result.addresses || [], 'address'),
      invoiceNumbers: convertEntities(result.invoiceNumbers || [], 'invoiceNumber'),
      taxIds: convertEntities(result.taxIds || [], 'taxId'),
      other: []
    };
  } catch (error) {
    console.error('AI entity extraction failed, falling back to pattern matching:', error);
    return extractAllEntities(text);
  }
}

