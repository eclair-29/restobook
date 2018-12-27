const express = require('express');
const router = express.Router();

const Diner = require('../../models/Diner');

// # route: GET /api/v.1/diners?page=1&limit=20
// # desc: fetch diner list from the db with pagination
// # access: private
router.get('/', (req, res) => {
    Diner.find({}, {
        reservations: 0,
        __v: 0
    })
        .then(docs => {
            console.log(`Found ${docs.length} diners`);
            res.json(docs);
        });
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
        return Diner.find({
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

module.exports = router;
