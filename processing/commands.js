const { createNewPlayer } = require('./playersControl.js');
const playersControl = require('./playersControl.js');

// ---- Cooldowns and Cooldown Functions ----
// vars
var cooldowns = {
    "gcd": {
        "value": 30000,
        "onCd": false,
        "actualValue": 0
    },
    "dice": {
        "value": 10000,
        "onCd": false,
        "actualValue": 0
    }
}

// Count every second of the cooldown
function TimeCountCD(cdName)
{
    cooldowns[cdName].actualValue += 1
    if (cooldowns[cdName].actualValue*1000 != cooldowns[cdName].value)
        setTimeout(TimeCountCD, 1000, cdName)
    else
    {
        cooldowns[cdName].actualValue = 0
        cooldowns[cdName].onCd = false
    }
}

// Send message if the CD is still on
function ErrorMessageCD(client, channel, cdName)
{
    let timeLeft = (cooldowns[cdName].value/1000) - cooldowns[cdName].actualValue 
    client.action(channel, `Opa, o comando !${cdName} ta no cooldown, calma ae! Faltam ${timeLeft} segundos`)
}
// ---- End of Cooldowns and Cooldown Functions ----


function rollDice(qnt) 
{
    const sides = qnt;
    return Math.floor(Math.random() * sides) + 1;
}

module.exports = {
    teste(client, channel)
    {
        client.say(channel, "teste")
        console.log("teste caraio", channel);
    },
    dice(client, channel, qnt)
    {
        if (cooldowns.dice.onCd)
        {
            ErrorMessageCD(client, channel, "dice")
            return;
        }

        num = rollDice(qnt)
        client.say(channel, `Você rolou um ${num} em D${qnt}`)
        cooldowns.dice.onCd = true

        TimeCountCD("dice")
    },
    fight(client, channel, user)
    {
        if (cooldowns.gcd.onCd)
        {
            ErrorMessageCD(client, channel, "gcd")
            return;
        }
        
        client.action(channel, `o moderador ${user} liberou, pode começar a porrada!`)
        cooldowns.gcd.onCd = true

        TimeCountCD("gcd")
    },
    perfilCheck(client, channel, user)
    {
        userInfo = playersControl.getPlayerInfo(user)

        if (!userInfo)
            client.say(channel, "Sinto muito, vc ainda não esta jogando... digite !letmeplay para criar sua ficha")
        else
            client.say(channel, `Opa, ola ${user}, suas infos: ${userInfo}`)
    },
    createNewPlayer(client, channel, user)
    {
        let done = playersControl.createNewPlayer(user)

        if (done) 
            client.say(channel, `Boa ${user}, agora você também está jogando!`)
        else
            client.say(channel, `Aparentemente você ja ta jogando ${user}...`)
    }
}