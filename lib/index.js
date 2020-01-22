"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.reduce");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.split");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Element.prototype.closest polyfill
// https://developer.mozilla.org/docs/Web/API/Element/closest
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (el.matches(s)) {
        return el;
      }

      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
} // text-emphasis-style definition
// https://www.w3.org/TR/css-text-decor-3/#text-emphasis-style-property


var EMPHASIS_SYMBOLS = {
  dot: {
    filled: "\u2022",
    open: "\u25E6"
  },
  circle: {
    filled: "\u25CF",
    open: "\u25CB"
  },
  "double-circle": {
    filled: "\u25C9",
    open: "\u25CE"
  },
  triangle: {
    filled: "\u25B2",
    open: "\u25B3"
  },
  sesame: {
    filled: "\uFE45",
    open: "\uFE46"
  }
}; // detect browser supports CSS text-emphasis

function textEmphasisNativeSupports() {
  var rootStyle = document.documentElement.style;
  return rootStyle.hasOwnProperty("textEmphasis") || rootStyle.hasOwnProperty("WebkitTextEmphasis");
}

function rubySupports() {
  var ruby = document.createElement("ruby");
  var rp = document.createElement("rp");
  var punctuation = document.createTextNode("（");
  rp.appendChild(punctuation);
  ruby.appendChild(rp);
  ruby.setAttribute("style", "position: absolute !important;" + "top: -100% !important;" + "box-sizing: content-box !important;" + "border: 0 !important;" + "padding: 0 !important;" + "font-size: 1em !important;");
  document.body.appendChild(ruby);
  var width = ruby.getBoundingClientRect().width;
  document.body.removeChild(ruby);
  return width === 0;
}

