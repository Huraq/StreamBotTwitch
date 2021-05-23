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


// setTimeout(onTimer, 10000) // 10 segundos

// function onTimer ()
// {
  //   setTimeout(onTimer, 10000)
  //   client.say(options.channels[0], "testando, 1, 2, 3...")
// }

// Called every time a message comes in
function onMessageHandler (channel, tags, message, self) 
{
  if (self) { return; } // Ignore messages from the bot
  
  // Remove whitespace from chat message
  let commandName = message.trim().split(" ")[0];

  
  if (commandName === "teste" && tags.username == "huraq")
    commands.teste(client, channel)


  if (commandName === "!fight" && tags.mod)
    commands.fight(client, channel, tags.username)

  if(commandName === "!dice")
  {
    let diceSides = message.trim().split(" ")[1];
    diceSides = isNaN(diceSides) ? 6 : diceSides
    
    commands.dice(client, channel, diceSides)
  }

}


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}