const mongoose = require('mongoose');

// Function to generate a sequence number for a given model
async function getNextSequenceNumber(model, prefix) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    
    // Find the latest document for the current month
    const latestDoc = await model.findOne({
        createdAt: {
            $gte: new Date(year, today.getMonth(), 1),
            $lt: new Date(year, today.getMonth() + 1, 1)
        }
    }).sort({ createdAt: -1 });

    let sequence = 1;
    if (latestDoc) {
        // Extract sequence number from the existing document number
        const match = latestDoc.id.toString().match(/\d+$/);
        if (match) {
            sequence = parseInt(match[0]) + 1;
        }
    }

    // Format: PREFIX-YYYYMM-SEQUENCE
    // Example: INV-202403-001
    const formattedNumber = `${prefix}-${year}${month}-${String(sequence).padStart(3, '0')}`;
    const numericId = parseInt(`${year}${month}${String(sequence).padStart(3, '0')}`);

    return {
        formattedNumber,
        numericId
    };
}

// Generate document numbers for different types
async function generateDocumentNumber(model, type) {
    const prefixMap = {
        'invoice': 'INV',
        'estimate': 'EST',
        'creditNote': 'CN',
        'payment': 'PAY'
    };

    const prefix = prefixMap[type];
    if (!prefix) {
        throw new Error('Invalid document type');
    }

    return await getNextSequenceNumber(model, prefix);
}

module.exports = {
    generateDocumentNumber
}; 