
module.exports = function (app) {



    app.get('/', (req, res) => {
        res.render("index", {active: "home"})
    });
    app.get('/test', (req, res) => {
        res.render("index", {active: "test"})
    })
    app.get('/report', (req, res) => {
         res.render("index", {active: "report"})
    })
    app.get('/sale', (req, res) => {
        res.render("index", {active: "sale"})
   })
    app.get('/exp', (req, res) => {
        res.render("index", {active: "exp"})
    })
    app.get('/item', (req, res) => {
        res.render("index", {active: "items"})
    })
    app.get('/todo', (req, res) => {
        res.render("index", {active: "todo"})
    })

}



