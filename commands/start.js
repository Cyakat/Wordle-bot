const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed, MessageCollector } = require("discord.js");
const { correctList, possibleList } = require("../wordLists.json");
const emojiList = require("../emojiList.json");
const { toLower } = require("lodash");

var scoreboard = "";

module.exports = {
  data: new SlashCommandBuilder()
  .setName('start')
  .setDescription('Starts a wordle game'),
  async execute(interaction, Discord, client, con, arguments) {

    //selects a random word from the list of possible correct answers
    // const word = correctList[Math.floor(Math.random() * (correctList.length-1))]; real line keep this
    const word = "apple"
    console.log(word);
    
    //creates a blank array equal to the length of correct word -- keeps user score
    var posArray = []; posArray.fill(0,0,word.length);

    interaction.reply({content: 'Start Guessin!\n\n It\'s totally not ' + word});

    const filter = i => i.user.id === interaction.user.id;

    //creates a new collector
    //expires after 10 minutes
    let collector = new MessageCollector(interaction.channel, {time: 600000 });

      //listens for incoming messages from any user (working on making it for just the user who started the interaction)
        collector.on('collect', async collectorInteraction => {
          let guessWord = collectorInteraction.content;

          //will immediately stop checking everything if the guess word is not equal in length to the correct word
          if (guessWord.length != word.length) return;
          guessWord = toLower(guessWord);

          //if the word is equal in length this checkWord will see if the guessed word is on the list
          if(checkWord(guessWord)) {
            //does all the work of seeing which letters are in correct spots
            comapareWords(word, guessWord);
            interaction.editReply({content: word + "\n" + scoreboard});
            //if the word was correctly guessed then the collector will stop listening for messages and it will reset the scoreboard
            if (word === guessWord) {
              collector.stop();
              console.log("stopped the collector");
              scoreboard = "";
            }
          }
        });
  }

};

//checks if guess word is a valid word
function checkWord(guessWord) {
  for (var i = 0; i < possibleList.length; i++) {
    //if the word is on the list return true
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
      } else {
        posArray[i] = 0;
      }
    }
  }
  //convert current letter to emoji ID
  convertToEmojiId(posArray, guessWord)
  console.log(posArray);
}

//Takes the status number and the guessed word and converts it to an emoji and stuffs it in the scoreboard variable <3
function convertToEmojiId(posArray, guessWord) {
  for (let i = 0; i < guessWord.length; i++) {
    //ex: letter is a and num is 2 it would look like emojiList[a][2] accessing object a and getting the 3rd thing in the list
    scoreboard += " " + emojiList[guessWord[i]][posArray[i]];
    //when the loop reaches the end of the array add a new line
    if(i === guessWord.length) { 
      scoreboard += "\n"; 
    } 
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

^^current data structure
//////////////////////////////////////

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