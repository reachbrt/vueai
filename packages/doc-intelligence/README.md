# @aivue/doc-intelligence

> AI-powered document parser and extractor for Vue 3 - Upload PDFs/images, extract structured data from invoices, receipts, forms, and IDs with OCR and entity recognition

[![npm version](https://img.shields.io/npm/v/@aivue/doc-intelligence.svg)](https://www.npmjs.com/package/@aivue/doc-intelligence)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/doc-intelligence.svg)](https://www.npmjs.com/package/@aivue/doc-intelligence)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 📄 Multi-Format Document Support
- **PDF Processing** - Extract text from PDF documents
- **Image Processing** - Support for PNG, JPG, JPEG, and more
- **Drag & Drop Upload** - Intuitive file upload interface
- **Multi-File Processing** - Process multiple documents simultaneously

### 🔍 Intelligent Document Understanding
- **Document Type Detection** - Automatically identifies invoices, receipts, forms, IDs, passports, driver licenses, business cards, and contracts
- **AI-Powered Classification** - Optional AI enhancement for better accuracy
- **Pattern Matching** - Fast, offline document type detection

### 🤖 OCR & Text Extraction
- **Offline OCR** - Uses Tesseract.js for privacy-first text extraction
- **Multi-Language Support** - Process documents in 100+ languages
- **High Accuracy** - Advanced OCR with confidence scores
- **PDF Text Extraction** - Native PDF text extraction with fallback to OCR

### 🎯 Entity Recognition
- **Dates** - Extracts dates in various formats
- **Monetary Amounts** - Identifies currency values
- **Names** - Detects person and company names
- **Email Addresses** - Finds email contacts
- **Phone Numbers** - Extracts phone numbers in multiple formats
- **Addresses** - Identifies street addresses
- **Invoice Numbers** - Detects invoice/receipt numbers
- **Tax IDs** - Finds tax identification numbers

### 📝 Auto-Generated Forms
- **Smart Form Generation** - Automatically creates Vue forms from extracted data
- **Editable Fields** - Review and edit extracted information
- **Confidence Indicators** - Shows extraction confidence for each field
- **Validation** - Built-in form validation

### 🎨 Beautiful UI Components
- **DocumentUpload** - Drag-and-drop file upload with preview
- **DocumentViewer** - Display documents with extracted data overlay
- **ExtractedDataForm** - Auto-generated forms from document data

### 🔒 Privacy-First
- **Local Processing** - All OCR happens in the browser
- **No Server Required** - Works completely offline
- **Data Security** - Your documents never leave your device

## 📦 Installation

```bash
npm install @aivue/doc-intelligence
```

## 🚀 Quick Start

### Basic Usage

```vue
<template>
  <div>
    <DocumentUpload
      @files-selected="handleFilesSelected"
      :multiple="true"
      :max-file-size="10"
    />

    <DocumentViewer
      v-if="currentDocument"
      :document-url="currentDocument.url"
      :document-name="currentDocument.file.name"
      :document-type="currentDocument.documentType"
      :extracted-data="currentDocument.extractedData"
    />

    <ExtractedDataForm
      v-if="currentDocument?.extractedData"
      :extracted-data="currentDocument.extractedData"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup>
import { DocumentUpload, DocumentViewer, ExtractedDataForm, useDocIntelligence } from '@aivue/doc-intelligence';
import '@aivue/doc-intelligence/style.css';

const { documents, addDocuments, processDocument, currentDocument } = useDocIntelligence({
  autoProcess: true,
  ocrLanguage: 'eng'
});

const handleFilesSelected = async (files) => {
  const newDocs = await addDocuments(files);
  if (newDocs.length > 0) {
    await processDocument(newDocs[0].id);
  }
};

const handleFormSubmit = (data) => {
  console.log('Form submitted:', data);
};
</script>
```

### With AI Enhancement

```vue
<script setup>
import { useDocIntelligence } from '@aivue/doc-intelligence';
import { createAIClient } from '@aivue/core';

const aiClient = createAIClient({
  provider: 'openai',
  apiKey: 'your-api-key'
});

const { addDocuments, processDocument } = useDocIntelligence({
  useAI: true,
  aiClient,
  autoProcess: true
});
</script>
```

## 📚 Components

### DocumentUpload

Upload component with drag-and-drop support.

**Props:**
- `title` (String) - Upload area title
- `description` (String) - Upload area description
- `acceptedTypes` (String) - Accepted file MIME types
- `acceptedFormats` (String) - Display text for accepted formats
- `multiple` (Boolean) - Allow multiple file selection
- `maxFileSize` (Number) - Maximum file size in MB
- `maxFiles` (Number) - Maximum number of files
- `showProgress` (Boolean) - Show upload progress bar

**Events:**
- `files-selected` - Emitted when files are selected
- `file-removed` - Emitted when a file is removed
- `error` - Emitted on validation errors

### DocumentViewer

Display documents with extracted data overlay.

**Props:**
- `documentUrl` (String) - Document URL or data URL
- `documentName` (String) - Document filename
- `documentType` (Object) - Detected document type
- `extractedData` (Object) - Extracted entities
- `showExtractedData` (Boolean) - Show data panel

### ExtractedDataForm

Auto-generated form from extracted data.

**Props:**
- `title` (String) - Form title
- `description` (String) - Form description
- `fields` (Array) - Custom form fields
- `extractedData` (Object) - Extracted data to generate form from
- `autoGenerateFields` (Boolean) - Auto-generate fields from data
- `submitButtonText` (String) - Submit button text

**Events:**
- `submit` - Emitted on form submission
- `reset` - Emitted on form reset
- `field-change` - Emitted when field value changes

## 🎯 Composable API

### useDocIntelligence

Main composable for document processing.

```typescript
const {
  documents,
  isProcessing,
  currentDocument,
  totalDocuments,
  completedDocuments,
  failedDocuments,
  addDocuments,
  processDocument,
  processAllDocuments,
  removeDocument,
  clearAllDocuments,
  getDocument,
  cleanup
} = useDocIntelligence(options);
```

**Options:**
- `useAI` (Boolean) - Use AI for enhanced accuracy
- `aiClient` (Object) - AI client instance
- `ocrLanguage` (String) - OCR language code (default: 'eng')
- `autoProcess` (Boolean) - Auto-process documents on upload

## 🔧 Utility Functions

### OCR Functions

```typescript
import { extractTextFromImage, extractTextFromPDF, initializeOCR } from '@aivue/doc-intelligence';

// Extract text from image
const result = await extractTextFromImage(imageFile);

// Extract text from PDF
const results = await extractTextFromPDF(pdfFile);
```

### Document Type Detection

```typescript
import { detectDocumentType, detectDocumentTypeWithAI } from '@aivue/doc-intelligence';

// Pattern-based detection
const type = detectDocumentType(text);

// AI-enhanced detection
const type = await detectDocumentTypeWithAI(text, aiClient);
```

### Entity Extraction

```typescript
import { extractAllEntities, extractEntitiesWithAI } from '@aivue/doc-intelligence';

// Pattern-based extraction
const entities = extractAllEntities(text);

// AI-enhanced extraction
const entities = await extractEntitiesWithAI(text, aiClient);
```

## 📖 Examples

Check out the [demo](https://aivue.netlify.app/) for live examples.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📦 Related Packages

Explore the complete @aivue ecosystem:

### 🧠 [@aivue/core](https://www.npmjs.com/package/@aivue/core)
Core AI functionality for Vue.js components

### 💬 [@aivue/chatbot](https://www.npmjs.com/package/@aivue/chatbot)
AI-powered chat components for Vue.js

### ✨ [@aivue/autosuggest](https://www.npmjs.com/package/@aivue/autosuggest)
AI-powered suggestion components for Vue.js

### 📝 [@aivue/smartform](https://www.npmjs.com/package/@aivue/smartform)
AI-powered form validation for Vue.js

### 🎭 [@aivue/emotion-ui](https://www.npmjs.com/package/@aivue/emotion-ui)
Emotion-aware UI components with sentiment analysis

### 🧠 [@aivue/predictive-input](https://www.npmjs.com/package/@aivue/predictive-input)
AI-powered predictive text input

### 🔔 [@aivue/smart-notify](https://www.npmjs.com/package/@aivue/smart-notify)
Intelligent notification system

### 🎤 [@aivue/voice-actions](https://www.npmjs.com/package/@aivue/voice-actions)
Voice command integration

### 📋 [@aivue/smart-datatable](https://www.npmjs.com/package/@aivue/smart-datatable)
Advanced data table components

### 🖼️ [@aivue/image-caption](https://www.npmjs.com/package/@aivue/image-caption)
AI-powered image captioning with OpenAI Vision models

### 📊 [@aivue/analytics](https://www.npmjs.com/package/@aivue/analytics)
AI-powered analytics and insights

## 📄 License

MIT © [reachbrt](https://github.com/reachbrt)

## 🔗 Links

- [Documentation](https://github.com/reachbrt/vueai#readme)
- [Demo](https://aivue.netlify.app/)
- [GitHub](https://github.com/reachbrt/vueai)
- [npm](https://www.npmjs.com/package/@aivue/doc-intelligence)

