const curl = require("curlrequest")
const _ = require("lodash");



module.exports.rawData = (req, res, next) => {
    try {
        curl.request({
            url: "https://intent-kit-16.hasura.app/api/rest/blogs", headers: {
                Accept: "application/json",
                "x-hasura-admin-secret": "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6"
            }
        }, (err, response) => {
            const jsonRes = JSON.parse(response)
            res.locals.blogsData = _.get(jsonRes, "blogs")
            next()
        })
    } catch (error) {
        res.status(error.status || 500).send({
            error: {
                message: error.message || "Error with API"
            }
        })
    }


}

module.exports.analysisAndResponse = (req, res, next) => {
    try {
        const blogsData = res.locals.blogsData
        const totalNumber = _.size(blogsData)
        const onlyTitle = _.map(blogsData, (obj) => { return obj.title.toLowerCase() })
        const longestTitle = _.reduce(onlyTitle,
            (acc, cur) => {
                return acc.length > cur.length ? acc : cur
            })
        const privacyTitle = _.size(_.filter(onlyTitle, _.matches("privacy")));
        const uniqueTitle = _.uniq(onlyTitle)
        res.json({
            "Total umber of blogs": totalNumber,
            "The Title of the longest blog": longestTitle,
            "Number of blogs with 'privacy' in title": privacyTitle,
            "An array of unique blog titles": uniqueTitle
        })

    } catch (error) {
        res.status(error.status || 500).send({
            error: {
                message: error.message || "Error with Analysisng the data"
            }
        })
    }

}