var TextEmphasis =
/*#__PURE__*/
function () {
  function TextEmphasis(_ref) {
    var selector = _ref.selector,
        _ref$emphasisSymbol = _ref.emphasisSymbol,
        emphasisSymbol = _ref$emphasisSymbol === void 0 ? "dot" : _ref$emphasisSymbol,
        _ref$symbolStyle = _ref.symbolStyle,
        symbolStyle = _ref$symbolStyle === void 0 ? "filled" : _ref$symbolStyle,
        _ref$string = _ref.string,
        string = _ref$string === void 0 ? "" : _ref$string,
        _ref$color = _ref.color,
        color = _ref$color === void 0 ? undefined : _ref$color,
        _ref$force = _ref.force,
        force = _ref$force === void 0 ? false : _ref$force,
        splitter = _ref.splitter,
        _ref$hideEmphasisSele = _ref.hideEmphasisSelection,
        hideEmphasisSelection = _ref$hideEmphasisSele === void 0 ? false : _ref$hideEmphasisSele,
        _ref$rubyClassName = _ref.rubyClassName,
        rubyClassName = _ref$rubyClassName === void 0 ? "js-textEmphasis-ruby" : _ref$rubyClassName,
        _ref$rtClassName = _ref.rtClassName,
        rtClassName = _ref$rtClassName === void 0 ? "js-textEmphasis-rt" : _ref$rtClassName;

    _classCallCheck(this, TextEmphasis);

    if (!force && textEmphasisNativeSupports()) {
      return;
    }

    if (!rubySupports()) {
      return;
    }

    this.props = {
      selector: selector,
      emphasisSymbol: emphasisSymbol,
      symbolStyle: symbolStyle,
      string: string,
      color: color,
      splitter: splitter || Array.from,
      hideEmphasisSelection: hideEmphasisSelection,
      rubyClassName: rubyClassName,
      rtClassName: rtClassName
    };
    this.rtElements = [];
    this.init();
  }

  _createClass(TextEmphasis, [{
    key: "init",
    value: function init() {
      var selector = this.props.selector;
      var targetElements = document.querySelectorAll(selector);

      if (!targetElements.length) {
        return;
      }

      var targets = Array.from(targetElements).filter(function (target) {
        return !target.closest("ruby") && !target.parentElement.closest(selector);
      });
      this.appendStyle();
      this.process(targets);

      if (this.props.hideEmphasisSelection) {
        this.hideEmphasis = this.hideEmphasis.bind(this);
        this.attachHideEmphasisWhenSelection();
      }
    }
  }, {
    key: "appendStyle",
    value: function appendStyle() {
      var _this$props = this.props,
          color = _this$props.color,
          rtClassName = _this$props.rtClassName;
      var style = document.createElement("style");
      document.head.appendChild(style);
      var styleSheet = style.sheet;
      var rtCssDeclarations = ["-webkit-user-select: none", "-ms-user-select: none", "user-select: none"];

      if (color) {
        rtCssDeclarations.push("color: ".concat(color));
      }

      var rtRules = rtCssDeclarations.join(";");
      var rtRuleBlock = "".concat(this.props.selector, " .").concat(rtClassName, " { ").concat(rtRules, " }");
      styleSheet.insertRule(rtRuleBlock, 0);
    }
  }, {
    key: "process",
    value: function process(nodeList) {
      var _this = this;

      nodeList.forEach(function (node) {
        var nodeType = node.nodeType,
            tagName = node.tagName;

        if (nodeType === Node.TEXT_NODE) {
          _this.applyEmphasis(node);
        }

        if (nodeType === Node.ELEMENT_NODE && tagName.toLowerCase() !== "ruby") {
          _this.process(node.childNodes);
        }
      });
    }
  }, {
    key: "applyEmphasis",
    value: function applyEmphasis(textNode) {
      var content = textNode.textContent;
      var parent = textNode.parentElement || textNode.parentNode;
      var fragment = document.createDocumentFragment();
      content.split(/(\s+)/).reduce(this.createReplaceDocument.bind(this), fragment);
      parent.replaceChild(fragment, textNode);
    }
  }, {
    key: "createReplaceDocument",
    value: function createReplaceDocument(fragment, string) {
      if (string.match(/\s+/)) {
        var node = document.createTextNode(string);
        fragment.appendChild(node);
      } else {
        var text = this.props.splitter(string);
        var ruby = this.createRubyElement(string);
        text.reduce(this.createEmphasis.bind(this), ruby);
        fragment.appendChild(ruby);
      }

      return fragment;
    }
  }, {
    key: "createRubyElement",
    value: function createRubyElement(content) {
      var ruby = document.createElement("ruby");
      ruby.classList.add(this.props.rubyClassName);
      ruby.setAttribute("aria-label", content);
      return ruby;
    }
  }, {
    key: "createEmphasis",
    value: function createEmphasis(container, character) {
      var charNode = document.createTextNode(character);

      if (character.match(/\s/)) {
        container.appendChild(charNode);
      } else {
        var rb = this.createRbElement(charNode);
        var rt = this.createRtElement();
        container.appendChild(rb);
        container.appendChild(rt);
      }

      return container;
    }
  }, {
    key: "createRbElement",
    value: function createRbElement(charNode) {
      var rb = document.createElement("rb");
      rb.appendChild(charNode);
      rb.setAttribute("aria-hidden", "true");
      return rb;
    }
  }, {
    key: "createRtElement",
    value: function createRtElement() {
      var rt = document.createElement("rt");
      var symbolNode = document.createTextNode(this.getEmphasisCharacter());
      rt.appendChild(symbolNode);
      rt.classList.add(this.props.rtClassName);
      rt.setAttribute("aria-hidden", "true");
      this.rtElements.push(rt);
      return rt;
    }
  }, {
    key: "getEmphasisCharacter",
    value: function getEmphasisCharacter() {
      var _this$props2 = this.props,
          string = _this$props2.string,
          emphasisSymbol = _this$props2.emphasisSymbol,
          symbolStyle = _this$props2.symbolStyle;
      return string || EMPHASIS_SYMBOLS[emphasisSymbol][symbolStyle];
    }
  }, {
    key: "attachHideEmphasisWhenSelection",
    value: function attachHideEmphasisWhenSelection() {
      document.addEventListener("selectionchange", this.hideEmphasis);
    }
  }, {
    key: "hideEmphasis",
    value: function hideEmphasis() {
      var _this2 = this;

      // setTimeout入れないとIEでgetSelection.isCollapsedがtrueになるタイミングが取れない
      setTimeout(function () {
        var selection = document.getSelection();

        if (selection.isCollapsed) {
          _this2.revertRtElementsVisibility();
        } else {
          _this2.hideRtElements();
        }
      }, 100);
    }
  }, {
    key: "hideRtElements",
    value: function hideRtElements() {
      this.rtElements.forEach(function (element) {
        element.style.visibility = "hidden";
      });
    }
  }, {
    key: "revertRtElementsVisibility",
    value: function revertRtElementsVisibility() {
      this.rtElements.forEach(function (element) {
        element.style.visibility = "";
      });
    }
  }]);

  return TextEmphasis;
}();

var _default = TextEmphasis;
exports.default = _default;
module.exports = exports.default;