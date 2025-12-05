export type DocumentType = 
  | 'invoice' 
  | 'receipt' 
  | 'form' 
  | 'id' 
  | 'passport'
  | 'driver_license'
  | 'business_card'
  | 'contract'
  | 'unknown';

export interface DocumentTypeResult {
  type: DocumentType;
  confidence: number;
  indicators: string[];
}

// Keywords and patterns for each document type
const DOCUMENT_PATTERNS = {
  invoice: {
    keywords: ['invoice', 'bill to', 'invoice number', 'invoice date', 'due date', 'subtotal', 'tax', 'total amount', 'payment terms', 'remit to'],
    patterns: [/invoice\s*#?\s*\d+/i, /bill\s*to/i, /due\s*date/i, /payment\s*terms/i],
    weight: 1.0
  },
  receipt: {
    keywords: ['receipt', 'thank you', 'total', 'cash', 'credit', 'change', 'items', 'qty', 'price', 'subtotal'],
    patterns: [/receipt\s*#?\s*\d+/i, /thank\s*you/i, /total\s*\$?\d+/i],
    weight: 0.9
  },
  form: {
    keywords: ['application', 'form', 'please fill', 'signature', 'date', 'name', 'address', 'phone', 'email'],
    patterns: [/application\s*form/i, /please\s*fill/i, /signature/i],
    weight: 0.8
  },
  id: {
    keywords: ['identification', 'id card', 'date of birth', 'dob', 'issued', 'expires', 'id number'],
    patterns: [/id\s*card/i, /date\s*of\s*birth/i, /expires/i],
    weight: 1.0
  },
  passport: {
    keywords: ['passport', 'nationality', 'date of birth', 'place of birth', 'date of issue', 'date of expiry', 'passport no'],
    patterns: [/passport/i, /nationality/i, /place\s*of\s*birth/i],
    weight: 1.0
  },
  driver_license: {
    keywords: ['driver license', 'drivers license', 'dl', 'class', 'restrictions', 'endorsements', 'expires'],
    patterns: [/driver'?s?\s*license/i, /dl\s*#/i, /class\s*[a-z]/i],
    weight: 1.0
  },
  business_card: {
    keywords: ['tel', 'fax', 'mobile', 'email', 'website', 'www', 'phone', 'cell'],
    patterns: [/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/i, /www\./i, /@[\w.-]+\.\w+/i],
    weight: 0.7
  },
  contract: {
    keywords: ['agreement', 'contract', 'party', 'whereas', 'hereby', 'terms and conditions', 'effective date'],
    patterns: [/agreement/i, /whereas/i, /hereby/i, /terms\s*and\s*conditions/i],
    weight: 0.9
  }
};

/**
 * Detect document type from extracted text using pattern matching
 */
export function detectDocumentType(text: string): DocumentTypeResult {
  const normalizedText = text.toLowerCase();
  const scores: Record<DocumentType, number> = {
    invoice: 0,
    receipt: 0,
    form: 0,
    id: 0,
    passport: 0,
    driver_license: 0,
    business_card: 0,
    contract: 0,
    unknown: 0
  };

  const indicators: Record<DocumentType, string[]> = {
    invoice: [],
    receipt: [],
    form: [],
    id: [],
    passport: [],
    driver_license: [],
    business_card: [],
    contract: [],
    unknown: []
  };

  // Check each document type
  for (const [docType, config] of Object.entries(DOCUMENT_PATTERNS)) {
    const type = docType as Exclude<DocumentType, 'unknown'>;
    
    // Check keywords
    for (const keyword of config.keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        scores[type] += config.weight;
        indicators[type].push(keyword);
      }
    }

    // Check patterns
    for (const pattern of config.patterns) {
      if (pattern.test(text)) {
        scores[type] += config.weight * 1.5; // Patterns have higher weight
        indicators[type].push(`Pattern: ${pattern.source}`);
      }
    }
  }

  // Find the type with highest score
  let maxScore = 0;
  let detectedType: DocumentType = 'unknown';

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedType = type as DocumentType;
    }
  }

  // Calculate confidence (normalize to 0-1)
  const maxPossibleScore = 20; // Approximate max score
  const confidence = Math.min(maxScore / maxPossibleScore, 1.0);

  // If confidence is too low, mark as unknown
  if (confidence < 0.2) {
    detectedType = 'unknown';
  }

  return {
    type: detectedType,
    confidence,
    indicators: indicators[detectedType]
  };
}

/**
 * Detect document type using AI (requires AI client)
 */
export async function detectDocumentTypeWithAI(
  text: string,
  aiClient: any
): Promise<DocumentTypeResult> {
  try {
    const prompt = `Analyze the following text and determine what type of document it is.
Possible types: invoice, receipt, form, id, passport, driver_license, business_card, contract, unknown.

Text:
${text.substring(0, 1000)}

Respond with JSON in this format:
{
  "type": "document_type",
  "confidence": 0.95,
  "indicators": ["reason1", "reason2"]
}`;

    const response = await aiClient.chat(prompt);
    const result = JSON.parse(response);

    return {
      type: result.type as DocumentType,
      confidence: result.confidence,
      indicators: result.indicators
    };
  } catch (error) {
    console.error('AI document type detection failed, falling back to pattern matching:', error);
    return detectDocumentType(text);
  }
}

