#!/usr/bin/env node

/**
 * TEST 1: UNIT TESTS - Document Type Detection & Entity Extraction
 * Tests individual utility functions without OCR
 */

import {
  detectDocumentType,
  extractDates,
  extractAmounts,
  extractEmails,
  extractPhones,
  extractInvoiceNumbers,
  extractTaxIds,
  extractAllEntities
} from '../../packages/doc-intelligence/dist/index.mjs';

console.log('🧪 TEST 1: UNIT TESTS - Document Intelligence\n');
console.log('='.repeat(80));

let totalTests = 0;
let passedTests = 0;

function runTest(name, testFn) {
  totalTests++;
  try {
    const result = testFn();
    if (result) {
      passedTests++;
      console.log(`✅ ${name}`);
      return true;
    } else {
      console.log(`❌ ${name}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
    return false;
  }
}

// ============================================================================
// DOCUMENT TYPE DETECTION TESTS
// ============================================================================

console.log('\n📄 Document Type Detection Tests\n');

runTest('Detect Invoice Document', () => {
  const invoiceText = `
    INVOICE
    Invoice Number: INV-2024-001
    Invoice Date: 12/04/2024
    Bill To: John Doe
    Due Date: 01/04/2025
    Subtotal: $1,000.00
    Tax: $80.00
    Total Amount: $1,080.00
  `;
  const result = detectDocumentType(invoiceText);
  console.log(`   Type: ${result.type}, Confidence: ${(result.confidence * 100).toFixed(1)}%`);
  return result.type === 'invoice' && result.confidence > 0.5;
});

runTest('Detect Receipt Document', () => {
  const receiptText = `
    RECEIPT #12345
    Thank you for your purchase!
    Items: 3
    Subtotal: $45.99
    Tax: $3.68
    Total: $49.67
    Cash: $50.00
    Change: $0.33
  `;
  const result = detectDocumentType(receiptText);
  console.log(`   Type: ${result.type}, Confidence: ${(result.confidence * 100).toFixed(1)}%`);
  return result.type === 'receipt' && result.confidence > 0.3;
});

runTest('Detect Passport Document', () => {
  const passportText = `
    PASSPORT
    Passport No: P12345678
    Nationality: United States
    Date of Birth: 01/15/1990
    Place of Birth: New York, USA
    Date of Issue: 06/01/2020
    Date of Expiry: 06/01/2030
  `;
  const result = detectDocumentType(passportText);
  console.log(`   Type: ${result.type}, Confidence: ${(result.confidence * 100).toFixed(1)}%`);
  return result.type === 'passport' && result.confidence > 0.5;
});

runTest('Detect Business Card', () => {
  const businessCardText = `
    John Smith
    CEO & Founder
    Tech Solutions Inc.
    Tel: 555-123-4567
    Mobile: 555-987-6543
    Email: john@techsolutions.com
    www.techsolutions.com
  `;
  const result = detectDocumentType(businessCardText);
  console.log(`   Type: ${result.type}, Confidence: ${(result.confidence * 100).toFixed(1)}%`);
  return result.type === 'business_card' && result.confidence > 0.2;
});

// ============================================================================
// ENTITY EXTRACTION TESTS
// ============================================================================

console.log('\n🎯 Entity Extraction Tests\n');

runTest('Extract Dates', () => {
  const text = 'Invoice Date: 12/04/2024, Due Date: 01/15/2025, Issued on Jan 1, 2024';
  const dates = extractDates(text);
  console.log(`   Found ${dates.length} dates: ${dates.map(d => d.value).join(', ')}`);
  return dates.length >= 3;
});

runTest('Extract Monetary Amounts', () => {
  const text = 'Subtotal: $1,234.56, Tax: $98.77, Total: $1,333.33, Balance: 500.00 USD';
  const amounts = extractAmounts(text);
  console.log(`   Found ${amounts.length} amounts: ${amounts.map(a => a.value).join(', ')}`);
  return amounts.length >= 3;
});

runTest('Extract Email Addresses', () => {
  const text = 'Contact: john@example.com, support@company.org, info@test.co.uk';
  const emails = extractEmails(text);
  console.log(`   Found ${emails.length} emails: ${emails.map(e => e.value).join(', ')}`);
  return emails.length === 3;
});

runTest('Extract Phone Numbers', () => {
  const text = 'Phone: 555-123-4567, Mobile: (555) 987-6543, Fax: 555.111.2222';
  const phones = extractPhones(text);
  console.log(`   Found ${phones.length} phones: ${phones.map(p => p.value).join(', ')}`);
  return phones.length >= 2;
});

runTest('Extract Invoice Numbers', () => {
  const text = 'Invoice #INV-2024-001, Bill #12345, Reference: ABC1234';
  const invoiceNumbers = extractInvoiceNumbers(text);
  console.log(`   Found ${invoiceNumbers.length} invoice numbers: ${invoiceNumbers.map(i => i.value).join(', ')}`);
  return invoiceNumbers.length >= 2;
});

runTest('Extract Tax IDs', () => {
  const text = 'EIN: 12-3456789, SSN: 123-45-6789';
  const taxIds = extractTaxIds(text);
  console.log(`   Found ${taxIds.length} tax IDs: ${taxIds.map(t => t.value).join(', ')}`);
  return taxIds.length >= 2;
});

runTest('Extract All Entities from Invoice', () => {
  const invoiceText = `
    INVOICE #INV-2024-001
    Date: 12/04/2024
    Bill To: Acme Corp
    Email: billing@acme.com
    Phone: 555-123-4567
    Tax ID: 12-3456789
    
    Amount Due: $1,234.56
    Due Date: 01/15/2025
  `;
  const entities = extractAllEntities(invoiceText);
  console.log(`   Dates: ${entities.dates.length}, Amounts: ${entities.amounts.length}`);
  console.log(`   Emails: ${entities.emails.length}, Phones: ${entities.phones.length}`);
  console.log(`   Invoice Numbers: ${entities.invoiceNumbers.length}, Tax IDs: ${entities.taxIds.length}`);
  
  return entities.dates.length >= 2 &&
         entities.amounts.length >= 1 &&
         entities.emails.length >= 1 &&
         entities.phones.length >= 1 &&
         entities.invoiceNumbers.length >= 1 &&
         entities.taxIds.length >= 1;
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
  console.log('🎉 ALL UNIT TESTS PASSED!\n');
  process.exit(0);
} else {
  console.log('⚠️  SOME TESTS FAILED\n');
  process.exit(1);
}

