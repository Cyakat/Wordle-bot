const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
  .setName('seperate-emoji-ids')
  .setDescription('seperates the emoji ids'),
  async execute(interaction, Discord, client, con, arguments) {
        emojis = fs.readFileSync("./emojiIDsInOrder.txt").toString();
        console.log(emojis);
        emojisSeperated = emojis.replaceAll("><",">\n<");
        fs.writeFileSync("./emojiIDsSeperated.txt", emojisSeperated);
        interaction.reply("done!");
        

    }
}
