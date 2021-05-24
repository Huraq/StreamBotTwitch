// const {tempDB} = require('../model/tempDB.json');
const fs = require('fs');
const playersDB = __dirname+'/../model/tempDB.json'
const defaultPlayer = {
    "id": 0,
    "username": "",
    "level": "",
    "class": "",
    "exp": 
    {
        "actualXP": "",
        "expToNextLvl": ""
    },
    "status":
    {
        "atk": "",
        "def": "",
        "actualHP": "",
        "totalHP": ""
    },
    "equip": 
    {
        "weapon": "",
        "armor": "",
        "shield": ""
    },
    "money": ""
}

function getDBInfo()
{
    let rawData = fs.readFileSync(playersDB);
    let playerInfo = JSON.parse(rawData);
    return playerInfo
}

module.exports = {
    getPlayerInfo(username)
    {
        let playerInfo = getDBInfo()
        return playerInfo.player[username]
    },
    createNewPlayer(username)
    {
        let playerInfo = getDBInfo()
        if (playerInfo.player[username])
            return false

        let newPlayer = Object.assign({}, defaultPlayer)
        newPlayer.id = Object.keys(playerInfo.player).length + 1
        newPlayer.username = username
        playerInfo.player[username] = newPlayer
        console.log(playerInfo);

        let data = JSON.stringify(playerInfo, null, 2)
        fs.writeFileSync(playersDB, data)
        return true

}

}