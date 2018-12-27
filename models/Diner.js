const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const addressSchema = new Schema({
    address: String,
    city: String,
    stateProvince: String,
    country: String,
    zipcode: { type: Number, max: 9999 }
})

const DinerSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    phone: { type: Number, required: true, max: 9999999999 },
    email: { type: String, required: true, unique: true },
    reservationCount: { type: Number, default: 0, max: 9999 },
    reservations: [
        { type: Schema.Types.ObjectId, ref: 'reservation' }
    ],
    address: addressSchema,
    salutation: String,
    birthdate: Date,
    dateRegistered: { type: Date, default: Date.now }
});

DinerSchema.plugin(mongoosePaginate);
DinerSchema.index({
    fname: 'text',
    lname: 'text'
});

const Diner = mongoose.model('diner', DinerSchema);

module.exports = Diner;
