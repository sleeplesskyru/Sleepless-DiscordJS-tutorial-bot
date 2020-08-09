const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: 'commands',
    aliases: ['c'],
    category: 'info',
    description: 'Displays a full list of bot commands.',
    usage: `commands`,
    run: async (client, message) => {
        return getAll(client, message);
    }
}

async function getAll(client, message) {
    const settings = await Guild.findOne({
        guildID: message.guild.id
    }, (err, guild) => {
        if (err) console.error(err)
        if (!guild) {
            const newGuild = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                guildName: message.guild.name,
                prefix: process.env.PREFIX
            })

            newGuild.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));

            return message.channel.send('This server was not in our database! We have now added and you should be able to use bot commands.').then(m => m.delete({timeout: 10000}));
        }
    });
    
    const embed = new MessageEmbed()
    .setColor(process.env.COLOR)
    .setTitle('Command List')
    .setThumbnail(client.user.avatarURL())
    .setFooter('Created by Sleepless Kyru#7615')
    
    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `\`${settings.prefix + cmd.name}\``)
            .join('\n');
    }

    const info = client.categories
        .map(cat => stripIndents`**${cat[0].toLowerCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => `${string}\n${category}`);

    return message.channel.send(embed.setDescription('Use `' + (`${settings.prefix}help <commandName>\` without the \`<>\` to see more information about a specific command.\n\n${info}`)));
}