const config = require("../config.json");
const botId = config.wordleBotId;
const token = config.wordleToken

const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');

const botInvLink = "https://discord.com/api/oauth2/authorize?client_id=966165556266926111&permissions=3072&scope=applications.commands%20bot"
const {correctList, possibleList} = require('./wordLists');

reloadCommands();

client.commands = new Collection();
commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

commands = [];
commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9'}).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(botId),
      {body: commands},
    );

    console.log('Successfully reloaded application (/) commands.');
  }
  catch (error) {
    console.error(error);
  }
})();

// Load Event files from events folder
const eventFiles = fs.readdirSync('./events/').filter(f => f.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args, client))
    } else {
        client.on(event.name, (...args) => event.execute(...args, client))
    }
}

client.on('interactionCreate', async interaction => {

    commandName = interaction.commandName;
  
    //this little bit is what makes the buttons work in the slash commands
    //it will ignore anything that doesn't have a / command tied to its name
    if (!client.commands.has(commandName)) return;

    client.commands.get(commandName).execute(interaction);

});

//Token needed in config.json
client.login(token);


function reloadCommands() {
  const commandSubFolders = fs.readdirSync('./commands/').filter(f => !f.endsWith('.js'))
  commandSubFolders.forEach(folder => {
      const commandFiles = fs.readdirSync(`./commands/${folder}/`).filter(f => f.endsWith('.js'))
      for (const file of commandFiles) {
          const props = require(`./commands/${folder}/${file}`)
          console.log(`${file} loaded from ${folder}`)
          client.commands.set(props.help.name, props)
      }
  });
}