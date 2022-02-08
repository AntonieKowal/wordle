<template>
	<div class='container'>
		<h1 id='title'>UNORIGINLE</h1>
		<hr style='width: 100%; margin: 12px 0;'>
		<!-- start word row -->
		<div 
			class='word'
			v-for='word, wordIndex in game'
			:key='wordIndex'
		>
			<!-- start letter cards -->
			<!-- These could probably be components with more comprehensive and explicit state -->
			<div
				class='letter'
				:class="letter.color"
				v-for='letter, letterIndex in word'
				:key='wordIndex + letterIndex'
			>
				{{letter.key}}
			</div>
			<!-- end letter cards -->

		</div>
		<!-- end word row -->

		<!-- start winner/loser screen -->
		<div v-if='scene == "winner"' class='results'>
			<h2>Winner!</h2>
			<br>
			<button @click='resetGame()'>Reset Game?</button>
		</div>
		<div v-if='scene == "loser"' class='results'>
			<h2>Loser!</h2>
			<br>
			<p>The word was:</p>
			<br>
			<h1 style='text-transform: uppercase'>{{word}}</h1>
			<br>
			<button @click='resetGame()'>Reset Game?</button>
		</div>
		<!-- end winner/loser screen -->

		<!-- This element acts as a divider to push the keyboard container to the bottom and the game content to the top. -->
		<div style='flex: 1;'/>
		
		<!-- start keyboard -->
		<Keyboard
			@keyboardClick='processUserInput($event)'
			:keyboard='keyboard'
			:keyboardState='keyboardState'
		/>
		<!-- end keyboard -->
	</div>
</template>

<script>
import Vue from 'vue'
import settings from '../../game-settings.js'
import Keyboard from '@/components/Keyboard.vue'

import wordbank from '../../word-bank.js'

