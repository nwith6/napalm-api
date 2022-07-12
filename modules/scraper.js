const request = require("request-promise")


class Scraper {

    constructor(placeid, cookie) {
        this.placeid = placeid
        this.cookie = cookie
    }

    // Request Methods

    async get(url) {
        return await request({
            uri: url,
            method: "GET",
            headers: {
                Cookie: `.ROBLOSECURITY=${this.cookie};path=/;domain=.roblox.com;`
            }
        })
        .then(res => {return res})
        .catch(err => console.log(err))
    }

    async post(url) {
        return await request({
            uri: url,
            method: "POST",
            json: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
                Referer: `https://www.roblox.com/games/${this.placeid}/`,
                Origin: "https://www.roblox.com/",
                Cookie: `.ROBLOSECURITY=${this.cookie};path=/;domain=.roblox.com;`
            }
        })
        .then(res => {return res})
        .catch(err => console.log(err))
    }

    // Requests

    async gamev1() {
        return await this.get(`https://games.roblox.com/v1/games/${this.placeid}/servers/Public?sortOrder=Asc&limit=25`)
        .then(res => {return JSON.parse(res)})
        .catch(err => console.log(err))
    }

    async multigetv1() {
        return await this.get(`https://games.roblox.com/v1/games/multiget-place-details?placeids=${this.placeid}`)
        .then(res => {return JSON.parse(res)})
        .catch(err => console.log(err))
    }

    async assetgame(jobid) {
        return await(this.post(`https://assetgame.roblox.com/game/PlaceLauncher.ashx?request=RequestGameJob&browserTrackerId=10000&placeid=${this.placeid}&gameId=${jobid}&isPlayTogetherGame=false`))
    }

    async jSR(url) {
        return await this.post(url)
        .then(res => {return JSON.parse(res)})
        .catch(err => console.log(err))
    }

    // Methods

    async getJobids() {
        const data = await this.gamev1()

        if (data === undefined) return {error: "Failed to fetch jobids"}

        let jobids = []
        for (let i=0; i < data.data.length; i++) {
            if (data.data[i].maxPlayers == 1 || data.data[i].maxPlayers === data.data[i].playing) continue
            jobids.push(data.data[i].id)
        }

        return jobids
    }

    async getServerInfo(jobid) {
        let data = await this.assetgame(jobid)

        if (data === undefined) return {error: "Failed to fetch server info"}
        else if (data.joinScriptUrl !== null) {
            data = await this.jSR(data.joinScriptUrl)

            return {
                ip: data.MachineAddress,
                port: data.ServerPort
            }
        }
        return {error: "Failed to fetch joinScriptUrl"}
    }
}

module.exports = { Scraper }
