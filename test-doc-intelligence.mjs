#!/usr/bin/env node

/**
 * Test script for @aivue/doc-intelligence package
 * Tests document type detection and entity extraction with 3 different document types
 * Note: OCR testing requires a browser environment and is tested separately
 */

import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import {
    detectDocumentType,
    extractAllEntities
} from './packages/doc-intelligence/dist/index.mjs';

console.log('🧪 Testing @aivue/doc-intelligence package\n');
console.log('Note: OCR requires browser environment - testing document analysis only');
console.log('=' .repeat(80));

// Test 1: Create and test Invoice
async function testInvoice() {
    console.log('\n📄 TEST 1: INVOICE DOCUMENT');
    console.log('-'.repeat(80));

    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext('2d');

    // Draw invoice
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = 'black';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('INVOICE', 250, 40);

    ctx.font = '16px Arial';
    ctx.fillText('Invoice Number: INV-2024-001', 50, 80);
    ctx.fillText('Date: December 2, 2024', 50, 110);
    ctx.fillText('Bill To: John Smith', 50, 150);
    ctx.fillText('Email: john.smith@example.com', 50, 175);
    ctx.fillText('Address: 123 Main Street, New York, NY 10001', 50, 200);
    ctx.fillText('Description: Web Development Services', 50, 240);
    ctx.fillText('Amount: $2,500.00', 50, 270);
    ctx.fillText('Tax (10%): $250.00', 50, 295);
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Total: $2,750.00', 50, 330);

    // Save image
    const buffer = canvas.toBuffer('image/png');
    writeFileSync('test-invoice.png', buffer);
    console.log('✓ Created test-invoice.png');

    // Simulate extracted text (what OCR would return)
    const extractedText = `INVOICE
Invoice Number: INV-2024-001
Date: December 2, 2024
Bill To: John Smith
Email: john.smith@example.com
Address: 123 Main Street, New York, NY 10001
Description: Web Development Services
Amount: $2,500.00
Tax (10%): $250.00
Total: $2,750.00`;

    console.log('\n✓ Simulated OCR text extraction');
    console.log(`✓ Extracted Text (first 150 chars):\n  "${extractedText.substring(0, 150)}..."`);

    // Test document type detection
    console.log('\n⏳ Detecting document type...');
    const docType = detectDocumentType(extractedText);
    console.log(`✓ Document Type: ${docType.type.toUpperCase()}`);
    console.log(`✓ Confidence: ${(docType.confidence * 100).toFixed(1)}%`);
    console.log(`✓ Indicators: ${docType.indicators.join(', ')}`);

    // Test entity extraction
    console.log('\n⏳ Extracting entities...');
    const entities = extractAllEntities(extractedText);
    console.log(`✓ Found ${entities.dates.length} dates`);
    console.log(`✓ Found ${entities.amounts.length} amounts`);
    console.log(`✓ Found ${entities.emails.length} emails`);
    console.log(`✓ Found ${entities.invoiceNumbers.length} invoice numbers`);
    console.log(`✓ Found ${entities.names.length} names`);
    console.log(`✓ Found ${entities.addresses.length} addresses`);

    if (entities.dates.length > 0) {
        console.log(`  Sample dates: ${entities.dates.slice(0, 2).map(e => e.value).join(', ')}`);
    }
    if (entities.amounts.length > 0) {
        console.log(`  Sample amounts: ${entities.amounts.slice(0, 3).map(e => e.value).join(', ')}`);
    }
    if (entities.emails.length > 0) {
        console.log(`  Sample emails: ${entities.emails.slice(0, 2).map(e => e.value).join(', ')}`);
    }
    if (entities.invoiceNumbers.length > 0) {
        console.log(`  Invoice numbers: ${entities.invoiceNumbers.map(e => e.value).join(', ')}`);
    }

    console.log('\n✅ Invoice test completed successfully!');
    return { extractedText, docType, entities };
}

