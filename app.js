const express = require("express");
const app = express();
const _ = require("lodash");
const curl = require("curlrequest")
const myParser = require("body-parser")
const fs = require("fs");
const path = require("path");
const { rawData, analysisAndResponse } = require("./middleware");
const ExpressError = require("./utils/ExpressError")

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



app.get("/api/blog-stats", rawData, analysisAndResponse, (req, res, err) => {
    if (err) {
        res.status(err.status || 500).send({
            err: {
                message: err.message || "Error with API"
            }
        })
    }
})



app.get("/api/blog-search", rawData, (req, res) => {
    const middlewareData = res.locals.blogsData
    const onlyTitle = _.map(middlewareData, (obj) => { return obj.title.toLowerCase() })
    const searchedBlog = Object.values(req.query).toString().replace(",", " ").toLowerCase();
    const result = onlyTitle.filter((val) => val === searchedBlog)
    console.log(result)
    res.render('results', { result })
})
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.listen(3000, () => {
    console.log("using port 3000")
})

