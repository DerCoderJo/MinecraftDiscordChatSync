const WebSocket = require("ws")
const Discord = require("discord.js")

const client = new Discord.Client({intents: new Discord.Intents(32767)})


let wss = new WebSocket.Server({port: 5555})

console.log("Schreibe nun /connect localhost:5555 in den Minecraft Chat")
wss.on("connection", (socket) => {
    console.log("Verbunden!")

    client.on("messageCreate", (message) => {
        if(message.channel.id !== "991272160217796648" || message.author.bot) return

        socket.send(JSON.stringify({
            body: {
                commandLine: `/tellraw @a {"rawtext": [{"text": "§r§8(§9Discord§8) §7${message.author.tag} §8> ${message.content}"}]}`,
                version: 1
            },
            header: {
                requestId: uuid(),
                messagePurpose: "commandRequest",
                version: 1
            }
        }))
    })

    socket.send(JSON.stringify({
        header: {
            version: 1,
            requestId: uuid(),
            messageType: "commandRequest",
            messagePurpose: "subscribe"
        },
        body: {
            eventName: "PlayerMessage"
        }
    }))

    socket.on("message", (packet) => {
        let data = JSON.parse(packet)
        console.log(data)
        if(data.header.eventName == "PlayerMessage" && data.body.type == "chat"){
            client.guilds.cache.get("926761793559363615").channels.cache.get("991272160217796648").send({embeds: [
                new Discord.MessageEmbed()
                .setAuthor({name: data.body.sender})
                .setDescription(data.body.message)
                .setFooter({text: "Discord & Minecraft Chat :D"})
                .setTimestamp()
                .setColor("RANDOM")
            ]})
        }
    })
})

function uuid(){
    var chars = "0123456789abcdef";
    var random_1 = '';
    var random_2 = '';
    var random_3 = '';
    var random_4 = '';
    var random_5 = '';
    for(var i=0; i<8; i++){
	    var rnum = Math.floor(Math.random() * chars.length)
    	random_1 += chars.substring(rnum,rnum+1)
    }
    for(var i=0; i<4; i++){
	    var rnum = Math.floor(Math.random() * chars.length)
	    random_2 += chars.substring(rnum,rnum+1)
	}
	for(var i=0; i<4; i++){
		var rnum = Math.floor(Math.random() * chars.length)
		random_3 += chars.substring(rnum,rnum+1)
	}
	for(var i=0; i<4; i++){
		var rnum = Math.floor(Math.random() * chars.length)
		random_4 += chars.substring(rnum,rnum+1)
	}
    for(var i=0; i<12; i++){
	    var rnum = Math.floor(Math.random() * chars.length)
    	random_5 += chars.substring(rnum,rnum+1)
    }
    return random_1 + "-" + random_2 + "-" + random_3 + "-" + random_4 + "-" + random_5
}

client.login("")

//By DerCoderJo
