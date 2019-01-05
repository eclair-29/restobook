const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PayementSchema = new Schema({
    depositFee: Number,
    depositPercentage: { type: Number, default: 0.20, max: 1 },
    chargePerHead: { type: Number, default: 200 },
    guestsCount: Number,
    totalAmount: Number,
    paymentMethod: { type: String, default: 'cash'},
    dateOfPayment: Date
});

const Payment = mongoose.model('payment', PayementSchema);

module.exports = Payment;
