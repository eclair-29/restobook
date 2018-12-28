const express = require('express');
const router = express.Router();

const Reservation = require('../../models/Reservation');
const Diner = require('../../models/Diner');

// # route: GET /api/v.1/reservations?page=1&limit=20
// # desc: fetch all reservations from the db with pagination
// # access: private
router.get('/', (req, res) => {
    const { page, limit, sort } = req.query;
    const paginationOptions = {
        page: parseInt(page) || 1,
        select: '-tables -__v',
        populate: { path: 'diner', select: 'fname lname email phone' },
        limit: parseInt(limit) || 20,
        sort: sort || { dateReserved: -1 }
    };

    Reservation.paginate({}, paginationOptions)
        .then(docs => {
            console.log(`Found ${docs.docs.length} reservations`);
            res.json(docs);
        })
});

// # route: GET /api/v.1/reservations/:id
// # desc: fetch reservation info from the db
// # access: private
router.get('/:id', (req, res) => {
    Reservation.findOne({
        _id: req.params.id
    }, {
        tables: 0,
        __v: 0
    })
        .populate({ path: 'diner', select: '-reservations -__v' })
        .then(doc => {
            console.log(`Fetched one reservation id: ${doc._id}`);
            res.json(doc);
        })
});

// # route: PUT /api/v.1/reservations/:id
// # desc: edit/update a reservation from the db
// # access: private
router.put('/:id', (req, res) => {
    const updateReservation = () => {
        return Reservation.updateOne({
            _id:req.params.id
        }, req.body)
            .then(doc => doc)
    }

    const findRef = () => {
        return Reservation.findOne({
            _id: req.params.id
        }, {
            tables: 0,
            __v: 0
        })
            .populate({ path: 'diner', select: '-reservations -__v' })
            .then(doc => {
                console.log(`Update one reservation id: ${doc._id}`);
                res.json(doc);
            })
    }

    return updateReservation()
        .then(findRef);
});

// # route: DELETE /api/v.1/reservations/:id
// # desc: remove/delete a reservation from the db
// # access: private
router.delete('/:id', (req, res) => {
   const updateDinerReservation = () => {
       return Diner.update({
           reservations: req.params.id
       }, {
           $pull: { reservations: req.params.id },
           $inc: { reservationCount: -1 }
       }).then(doc => doc);
   }

   const removeDinerReservation = () => {
       return Reservation.deleteOne({ _id: req.params.id })
        .then(doc => {
            console.log(`Remove one reservation id: ${req.params.id}`);
            res.json(doc);
        })
   }

   return updateDinerReservation()
    .then(removeDinerReservation);
});

module.exports = router;
