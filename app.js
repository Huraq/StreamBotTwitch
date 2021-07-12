const tmi = require('tmi.js');

// Define configuration options
if (process.env.PORT)
{
  var options = {
    identity: {
      username: process.env.USERNAME,
      password: process.env.PASSWORD
    },
    channels: [
      process.env.CHANNEL0
    ]
  };
}
else
  var {options} = require('./configs/configs.json');

// Define commands module
const commands = require('./processing/commands.js')
// Create a client with our options
const client = new tmi.client(options);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();


// Called every time a message comes in
async function onMessageHandler (channel, tags, message, self) 
{
  if (self) { return; } // Ignore messages from the bot
  
  // Remove whitespace from chat message
  let commandName = message.trim().split(" ")[0];

  
  if (commandName === "teste" && tags.username == "huraq")
    commands.teste(client, channel)

  if(commandName === "!dice")
  {
    let diceSides = message.trim().split(" ")[1];
    diceSides = isNaN(diceSides) ? 6 : diceSides
    
    commands.dice(client, channel, diceSides)
  }

  if (commandName == "!crise")
    client.action(channel, "Tisi está passando por mais uma crise... e eu to com preguiça de fazer contador xD <3")

  // Commandos apenas do RPG
  if (commandName === "!rpg")
  {
    let secondaryCommand = message.trim().split(" ")[1];
    let targetName = message.trim().split(" ")[2];

    if (secondaryCommand === "perfilCheck" || secondaryCommand === "p" || !secondaryCommand)
      commands.perfilCheck(client, channel, tags.username)

    if (secondaryCommand === "fight" || secondaryCommand == "lutar")
    {
      if (targetName)
        commands.fight(client, channel, tags.username, targetName.substring(1))
      else
        client.action(channel, "Informe contra quem vc quer batalhar por favor...")
    }
  }

  if (commandName === "!letmeplay")
    commands.createNewPlayer(client, channel, tags.username)

  
  if (commandName === "!t")
    client.whisper(tags.username, "teste").catch(e => (console.log(e)))
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}