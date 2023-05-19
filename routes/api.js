const myDB = require('./connection');

module.exports = function (app) {


    app.get('/api/:reqData', (req, res) => {
        let query = req.query;
        let reqData = req.params.reqData;
        myDB(async client => {
            const data = await client.db('Pos').collection(reqData).find().toArray();

            res.json(data)

        })
    });

    app.post('/api/sale', (req, res) => {
        let data = req.body;
        let name = data.name;
        let amount = Number(data.amount);
        let payBy =data.payBy
        let date = data.buyDate
        let input = {
            amount,
            payBy,
            buyDate: date,
            payDate: data.payDate,
            items: data.items
        }
        let items = data.items
        let buyDate = data.buyDate
        //add data in employe acount
        myDB(async client => {
            const myDataBase = await client.db('Pos').collection('employe');
            myDataBase.updateOne({ name: name }, { $push: { sales: input } }, { upsert: true }, (err, data) => { })
        })

        if (payBy == 'cash') {
            myDB(async client => {
                let name = 'Cash sales'
                const myDataBase = await client.db('Pos').collection('tally');
                myDataBase.updateOne({ _id: 'dr' }, { $push: { 'dr.cash': { amount, date, name } } }, { upsert: true }, (err, data) => { })
                myDataBase.updateOne({ _id: 'cash' }, { $inc: { 'cash': amount } }, { upsert: true }, (err, data) => { })
            })
        };

        if (payBy == 'paytm') {
            myDB(async client => {
                let name = 'Paytm sales'
                const myDataBase = await client.db('Pos').collection('tally');
                myDataBase.updateOne({ _id: 'dr' }, { $push: { 'dr.paytm': { amount, date, name } } }, { upsert: true }, (err, data) => { })
                myDataBase.updateOne({ _id: 'paytm' }, { $inc: { 'paytm': amount } }, { upsert: true }, (err, data) => { })
            })
        };
        //update item data
        myDB(async client => {
            const myDataBase = await client.db('Pos').collection('items');
            for (let item in items) {
                let name = items[item].name;
                let qty = Number(items[item].qty);
                let price = items[item].price;
                myDataBase.updateOne({ name: name, price: price }, { $push: { 'itemData.sell': { date: buyDate, qty: qty } }, $inc: { qty: -qty } }, { upsert: true }, (err, data) => { })
            }
        })


    });

    app.post('/api/crRec', (req, res) => {
        let date = req.body.date
        let name = req.body.name
        let payBy = req.body.payBy
        let amount = Number(req.body.amount)
        let datePay = req.body.datePay
      let same_date = (datePay == date)
        myDB(async client => {

            const myDataBase = await client.db('Pos').collection('employe');
            myDataBase.updateOne({ name: name, 'sales.amount': amount,'sales.payBy':'credit' },
                { $set: { 'sales.$.payDate': datePay, 'sales.$.payBy': payBy } }, { upsert: true }, (err, data) => { })
        })


        if (payBy == 'cash') {
            myDB(async client => {
                let name = same_date ? 'Cash sales' : 'Cash Cr recived'
                const myDataBase = await client.db('Pos').collection('tally');
                myDataBase.updateOne({ _id: 'dr' }, { $push: { 'dr.cash': { amount,date: datePay, name } } }, { upsert: true }, (err, data) => { })
                myDataBase.updateOne({ _id: 'cash' }, { $inc: { 'cash': amount } }, { upsert: true }, (err, data) => { })
            })
        };

        if (payBy == 'paytm') {
            myDB(async client => {
                let name = same_date ? 'Paytm sales' : 'Paytm Cr recived'
                const myDataBase = await client.db('Pos').collection('tally');
                myDataBase.updateOne({ _id: 'dr' }, { $push: { 'dr.paytm': { amount, date :datePay, name } } }, { upsert: true }, (err, data) => { })
                myDataBase.updateOne({ _id: 'paytm' }, { $inc: { 'paytm': amount } }, { upsert: true }, (err, data) => { })
            })
        };

    });

    app.post('/api/exp', (req, res) => {
        let data = req.body;
        let amount = Number(req.body.amount);
        let type = req.body.type;
        let date = req.body.date;
        let items = req.body.items;
        let name = req.body.name;
        let payBy = req.body.payBy;

        myDB(async client => {
            const myDataBase = await client.db('Pos').collection('exp');
            myDataBase.insertOne({ ...data }, { upsert: true }, (err, data) => { })
        });

        if (type == 'Sales & Office use') {
            myDB(async client => {
                const myDataBase = await client.db('Pos').collection('items');
                for (let item in items) {
                    let name = items[item].name;
                    let qty = Number(items[item].qty);
                    let price = items[item].price;
                    myDataBase.updateOne({ name: name, price: price }, { $push: { 'itemData.buy': { date: date, qty: qty } }, $inc: { qty: qty } }, { upsert: true }, (err, data) => { })
                }
            })
        }




        if (payBy == 'cash') {
            myDB(async client => {
                const myDataBase = await client.db('Pos').collection('tally');
                myDataBase.updateOne({ _id: 'cr' }, { $push: { 'cr.cash': { amount, date, name } } }, { upsert: true }, (err, data) => { })
                myDataBase.updateOne({ _id: 'cash' }, { $inc: { 'cash': -amount } }, { upsert: true }, (err, data) => { })
            })
        };

        if (payBy == 'paytm') {
            myDB(async client => {
                const myDataBase = await client.db('Pos').collection('tally');
                myDataBase.updateOne({ _id: 'cr' }, { $push: { 'cr.paytm': { amount, date, name } } }, { upsert: true }, (err, data) => { })
                myDataBase.updateOne({ _id: 'paytm' }, { $inc: { 'paytm': -amount } }, { upsert: true }, (err, data) => { })
            })
        };
        //add data in exp with type keyvalue on basses of type


    });

    app.post('/api/todo', (req, res) => {
        myDB(async client => {
            const myDataBase = await client.db('Pos').collection('todo');
            myDataBase.updateOne({ name: req.body.name, date: req.body.date }, {
                $set: {
                    doneDate: req.body.doneDate,
                    done: req.body.done,
                    remark: req.body.remark
                }
            }, { upsert: true }, (err, data) => { })
        });





    });

    app.post('/api/tally', (req, res) => {
        console.log(req.body)
        let name = req.body.name;
        let date = req.body.date;
        let amount = Number(req.body.amount);
        let payBy = req.body.payBy;

        if (payBy == 'cash') {
            myDB(async client => {
                const myDataBase = await client.db('Pos').collection('tally');
                myDataBase.updateOne({ _id: 'dr' }, { $push: { 'dr.cash': { amount, date, name } } }, { upsert: true }, (err, data) => { })
                myDataBase.updateOne({ _id: 'cash' }, { $inc: { 'cash': amount } }, { upsert: true }, (err, data) => { })
            })
        };

        if (payBy == 'paytm') {
            myDB(async client => {
                const myDataBase = await client.db('Pos').collection('tally');
                myDataBase.updateOne({ _id: 'dr' }, { $push: { 'dr.paytm': { amount, date, name } } }, { upsert: true }, (err, data) => { })
                myDataBase.updateOne({ _id: 'paytm' }, { $inc: { 'paytm': amount } }, { upsert: true }, (err, data) => { })
            })
        };


    })

}


