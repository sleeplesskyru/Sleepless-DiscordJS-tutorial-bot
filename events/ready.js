module.exports = client => {
    console.log('Let\'s get this bread!');
    
    client.user.setPresence({
        status: 'dnd',
        activity: {
            name: 'Discord.js Tutorials',
            type: 'STREAMING',
            url: 'https://twitch.tv/sleeplesskyru'
        }
    });
}