const fs = require('fs')
const express = require("express")

module.exports = {
    
    async new() {
        const routes = fs.readdirSync(`${global.__basedir}/routes`, (err, files) => {
            if (err) return false
            return files
        })
        if (routes == false) return false

        const app = express()
        const PORT = process.env.PORT || 8080

        app.use(express.json())
        app.get("/", (req, res) => res.send(""))
        routes.forEach(file => {
            let { router } = require(`${global.__basedir}/routes/${file}`)
            app.use("", router)
        })

        app.listen(PORT, () => console.log(`Server running on ${PORT}`))
    }
}