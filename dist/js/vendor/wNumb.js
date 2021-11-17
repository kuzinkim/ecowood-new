(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.wNumb = factory();
    }

}(function(){

	'use strict';

var FormatOptions = [
	'decimals',
	'thousand',
	'mark',
	'prefix',
	'suffix',
	'encoder',
	'decoder',
	'negativeBefore',
	'negative',
	'edit',
	'undo'
];

// General

	// Reverse a string
	function strReverse ( a ) {
		return a.split('').reverse().join('');
	}

	// Check if a string starts with a specified prefix.
	function strStartsWith ( input, match ) {
		return input.substring(0, match.length) === match;
	}

	// Check is a string ends in a specified suffix.
	function strEndsWith ( input, match ) {
		return input.slice(-1 * match.length) === match;
	}

	// Throw an error if formatting options are incompatible.
	function throwEqualError( F, a, b ) {
		if ( (F[a] || F[b]) && (F[a] === F[b]) ) {
			throw new Error(a);
		}
	}

	// Check if a number is finite and not NaN
	function isValidNumber ( input ) {
		return typeof input === 'number' && isFinite( input );
	}

	// Provide rounding-accurate toFixed method.
	// Borrowed: http://stackoverflow.com/a/21323330/775265
	function toFixed ( value, exp ) {
		value = value.toString().split('e');
		value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));
		value = value.toString().split('e');
		return (+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp))).toFixed(exp);
	}


// Formatting

	// Accept a number as input, output formatted string.
	function formatTo ( decimals, thousand, mark, prefix, suffix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

		var originalInput = input, inputIsNegative, inputPieces, inputBase, inputDecimals = '', output = '';

		// Apply user encoder to the input.
		// Expected outcome: number.
		if ( encoder ) {
			input = encoder(input);
		}

		// Stop if no valid number was provided, the number is infinite or NaN.
		if ( !isValidNumber(input) ) {
			return false;
		}

		// Rounding away decimals might cause a value of -0
		// when using very small ranges. Remove those cases.
		if ( decimals !== false && parseFloat(input.toFixed(decimals)) === 0 ) {
			input = 0;
		}

		// Formatting is done on absolute numbers,
		// decorated by an optional negative symbol.
		if ( input < 0 ) {
			inputIsNegative = true;
			input = Math.abs(input);
		}

		// Reduce the number of decimals to the specified option.
		if ( decimals !== false ) {
			input = toFixed( input, decimals );
		}

		// Transform the number into a string, so it can be split.
		input = input.toString();

		// Break the number on the decimal separator.
		if ( input.indexOf('.') !== -1 ) {
			inputPieces = input.split('.');

			inputBase = inputPieces[0];

			if ( mark ) {
				inputDecimals = mark + inputPieces[1];
			}

		} else {

		// If it isn't split, the entire number will do.
			inputBase = input;
		}

		// Group numbers in sets of three.
		if ( thousand ) {
			inputBase = strReverse(inputBase).match(/.{1,3}/g);
			inputBase = strReverse(inputBase.join( strReverse( thousand ) ));
		}

		// If the number is negative, prefix with negation symbol.
		if ( inputIsNegative && negativeBefore ) {
			output += negativeBefore;
		}

		// Prefix the number
		if ( prefix ) {
			output += prefix;
		}

		// Normal negative option comes after the prefix. Defaults to '-'.
		if ( inputIsNegative && negative ) {
			output += negative;
		}

		// Append the actual number.
		output += inputBase;
		output += inputDecimals;

		// Apply the suffix.
		if ( suffix ) {
			output += suffix;
		}

		// Run the output through a user-specified post-formatter.
		if ( edit ) {
			output = edit ( output, originalInput );
		}

		// All done.
		return output;
	}

	// Accept a sting as input, output decoded number.
	function formatFrom ( decimals, thousand, mark, prefix, suffix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

		var originalInput = input, inputIsNegative, output = '';

		// User defined pre-decoder. Result must be a non empty string.
		if ( undo ) {
			input = undo(input);
		}

		// Test the input. Can't be empty.
		if ( !input || typeof input !== 'string' ) {
			return false;
		}

		// If the string starts with the negativeBefore value: remove it.
		// Remember is was there, the number is negative.
		if ( negativeBefore && strStartsWith(input, negativeBefore) ) {
			input = input.replace(negativeBefore, '');
			inputIsNegative = true;
		}

		// Repeat the same procedure for the prefix.
		if ( prefix && strStartsWith(input, prefix) ) {
			input = input.replace(prefix, '');
		}

		// And again for negative.
		if ( negative && strStartsWith(input, negative) ) {
			input = input.replace(negative, '');
			inputIsNegative = true;
		}

		// Remove the suffix.
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
		if ( suffix && strEndsWith(input, suffix) ) {
			input = input.slice(0, -1 * suffix.length);
		}

		// Remove the thousand grouping.
		if ( thousand ) {
			input = input.split(thousand).join('');
		}

		// Set the decimal separator back to period.
		if ( mark ) {
			input = input.replace(mark, '.');
		}

		// Prepend the negative symbol.
		if ( inputIsNegative ) {
			output += '-';
		}

		// Add the number
		output += input;

		// Trim all non-numeric characters (allow '.' and '-');
		output = output.replace(/[^0-9\.\-.]/g, '');

		// The value contains no parse-able number.
		if ( output === '' ) {
			return false;
		}

		// Covert to number.
		output = Number(output);

		// Run the user-specified post-decoder.
		if ( decoder ) {
			output = decoder(output);
		}

		// Check is the output is valid, otherwise: return false.
		if ( !isValidNumber(output) ) {
			return false;
		}

		return output;
	}


