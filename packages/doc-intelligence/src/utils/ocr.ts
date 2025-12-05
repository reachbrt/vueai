import { createWorker, Worker } from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
  lines: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

export interface OCROptions {
  language?: string;
  logger?: (info: any) => void;
  errorHandler?: (error: Error) => void;
}

let workerInstance: Worker | null = null;

/**
 * Initialize Tesseract.js worker
 */
export async function initializeOCR(options: OCROptions = {}): Promise<Worker> {
  const { language = 'eng', logger } = options;

  if (workerInstance) {
    return workerInstance;
  }

  try {
    const worker = await createWorker(language, 1, {
      logger: logger || ((m) => console.log(m)),
    });

    workerInstance = worker;
    return worker;
  } catch (error) {
    console.error('Failed to initialize OCR worker:', error);
    throw error;
  }
}

/**
 * Extract text from image using OCR
 */
export async function extractTextFromImage(
  imageSource: string | File | Blob,
  options: OCROptions = {}
): Promise<OCRResult> {
  try {
    const worker = await initializeOCR(options);

    const { data } = await worker.recognize(imageSource);

    return {
      text: data.text,
      confidence: data.confidence,
      words: data.words.map((word) => ({
        text: word.text,
        confidence: word.confidence,
        bbox: word.bbox,
      })),
      lines: data.lines.map((line) => ({
        text: line.text,
        confidence: line.confidence,
        bbox: line.bbox,
      })),
    };
  } catch (error) {
    console.error('OCR extraction failed:', error);
    if (options.errorHandler) {
      options.errorHandler(error as Error);
    }
    throw error;
  }
}

/**
 * Extract text from PDF (converts pages to images first)
 */
export async function extractTextFromPDF(
  pdfFile: File,
  options: OCROptions = {}
): Promise<OCRResult[]> {
  try {
    // Import pdfjs-dist dynamically
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const results: OCRResult[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) continue;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const imageData = canvas.toDataURL('image/png');
      const result = await extractTextFromImage(imageData, options);
      results.push(result);
    }

    return results;
  } catch (error) {
    console.error('PDF OCR extraction failed:', error);
    if (options.errorHandler) {
      options.errorHandler(error as Error);
    }
    throw error;
  }
}

/**
 * Terminate OCR worker
 */
export async function terminateOCR(): Promise<void> {
  if (workerInstance) {
    await workerInstance.terminate();
    workerInstance = null;
  }
}

/**
 * Check if OCR is initialized
 */
export function isOCRInitialized(): boolean {
  return workerInstance !== null;
}

