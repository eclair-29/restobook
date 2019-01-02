const express = require('express');
const router = express.Router();

const Table = require('../../models/Table');
const Reservation = require('../../models/Reservation');

// # route: GET /api/v.1/tables?page=1&limit=20
// # desc: fetch table list from the db with pagination
// # access: private
router.get('/', (req, res) => {
    const { page, limit, sort } = req.query;
    const paginateOptions = {
        limit: parseInt(limit) || 20,
        select: '-reservations -__v',
        page: parseInt(page) || 1,
        sort: sort || { dateAdded: -1 }
    }

    Table.paginate({}, paginateOptions)
        .then(docs => {
            console.log(`Found ${docs.docs.length} reservations`);
            res.json(docs);
        })
});

// # route: GET /api/v.1/tables/:id
// # desc: fetch table info from the db
// # access: private
router.get('/:id', (req,res) => {
    Table.findOne({
        _id: req.params.id
    }, {
        reservations: 0,
        __v: 0
    }).then(doc => {
        console.log(`Fetched one table id: ${doc._id}`);
        res.json(doc);
    })
})

// # route: GET /api/v.1/tables/search?keyword=eclair+29
// # desc: fetch a table search results from search keyword query
// # access: private
router.get('/search', (req, res) => {
    const { keyword, page, limit, sort } = req.query;
    const options = {
        limit: parseInt(limit) || 20,
        select: '-reservations -__v',
        page: parseInt(page) || 1,
        sort: sort || { dateAdded: -1 }
    };

    Table.paginate({
        $text: { $search: keyword }
    }, options).then(docs => {
        console.log(`Search result for: ${keyword}. Found ${docs.docs.length} tables`);
        res.json(docs);
    })
});

// # route: POST /api/v.1/tables
// # desc: add a table from the db
// # access: private
router.post('/', (req, res) => {
    const newTable = new Table(req.body);

    const saveTable = () => {
        return newTable.save()
            .then(doc => doc);
    };

    const findRef = () => {
        return Table.findOne({
            _id: newTable._id.toString()
        }, {
            reservations: 0,
            __v: 0
        }).then(doc => {
            console.log(`Added a new table id: ${doc._id}`);
            res.json(doc);
        })
    };

    return saveTable()
        .then(findRef);
});

// # route: PUT /api/v.1/tables/:id
// # desc: edit/update a table from the db
// # access: private
router.put('/:id', (req, res) => {
    const updateTable = () => {
        return Table.updateOne({
            _id: req.params.id
        }, req.body)
            .then(doc => doc);
    }

    const findRef = () => {
        return Table.findOne({
            _id: req.params.id
        }, {
            reservations: 0,
            __v: 0
        }).then(doc => {
            console.log(`Update one table id: ${doc._id}`);
            res.json(doc);
        })
    }

    return updateTable()
        .then(findRef);
});

// # route: DELETE /api/v.1/tables/:id
// # desc: remove/delete a table from the db
// # access: private
router.delete('/:id', (req, res) => {
    const updateRemoveState = () => {
        return Reservation.updateOne({
            tables: req.params.id
        }, {
            $pull: { tables: req.params.id },
            $inc: { tableCount: -1 }
        }).then(doc => doc);
    }

    const removeTable = () => {
        return Table.deleteOne({ _id: req.params.id })
            .then(doc => {
                console.log(`Remove one table id: ${req.params.id}`);
                res.json(doc);
            });
    }

    return updateRemoveState()
        .then(removeTable);
});

// # route: GET /api/v.1/tables/:id/reservations
// # desc: fetch all table's reservations from the db
// # access: private
router.get('/:id/reservations', (req, res) => {
    const { limit, page, sort } = req.query;
    const paginateOptions = {
        limit: parseInt(limit) || 20,
        select: '-tables -__v',
        page: parseInt(page) || 1,
        sort: sort || { dateReserved: -1 }
    };

    Reservation.paginate({
        tables: req.params.id
    }, paginateOptions)
        .then(docs => {
            console.log(`Found ${docs.docs.length} reservations`);
            res.json(docs);
        })
})

module.exports = router;
