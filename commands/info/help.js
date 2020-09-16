const { MessageEmbed } = require('discord.js');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    description: 'Displays bot help message.',
    usage: `help [commandName]`,
    run: async (client, message, args) => {
        await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) console.error(err)
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: process.env.PREFIX,
                    logChannelID: null
                });
    
                newGuild.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
            }
        });

        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return helpMSG(client, message);
        }
    }
}

async function helpMSG(client, message) {
    const guildDB = await Guild.findOne({
        guildID: message.guild.id
    });

    const embed = new MessageEmbed()
        .setColor(process.env.COLOR)
        .setTitle('Discord.js Tutorials')
        .setThumbnail(client.user.avatarURL())
        .setDescription(`For a full list of commands, please type \`${guildDB.prefix}commands\` \n\nTo see more info about a specific command, please type \`${guildDB.prefix}help <command>\` without the \`<>\``)
        .addField('About', "This bot is used for Sleepless Kyru's Discord.js tutorial series on YouTube! Please consider subscribiing if you like this type of content :smile:")
        .addField('Links', "[YouTube](https://www.youtube.com/channel/UCeujGfgR1JARTyQyfnlQBrA)\n[Twitch](https://www.twitch.tv/sleeplesskyru)\n[Twitter](https://twitter.com/SleeplessKyruRL)\n[Sleepless' Main Discord Server](https://discord.gg/WKDeFzz)")
        .setFooter('Created by Sleepless Kyru#7615');
    message.channel.send(embed);
}

async function getCMD(client, message, input) {
    const guildDB = await Guild.findOne({
        guildID: message.guild.id
    });

    const embed = new MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `No information found for command **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor('#ff0000').setDescription(info));
    }

    if (cmd.name) info = `**Command Name**: ${cmd.name}`
    if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`{a}\``).join(', ')}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${guildDB.prefix}${cmd.usage}`;
        embed.setFooter('<> = REQUIRED | [] = OPTIONAL')
    }
    if (cmd.usage2) info += `\n**Usage 2**: ${guildDB.prefix}${cmd.usage2}`;

    return message.channel.send(embed.setColor(process.env.COLOR).setDescription(info));
}