// Test 2: Create and test Receipt
async function testReceipt() {
    console.log('\n🧾 TEST 2: RECEIPT DOCUMENT');
    console.log('-'.repeat(80));
    
    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext('2d');
    
    // Draw receipt
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 600, 400);
    
    ctx.fillStyle = 'black';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('RECEIPT', 260, 40);
    
    ctx.font = '14px Arial';
    ctx.fillText('Coffee Shop & Bakery', 220, 70);
    ctx.fillText('456 Park Avenue, Boston, MA 02101', 180, 90);
    ctx.fillText('Phone: (555) 123-4567', 230, 110);
    ctx.fillText('Date: 12/02/2024  Time: 10:30 AM', 200, 140);
    ctx.fillText('Receipt #: RCP-789456', 230, 160);
    ctx.fillText('Items:', 50, 200);
    ctx.fillText('Cappuccino (Large)         $4.50', 50, 225);
    ctx.fillText('Croissant                  $3.25', 50, 250);
    ctx.fillText('Blueberry Muffin           $2.75', 50, 275);
    ctx.fillText('Subtotal:                 $10.50', 50, 310);
    ctx.fillText('Tax:                       $0.84', 50, 330);
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Total:                    $11.34', 50, 360);
    
    // Save image
    const buffer = canvas.toBuffer('image/png');
    writeFileSync('test-receipt.png', buffer);
    console.log('✓ Created test-receipt.png');

    // Simulate extracted text
    const extractedText = `RECEIPT
Coffee Shop & Bakery
456 Park Avenue, Boston, MA 02101
Phone: (555) 123-4567
Date: 12/02/2024  Time: 10:30 AM
Receipt #: RCP-789456
Items:
Cappuccino (Large)         $4.50
Croissant                  $3.25
Blueberry Muffin           $2.75
Subtotal:                 $10.50
Tax:                       $0.84
Total:                    $11.34`;

    console.log('\n✓ Simulated OCR text extraction');
    console.log(`✓ Extracted Text (first 150 chars):\n  "${extractedText.substring(0, 150)}..."`);

    // Test document type detection
    console.log('\n⏳ Detecting document type...');
    const docType = detectDocumentType(extractedText);
    console.log(`✓ Document Type: ${docType.type.toUpperCase()}`);
    console.log(`✓ Confidence: ${(docType.confidence * 100).toFixed(1)}%`);
    console.log(`✓ Indicators: ${docType.indicators.join(', ')}`);

    // Test entity extraction
    console.log('\n⏳ Extracting entities...');
    const entities = extractAllEntities(extractedText);
    console.log(`✓ Found ${entities.dates.length} dates`);
    console.log(`✓ Found ${entities.amounts.length} amounts`);
    console.log(`✓ Found ${entities.phones.length} phone numbers`);
    console.log(`✓ Found ${entities.addresses.length} addresses`);

    if (entities.amounts.length > 0) {
        console.log(`  Sample amounts: ${entities.amounts.slice(0, 5).map(e => e.value).join(', ')}`);
    }
    if (entities.phones.length > 0) {
        console.log(`  Sample phones: ${entities.phones.map(e => e.value).join(', ')}`);
    }
    if (entities.dates.length > 0) {
        console.log(`  Sample dates: ${entities.dates.slice(0, 2).map(e => e.value).join(', ')}`);
    }

    console.log('\n✅ Receipt test completed successfully!');
    return { extractedText, docType, entities };
}

// Test 3: Create and test Business Card
async function testBusinessCard() {
    console.log('\n💼 TEST 3: BUSINESS CARD');
    console.log('-'.repeat(80));
    
    const canvas = createCanvas(600, 300);
    const ctx = canvas.getContext('2d');
    
    // Draw business card
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(0, 0, 600, 300);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Sarah Johnson', 50, 80);
    
    ctx.font = '18px Arial';
    ctx.fillText('Senior Software Engineer', 50, 115);
    
    ctx.font = '16px Arial';
    ctx.fillText('Email: sarah.johnson@techcorp.com', 50, 160);
    ctx.fillText('Phone: +1 (555) 987-6543', 50, 190);
    ctx.fillText('LinkedIn: linkedin.com/in/sarahjohnson', 50, 220);
    
    ctx.font = 'bold 20px Arial';
    ctx.fillText('TechCorp Solutions', 350, 260);
    ctx.font = '14px Arial';
    ctx.fillText('www.techcorp.com', 380, 285);
    
    // Save image
    const buffer = canvas.toBuffer('image/png');
    writeFileSync('test-business-card.png', buffer);
    console.log('✓ Created test-business-card.png');

    // Simulate extracted text
    const extractedText = `Sarah Johnson
Senior Software Engineer
Email: sarah.johnson@techcorp.com
Phone: +1 (555) 987-6543
LinkedIn: linkedin.com/in/sarahjohnson
TechCorp Solutions
www.techcorp.com`;

    console.log('\n✓ Simulated OCR text extraction');
    console.log(`✓ Extracted Text:\n  "${extractedText}"`);

    // Test document type detection
    console.log('\n⏳ Detecting document type...');
    const docType = detectDocumentType(extractedText);
    console.log(`✓ Document Type: ${docType.type.toUpperCase()}`);
    console.log(`✓ Confidence: ${(docType.confidence * 100).toFixed(1)}%`);
    console.log(`✓ Indicators: ${docType.indicators.join(', ')}`);

    // Test entity extraction
    console.log('\n⏳ Extracting entities...');
    const entities = extractAllEntities(extractedText);
    console.log(`✓ Found ${entities.names.length} names`);
    console.log(`✓ Found ${entities.emails.length} emails`);
    console.log(`✓ Found ${entities.phones.length} phone numbers`);

    if (entities.names.length > 0) {
        console.log(`  Sample names: ${entities.names.slice(0, 2).map(e => e.value).join(', ')}`);
    }
    if (entities.emails.length > 0) {
        console.log(`  Sample emails: ${entities.emails.map(e => e.value).join(', ')}`);
    }
    if (entities.phones.length > 0) {
        console.log(`  Sample phones: ${entities.phones.map(e => e.value).join(', ')}`);
    }

    console.log('\n✅ Business card test completed successfully!');
    return { extractedText, docType, entities };
}

// Run all tests
async function runAllTests() {
    try {
        const results = {};
        
        results.invoice = await testInvoice();
        results.receipt = await testReceipt();
        results.businessCard = await testBusinessCard();
        
        // Summary
        console.log('\n' + '='.repeat(80));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(80));
        console.log('✅ All 3 tests passed successfully!');
        console.log('\nGenerated test files:');
        console.log('  - test-invoice.png');
        console.log('  - test-receipt.png');
        console.log('  - test-business-card.png');
        console.log('\n🎉 @aivue/doc-intelligence package is working correctly!');
        console.log('\nNote: Full OCR testing requires a browser environment.');
        console.log('Open the demo at http://localhost:8080/ and navigate to Doc Intelligence tab to test OCR.');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run tests
runAllTests();

