const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName('generate-emoji-list')
  .setDescription('Generates the emoji list'),
  async execute(interaction, Discord, client, con, arguments) {
        let jsonFile = "```json\n { \n";
        let abcee = "abcedfghijklmnopqrstuvwxyz";
        for (let i = 0; i < abcee.length; i++) {
            jsonFile += `\t"${abcee[i]}": [\n\t\t"blag ${abcee[i]}",\n\t\t"chink ${abcee[i]}",\n\t\t"weed ${abcee[i]}"\n\t],\n`
        }
        jsonFile += "}\n```"
        interaction.reply({content: jsonFile});
    }
}
