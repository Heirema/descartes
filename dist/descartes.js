'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*! Descartes v0.0.1-pre | (c) Jon Chan @jonhmchan | descartes.io/license */

var Descartes = function () {
	function Descartes(tree) {
		_classCallCheck(this, Descartes);

		this.tree = tree;
		this.selector = 'selector';
		this.rule = 'rule';
		this.meta = 'meta';
		this.mixins = '_mixins';
		this.listeners = '_listeners';
		this.mappings = {};
		this.rules = ['align-content', 'align-items', 'align-self', 'all', 'animation', 'animation-delay', 'animation-direction', 'animation-duration', 'animation-fill-mode', 'animation-iteration-count', 'animation-name', 'animation-play-state', 'animation-timing-function', 'backface-visibility', 'background', 'background-attachment', 'background-blend-mode', 'background-clip', 'background-color', 'background-image', 'background-origin', 'background-position', 'background-repeat', 'background-size', 'border', 'border-bottom', 'border-bottom-color', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color', 'border-image', 'border-image-outset', 'border-image-repeat', 'border-image-slice', 'border-image-source', 'border-image-width', 'border-left', 'border-left-color', 'border-left-style', 'border-left-width', 'border-radius', 'border-right', 'border-right-color', 'border-right-style', 'border-right-width', 'border-spacing', 'border-style', 'border-top', 'border-top-color', 'border-top-left-radius', 'border-top-right-radius', 'border-top-style', 'border-top-width', 'border-width', 'bottom', 'box-shadow', 'box-sizing', 'caption-side', 'clear', 'clip', 'color', 'column-count', 'column-fill', 'column-gap', 'column-rule', 'column-rule-color', 'column-rule-style', 'column-rule-width', 'column-span', 'column-width', 'columns', 'content', 'counter-increment', 'counter-reset', 'cursor', 'direction', 'display', 'empty-cells', 'filter', 'flex', 'flex-basis', 'flex-direction', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-wrap', 'float', 'font', '@font-face', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'hanging-punctuation', 'height', 'justify-content', '@keyframes', 'left', 'letter-spacing', 'line-height', 'list-style', 'list-style-image', 'list-style-position', 'list-style-type', 'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'max-height', 'max-width', '@media', 'min-height', 'min-width', 'nav-down', 'nav-index', 'nav-left', 'nav-right', 'nav-up', 'opacity', 'order', 'outline', 'outline-color', 'outline-offset', 'outline-style', 'outline-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'page-break-after', 'page-break-before', 'page-break-inside', 'perspective', 'perspective-origin', 'position', 'quotes', 'resize', 'right', 'tab-size', 'table-layout', 'text-align', 'text-align-last', 'text-decoration', 'text-decoration-color', 'text-decoration-line', 'text-decoration-style', 'text-indent', 'text-justify', 'text-overflow', 'text-shadow', 'text-transform', 'top', 'transform', 'transform-origin', 'transform-style', 'transition', 'transition-delay', 'transition-duration', 'transition-property', 'transition-timing-function', 'unicode-bidi', 'vertical-align', 'visibility', 'white-space', 'width', 'word-break', 'word-spacing', 'word-wrap', 'z-index'];
		this.sizzle = Sizzle;
	}

	// Returns the computed rules tree based on original tree

	_createClass(Descartes, [{
		key: 'compute',
		value: function compute() {
			var tree = arguments.length <= 0 || arguments[0] === undefined ? this.tree : arguments[0];

			if ((typeof tree === 'undefined' ? 'undefined' : _typeof(tree)) === 'object') {
				var result = {};
				for (var key in tree) {
					var value = tree[key];
					var keyObject = this.parseKey(key);
					if (keyObject.type === this.selector) {
						result[keyObject.key] = this.compute(value);
					} else if (keyObject.type === this.rule) {
						result[keyObject.key] = value;
					} else if (keyObject.type === this.meta) {
						if (keyObject.key === this.mixins) {
							var mixedRules = this.parseMixins(tree, key);
							result = mixedRules;
						} else if (keyObject.key === this.listeners) {
							result[keyObject.key] = value;
						}
					}
				}
				return result;
			}
			return null;
		}

		// Expands the computed rules tree into a flat rule mappings object

	}, {
		key: 'flatten',
		value: function flatten() {
			var tree = arguments.length <= 0 || arguments[0] === undefined ? this.compute(tree) : arguments[0];
			var parentSelector = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

			for (var selector in tree) {
				var rules = Object.assign({}, tree[selector]);
				var _listeners = rules[this.listeners];

				// Add the rules in here
				for (var rule in rules) {
					if (!this.isRule(rule)) {
						var subtree = null;
						if (parentSelector === "") parentSelector = selector;
						var nestedSelector = this.nestSelector(rule, parentSelector);
						if (!this.isMeta(rule) && !this.isRule(rule)) {
							subtree = {};
							subtree[nestedSelector] = rules[rule];
						}
						delete rules[rule];
						if (subtree !== null) {
							this.flatten(subtree, nestedSelector);
						}
					}
				}
				this.mappings[selector] = {
					rules: rules,
					_listeners: _listeners
				};
			}
			return this.mappings;
		}
	}, {
		key: 'render',
		value: function render() {
			this.flatten();
			this.bindListeners();
			this.applyAll();
		}
	}, {
		key: 'bindListeners',
		value: function bindListeners() {
			var _this = this;

			var _loop = function _loop(selector) {
				var mapping = _this.mappings[selector];
				var listeners = mapping[_this.listeners];
				if (typeof listeners === 'undefined') return 'continue';
				var rules = mapping['rules'];
				listeners.map(function (l) {
					l[0].addEventListener(l[1], function () {
						_this.apply(selector, rules);
					});
				});
			};

			for (var selector in this.mappings) {
				var _ret = _loop(selector);

				if (_ret === 'continue') continue;
			}
		}
	}, {
		key: 'applyAll',
		value: function applyAll() {
			for (var key in this.mappings) {
				this.apply(key, this.mappings[key].rules);
			}
		}
	}, {
		key: 'apply',
		value: function apply() {
			var _this2 = this;

			var selector = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
			var rule = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

			if (selector === null || rule === null) return;
			var elems = this.sizzle(selector.toString());
			if (elems.length === 0) return;
			elems.map(function (elem) {
				var style = "";
				for (var key in rule) {
					var computedRule = _this2.computeRule(rule[key], key, elem);
					style += key + ": " + computedRule + "; ";
				}
				style = style.slice(0, -1);
				elem.setAttribute('style', style);
			});
		}
	}, {
		key: 'computeRule',
		value: function computeRule(rule, key, elem) {
			if (typeof rule === 'function') {
				rule = rule(elem);
			}
			var except = ['font-weight'];
			if (Number(rule) === rule && except.indexOf(key) < 0) {
				return rule.toString() + "px";
			}
			return rule.toString();
		}
	}, {
		key: 'nestSelector',
		value: function nestSelector(current, parent) {
			var separator = " ";
			if (this.selIsAppending(current)) {
				separator = "";
				current = current.substring(1);
			}
			return parent + separator + current;
		}

		// Runs any checks on the current key to see what type it is

	}, {
		key: 'parseKey',
		value: function parseKey(key) {
			var isMeta = this.isMeta(key);
			var isRule = this.isRule(key);
			return {
				key: key,
				type: isMeta ? this.meta : isRule ? this.rule : this.selector
			};
		}

		// Adds mixins to existing tree

	}, {
		key: 'parseMixins',
		value: function parseMixins(tree, selector) {
			var mixins = tree[this.mixins];

			if (!Array.isArray(mixins)) {
				mixins = [mixins];
			}

			for (var index in mixins) {
				var mixin = mixins[index];
				if (mixin !== null && (typeof mixin === 'undefined' ? 'undefined' : _typeof(mixin)) === 'object') {
					for (var rule in mixin) {
						if (!tree.hasOwnProperty(rule) || tree[rule] === null) tree[rule] = mixin[rule];
					}
				} else {
					throw "'" + selector + "' tree has an invalid _mixins value. _mixins can only be an object literal or array of object literals.";
				}
			}
			delete tree[this.mixins];
			return tree;
		}
	}, {
		key: 'isMeta',
		value: function isMeta(key) {
			var metas = [this.mixins, this.listeners];
			return metas.indexOf(key) > -1;
		}
	}, {
		key: 'selIsAppending',
		value: function selIsAppending(sel) {
			return sel.substr(0, 1) === '&';
		}
	}, {
		key: 'isRule',
		value: function isRule(key) {
			return this.rules.indexOf(key) > -1;
		}
	}]);

	return Descartes;
}();