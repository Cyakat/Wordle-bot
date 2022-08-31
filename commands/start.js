const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed, MessageCollector } = require("discord.js");
const { correctList, possibleList } = require("../wordLists.json");
const emojiList = require("../emojiList.json");

var scoreboard = "";

module.exports = {
  data: new SlashCommandBuilder()
  .setName('start')
  .setDescription('Starts a wordle game'),
  async execute(interaction, Discord, client, con, arguments) {

    //selects a random word from the list of possible correct answers
    const word = correctList[Math.floor(Math.random() * (correctList.length-1))];
    console.log(word);
    
    //creates a blank array equal to the length of correct word -- keeps user score
    var posArray = []; posArray.fill(0,0,word.length);

    interaction.reply({content: 'Start Guessin!\n\n It\'s totally not ' + word});
    const filter = i => i.user.id === interaction.user.id;
    let collector = new MessageCollector(interaction.channel, {time: 600000 });
        collector.on('collect', async collectorInteraction => {
          let guessWord = collectorInteraction.content;
          if(checkWord(guessWord)) {
            comapareWords(word, guessWord);
            interaction.editReply({content: word + "\n" + scoreboard});
            if (word === guessWord) {
              collector.stop();
            }
          }
        });
  }

};

//checks if guess word is a valid word
function checkWord(guessWord) {
  for (var i = 0; i < possibleList.length; i++) {

    if (guessWord === possibleList[i] || guessWord === "alpha") {
      return true;
    }
  }
  return false;
}

// 0 if no match, 1 if letter exists in other word but wrong position, 2 if correct spot
// return the number array corresponding to the word that was just guessed
function comapareWords(word, guessWord) {
  //creates a blank array equal to the length of correct word -- keeps user score
  let posArray = []; posArray.fill(0,0,word.length);

  //see if there are any matching letters
  for(let i = 0; i < guessWord.length; i++) {
    for(let o = 0; o < word.length; o++) {
      //see if same letters are in the word
      if(guessWord[i] === word[o]) {
        posArray[i] = 1;
        //see if same letters are in the word and right position
        if(i === o) {
          posArray[i] = 2;
        }

        //skips to next letter once there is a match
        i++; o = 0;

        //convert current letter to emoji ID
        convertToEmojiId(posArray, guessWord, i)
      }
    }
  }
}

//Takes the status number and the guessed word and converts it to an emoji and stuffs it in the scoreboard variable <3
function convertToEmojiId(posArray, guessWord, i) {
  scoreboard += emojiList[guessWord[i]][posArray[i]];
  if(i === guessWord.length) { 
    scoreboard += "\n"; 
  } 
}



//send command > random word is chosen > user guesses word > check if word is valid > look for matching letters > match emojis to letters 
//> add emoji-filled message to scoreboard array

/*

[bawls]
[apple]
[1,0,0,2,0]

[yellow a, blag,blag,green l, blag]

a: {green a, yellow a , black a}

{
  "a": [
    "emoji ID",
    "emoji ID",
    "emoji ID"
  ]
}

emojiList[letter][number]

{
  "a" : {
    "0" : "emoji ID",
    "1" : "emoji ID",
    "2" : "emoji ID"
  },
  "b" : {},
  "c" : {}
}

emojis.word[i][i];

*/