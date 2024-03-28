const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    id: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: Date, required: true },
    phone: { type: Number, required: true },
    mobilePhone: { type: Number, required: true },
    vaccineInfo: [
        {
            vaccineType: { type: mongoose.Schema.Types.ObjectId, ref: 'Covid19' },
            vaccinationDate: { type: Date }
        }
    ],
    positiveTestDate: { type: Date },
    recoveryDate: { type: Date }
});

module.exports = mongoose.model('Client', clientSchema);
