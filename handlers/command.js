const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const table = new ascii().setHeading('Command', 'Status');

module.exports = (client) => {
    readdirSync('./commands/').forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js'));

        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);

            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅ Loaded!');
            } else {
                table.addRow(file, '❌ -> Command failed to load, please check your work again!');
                continue;
            }

            if (pull.aliases && Array.isArray(pull.aliases))
                pull.aliases.forEach(alias => {
                    return client.aliases.set(alias, pull.name);
                });
        }

        console.log(table.toString());
    })
}