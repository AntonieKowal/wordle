/*
The purpose of this module is to generate a large bank of words based on certain parameters optionally provided by the user,
or if no argument is provided the word bank will be generated using default values provided by the module.

This wordbank-generating logic shouldn't necessarily be abstracted away intoto its own module normally but the purpose of this small app is practice!
*/

// This package is used to provide a large array of words to populate the word bank if the src option is set to 'external'
import dictionary from 'an-array-of-english-words' // https://www.npmjs.com/package/an-array-of-english-words

/*
TODO:
if an options key is not present, fall back to the default value.
*/
export default function (options = {
    wordLength: 5,
    src: 'external',
    duplicateLetters: false
}) {
    function filterWords(words) {
        // Filter out our word bank to contain only words with the length set within the game-settings.js file
        words = words.filter((word) => word.length == options.wordLength);

        // Words that contain duplicate letters will be filtered out based on the boolean value set in the settings file
        if (!options.duplicateLetters) {
			words = words.filter((word) => {
				// This line isn't as immediately readable but the code is explained in the blog post.
				// This is simply a succinct way to check whether or not a word contains any letter more than once.
				// If it does contain duplicates, the line of code will return true.
				// We want to reverse this with a leading '!' so that JavaScript's filter will know to filter out the word with a false value.
				// So... If the word contains duplicates (if true), we want to return false (if !true) to the filter function so that the word is removed.
				return !word.split('').some((val, i) => word.indexOf(val) !== i); // https://www.javascriptfullstack.com/how-to-check-if-array-contains-duplicate-values
			});
		}

        // This should probably be reduced to one filter call instead of running through twice.

        return words;
    }

    let wordbank = [];
    if (options.src == 'local') {
        console.log('local selected, logic not complete');
        // Read from 'words.txt', generate into an array, call filterWords on array.
    } else if (options.src == 'external') {
		wordbank = filterWords(dictionary);
	}

    return wordbank;
}




// export default wordbank;
