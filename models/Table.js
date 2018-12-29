const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const TableSchema = new Schema({
    tableName: { type: String, required: true, unique: true },
    seatCapacity: { type: Number, required: true, max: 999 },
    reservations: [
        { type: Schema.Types.ObjectId, ref: 'reservation' }
    ],
    reservationCount: { type: Number, default: 0, max: 9999 },
    dateAdded: { type: Date, default: Date.now }
});

TableSchema.plugin(mongoosePaginate);
TableSchema.index({ tableName: 'text' });

const Table = mongoose.model('table', TableSchema);

module.exports = Table;
