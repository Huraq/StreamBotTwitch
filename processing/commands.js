const model = require('../model/model.js');

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
    },
    "fight": {
        "value": 60000,
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

// Send message when the CD finishes up
function CooldownFinishedMessage(client, channel, cdName)
{
    if (cdName == "fight")
        client.action(channel, `A arena esta limpa novamente, o comando !${cdName} ta liberado, escolha seu adversário e venha batalhar!`)
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
    fight(client, channel, user, targetUser)
    {
        if (cooldowns.fight.onCd)
        {
            ErrorMessageCD(client, channel, "fight")
            return;
        }

        userSTR = Math.floor(Math.random() * 10)
        tgtUserSTR = Math.floor(Math.random() * 10)
        
        client.action(channel, `Começou a batalha! ${user} corre em direção de ${targetUser}`)
        if (userSTR > tgtUserSTR)
            setTimeout(() => (client.action(channel, `Quando a poeira baixa, ${user} ainda está de pé! Parabéns, você é o vencedor!`)), 2000 )
        else if (userSTR < tgtUserSTR)
            setTimeout(() => (client.action(channel, `Quando a poeira baixa, ${targetUser} ainda está de pé! Parabéns, você é o vencedor!`)), 2000 )
        else
            setTimeout(() => (client.action(channel, `Tudo está muito calmo... quando a poeira baixou, ambos estão ajoelhados e ofegantes... Foi um empate!`)), 2000 )

        cooldowns.fight.onCd = true

        TimeCountCD("fight")
        setTimeout(CooldownFinishedMessage, cooldowns.fight.value, client, channel, "fight")
    },
    // Model user functions
    async perfilCheck(client, channel, user)
    {
        userInfo = await model.getPlayerInfo(user)

        if (userInfo == null)
            client.say(channel, "Sinto muito, vc ainda não esta jogando... digite !letmeplay para criar sua ficha")
        else
            client.say(channel, `Opa, ola ${user}, suas infos: ${userInfo}`)
    },
    async createNewPlayer(client, channel, user)
    {
        let done = await model.createNewUser(user)

        if (done) 
            client.say(channel, `Boa ${user}, agora você também está jogando!`)
        else
            client.say(channel, `Aparentemente você ja ta jogando ${user}...`)
    }
}