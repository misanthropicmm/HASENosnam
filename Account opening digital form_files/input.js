/**
 * Input helpers.
 * @module input
 */
define(function(require, exports, module) {
    'use strict';

    /**
     * Get the selection position of an input field
     * @param {element} input the input field to get the caret position
     * @param {Function} formatter function to handle formatting of input field
     */
    exports.getSelectionPositionOfInput = function(input, formatter) {
        var textSelection = [];
        if (!formatter) {
            formatter = function(_input) {
                return _input;
            };
        }

        // get the selection start and end values
        if ('selectionStart' in input) {
            textSelection = [formatter(input.selectionStart), formatter(input.selectionEnd)];
        } else {
            // < IE9 version
            var range = document.selection.createRange();
            if (range && range.parentElement() === input) {
                var textInputRange = input.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());
                textSelection[0] = formatter(textInputRange.moveStart('character', -input.value.length));
                textSelection[1] = formatter(textInputRange.moveEnd('character', -input.value.length));
            }
        }

        return textSelection;
    };

    /**
     * Gets the caret position of an input field after it has been updated
     * @param {element} input        The input field
     * @param {Array}   previousTextSelection  The previous selection on the input before the update
     * @param {Number}  lengthDiff   The difference in length between the previous value and the new value
     * @param {Boolean} isBackspace  If the last keypress was a backspace
     */
    exports.getNewCaretPosition = function(input, previousTextSelection, lengthDiff, isBackspace) {
        var cursorPosition = previousTextSelection[0];

        lengthDiff = previousTextSelection[1] - previousTextSelection[0] + lengthDiff;
        if (lengthDiff <= 0) {
            lengthDiff = 1;
        }
        // reset the selection values if input field is empty
        if (!input.value.length) {
            previousTextSelection = [0, 0];
        }

        if (previousTextSelection[0] === previousTextSelection[1]) {
            // if the nothing is selected in the input field
            if (isBackspace) {
                cursorPosition = previousTextSelection[0] === 0 ? 0 : previousTextSelection[0] - 1;
            } else {
                cursorPosition = previousTextSelection[0] + lengthDiff;
            }
        } else {
            // if something is selected
            if (isBackspace) {
                cursorPosition = previousTextSelection[0];
            } else {
                cursorPosition = previousTextSelection[0] + lengthDiff;
            }
        }

        return cursorPosition;
    };

    /**
     * Sets the caret position of input field an handles the scroll to have the caret centered
     * @param {Element} input the input field to set the caret position of
     * @param {Number} cursorPosition numeric value representing the desired caret position
     * @param {String} content content of input field
     * @param {Element} dummyField dummy field to measure length of text
     */
    exports.setCaretPositionOfInput = function(input, cursorPosition, content, dummyField) {

        var scroll;

        // set the correct cursor position
        if ('setSelectionRange' in input) {
            input.setSelectionRange(cursorPosition, cursorPosition);
        } else {
            // < IE9 version
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', cursorPosition);
            range.moveStart('character', cursorPosition);
            range.select();
        }
        //handle input scroll
        if (content && dummyField) {
            if (content) {
                dummyField.text(content.substr(0, cursorPosition));
            } else {
                dummyField.text('');
            }
            scroll = dummyField.width() - input.offsetWidth / 2;
            input.scrollLeft = scroll;
        }
    };

});
