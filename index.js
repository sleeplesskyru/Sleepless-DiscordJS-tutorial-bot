const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');

const nodemon = require('nodemon');

const client = new Client();

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync('./commands/');

config({
    path: `${__dirname}/.env`
});

['command'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on('ready', async () => {
    console.log('Lets get this bread!');

    client.user.setPresence({
        status: 'dnd',
        activity: {
            name: 'Discord.js Tutorials',
            type: 'WATCHING'
        }
    });
});

client.on('message', async message => {
    const prefix = (process.env.PREFIX);

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    if (!message.member) message.member = await message.guild.fetchMember (message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command)
        command.run(client, message, args);
});

client.login(process.env.TOKEN);