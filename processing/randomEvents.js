// ---- Cooldowns and Cooldown Functions ----
// vars
var cooldowns = {
    "bossCD": {
        "value": 30000,
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




module.exports = {
    startEvents(client, channel)
    {
        runAll(client, channel)
    }   
}


/*
cd pro povo entra no evento
cd pro evento acontecer
gravar quantia de pessoas que estarão no evento

*/