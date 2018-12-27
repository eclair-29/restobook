const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const reservationStatus = [ 'enquiry', 'pending', 'confirmed' ];

const ReservationSchema = new Schema({
    diner: { type: Schema.Types.ObjectId, ref: 'diner' },
    date: { type: Date, required: true },
    timeEnter: { type: Date, required: true },
    timeExits: { type: Date, required: true },
    status: { type: String, enum: reservationStatus, default: 'enquiry' },
    guestsCount: { type: Number, required: true, max: 9999 },
    tables: [
        { type: Schema.Types.ObjectId, ref: 'table' }
    ],
    payment: { type: Schema.Types.ObjectId, ref: 'payment' },
    dateReserved: { type: Date, default: Date.now }
});

ReservationSchema.plugin(mongoosePaginate);

const Reservation = mongoose.model('reservation', ReservationSchema);

module.exports = Reservation;
