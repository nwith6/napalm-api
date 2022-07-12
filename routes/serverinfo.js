const express = require("express")
const { Scraper } = require("../modules/scraper")


const router = express.Router()
    .post("/serverinfo", async (req, res) => {
        if (!req.body.placeid || !req.body.cookie || !req.body.jobid) return res.json({error: "Invalid payload"})

        let scraper;
        if (req.body.cookie === null) {
            const { cookie } = require("../config.json").authentication
            scraper = new Scraper(req.body.placeid, cookie)
        } else {
            scraper = new Scraper(req.body.placeid, req.body.cookie)
        }

        return res.json(await scraper.getServerInfo(req.body.jobid))
    })

module.exports = {
    router: router
}