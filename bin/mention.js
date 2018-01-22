'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mention = function () {
   /**
   * @class Mention
   * @classdesc Allows using a symbol to display options
   *
   * @param {Object} settings - Options to initialize the component with
   * @param {HTMLElement} settings.input - The textarea to watch {@link Component#input}
   * @param {HTMLElement} settings.optionList - Element to display options when matched {@link Component#optionList}
   * @param {Array} settings.options - Array of options. Options can have properties {@link Component#options}
   * @param {String} [settings.symbol="@"] - The symbol that initials the option list {@link Component#symbol}
   * @param {Function} [settings.match] - The function used to match options {@link Component#match}
   * @param {Function} [settings.template] - The template function outputs the innerHTML of the optionlist {@link Component#template}
   */
   function Mention(settings) {
      _classCallCheck(this, Mention);

      var that = this;
      this.options = settings.options || [];
      this.input = settings.input;
      this.symbol = settings.symbol || '@';
      this.cursorPosition = 0;
      this.hover = 0;
      this.showingOptions = false;
      this.upDownStay = 0;
      this.update = settings.update || function () {};
      this.match = settings.match || this.defaultMatchFunction;
      this.template = settings.template || this.defaultTemplateFunction;
      this.html = {
         input: undefined,
         display: undefined,
         wrapper: undefined,
         optionsList: undefined,
         options: [],
         spans: [] };
      this.setupHTML();
      this.listen();
   }

   /**
   * Function used to match options based on the word
   * @param {String} [word] - The current word ex. @test
   * @param {String} [option] - The options being looped
   * @return {boolean} - If the word matches the option
   */


   _createClass(Mention, [{
      key: 'defaultMatchFunction',
      value: function defaultMatchFunction(word, option) {
         var optionText = option.name || option;
         return !word.length || optionText.startsWith(word.replace('@', ''));
      }

      /**
      * Function returns the template (innerHTML) that will be used for each option
      * @param {String} [option] - The options being looped
      * @return {String} - The innerHTM
      */

   }, {
      key: 'defaultTemplateFunction',
      value: function defaultTemplateFunction(option) {
         return option.name || option;
      }

      /**
      * Sets up the HTML. Wrapper, Display, OptionsList, Options
      */

   }, {
      key: 'setupHTML',
      value: function setupHTML() {
         this.html.input = this.input;
         var computedStyleInput = window.getComputedStyle(this.html.input, "");
         this.html.wrapper = document.createElement('div');
         this.html.wrapper.classList.add('mention-wrapper');
         this.html.wrapper.style.position = 'relative';
         this.html.wrapper.style.width = computedStyleInput.getPropertyValue('width');

         this.html.display = document.createElement('div');
         this.html.display.classList.add('mention-display');
         this.html.input.parentElement.insertBefore(this.html.wrapper, this.html.input);
         this.html.wrapper.appendChild(this.html.input);
         this.html.wrapper.appendChild(this.html.display);

         for (var prop in computedStyleInput) {
            try {
               this.html.display.style[prop] = computedStyleInput[prop];
            } catch (e) {}
         }
         if (/iPhone|iPad|iPod|Edge/i.test(navigator.userAgent)) {
            this.html.display.style.paddingLeft = parseInt(computedStyleInput.getPropertyValue('padding-left')) + 3 + 'px';
            if (navigator.userAgent.includes('Edge')) {
               this.html.display.style.paddingTop = parseInt(computedStyleInput.getPropertyValue('padding-top')) + 3 + 'px';
            }
         }
         this.html.display.style.wordBreak = 'break-word';
         this.html.display.style.wordWrap = 'break-word';
         this.html.display.style.background = 'transparent';
         this.html.display.style.pointerEvents = "none";
         this.html.display.style.position = "absolute";
         this.html.display.style.left = '0px';
         this.html.display.style.top = '0px';
         this.html.display.style.width = '100%';
         this.html.input.style.width = '100%';
         this.html.display.style.height = 'fit-content';

         this.html.optionsList = document.createElement('div');
         this.html.optionsList.classList.add('mention-options');
         this.html.wrapper.appendChild(this.html.optionsList);

         var _iteratorNormalCompletion = true;
         var _didIteratorError = false;
         var _iteratorError = undefined;

         try {
            for (var _iterator = this.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
               var option = _step.value;

               var optionElement = document.createElement('div');
               optionElement.classList.add('mention-option');
               optionElement.innerHTML = this.template(option);
               optionElement.setAttribute('mentiondata', JSON.stringify(option));
               this.html.options.push(optionElement);
               this.html.optionsList.appendChild(optionElement);
            }
         } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
         } finally {
            try {
               if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
               }
            } finally {
               if (_didIteratorError) {
                  throw _iteratorError;
               }
            }
         }
      }

      /**
      * Begins listening for events on the input and options
      */

   }, {
      key: 'listen',
      value: function listen() {
         var _this = this;

         var that = this;
         this.html.input.addEventListener('input', function () {
            _this.onEventInput();
         });
         this.html.input.addEventListener('keydown', function (e) {
            _this.onEventKeyDown(e);
         });
         this.html.input.addEventListener('keyup', function (e) {
            _this.onEventKeyUp(e);
         });
         this.html.options.forEach(function (o) {
            o.addEventListener('click', function (e) {
               _this.onEventOptionClick(e.target);
            });
         });
      }

      /**
      * Called when  on input.addEventListener('input')
      * @param {Event} e - the event passed
      */

   }, {
      key: 'onEventInput',
      value: function onEventInput() {
         this.updateDisplay();
         this.update();
      }

      /**
      * Called when  on input.addEventListener('keyup')
      * @param {Event} e - the keyboard event passed
      */

   }, {
      key: 'onEventKeyDown',
      value: function onEventKeyDown(e) {
         this.upDownStay = e.keyCode == 40 ? 1 : e.keyCode == 38 ? -1 : 0;
         if (this.upDownStay && this.showingOptions) e.preventDefault();
         if (e.keyCode == 13 && this.showingOptions) {
            e.preventDefault();
            this.onEventOptionClick(this.html.options.find(function (e) {
               return e.classList.contains('hover');
            }));
         }
      }

      /**
      * Called when  on input.addEventListener('keydown')
      * @param {Event} e - the event passed
      */

   }, {
      key: 'onEventKeyUp',
      value: function onEventKeyUp() {
         this.setHoverOption();
         this.cursorPositionChanged();
      }

      /**
      * Called when option input.addEventListener('click')
      */

   }, {
      key: 'onEventOptionClick',
      value: function onEventOptionClick(optionEle) {
         var word = JSON.parse(optionEle.getAttribute('mentiondata')).name;
         this.html.input.value = this.html.input.value.substring(0, this.inputData.start) + '@' + word + this.html.input.value.substring(this.inputData.end, this.html.input.value.length) + ' ';
         this.html.input.focus();
         this.setCursorPosition(this.inputData.end + word.length + 1);
         this.updateDisplay();
         this.toggleOptions(false);
      }

      /**
      * Cursor position changed. Check for input data and toggle options
      */

   }, {
      key: 'cursorPositionChanged',
      value: function cursorPositionChanged() {
         this.cursorPosition = this.html.input.selectionStart;
         this.inputData = this.readWordAtCursor({ cursorPosition: this.cursorPosition, value: this.input.value });
         this.toggleOptions(this.inputData.word.length && this.inputData.word[0] == this.symbol);
         this.optionsMatch();
      }

      /**
      * Updates the display (finds mentions and underlines/bolds them)
      */

   }, {
      key: 'updateDisplay',
      value: function updateDisplay() {
         this.html.display.innerHTML = this.replaceInputWithHTML();

         // Fix the html styles
         var computedStylesInput = window.getComputedStyle(this.html.input);
         var minHeight = parseInt(computedStylesInput.getPropertyValue('min-height'));
         minHeight += parseInt(computedStylesInput.getPropertyValue('padding-bottom'));
         minHeight += parseInt(computedStylesInput.getPropertyValue('border-width')) / 2;
         if (minHeight < this.html.display.offsetHeight) minHeight = this.html.display.offsetHeight;
         this.html.input.style.height = minHeight + 'px';
      }

      /**
      * From the cursor positoin looks back to match the work and start/end position
      * @param {Object} data - Options to initialize the component with
      * @param {String} [data.value] - the string to search through
      * @param {Number} [data.cursorPosition] - The position of the cursor in the string
      */

   }, {
      key: 'readWordAtCursor',
      value: function readWordAtCursor(data) {
         var word = '',
             index = data.cursorPosition;
         var valueWithReplacedSpecial = data.value.replace(/\n/g, ' ');

         while (index--) {
            var previousCharacter = valueWithReplacedSpecial[index];
            if (previousCharacter == ' ' || index < 0) break;
         }

         while (index++ < valueWithReplacedSpecial.length - 1) {
            var nextCharacter = valueWithReplacedSpecial[index];
            if (nextCharacter == ' ') break;
            word += nextCharacter;
         }

         return { index: Math.max(index - word.length, 0), word: word };
      }

      /**
      * Show/Hide the options list
      * @param {Boolean} toggle - show or hide
      */

   }, {
      key: 'toggleOptions',
      value: function toggleOptions(toggle) {
         this.html.optionsList.classList.remove('show');
         if (toggle) this.html.optionsList.classList.add('show');
         this.showingOptions = toggle;
      }

      /**
      * Loop the options and show/hide options based on match function
      */

   }, {
      key: 'optionsMatch',
      value: function optionsMatch() {
         for (var option in this.options) {
            var word = this.inputData.word.replace('@', '');
            this.html.options[option].classList.remove('show');
            if (this.match(word, this.options[option])) this.html.options[option].classList.add('show');
         }
      }

      /**
      * Using up/down arrow selects the next option
      */

   }, {
      key: 'setHoverOption',
      value: function setHoverOption() {
         var viewableOptions = this.html.options.filter(function (e) {
            return e.classList.contains('show');
         });
         if (!viewableOptions.length) return;
         var _iteratorNormalCompletion2 = true;
         var _didIteratorError2 = false;
         var _iteratorError2 = undefined;

         try {
            for (var _iterator2 = this.html.options[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
               var option = _step2.value;

               option.classList.remove('hover');
            }
         } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
         } finally {
            try {
               if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
               }
            } finally {
               if (_didIteratorError2) {
                  throw _iteratorError2;
               }
            }
         }

         this.hover = this.upDownStay ? this.hover + this.upDownStay : 0;
         if (this.hover < 0) {
            this.hover = viewableOptions.length - 1;
         }
         if (this.hover == viewableOptions.length) {
            this.hover = 0;
         }
         viewableOptions[this.hover].classList.add('hover');
      }

      /**
      * Sets the cursor position in the text area
      * @param {Number} position - the position
      */

   }, {
      key: 'setCursorPosition',
      value: function setCursorPosition(position) {
         this.cursorPosition = position;
         this.html.input.setSelectionRange(position, position);
      }

      /**
      * Returns the mentions form the input. Returns the value of the option with its properties
      */

   }, {
      key: 'collect',
      value: function collect() {
         var data = [];
         var added = this.html.display.querySelectorAll('u');
         var _iteratorNormalCompletion3 = true;
         var _didIteratorError3 = false;
         var _iteratorError3 = undefined;

         try {
            for (var _iterator3 = added[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
               var add = _step3.value;

               data.push(JSON.parse(add.getAttribute('mentiondata')));
            }
         } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
         } finally {
            try {
               if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
               }
            } finally {
               if (_didIteratorError3) {
                  throw _iteratorError3;
               }
            }
         }

         return data;
      }

      /**
      * Loops through the word matches and replaces them with underlines
      * @returns {string} the input value in an html form
      */

   }, {
      key: 'replaceInputWithHTML',
      value: function replaceInputWithHTML() {
         var words = this.findMatches();
         var inputValue = this.html.input.value.split('');

         var _iteratorNormalCompletion4 = true;
         var _didIteratorError4 = false;
         var _iteratorError4 = undefined;

         try {
            for (var _iterator4 = words[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
               var word = _step4.value;
               var _iteratorNormalCompletion5 = true;
               var _didIteratorError5 = false;
               var _iteratorError5 = undefined;

               try {
                  for (var _iterator5 = this.options[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                     var option = _step5.value;

                     if (this.symbol + option.name == word.word) {
                        var optionHTML = document.createElement('u');
                        optionHTML.innerHTML = word.word;
                        optionHTML.setAttribute('mentiondata', JSON.stringify(option));

                        inputValue.splice(word.index, word.word.length, optionHTML.outerHTML);
                     }
                  }
               } catch (err) {
                  _didIteratorError5 = true;
                  _iteratorError5 = err;
               } finally {
                  try {
                     if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                     }
                  } finally {
                     if (_didIteratorError5) {
                        throw _iteratorError5;
                     }
                  }
               }
            }

            // Replace Line breaks and spaces with HTML
         } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
         } finally {
            try {
               if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
               }
            } finally {
               if (_didIteratorError4) {
                  throw _iteratorError4;
               }
            }
         }

         inputValue = inputValue.join('');
         if (inputValue[inputValue.length - 1] != ' ') inputValue += '&nbsp;';
         return inputValue;
      }

      /**
      * Loops over the input value.
      * @return {match[]} - Array of matches { word: word, index: index word is at}
      */

   }, {
      key: 'findMatches',
      value: function findMatches() {
         var inputValue = this.html.input.value.split('');
         var words = [];
         var word = '';
         for (var index in inputValue) {
            var letter = inputValue[index];
            var lastLetter = inputValue[index - 1] || ' ';
            var start = letter == this.symbol && (lastLetter == ' ' || lastLetter.charCodeAt(0) == 10 || lastLetter == '\\n');
            if ((start || word.length) && letter != ' ') word += letter;
            if (letter == ' ' && word.length) {
               words.unshift({ word: word, index: index - word.length });
               word = '';
            }
         }

         return words;
      }

      /**
      * Removes the HTML and listeners
      */

   }, {
      key: 'deconctruct',
      value: function deconctruct() {}
   }]);

   return Mention;
}();

if (typeof module != 'undefined') module.exports = Mention;