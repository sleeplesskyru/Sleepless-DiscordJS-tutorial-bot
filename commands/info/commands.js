const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

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

function getAll(client, message) {
    const embed = new MessageEmbed()
    .setColor(process.env.COLOR)
    .setTitle('Command List')
    .setThumbnail(client.user.avatarURL())
    .setFooter('Created by Sleepless Kyru#7615')
    
    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${(process.env.PREFIX) + cmd.name}\``)
            .join('\n');
    }

    const info = client.categories
        .map(cat => stripIndents`**${cat[0].toLowerCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => `${string}\\n${category}`);

    return message.channel.send(embed.setDescription('Use `' + (`${process.env.PREFIX}help <commandName>\` without the \`<>\` to see more information about a specific command.\n\n${info}`)));
}