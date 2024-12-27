const express = require('express');
const Signature = require('../models/Signature');

const router = express.Router();

// Route: Store signature
router.post('/store', async (req, res) => {
    const { accountNumber, signature } = req.body;

    try {
        // Save the account and Base64-encoded signature in the database
        const newSignature = new Signature({ accountNumber, signature });
        await newSignature.save();
        res.status(201).send({ message: 'Signature stored successfully' });
    } catch (err) {
        res.status(400).send({ message: 'Error storing signature', error: err.message });
    }
});

// Route: Verify signature
router.post('/verify', async (req, res) => {
    const { accountNumber, signature } = req.body;

    try {
        // Find the stored signature for the given account
        const storedSignature = await Signature.findOne({ accountNumber });
        if (!storedSignature) {
            return res.status(404).send({ message: 'Account not found' });
        }

        // Compare the uploaded signature with the stored signature
        const similarity = compareSignatures(storedSignature.signature, signature);

        // Set a threshold for "genuine" verification
        const isGenuine = similarity > 0.8; // Example threshold: 80%

        res.status(200).send({
            message: isGenuine ? 'Signature is Genuine' : 'Signature is Forged',
            similarity: similarity,
        });
    } catch (err) {
        res.status(500).send({ message: 'Error during verification', error: err.message });
    }
});

// Function: Compare two Base64 strings and return similarity score
function compareSignatures(storedBase64, uploadedBase64) {
    // Example: Add proper comparison logic here
    // Placeholder: Return a random similarity score for demonstration
    return Math.random();
}

module.exports = router;
