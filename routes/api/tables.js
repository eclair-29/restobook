const express = require('express');
const router = express.Router();

const Table = require('../../models/Table');

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

module.exports = router;
