'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mention = function () {
   function Mention(settings) {
      _classCallCheck(this, Mention);

      var that = this;
      this.options = settings.options || [];
      this.input = settings.input;
      this.key = settings.key || '@';
      this.cursorPosition = 0;
      this.hover = 0;
      this.showingOptions = false;
      this.upDownStay = 0;
      this.update = settings.update || function () {};
      this.match = settings.match || this.defaultMatchFunction;
      this.template = settings.template || this.defaultTemplate;
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

   _createClass(Mention, [{
      key: 'defaultMatchFunction',
      value: function defaultMatchFunction(word, option) {
         return !word.length || option.name.startsWith(word.replace('@', ''));
      }
   }, {
      key: 'defaultTemplate',
      value: function defaultTemplate(option) {
         return option.name || option;
      }
   }, {
      key: 'listen',
      value: function listen() {
         var _this = this;

         var that = this;
         this.html.input.addEventListener('input', function (e) {
            _this.updateDisplay();
            _this.cursorPosition = _this.html.input.selectionStart;
            _this.inputData = _this.locateInputData({ cursorPosition: _this.cursorPosition, value: _this.input.value });
            _this.optionsMatch();
            _this.toggleOptions(_this.inputData.word.length);
         });

         var _iteratorNormalCompletion = true;
         var _didIteratorError = false;
         var _iteratorError = undefined;

         try {
            for (var _iterator = this.html.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
               var optionElement = _step.value;

               optionElement.addEventListener('click', function (e) {
                  that.selectOption(this);
               });
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

         this.html.input.addEventListener('scroll', function (e) {
            that.html.display.scrollTop = that.html.input.scrollTop;
         });

         this.html.input.addEventListener('keydown', function (e) {
            that.upDownStay = e.code == 'ArrowDown' ? 1 : e.code == 'ArrowUp' ? -1 : 0;
            if (that.upDownStay && that.showingOptions) e.preventDefault();
            if (e.code == 'Enter' && that.showingOptions) {
               e.preventDefault();
               that.selectOption(that.html.options.find(function (e) {
                  return e.classList.contains('hover');
               }));
            }
         });

         this.html.input.addEventListener('keyup', function (e) {
            that.setHoverOption();
         });
      }
   }, {
      key: 'setupHTML',
      value: function setupHTML() {
         this.html.input = this.input;
         this.html.wrapper = document.createElement('div');
         this.html.wrapper.classList.add('mention-wrapper');
         this.html.display = document.createElement('div');
         this.html.display.classList.add('mention-display');
         this.html.input.parentElement.insertBefore(this.html.wrapper, this.html.input);
         this.html.wrapper.appendChild(this.html.input);
         this.html.wrapper.appendChild(this.html.display);

         this.html.optionsList = document.createElement('div');
         this.html.optionsList.classList.add('mention-options');
         this.html.wrapper.appendChild(this.html.optionsList);

         var _iteratorNormalCompletion2 = true;
         var _didIteratorError2 = false;
         var _iteratorError2 = undefined;

         try {
            for (var _iterator2 = this.options[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
               var option = _step2.value;

               var optionElement = document.createElement('div');
               optionElement.classList.add('mention-option');
               optionElement.innerHTML = this.template(option);
               optionElement.setAttribute('mentiondata', JSON.stringify(option));
               this.html.options.push(optionElement);
               this.html.optionsList.appendChild(optionElement);
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
      }
   }, {
      key: 'updateDisplay',
      value: function updateDisplay() {
         var storeText = this.html.input.value.replace(/\r?\n/g, '<br/>');
         var storeText = this.html.input.value.replace(' ', '&nbsp;');
         var _iteratorNormalCompletion3 = true;
         var _didIteratorError3 = false;
         var _iteratorError3 = undefined;

         try {
            for (var _iterator3 = this.options[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
               var option = _step3.value;

               var optionHTML = document.createElement('u');
               optionHTML.innerHTML = this.key + option.name;
               optionHTML.setAttribute('mentiondata', JSON.stringify(option));
               storeText = storeText.replace(new RegExp('@' + option.name, 'g'), optionHTML.outerHTML);
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

         this.html.display.innerHTML = storeText;
         this.update();
      }
   }, {
      key: 'optionsMatch',
      value: function optionsMatch() {
         for (var option in this.options) {
            var word = this.inputData.word.replace('@', '');
            this.html.options[option].classList.toggle('show', this.match(word, this.options[option]));
         }
      }
   }, {
      key: 'locateInputData',
      value: function locateInputData(data) {
         var startPosition = data.cursorPosition;
         var valueWithReplacedSpecial = data.value.replace(/\n/g, " ");

         while (startPosition--) {
            var previousCharacter = valueWithReplacedSpecial[startPosition];
            if (previousCharacter == ' ' || previousCharacter == '@') break;
         }

         if (previousCharacter != '@') return { start: data.cursorPosition, end: data.cursorPosition, word: '' };
         return {
            start: startPosition,
            end: data.cursorPosition,
            word: valueWithReplacedSpecial.substring(startPosition, data.cursorPosition)
         };
      }
   }, {
      key: 'toggleOptions',
      value: function toggleOptions(toggle) {
         this.html.optionsList.classList.toggle('show', toggle);
         this.showingOptions = toggle;
      }
   }, {
      key: 'selectOption',
      value: function selectOption(optionHTML) {
         var data = JSON.parse(optionHTML.getAttribute('mentiondata')).name;
         this.html.input.value = this.html.input.value.substring(0, this.inputData.start) + '@' + data + this.html.input.value.substring(this.inputData.end, this.html.input.value.length) + ' ';
         this.updateDisplay();
         this.hideOptions();
         this.html.input.focus();
      }
   }, {
      key: 'setHoverOption',
      value: function setHoverOption() {
         var viewableOptions = this.html.options.filter(function (e) {
            return e.classList.contains('show');
         });
         if (!viewableOptions.length) return;
         var _iteratorNormalCompletion4 = true;
         var _didIteratorError4 = false;
         var _iteratorError4 = undefined;

         try {
            for (var _iterator4 = this.html.options[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
               var option = _step4.value;

               option.classList.remove('hover');
            }
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

         this.hover = this.upDownStay ? this.hover + this.upDownStay : 0;
         if (this.hover < 0) {
            this.hover = viewableOptions.length - 1;
         }
         if (this.hover == viewableOptions.length) {
            this.hover = 0;
         }
         viewableOptions[this.hover].classList.add('hover');
      }
   }, {
      key: 'collect',
      value: function collect() {
         var data = [];
         var added = this.html.display.querySelectorAll('u');
         var _iteratorNormalCompletion5 = true;
         var _didIteratorError5 = false;
         var _iteratorError5 = undefined;

         try {
            for (var _iterator5 = added[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
               var add = _step5.value;

               data.push(JSON.parse(add.getAttribute('mentiondata')));
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

         return data;
      }
   }]);

   return Mention;
}();

if (typeof module != 'undefined') module.exports = Mention;