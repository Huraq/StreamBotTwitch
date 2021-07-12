const {MongoClient} = require('mongodb');
const configs = require('../configs/configs.json');

const defaultPlayer = {
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

async function showUser(client, user){
    players = client.db('players').collection('players')

    const options = {
        sort: { rating: -1 },
        projection: { _id: 0 },
      };

    result = await players.findOne({username: user}, options)

    console.log(result);
    return result
    
};

async function createUser(client, username){
    players = client.db('players').collection('players')
    if (await showUser(client, username))
        return false

    let newPlayer = Object.assign({}, defaultPlayer)
    newPlayer.username = username

    result = await players.insertOne(newPlayer)

    console.log(result);
    return true
    
};

async function addXPToPlayer(client, user, newXP){
    players = client.db('players').collection('players')
    update = await showUser(client, user)
    update.exp.actualXP += 10
    result = await players.findOneAndUpdate({username: user}, {$set: update}, {upsert: true})
};


module.exports = {
    async createNewUser(username){
        let client = new MongoClient(configs.uri,{useUnifiedTopology: true });

        try {
            // Connect to the MongoDB cluster
            await client.connect();
            return await createUser(client, username);
     
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    },
    async getPlayerInfo(username)
    {
        let client = new MongoClient(configs.uri,{useUnifiedTopology: true });
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            return await showUser(client, username);
     
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }        
    }
}
