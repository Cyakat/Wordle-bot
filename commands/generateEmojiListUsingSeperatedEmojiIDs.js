const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
  .setName('generate-emoji-list-emoji-ids')
  .setDescription('Generates the emoji list using the seperated emoji ids'),
  async execute(interaction, Discord, client, con, arguments) {
        let emojiList = [];
        let emojiFile = fs.readFileSync("./emojiIDsSeperated.txt").toString();
        emojiList = emojiFile.split("\n");

        let jsonFile = "{\n";
        let abcee = "abcedfghijklmnopqrstuvwxyz";
        for (let i = 0; i < abcee.length; i++) {
            jsonFile += `\t"${abcee[i]}": [\n\t\t"${emojiList[i]}",\n\t\t"${emojiList[i + 52]}",\n\t\t"${emojiList[i + 26]}"\n\t],\n`
        }
        jsonFile += "}\n"
        fs.writeFileSync("./emojiList.json", jsonFile);
        interaction.reply({content: "done"});
    }
}