export default {
	name: 'Game',
	components: {
		Keyboard
	},
	created() {
		window.addEventListener('keydown', (e) => {
			// Only allow the handling logic to fire one time per key press.
			if (!e.repeat) {
				this.processUserInput(e.key);
			}
		});
	},
	data() {
		return {
			// Game will be a 2-Dimensional array
			// [
			// 	  [ letter, letter, letter, letter, letter],
			// 	  [ letter, letter, letter, letter, letter],
			// 	  etc...
			// ]
			game: [],

			word: "", // Target word the player is trying to guess
			wordbank: [], // Array of words from which the target will be randomly selected per game. This array will update based on user selected settings.
			wordbankSettings: { // When the player first opens the game, we want to serve the game with default rules set within game-settings.js.
				wordLength: settings.wordLength,
				src: settings.wordsSource,
				duplicateLetters: settings.wordsCanContainDuplicateLetters
			},
			/*
			Assigning the values found within settings to additional state variables here will enable us to add functionality for
			the user to update these values on their own in a settings menu.
			*/
			wordLength: settings.wordLength, // Length of target word
			allowedGuesses: settings.guessCount, // How many guesses the player is allowed before the game is over

			currentWord: 0, // Used to traverse the 2-Dimensional 'game' array by index
			currentLetter: 0, // Used to traverse the 2-Dimensional 'game' array by index

			scene: 'game', // Very simple state variable used to determine what few elements to render to the DOM
			
			keyboards: {
				'qwerty' : [
					'qwertyuiop'.split(''),  // ['q', 'w', 'e', 'r', etc...]
					'asdfghjkl'.split(''),
					['enter', ...'zxcvbnm'.split(''), 'backspace'] // Sometimes, a keyboard key will be a special word like 'backspace' instead of a char.
				]
			},
			keyboard: [], // keyboards['qwerty'] for example
			keyboardState: { // Track which letters have been guessed and categorize them by result.
				'incorrect': [],
				'close': [],
				'correct': [],
			}
		};
	},
	mounted() {
		// wordbank accepts an object as an optional argument with certain options to configure the word bank.
		this.wordbank = wordbank(this.wordbankSettings);
		console.log(this.wordbank);

		// Default the keyboard to the qwerty option
		this.keyboard = this.keyboards['qwerty'];
		
		this.refreshBoard();
	},
	methods: {
		processUserInput(input) {
			input = input.toLowerCase();

			// Check to see if the key pressed is allowed
			const permittedLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
			// const permittedKeys = ['enter', 'backspace'];
			// const permittedInput = permittedLetters.concat(permittedKeys);

			if (
				permittedLetters.includes(input.toLowerCase()) &&
				this.currentLetter < this.wordLength 		   &&
				this.currentWord < this.allowedGuesses
			) {
				let letter = {
					key: input.toLowerCase(),
					color: 'filled' // Used to determine what styling to apply to the tile
				}

				// Arrays are not reactive when changing data by directly referencing an element by index. (ex. arr[3] = 'helloworld' would not be reactive)
				// We must use Vue.set for reactivity to work.
				Vue.set(this.game[this.currentWord], this.currentLetter, letter);

				if (this.currentLetter < this.wordLength) this.currentLetter++;
			}
			
			if (
				input == "enter" 						 &&
				this.currentLetter > this.wordLength - 1 &&
				this.currentWord < this.allowedGuesses
			) {
				this.guessWord();
			}

			// Allow the user to delete a letter with backspace
			if (input == "backspace" && this.currentLetter > 0) {
				const letter = {
					key: "",
					color: ""
				}
				
				// Delete a letter
				this.currentLetter--;
				Vue.set(this.game[this.currentWord], this.currentLetter, letter);
			}
		},
		keyboardPress(key) {
			console.log(key);
		},
		guessWord() {
			let word = this.word.split('');
			let guess = this.game[this.currentWord].map(letter => letter.key);
			// let alreadyGuessedLetters = [
			// 	...this.keyboardState.correct,
			// 	...this.keyboardState.close,
			// 	...this.keyboardState.incorrect
			// ];

			// Guessed 'peels' with the duplicate flag set to false, this is a valid word but does not exist in the array
			// if the duplicate flag is false. We must reference the full array of words or notify the user that
			// their word may not allow duplicate letters.
			
			if (!this.wordbank.includes(guess.join('').toLowerCase())) {
				alert(guess.join('') + ' does not match any word in our dictionary of words.\nPlease enter a valid word.');
				return;
			}


			// Color the tile of each letter based on whether or not it is a match.
			for (let i = 0; i < word.length; i++) {
				
				if (word[i] == guess[i]) { // If the letter matches
					this.game[this.currentWord][i].color = 'green'; // Color the tile Green
					// THIS DOESN'T WORK, THIS 3 ARRAY IDEA. IT NEEDS TO BE A 1-D ARRAY OF OBJECTS TRUST ME
					// MAKE AN OBJECT INSTEAD, WHERE KEYS ARE LETTERS LIKE 'a' and the value is an obj of state.
					// Check if the letter as a key exists in the object. if so, update it. if not, add it.
					if (!this.keyboardState.correct.includes(guess[i])) this.keyboardState.correct.push(guess[i]);
				} else if (word[i] != guess[i] && this.word.includes(guess[i])) { // If the letter does not match position but the letter does exist in the target word
					this.game[this.currentWord][i].color = 'orange'; // Color the tile Orange
					if (!this.keyboardState.close.includes(guess[i])) this.keyboardState.close.push(guess[i]);
				} else if (word[i] != guess[i] && !this.word.includes(guess[i])) { // If the letter does not exist in the target word whatsoever
					this.game[this.currentWord][i].color = 'grey'; // Color the tile Grey
					if (!this.keyboardState.incorrect.includes(guess[i])) this.keyboardState.incorrect.push(guess[i]); // Array of keyboard tiles to color grey
				}
			}
			
			// Evaluate whether or not the game is over
			if (word.join('').toLowerCase() == guess.join('').toLowerCase()) {
				// Winning condition
				this.scene = 'winner';
			} else if (this.currentWord >= this.allowedGuesses - 1) {
				// Losing condition
				this.scene = 'loser';
			}

			this.currentWord++;
			this.currentLetter = 0;
		},
		resetGame() {
			this.refreshBoard();

			// Reset the turn counter back to 0,0 (first letter of first word)
			this.currentWord = 0;
			this.currentLetter = 0;

			this.keyboardState = { 
				'incorrect': [],
				'close': [],
				'correct': []
			}

			this.scene = "game";
		},
		generateEmptyBoard() {
			// Clear the board
			this.game = [];

			// Generate a blank game board
			for (let i = 0; i < this.allowedGuesses; i++) {
				this.game.push(new Array(this.wordLength).fill({}));
			}
		},
		// Choose a word at random from the current wordbank
		selectWord() {
			this.word = this.wordbank[Math.floor(Math.random() * this.wordbank.length)]
		},
		// Refresh the game board to a clear state and re-select a word from the current word bank
		refreshBoard() {
			this.generateEmptyBoard();
			this.selectWord();
		}
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;

	height: 100%;
}

.word {
	display: flex;
	justify-content: space-between;

	margin-bottom: 5px;

	width: 100%;
	max-width: 330px;
}

.letter {
	display: flex;
	justify-content: center;
	align-items: center;

	width: 58px;
	height: 58px;
	border: 2px solid rgb(207, 207, 207);

	text-transform: capitalize;

	font-size: 2rem;
    line-height: 2rem;
    font-weight: bold;
    vertical-align: middle;
}

.filled {
	border-color: black;
	color: black;	
}

.green {
	border-color: #6aaa64;;
	background: #6aaa64;;
	color: white;	
}

.orange {
	border-color: #c9b458;;
	background: #c9b458;;
	color: white;
}

.red {
	border-color: red;
	background: red;
	color: white;
}

.grey {
	border-color: grey;
	background: grey;
	color: white;
}

.results {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	margin: 40px 0;
}

</style>
