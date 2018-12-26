const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DinerSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    phone: { type: Number, required: true, max: 9999999999 },
    email: { type: String, required: true, unique: true },
    reservationCount: { type: Number, default: 0, max: 9999 },
    reservations: [
        { type: Schema.Types.ObjectId, ref: 'reservation' }
    ]
});

const Diner = mongoose.model('diner', DinerSchema);

module.exports = Diner;
