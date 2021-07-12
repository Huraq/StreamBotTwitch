const {MongoClient} = require('mongodb');

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

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = configs.uri;
 

    const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    try {
        
        // Connect to the MongoDB cluster
        await client.connect();

        // await showUser(client, "huraq")
        // await createUser(client, "teste")
        await addXPToPlayer(client, "huraq", 10)
    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }
    
}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

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
    let newPlayer = Object.assign({}, defaultPlayer)
    newPlayer.username = username

    result = await players.insert(newPlayer)

    console.log(result);
    
};

async function addXPToPlayer(client, user, newXP){
    players = client.db('players').collection('players')
    update = await showUser(client, user)
    update.exp.actualXP += 10
    result = await players.findOneAndUpdate({username: user}, {$set: update}, {upsert: true})

    // console.log(result);
    
};

main().catch(console.error);

