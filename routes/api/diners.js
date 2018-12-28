const express = require('express');
const router = express.Router();

const Diner = require('../../models/Diner');
const Reservation = require('../../models/Reservation');

// # route: GET /api/v.1/diners?page=1&limit=20
// # desc: fetch diner list from the db with pagination
// # access: private
router.get('/', (req, res) => {
    const { page, limit, sort } = req.query;
    const paginationOptions = {
        limit: parseInt(limit) || 20,
        select: '-reservations -__v',
        page: parseInt(page) || 1,
        sort: sort || { dateRegistered: -1 }
    }

    Diner.paginate({}, paginationOptions)
        .then(docs => {
            console.log(`Found ${docs.docs.length} diners`);
            res.json(docs);
        });
});

// # route: GET /api/v.1/diners/:id
// # desc: fetch diner info from the db
// # access: private
router.get('/:id', (req, res) => {
    Diner.findOne({
        _id: req.params.id
    }, {
        reservations: 0,
        __v: 0
    })
        .then(doc => {
            console.log(`Fetched one diner id: ${doc._id}`);
            res.json(doc);
        })
});

// # route: GET /api/v.1/diner/search?keyword=eclair+29
// # desc: fetch a diner search results from search keyword query
// # access: private
router.get('/search', (req, res) => {
    const { keyword, sort, page, limit } = req.query;
    const options = {
        limit: parseInt(limit) || 20,
        select: '-reservations -__v',
        page: parseInt(page) || 1,
        sort: sort || { dateRegistered: -1 }
    }

    Diner.paginate({
        $text: { $search: keyword }
    }, options).then(docs => {
        console.log(`Search result for: ${keyword}. Found ${docs.docs.length} diners`);
        res.json(docs);
    })
});

// # route: POST /api/v.1/diners
// # desc: register a new diner from the db
// # access: private
router.post('/', (req, res) => {
    const newDiner = new Diner(req.body);

    const createDiner = () => {
        return newDiner.save()
            .then(doc => doc);
    };

    const findRef = doc => {
        return Diner.findOne({
            _id: doc._id
        }, {
            reservations: 0,
            __v: 0
        }).then(doc => {
            console.log(`Registered a new diner id: ${doc._id}`);
            res.json(doc);
        })
    }

    return createDiner()
        .then(findRef);
});

// # route: PUT /api/v.1/diners/:id
// # desc: edit/update a diner from the db
// # access: private
router.put('/:id', (req, res) => {
    const updateDiner = () => {
        return Diner.updateOne({
            _id: req.params.id
        }, req.body)
            .then(doc => doc);
    }

    const findRef = () => {
        return Diner.findOne({
            _id: req.params.id
        }, {
            reservations: 0,
            __v: 0
        }).then(doc => {
            console.log(`Updates one diner id: ${doc._id}`);
            res.json(doc);
        })
    }

    return updateDiner()
        .then(findRef);
});

// # route: DELETE /api/v.1/diners/:id
// # desc: remove/delete a diner from the db
// # access: private
router.delete('/:id', (req, res) => {
    const findRef = () => {
        return Diner.findOne({ _id: req.params.id })
            .then(doc => doc);
    }

    const removeDinerReservations = doc => {
        return Reservation.deleteMany({
            _id: { $in: doc.reservations }
        }).then(docs => docs);
    }

    const removeDiner = () => {
        return Diner.deleteOne({ _id: req.params.id })
            .then(doc => {
                console.log(`Remove one diner id: ${req.params.id}`);
                res.json(doc);
            });
    }

    return findRef()
        .then(removeDinerReservations)
        .then(removeDiner);
});

// # route: GET /api/v.1/diners/:id/reservations
// # desc: fetch all the diner's reservation from db
// # access: private
router.get('/:id/reservations', (req, res) => {
    const { page, limit, sort } = req.query;
    const paginationOptions = {
        limit: parseInt(limit) || 20,
        select: '-__v -tables',
        page: parseInt(page) || 1,
        populate: { path: 'diner', select: 'fname lname email phone' },
        sort: sort || { dateReserved: -1 }
    };

    Reservation.paginate({
        diner: req.params.id
    }, paginationOptions)
        .then(docs => {
            console.log(`Found ${docs.docs.length} reservations`);
            res.json(docs);
        });
});

// # route: POST /api/v.1/diners/:id/reservations
// # desc: add a new reservation for this diner
// # access: private
router.post('/:id/reservations', (req, res) => {
    const newReservation = new Reservation({
        diner: req.params.id,
        guestsCount: req.body.guestsCount,
        date: req.body.date,
        timeEnter: req.body.timeEnter,
        timeExits: req.body.timeExits
    });

    const saveReservation = () => {
        return newReservation.save()
            .then(doc => doc);
    }

    const updateReservationCount = doc => {
        return Diner.updateOne({
            _id: req.params.id
        }, {
            $inc: { reservationCount: 1 },
            $addToSet: { reservations: newReservation._id }
        }).then(doc => doc);
    }

    const findRef = doc => {
        return Reservation.findOne({
            _id: newReservation._id.toString()
        }, {
            tables: 0,
            __v: 0
        }).populate({
            path: 'diner',
            select: 'fname lname email phone'
        }).then(doc => {
            console.log(`Add a new reservation id: ${doc._id} to Mr/Ms. ${doc.diner.fname} ${doc.diner.lname}`);
            res.json(doc);
        });
    }

    return saveReservation()
        .then(updateReservationCount)
        .then(findRef);
});

module.exports = router;
