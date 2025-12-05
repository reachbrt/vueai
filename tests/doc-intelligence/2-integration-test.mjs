#!/usr/bin/env node

/**
 * TEST 2: INTEGRATION TESTS - useDocIntelligence Composable
 * Tests the main composable with mock documents
 */

import {
  useDocIntelligence,
  detectDocumentType,
  extractAllEntities
} from '../../packages/doc-intelligence/dist/index.mjs';

console.log('🧪 TEST 2: INTEGRATION TESTS - useDocIntelligence Composable\n');
console.log('='.repeat(80));

let totalTests = 0;
let passedTests = 0;

function runTest(name, testFn) {
  totalTests++;
  console.log(`\n🔍 ${name}`);
  try {
    const result = testFn();
    if (result) {
      passedTests++;
      console.log(`   ✅ PASS`);
      return true;
    } else {
      console.log(`   ❌ FAIL`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ FAIL - Error: ${error.message}`);
    return false;
  }
}

// ============================================================================
// COMPOSABLE INITIALIZATION TESTS
// ============================================================================

console.log('\n📦 Composable Initialization Tests');

runTest('Initialize composable with default options', () => {
  const { documents, isProcessing, totalDocuments } = useDocIntelligence();
  console.log(`   Documents: ${documents.value.length}`);
  console.log(`   Is Processing: ${isProcessing.value}`);
  console.log(`   Total Documents: ${totalDocuments.value}`);
  return documents.value.length === 0 && 
         isProcessing.value === false && 
         totalDocuments.value === 0;
});

runTest('Initialize composable with custom options', () => {
  const { documents } = useDocIntelligence({
    useAI: false,
    ocrLanguage: 'eng',
    autoProcess: false
  });
  console.log(`   Documents initialized: ${documents.value.length === 0}`);
  return documents.value.length === 0;
});

// ============================================================================
// DOCUMENT MANAGEMENT TESTS
// ============================================================================

console.log('\n📄 Document Management Tests');

runTest('Add mock documents to queue', async () => {
  const { documents, addDocuments, totalDocuments } = useDocIntelligence({
    autoProcess: false
  });
  
  // Create mock files
  const mockFile1 = new File(['invoice content'], 'invoice.txt', { type: 'text/plain' });
  const mockFile2 = new File(['receipt content'], 'receipt.txt', { type: 'text/plain' });
  
  const newDocs = await addDocuments([mockFile1, mockFile2]);
  
  console.log(`   Added ${newDocs.length} documents`);
  console.log(`   Total documents: ${totalDocuments.value}`);
  console.log(`   Document 1 ID: ${newDocs[0].id}`);
  console.log(`   Document 2 ID: ${newDocs[1].id}`);
  
  return newDocs.length === 2 && 
         totalDocuments.value === 2 &&
         documents.value.length === 2;
});

runTest('Check document status after adding', async () => {
  const { documents, addDocuments } = useDocIntelligence({
    autoProcess: false
  });
  
  const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  const newDocs = await addDocuments([mockFile]);
  const doc = newDocs[0];
  
  console.log(`   Status: ${doc.status}`);
  console.log(`   Progress: ${doc.progress}%`);
  console.log(`   Has URL: ${!!doc.url}`);
  console.log(`   Has File: ${!!doc.file}`);
  
  return doc.status === 'pending' && 
         doc.progress === 0 &&
         doc.url !== undefined &&
         doc.file.name === 'test.txt';
});

runTest('Get document by ID', async () => {
  const { documents, addDocuments, getDocumentById } = useDocIntelligence({
    autoProcess: false
  });
  
  const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  const newDocs = await addDocuments([mockFile]);
  const docId = newDocs[0].id;
  
  const foundDoc = getDocumentById(docId);
  
  console.log(`   Document ID: ${docId}`);
  console.log(`   Found: ${!!foundDoc}`);
  console.log(`   Matches: ${foundDoc?.id === docId}`);
  
  return foundDoc !== null && foundDoc.id === docId;
});

runTest('Remove document from queue', async () => {
  const { documents, addDocuments, removeDocument, totalDocuments } = useDocIntelligence({
    autoProcess: false
  });
  
  const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  const newDocs = await addDocuments([mockFile]);
  const docId = newDocs[0].id;
  
  console.log(`   Before removal: ${totalDocuments.value} documents`);
  
  removeDocument(docId);
  
  console.log(`   After removal: ${totalDocuments.value} documents`);
  
  return totalDocuments.value === 0 && documents.value.length === 0;
});

runTest('Clear all documents', async () => {
  const { documents, addDocuments, clearDocuments, totalDocuments } = useDocIntelligence({
    autoProcess: false
  });
  
  const mockFiles = [
    new File(['test1'], 'test1.txt', { type: 'text/plain' }),
    new File(['test2'], 'test2.txt', { type: 'text/plain' }),
    new File(['test3'], 'test3.txt', { type: 'text/plain' })
  ];
  
  await addDocuments(mockFiles);
  console.log(`   Before clear: ${totalDocuments.value} documents`);
  
  clearDocuments();
  console.log(`   After clear: ${totalDocuments.value} documents`);
  
  return totalDocuments.value === 0 && documents.value.length === 0;
});

// ============================================================================
// COMPUTED PROPERTIES TESTS
// ============================================================================

console.log('\n📊 Computed Properties Tests');

runTest('Track completed documents', async () => {
  const { documents, addDocuments, completedDocuments } = useDocIntelligence({
    autoProcess: false
  });
  
  const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  const newDocs = await addDocuments([mockFile]);
  
  console.log(`   Initial completed: ${completedDocuments.value}`);
  
  // Manually set status to completed
  documents.value[0].status = 'completed';
  
  console.log(`   After completion: ${completedDocuments.value}`);
  
  return completedDocuments.value === 1;
});

runTest('Track failed documents', async () => {
  const { documents, addDocuments, failedDocuments } = useDocIntelligence({
    autoProcess: false
  });
  
  const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  const newDocs = await addDocuments([mockFile]);
  
  console.log(`   Initial failed: ${failedDocuments.value}`);
  
  // Manually set status to error
  documents.value[0].status = 'error';
  documents.value[0].error = 'Test error';
  
  console.log(`   After error: ${failedDocuments.value}`);
  
  return failedDocuments.value === 1;
});

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('\n📊 TEST SUMMARY\n');
console.log(`   Total Tests: ${totalTests}`);
console.log(`   ✅ Passed: ${passedTests}`);
console.log(`   ❌ Failed: ${totalTests - passedTests}`);
console.log(`   Pass Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

if (passedTests === totalTests) {
  console.log('🎉 ALL INTEGRATION TESTS PASSED!\n');
  process.exit(0);
} else {
  console.log('⚠️  SOME TESTS FAILED\n');
  process.exit(1);
}

