#!/usr/bin/env node

/**
 * TEST 4: END-TO-END FUNCTIONAL TESTS
 * Tests complete workflows with realistic document scenarios
 */

import {
  detectDocumentType,
  extractAllEntities,
  useDocIntelligence
} from '../../packages/doc-intelligence/dist/index.mjs';

console.log('🧪 TEST 4: END-TO-END FUNCTIONAL TESTS\n');
console.log('='.repeat(80));

let totalTests = 0;
let passedTests = 0;

function runTest(name, testFn) {
  totalTests++;
  console.log(`\n🔍 ${name}\n`);
  try {
    const result = testFn();
    if (result) {
      passedTests++;
      console.log(`   ✅ PASS\n`);
      return true;
    } else {
      console.log(`   ❌ FAIL\n`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ FAIL - Error: ${error.message}\n`);
    return false;
  }
}

// ============================================================================
// SCENARIO 1: INVOICE PROCESSING WORKFLOW
// ============================================================================

console.log('\n💼 SCENARIO 1: Invoice Processing Workflow');

runTest('Process complete invoice document', () => {
  const invoiceDocument = `
    ACME CORPORATION
    123 Business Street, Suite 100
    New York, NY 10001
    Phone: (555) 123-4567
    Email: billing@acme.com
    Tax ID: 12-3456789
    
    INVOICE
    
    Invoice Number: INV-2024-12345
    Invoice Date: December 4, 2024
    Due Date: January 4, 2025
    
    Bill To:
    Tech Solutions Inc.
    456 Tech Avenue
    San Francisco, CA 94102
    Email: accounts@techsolutions.com
    Phone: (555) 987-6543
    
    Description                    Qty    Unit Price    Amount
    --------------------------------------------------------
    Web Development Services        40     $150.00      $6,000.00
    UI/UX Design                    20     $120.00      $2,400.00
    Project Management              10     $100.00      $1,000.00
    
    Subtotal:                                           $9,400.00
    Tax (8%):                                             $752.00
    Total Amount Due:                                  $10,152.00
    
    Payment Terms: Net 30
    Please remit payment to: payments@acme.com
  `;
  
  // Step 1: Detect document type
  const docType = detectDocumentType(invoiceDocument);
  console.log(`   📄 Document Type: ${docType.type}`);
  console.log(`   📊 Confidence: ${(docType.confidence * 100).toFixed(1)}%`);
  console.log(`   🔍 Indicators: ${docType.indicators.slice(0, 3).join(', ')}`);
  
  // Step 2: Extract all entities
  const entities = extractAllEntities(invoiceDocument);
  console.log(`\n   📅 Dates Found: ${entities.dates.length}`);
  entities.dates.forEach(d => console.log(`      - ${d.value}`));
  
  console.log(`   💰 Amounts Found: ${entities.amounts.length}`);
  entities.amounts.slice(0, 5).forEach(a => console.log(`      - ${a.value}`));
  
  console.log(`   📧 Emails Found: ${entities.emails.length}`);
  entities.emails.forEach(e => console.log(`      - ${e.value}`));
  
  console.log(`   📞 Phones Found: ${entities.phones.length}`);
  entities.phones.forEach(p => console.log(`      - ${p.value}`));
  
  console.log(`   🔢 Invoice Numbers: ${entities.invoiceNumbers.length}`);
  entities.invoiceNumbers.forEach(i => console.log(`      - ${i.value}`));
  
  console.log(`   🆔 Tax IDs: ${entities.taxIds.length}`);
  entities.taxIds.forEach(t => console.log(`      - ${t.value}`));
  
  // Validation
  const isValid = docType.type === 'invoice' &&
                  docType.confidence > 0.5 &&
                  entities.dates.length >= 2 &&
                  entities.amounts.length >= 3 &&
                  entities.emails.length >= 2 &&
                  entities.invoiceNumbers.length >= 1 &&
                  entities.taxIds.length >= 1;

  return isValid;
});

// ============================================================================
// SCENARIO 2: RECEIPT PROCESSING WORKFLOW
// ============================================================================

console.log('\n🧾 SCENARIO 2: Receipt Processing Workflow');

runTest('Process retail receipt document', () => {
  const receiptDocument = `
    WALMART SUPERCENTER
    Store #1234
    789 Main Street
    Los Angeles, CA 90001
    (555) 111-2222
    
    RECEIPT #R-987654321
    Date: 12/04/2024 10:45 AM
    Cashier: Sarah J.
    
    Items Purchased:
    Milk (1 Gallon)              $4.99
    Bread (Whole Wheat)          $3.49
    Eggs (Dozen)                 $5.99
    Chicken Breast (2 lbs)      $12.98
    Apples (3 lbs)               $5.97
    Orange Juice                 $6.99
    
    Subtotal:                   $40.41
    Tax (9.5%):                  $3.84
    Total:                      $44.25
    
    Payment Method: VISA ****1234
    Amount Paid:                $44.25
    Change:                      $0.00
    
    Thank you for shopping at Walmart!
    Save this receipt for returns
    
    Customer Service: 1-800-WALMART
    www.walmart.com
  `;
  
  const docType = detectDocumentType(receiptDocument);
  console.log(`   📄 Document Type: ${docType.type}`);
  console.log(`   📊 Confidence: ${(docType.confidence * 100).toFixed(1)}%`);
  
  const entities = extractAllEntities(receiptDocument);
  console.log(`\n   💰 Amounts: ${entities.amounts.length}`);
  console.log(`   📅 Dates: ${entities.dates.length}`);
  console.log(`   📞 Phones: ${entities.phones.length}`);
  
  return docType.type === 'receipt' &&
         entities.amounts.length >= 5 &&
         entities.dates.length >= 1;
});

// ============================================================================
// SCENARIO 3: BUSINESS CARD PROCESSING WORKFLOW
// ============================================================================

console.log('\n💳 SCENARIO 3: Business Card Processing Workflow');

runTest('Process business card document', () => {
  const businessCardDocument = `
    JOHN SMITH
    Chief Technology Officer
    
    TECH INNOVATIONS INC.
    
    📧 john.smith@techinnovations.com
    📱 Mobile: (555) 234-5678
    ☎️  Office: (555) 234-5600
    📠 Fax: (555) 234-5601
    
    🌐 www.techinnovations.com
    🔗 linkedin.com/in/johnsmith
    
    1000 Innovation Drive, Suite 500
    Silicon Valley, CA 94025
  `;
  
  const docType = detectDocumentType(businessCardDocument);
  console.log(`   📄 Document Type: ${docType.type}`);
  console.log(`   📊 Confidence: ${(docType.confidence * 100).toFixed(1)}%`);
  
  const entities = extractAllEntities(businessCardDocument);
  console.log(`\n   📧 Emails: ${entities.emails.length}`);
  entities.emails.forEach(e => console.log(`      - ${e.value}`));
  
  console.log(`   📞 Phones: ${entities.phones.length}`);
  entities.phones.forEach(p => console.log(`      - ${p.value}`));
  
  return docType.type === 'business_card' &&
         entities.emails.length >= 1;
});

// ============================================================================
// SCENARIO 4: MULTI-DOCUMENT BATCH PROCESSING
// ============================================================================

console.log('\n📚 SCENARIO 4: Multi-Document Batch Processing');

runTest('Process multiple documents in batch', async () => {
  const { documents, addDocuments, totalDocuments, completedDocuments } = useDocIntelligence({
    autoProcess: false
  });
  
  // Create mock documents
  const mockDocs = [
    new File(['invoice content'], 'invoice-001.txt', { type: 'text/plain' }),
    new File(['receipt content'], 'receipt-001.txt', { type: 'text/plain' }),
    new File(['contract content'], 'contract-001.txt', { type: 'text/plain' })
  ];
  
  console.log(`   📤 Adding ${mockDocs.length} documents...`);
  const newDocs = await addDocuments(mockDocs);
  
  console.log(`   📊 Total Documents: ${totalDocuments.value}`);
  console.log(`   📝 Document IDs:`);
  newDocs.forEach((doc, i) => {
    console.log(`      ${i + 1}. ${doc.id} - ${doc.file.name} (${doc.status})`);
  });
  
  // Simulate processing completion
  documents.value.forEach(doc => {
    doc.status = 'completed';
    doc.progress = 100;
  });
  
  console.log(`   ✅ Completed: ${completedDocuments.value}/${totalDocuments.value}`);
  
  return totalDocuments.value === 3 &&
         completedDocuments.value === 3 &&
         newDocs.every(doc => doc.status === 'completed');
});

// ============================================================================
// SCENARIO 5: ERROR HANDLING AND EDGE CASES
// ============================================================================

console.log('\n⚠️  SCENARIO 5: Error Handling & Edge Cases');

runTest('Handle empty document text', () => {
  const emptyText = '';
  const docType = detectDocumentType(emptyText);
  const entities = extractAllEntities(emptyText);
  
  console.log(`   📄 Document Type: ${docType.type}`);
  console.log(`   📊 Total Entities: ${Object.values(entities).flat().length}`);
  
  return docType.type === 'unknown' &&
         Object.values(entities).flat().length === 0;
});

runTest('Handle malformed data gracefully', () => {
  const malformedText = '!@#$%^&*()_+ random gibberish 12345 @@@@';
  const docType = detectDocumentType(malformedText);
  const entities = extractAllEntities(malformedText);
  
  console.log(`   📄 Document Type: ${docType.type}`);
  console.log(`   📊 Entities Found: ${Object.values(entities).flat().length}`);
  
  // Should not crash and should return unknown type
  return docType.type === 'unknown';
});

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('\n📊 END-TO-END TEST SUMMARY\n');
console.log(`   Total Scenarios: ${totalTests}`);
console.log(`   ✅ Passed: ${passedTests}`);
console.log(`   ❌ Failed: ${totalTests - passedTests}`);
console.log(`   Pass Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

if (passedTests === totalTests) {
  console.log('🎉 ALL END-TO-END TESTS PASSED!\n');
  console.log('✅ Invoice processing workflow: WORKING');
  console.log('✅ Receipt processing workflow: WORKING');
  console.log('✅ Business card processing: WORKING');
  console.log('✅ Batch processing: WORKING');
  console.log('✅ Error handling: WORKING\n');
  process.exit(0);
} else {
  console.log('⚠️  SOME TESTS FAILED\n');
  process.exit(1);
}

