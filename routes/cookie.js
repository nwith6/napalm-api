const { token } = require("../config.json").authentication
const express = require("express")
const fs = require("fs")


const router = express.Router()
    .post("/cookie", async (req, res) => {

        if (!req.body.token || !req.body.cookie) return res.json({error: "Invalid payload"})
        else if (req.body.token !== token) return res.json({error: "Invalid token"})

        let config = require("../config.json")
        config.authentication.cookie = req.body.cookie

        const success = fs.writeFileSync(`${global.__basedir}/config.json`, JSON.stringify(config, null, 4), err => {
            if (err) return false
            return true
        })
        if (success === false) return res.json({error: "Failed to write cookie to file"})
        
        return res.json({success: "Successfully wrote cookie to file"})
    })

module.exports = {
    router: router
}