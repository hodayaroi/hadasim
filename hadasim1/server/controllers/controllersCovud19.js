const Covid19 = require('../models/Covid19');

// Create a new Covid19 record
const createCovid19Record = async (req, res) => {
    try {
        const { vaccineType, manufacturer } = req.body;

        if (!vaccineType || !manufacturer) {
            return res.status(400).json({ message: 'Both vaccineType and manufacturer are required.' });
        }

        const covid19 = new Covid19({
            vaccineType,
            manufacturer
        });

        const savedCovid19 = await covid19.save();
        console.log(savedCovid19);

        res.status(201).json({ message: 'New vaccine created successfully', vaccine: savedCovid19 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating new vaccine record.' });
    }
};

// Retrieve all Covid19 records
const getAllCovid19Records = async (req, res) => {
    try {
        const covid19Records = await Covid19.find();
        res.status(200).json(covid19Records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving Covid19 records.' });
    }
};

module.exports = { createCovid19Record, getAllCovid19Records };