// Framework

	// Validate formatting options
	function validate ( inputOptions ) {

		var i, optionName, optionValue,
			filteredOptions = {};

		if ( inputOptions['suffix'] === undefined ) {
			inputOptions['suffix'] = inputOptions['postfix'];
		}

		for ( i = 0; i < FormatOptions.length; i+=1 ) {

			optionName = FormatOptions[i];
			optionValue = inputOptions[optionName];

			if ( optionValue === undefined ) {

				// Only default if negativeBefore isn't set.
				if ( optionName === 'negative' && !filteredOptions.negativeBefore ) {
					filteredOptions[optionName] = '-';
				// Don't set a default for mark when 'thousand' is set.
				} else if ( optionName === 'mark' && filteredOptions.thousand !== '.' ) {
					filteredOptions[optionName] = '.';
				} else {
					filteredOptions[optionName] = false;
				}

			// Floating points in JS are stable up to 7 decimals.
			} else if ( optionName === 'decimals' ) {
				if ( optionValue >= 0 && optionValue < 8 ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}

			// These options, when provided, must be functions.
			} else if ( optionName === 'encoder' || optionName === 'decoder' || optionName === 'edit' || optionName === 'undo' ) {
				if ( typeof optionValue === 'function' ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}

			// Other options are strings.
			} else {

				if ( typeof optionValue === 'string' ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}
			}
		}

		// Some values can't be extracted from a
		// string if certain combinations are present.
		throwEqualError(filteredOptions, 'mark', 'thousand');
		throwEqualError(filteredOptions, 'prefix', 'negative');
		throwEqualError(filteredOptions, 'prefix', 'negativeBefore');

		return filteredOptions;
	}

	// Pass all options as function arguments
	function passAll ( options, method, input ) {
		var i, args = [];

		// Add all options in order of FormatOptions
		for ( i = 0; i < FormatOptions.length; i+=1 ) {
			args.push(options[FormatOptions[i]]);
		}

		// Append the input, then call the method, presenting all
		// options as arguments.
		args.push(input);
		return method.apply('', args);
	}

	function wNumb ( options ) {

		if ( !(this instanceof wNumb) ) {
			return new wNumb ( options );
		}

		if ( typeof options !== "object" ) {
			return;
		}

		options = validate(options);

		// Call 'formatTo' with proper arguments.
		this.to = function ( input ) {
			return passAll(options, formatTo, input);
		};

		// Call 'formatFrom' with proper arguments.
		this.from = function ( input ) {
			return passAll(options, formatFrom, input);
		};
	}

	return wNumb;

}));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ2ZW5kb3Ivd051bWIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChmYWN0b3J5KSB7XHJcblxyXG4gICAgaWYgKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XHJcblxyXG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuICAgICAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcclxuXHJcbiAgICAgICAgLy8gTm9kZS9Db21tb25KU1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xyXG4gICAgICAgIHdpbmRvdy53TnVtYiA9IGZhY3RvcnkoKTtcclxuICAgIH1cclxuXHJcbn0oZnVuY3Rpb24oKXtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEZvcm1hdE9wdGlvbnMgPSBbXHJcblx0J2RlY2ltYWxzJyxcclxuXHQndGhvdXNhbmQnLFxyXG5cdCdtYXJrJyxcclxuXHQncHJlZml4JyxcclxuXHQnc3VmZml4JyxcclxuXHQnZW5jb2RlcicsXHJcblx0J2RlY29kZXInLFxyXG5cdCduZWdhdGl2ZUJlZm9yZScsXHJcblx0J25lZ2F0aXZlJyxcclxuXHQnZWRpdCcsXHJcblx0J3VuZG8nXHJcbl07XHJcblxyXG4vLyBHZW5lcmFsXHJcblxyXG5cdC8vIFJldmVyc2UgYSBzdHJpbmdcclxuXHRmdW5jdGlvbiBzdHJSZXZlcnNlICggYSApIHtcclxuXHRcdHJldHVybiBhLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJyk7XHJcblx0fVxyXG5cclxuXHQvLyBDaGVjayBpZiBhIHN0cmluZyBzdGFydHMgd2l0aCBhIHNwZWNpZmllZCBwcmVmaXguXHJcblx0ZnVuY3Rpb24gc3RyU3RhcnRzV2l0aCAoIGlucHV0LCBtYXRjaCApIHtcclxuXHRcdHJldHVybiBpbnB1dC5zdWJzdHJpbmcoMCwgbWF0Y2gubGVuZ3RoKSA9PT0gbWF0Y2g7XHJcblx0fVxyXG5cclxuXHQvLyBDaGVjayBpcyBhIHN0cmluZyBlbmRzIGluIGEgc3BlY2lmaWVkIHN1ZmZpeC5cclxuXHRmdW5jdGlvbiBzdHJFbmRzV2l0aCAoIGlucHV0LCBtYXRjaCApIHtcclxuXHRcdHJldHVybiBpbnB1dC5zbGljZSgtMSAqIG1hdGNoLmxlbmd0aCkgPT09IG1hdGNoO1xyXG5cdH1cclxuXHJcblx0Ly8gVGhyb3cgYW4gZXJyb3IgaWYgZm9ybWF0dGluZyBvcHRpb25zIGFyZSBpbmNvbXBhdGlibGUuXHJcblx0ZnVuY3Rpb24gdGhyb3dFcXVhbEVycm9yKCBGLCBhLCBiICkge1xyXG5cdFx0aWYgKCAoRlthXSB8fCBGW2JdKSAmJiAoRlthXSA9PT0gRltiXSkgKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihhKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIENoZWNrIGlmIGEgbnVtYmVyIGlzIGZpbml0ZSBhbmQgbm90IE5hTlxyXG5cdGZ1bmN0aW9uIGlzVmFsaWROdW1iZXIgKCBpbnB1dCApIHtcclxuXHRcdHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInICYmIGlzRmluaXRlKCBpbnB1dCApO1xyXG5cdH1cclxuXHJcblx0Ly8gUHJvdmlkZSByb3VuZGluZy1hY2N1cmF0ZSB0b0ZpeGVkIG1ldGhvZC5cclxuXHQvLyBCb3Jyb3dlZDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjEzMjMzMzAvNzc1MjY1XHJcblx0ZnVuY3Rpb24gdG9GaXhlZCAoIHZhbHVlLCBleHAgKSB7XHJcblx0XHR2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJ2UnKTtcclxuXHRcdHZhbHVlID0gTWF0aC5yb3VuZCgrKHZhbHVlWzBdICsgJ2UnICsgKHZhbHVlWzFdID8gKCt2YWx1ZVsxXSArIGV4cCkgOiBleHApKSk7XHJcblx0XHR2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJ2UnKTtcclxuXHRcdHJldHVybiAoKyh2YWx1ZVswXSArICdlJyArICh2YWx1ZVsxXSA/ICgrdmFsdWVbMV0gLSBleHApIDogLWV4cCkpKS50b0ZpeGVkKGV4cCk7XHJcblx0fVxyXG5cclxuXHJcbi8vIEZvcm1hdHRpbmdcclxuXHJcblx0Ly8gQWNjZXB0IGEgbnVtYmVyIGFzIGlucHV0LCBvdXRwdXQgZm9ybWF0dGVkIHN0cmluZy5cclxuXHRmdW5jdGlvbiBmb3JtYXRUbyAoIGRlY2ltYWxzLCB0aG91c2FuZCwgbWFyaywgcHJlZml4LCBzdWZmaXgsIGVuY29kZXIsIGRlY29kZXIsIG5lZ2F0aXZlQmVmb3JlLCBuZWdhdGl2ZSwgZWRpdCwgdW5kbywgaW5wdXQgKSB7XHJcblxyXG5cdFx0dmFyIG9yaWdpbmFsSW5wdXQgPSBpbnB1dCwgaW5wdXRJc05lZ2F0aXZlLCBpbnB1dFBpZWNlcywgaW5wdXRCYXNlLCBpbnB1dERlY2ltYWxzID0gJycsIG91dHB1dCA9ICcnO1xyXG5cclxuXHRcdC8vIEFwcGx5IHVzZXIgZW5jb2RlciB0byB0aGUgaW5wdXQuXHJcblx0XHQvLyBFeHBlY3RlZCBvdXRjb21lOiBudW1iZXIuXHJcblx0XHRpZiAoIGVuY29kZXIgKSB7XHJcblx0XHRcdGlucHV0ID0gZW5jb2RlcihpbnB1dCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU3RvcCBpZiBubyB2YWxpZCBudW1iZXIgd2FzIHByb3ZpZGVkLCB0aGUgbnVtYmVyIGlzIGluZmluaXRlIG9yIE5hTi5cclxuXHRcdGlmICggIWlzVmFsaWROdW1iZXIoaW5wdXQpICkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUm91bmRpbmcgYXdheSBkZWNpbWFscyBtaWdodCBjYXVzZSBhIHZhbHVlIG9mIC0wXHJcblx0XHQvLyB3aGVuIHVzaW5nIHZlcnkgc21hbGwgcmFuZ2VzLiBSZW1vdmUgdGhvc2UgY2FzZXMuXHJcblx0XHRpZiAoIGRlY2ltYWxzICE9PSBmYWxzZSAmJiBwYXJzZUZsb2F0KGlucHV0LnRvRml4ZWQoZGVjaW1hbHMpKSA9PT0gMCApIHtcclxuXHRcdFx0aW5wdXQgPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEZvcm1hdHRpbmcgaXMgZG9uZSBvbiBhYnNvbHV0ZSBudW1iZXJzLFxyXG5cdFx0Ly8gZGVjb3JhdGVkIGJ5IGFuIG9wdGlvbmFsIG5lZ2F0aXZlIHN5bWJvbC5cclxuXHRcdGlmICggaW5wdXQgPCAwICkge1xyXG5cdFx0XHRpbnB1dElzTmVnYXRpdmUgPSB0cnVlO1xyXG5cdFx0XHRpbnB1dCA9IE1hdGguYWJzKGlucHV0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZWR1Y2UgdGhlIG51bWJlciBvZiBkZWNpbWFscyB0byB0aGUgc3BlY2lmaWVkIG9wdGlvbi5cclxuXHRcdGlmICggZGVjaW1hbHMgIT09IGZhbHNlICkge1xyXG5cdFx0XHRpbnB1dCA9IHRvRml4ZWQoIGlucHV0LCBkZWNpbWFscyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRyYW5zZm9ybSB0aGUgbnVtYmVyIGludG8gYSBzdHJpbmcsIHNvIGl0IGNhbiBiZSBzcGxpdC5cclxuXHRcdGlucHV0ID0gaW5wdXQudG9TdHJpbmcoKTtcclxuXHJcblx0XHQvLyBCcmVhayB0aGUgbnVtYmVyIG9uIHRoZSBkZWNpbWFsIHNlcGFyYXRvci5cclxuXHRcdGlmICggaW5wdXQuaW5kZXhPZignLicpICE9PSAtMSApIHtcclxuXHRcdFx0aW5wdXRQaWVjZXMgPSBpbnB1dC5zcGxpdCgnLicpO1xyXG5cclxuXHRcdFx0aW5wdXRCYXNlID0gaW5wdXRQaWVjZXNbMF07XHJcblxyXG5cdFx0XHRpZiAoIG1hcmsgKSB7XHJcblx0XHRcdFx0aW5wdXREZWNpbWFscyA9IG1hcmsgKyBpbnB1dFBpZWNlc1sxXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0Ly8gSWYgaXQgaXNuJ3Qgc3BsaXQsIHRoZSBlbnRpcmUgbnVtYmVyIHdpbGwgZG8uXHJcblx0XHRcdGlucHV0QmFzZSA9IGlucHV0O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEdyb3VwIG51bWJlcnMgaW4gc2V0cyBvZiB0aHJlZS5cclxuXHRcdGlmICggdGhvdXNhbmQgKSB7XHJcblx0XHRcdGlucHV0QmFzZSA9IHN0clJldmVyc2UoaW5wdXRCYXNlKS5tYXRjaCgvLnsxLDN9L2cpO1xyXG5cdFx0XHRpbnB1dEJhc2UgPSBzdHJSZXZlcnNlKGlucHV0QmFzZS5qb2luKCBzdHJSZXZlcnNlKCB0aG91c2FuZCApICkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElmIHRoZSBudW1iZXIgaXMgbmVnYXRpdmUsIHByZWZpeCB3aXRoIG5lZ2F0aW9uIHN5bWJvbC5cclxuXHRcdGlmICggaW5wdXRJc05lZ2F0aXZlICYmIG5lZ2F0aXZlQmVmb3JlICkge1xyXG5cdFx0XHRvdXRwdXQgKz0gbmVnYXRpdmVCZWZvcmU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUHJlZml4IHRoZSBudW1iZXJcclxuXHRcdGlmICggcHJlZml4ICkge1xyXG5cdFx0XHRvdXRwdXQgKz0gcHJlZml4O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIE5vcm1hbCBuZWdhdGl2ZSBvcHRpb24gY29tZXMgYWZ0ZXIgdGhlIHByZWZpeC4gRGVmYXVsdHMgdG8gJy0nLlxyXG5cdFx0aWYgKCBpbnB1dElzTmVnYXRpdmUgJiYgbmVnYXRpdmUgKSB7XHJcblx0XHRcdG91dHB1dCArPSBuZWdhdGl2ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBBcHBlbmQgdGhlIGFjdHVhbCBudW1iZXIuXHJcblx0XHRvdXRwdXQgKz0gaW5wdXRCYXNlO1xyXG5cdFx0b3V0cHV0ICs9IGlucHV0RGVjaW1hbHM7XHJcblxyXG5cdFx0Ly8gQXBwbHkgdGhlIHN1ZmZpeC5cclxuXHRcdGlmICggc3VmZml4ICkge1xyXG5cdFx0XHRvdXRwdXQgKz0gc3VmZml4O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJ1biB0aGUgb3V0cHV0IHRocm91Z2ggYSB1c2VyLXNwZWNpZmllZCBwb3N0LWZvcm1hdHRlci5cclxuXHRcdGlmICggZWRpdCApIHtcclxuXHRcdFx0b3V0cHV0ID0gZWRpdCAoIG91dHB1dCwgb3JpZ2luYWxJbnB1dCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFsbCBkb25lLlxyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9XHJcblxyXG5cdC8vIEFjY2VwdCBhIHN0aW5nIGFzIGlucHV0LCBvdXRwdXQgZGVjb2RlZCBudW1iZXIuXHJcblx0ZnVuY3Rpb24gZm9ybWF0RnJvbSAoIGRlY2ltYWxzLCB0aG91c2FuZCwgbWFyaywgcHJlZml4LCBzdWZmaXgsIGVuY29kZXIsIGRlY29kZXIsIG5lZ2F0aXZlQmVmb3JlLCBuZWdhdGl2ZSwgZWRpdCwgdW5kbywgaW5wdXQgKSB7XHJcblxyXG5cdFx0dmFyIG9yaWdpbmFsSW5wdXQgPSBpbnB1dCwgaW5wdXRJc05lZ2F0aXZlLCBvdXRwdXQgPSAnJztcclxuXHJcblx0XHQvLyBVc2VyIGRlZmluZWQgcHJlLWRlY29kZXIuIFJlc3VsdCBtdXN0IGJlIGEgbm9uIGVtcHR5IHN0cmluZy5cclxuXHRcdGlmICggdW5kbyApIHtcclxuXHRcdFx0aW5wdXQgPSB1bmRvKGlucHV0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUZXN0IHRoZSBpbnB1dC4gQ2FuJ3QgYmUgZW1wdHkuXHJcblx0XHRpZiAoICFpbnB1dCB8fCB0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnICkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWYgdGhlIHN0cmluZyBzdGFydHMgd2l0aCB0aGUgbmVnYXRpdmVCZWZvcmUgdmFsdWU6IHJlbW92ZSBpdC5cclxuXHRcdC8vIFJlbWVtYmVyIGlzIHdhcyB0aGVyZSwgdGhlIG51bWJlciBpcyBuZWdhdGl2ZS5cclxuXHRcdGlmICggbmVnYXRpdmVCZWZvcmUgJiYgc3RyU3RhcnRzV2l0aChpbnB1dCwgbmVnYXRpdmVCZWZvcmUpICkge1xyXG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UobmVnYXRpdmVCZWZvcmUsICcnKTtcclxuXHRcdFx0aW5wdXRJc05lZ2F0aXZlID0gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZXBlYXQgdGhlIHNhbWUgcHJvY2VkdXJlIGZvciB0aGUgcHJlZml4LlxyXG5cdFx0aWYgKCBwcmVmaXggJiYgc3RyU3RhcnRzV2l0aChpbnB1dCwgcHJlZml4KSApIHtcclxuXHRcdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKHByZWZpeCwgJycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFuZCBhZ2FpbiBmb3IgbmVnYXRpdmUuXHJcblx0XHRpZiAoIG5lZ2F0aXZlICYmIHN0clN0YXJ0c1dpdGgoaW5wdXQsIG5lZ2F0aXZlKSApIHtcclxuXHRcdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKG5lZ2F0aXZlLCAnJyk7XHJcblx0XHRcdGlucHV0SXNOZWdhdGl2ZSA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVtb3ZlIHRoZSBzdWZmaXguXHJcblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TdHJpbmcvc2xpY2VcclxuXHRcdGlmICggc3VmZml4ICYmIHN0ckVuZHNXaXRoKGlucHV0LCBzdWZmaXgpICkge1xyXG5cdFx0XHRpbnB1dCA9IGlucHV0LnNsaWNlKDAsIC0xICogc3VmZml4Lmxlbmd0aCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVtb3ZlIHRoZSB0aG91c2FuZCBncm91cGluZy5cclxuXHRcdGlmICggdGhvdXNhbmQgKSB7XHJcblx0XHRcdGlucHV0ID0gaW5wdXQuc3BsaXQodGhvdXNhbmQpLmpvaW4oJycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNldCB0aGUgZGVjaW1hbCBzZXBhcmF0b3IgYmFjayB0byBwZXJpb2QuXHJcblx0XHRpZiAoIG1hcmsgKSB7XHJcblx0XHRcdGlucHV0ID0gaW5wdXQucmVwbGFjZShtYXJrLCAnLicpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFByZXBlbmQgdGhlIG5lZ2F0aXZlIHN5bWJvbC5cclxuXHRcdGlmICggaW5wdXRJc05lZ2F0aXZlICkge1xyXG5cdFx0XHRvdXRwdXQgKz0gJy0nO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFkZCB0aGUgbnVtYmVyXHJcblx0XHRvdXRwdXQgKz0gaW5wdXQ7XHJcblxyXG5cdFx0Ly8gVHJpbSBhbGwgbm9uLW51bWVyaWMgY2hhcmFjdGVycyAoYWxsb3cgJy4nIGFuZCAnLScpO1xyXG5cdFx0b3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL1teMC05XFwuXFwtLl0vZywgJycpO1xyXG5cclxuXHRcdC8vIFRoZSB2YWx1ZSBjb250YWlucyBubyBwYXJzZS1hYmxlIG51bWJlci5cclxuXHRcdGlmICggb3V0cHV0ID09PSAnJyApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENvdmVydCB0byBudW1iZXIuXHJcblx0XHRvdXRwdXQgPSBOdW1iZXIob3V0cHV0KTtcclxuXHJcblx0XHQvLyBSdW4gdGhlIHVzZXItc3BlY2lmaWVkIHBvc3QtZGVjb2Rlci5cclxuXHRcdGlmICggZGVjb2RlciApIHtcclxuXHRcdFx0b3V0cHV0ID0gZGVjb2RlcihvdXRwdXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENoZWNrIGlzIHRoZSBvdXRwdXQgaXMgdmFsaWQsIG90aGVyd2lzZTogcmV0dXJuIGZhbHNlLlxyXG5cdFx0aWYgKCAhaXNWYWxpZE51bWJlcihvdXRwdXQpICkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9XHJcblxyXG5cclxuLy8gRnJhbWV3b3JrXHJcblxyXG5cdC8vIFZhbGlkYXRlIGZvcm1hdHRpbmcgb3B0aW9uc1xyXG5cdGZ1bmN0aW9uIHZhbGlkYXRlICggaW5wdXRPcHRpb25zICkge1xyXG5cclxuXHRcdHZhciBpLCBvcHRpb25OYW1lLCBvcHRpb25WYWx1ZSxcclxuXHRcdFx0ZmlsdGVyZWRPcHRpb25zID0ge307XHJcblxyXG5cdFx0aWYgKCBpbnB1dE9wdGlvbnNbJ3N1ZmZpeCddID09PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdGlucHV0T3B0aW9uc1snc3VmZml4J10gPSBpbnB1dE9wdGlvbnNbJ3Bvc3RmaXgnXTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKCBpID0gMDsgaSA8IEZvcm1hdE9wdGlvbnMubGVuZ3RoOyBpKz0xICkge1xyXG5cclxuXHRcdFx0b3B0aW9uTmFtZSA9IEZvcm1hdE9wdGlvbnNbaV07XHJcblx0XHRcdG9wdGlvblZhbHVlID0gaW5wdXRPcHRpb25zW29wdGlvbk5hbWVdO1xyXG5cclxuXHRcdFx0aWYgKCBvcHRpb25WYWx1ZSA9PT0gdW5kZWZpbmVkICkge1xyXG5cclxuXHRcdFx0XHQvLyBPbmx5IGRlZmF1bHQgaWYgbmVnYXRpdmVCZWZvcmUgaXNuJ3Qgc2V0LlxyXG5cdFx0XHRcdGlmICggb3B0aW9uTmFtZSA9PT0gJ25lZ2F0aXZlJyAmJiAhZmlsdGVyZWRPcHRpb25zLm5lZ2F0aXZlQmVmb3JlICkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gJy0nO1xyXG5cdFx0XHRcdC8vIERvbid0IHNldCBhIGRlZmF1bHQgZm9yIG1hcmsgd2hlbiAndGhvdXNhbmQnIGlzIHNldC5cclxuXHRcdFx0XHR9IGVsc2UgaWYgKCBvcHRpb25OYW1lID09PSAnbWFyaycgJiYgZmlsdGVyZWRPcHRpb25zLnRob3VzYW5kICE9PSAnLicgKSB7XHJcblx0XHRcdFx0XHRmaWx0ZXJlZE9wdGlvbnNbb3B0aW9uTmFtZV0gPSAnLic7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEZsb2F0aW5nIHBvaW50cyBpbiBKUyBhcmUgc3RhYmxlIHVwIHRvIDcgZGVjaW1hbHMuXHJcblx0XHRcdH0gZWxzZSBpZiAoIG9wdGlvbk5hbWUgPT09ICdkZWNpbWFscycgKSB7XHJcblx0XHRcdFx0aWYgKCBvcHRpb25WYWx1ZSA+PSAwICYmIG9wdGlvblZhbHVlIDwgOCApIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9IG9wdGlvblZhbHVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3Iob3B0aW9uTmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gVGhlc2Ugb3B0aW9ucywgd2hlbiBwcm92aWRlZCwgbXVzdCBiZSBmdW5jdGlvbnMuXHJcblx0XHRcdH0gZWxzZSBpZiAoIG9wdGlvbk5hbWUgPT09ICdlbmNvZGVyJyB8fCBvcHRpb25OYW1lID09PSAnZGVjb2RlcicgfHwgb3B0aW9uTmFtZSA9PT0gJ2VkaXQnIHx8IG9wdGlvbk5hbWUgPT09ICd1bmRvJyApIHtcclxuXHRcdFx0XHRpZiAoIHR5cGVvZiBvcHRpb25WYWx1ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHRcdFx0XHRcdGZpbHRlcmVkT3B0aW9uc1tvcHRpb25OYW1lXSA9IG9wdGlvblZhbHVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3Iob3B0aW9uTmFtZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gT3RoZXIgb3B0aW9ucyBhcmUgc3RyaW5ncy5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0aWYgKCB0eXBlb2Ygb3B0aW9uVmFsdWUgPT09ICdzdHJpbmcnICkge1xyXG5cdFx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zW29wdGlvbk5hbWVdID0gb3B0aW9uVmFsdWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihvcHRpb25OYW1lKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBTb21lIHZhbHVlcyBjYW4ndCBiZSBleHRyYWN0ZWQgZnJvbSBhXHJcblx0XHQvLyBzdHJpbmcgaWYgY2VydGFpbiBjb21iaW5hdGlvbnMgYXJlIHByZXNlbnQuXHJcblx0XHR0aHJvd0VxdWFsRXJyb3IoZmlsdGVyZWRPcHRpb25zLCAnbWFyaycsICd0aG91c2FuZCcpO1xyXG5cdFx0dGhyb3dFcXVhbEVycm9yKGZpbHRlcmVkT3B0aW9ucywgJ3ByZWZpeCcsICduZWdhdGl2ZScpO1xyXG5cdFx0dGhyb3dFcXVhbEVycm9yKGZpbHRlcmVkT3B0aW9ucywgJ3ByZWZpeCcsICduZWdhdGl2ZUJlZm9yZScpO1xyXG5cclxuXHRcdHJldHVybiBmaWx0ZXJlZE9wdGlvbnM7XHJcblx0fVxyXG5cclxuXHQvLyBQYXNzIGFsbCBvcHRpb25zIGFzIGZ1bmN0aW9uIGFyZ3VtZW50c1xyXG5cdGZ1bmN0aW9uIHBhc3NBbGwgKCBvcHRpb25zLCBtZXRob2QsIGlucHV0ICkge1xyXG5cdFx0dmFyIGksIGFyZ3MgPSBbXTtcclxuXHJcblx0XHQvLyBBZGQgYWxsIG9wdGlvbnMgaW4gb3JkZXIgb2YgRm9ybWF0T3B0aW9uc1xyXG5cdFx0Zm9yICggaSA9IDA7IGkgPCBGb3JtYXRPcHRpb25zLmxlbmd0aDsgaSs9MSApIHtcclxuXHRcdFx0YXJncy5wdXNoKG9wdGlvbnNbRm9ybWF0T3B0aW9uc1tpXV0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFwcGVuZCB0aGUgaW5wdXQsIHRoZW4gY2FsbCB0aGUgbWV0aG9kLCBwcmVzZW50aW5nIGFsbFxyXG5cdFx0Ly8gb3B0aW9ucyBhcyBhcmd1bWVudHMuXHJcblx0XHRhcmdzLnB1c2goaW5wdXQpO1xyXG5cdFx0cmV0dXJuIG1ldGhvZC5hcHBseSgnJywgYXJncyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB3TnVtYiAoIG9wdGlvbnMgKSB7XHJcblxyXG5cdFx0aWYgKCAhKHRoaXMgaW5zdGFuY2VvZiB3TnVtYikgKSB7XHJcblx0XHRcdHJldHVybiBuZXcgd051bWIgKCBvcHRpb25zICk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0eXBlb2Ygb3B0aW9ucyAhPT0gXCJvYmplY3RcIiApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdG9wdGlvbnMgPSB2YWxpZGF0ZShvcHRpb25zKTtcclxuXHJcblx0XHQvLyBDYWxsICdmb3JtYXRUbycgd2l0aCBwcm9wZXIgYXJndW1lbnRzLlxyXG5cdFx0dGhpcy50byA9IGZ1bmN0aW9uICggaW5wdXQgKSB7XHJcblx0XHRcdHJldHVybiBwYXNzQWxsKG9wdGlvbnMsIGZvcm1hdFRvLCBpbnB1dCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIENhbGwgJ2Zvcm1hdEZyb20nIHdpdGggcHJvcGVyIGFyZ3VtZW50cy5cclxuXHRcdHRoaXMuZnJvbSA9IGZ1bmN0aW9uICggaW5wdXQgKSB7XHJcblx0XHRcdHJldHVybiBwYXNzQWxsKG9wdGlvbnMsIGZvcm1hdEZyb20sIGlucHV0KTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gd051bWI7XHJcblxyXG59KSk7Il0sImZpbGUiOiJ2ZW5kb3Ivd051bWIuanMifQ==
