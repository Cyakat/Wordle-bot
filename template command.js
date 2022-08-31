const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName('change-me')
  .setDescription('change me'),
  async execute(interaction, Discord, client, con, arguments) {

    }
}
