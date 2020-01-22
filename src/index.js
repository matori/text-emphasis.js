// Element.prototype.closest polyfill
// https://developer.mozilla.org/docs/Web/API/Element/closest
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    let el = this

    do {
      if (el.matches(s)) {
        return el
      }
      el = el.parentElement || el.parentNode
    } while (el !== null && el.nodeType === 1)
    return null
  }
}

// text-emphasis-style definition
// https://www.w3.org/TR/css-text-decor-3/#text-emphasis-style-property
const EMPHASIS_SYMBOLS = {
  dot: {
    filled: "\u2022",
    open: "\u25e6",
  },
  circle: {
    filled: "\u25cf",
    open: "\u25cb",
  },
  "double-circle": {
    filled: "\u25c9",
    open: "\u25ce",
  },
  triangle: {
    filled: "\u25b2",
    open: "\u25b3",
  },
  sesame: {
    filled: "\ufe45",
    open: "\ufe46",
  },
}

// detect browser supports CSS text-emphasis
function textEmphasisNativeSupports() {
  const rootStyle = document.documentElement.style
  return (
    rootStyle.hasOwnProperty("textEmphasis") ||
    rootStyle.hasOwnProperty("WebkitTextEmphasis")
  )
}

function rubySupports() {
  const ruby = document.createElement("ruby")
  const rp = document.createElement("rp")
  const punctuation = document.createTextNode("（")
  rp.appendChild(punctuation)
  ruby.appendChild(rp)
  ruby.setAttribute(
    "style",
    "position: absolute !important;" +
      "top: -100% !important;" +
      "box-sizing: content-box !important;" +
      "border: 0 !important;" +
      "padding: 0 !important;" +
      "font-size: 1em !important;",
  )
  document.body.appendChild(ruby)
  const width = ruby.getBoundingClientRect().width
  document.body.removeChild(ruby)
  return width === 0
}

class TextEmphasis {
  constructor({
    selector,
    emphasisSymbol = "dot",
    symbolStyle = "filled",
    string = "",
    color = undefined,
    force = false,
    splitter,
    hideEmphasisSelection = false,
    rubyClassName = "js-textEmphasis-ruby",
    rtClassName = "js-textEmphasis-rt",
  }) {
    if (!force && textEmphasisNativeSupports()) {
      return
    }

    if (!rubySupports()) {
      return
    }

    this.props = {
      selector,
      emphasisSymbol,
      symbolStyle,
      string,
      color,
      splitter: splitter || Array.from,
      hideEmphasisSelection,
      rubyClassName,
      rtClassName,
    }

    this.rtElements = []

    this.init()
  }

  init() {
    const selector = this.props.selector
    const targetElements = document.querySelectorAll(selector)
    if (!targetElements.length) {
      return
    }
    const targets = Array.from(targetElements).filter(target => {
      return !target.closest(`ruby`) && !target.parentElement.closest(selector)
    })
    this.appendStyle()
    this.process(targets)
    if (this.props.hideEmphasisSelection) {
      this.hideEmphasis = this.hideEmphasis.bind(this)
      this.attachHideEmphasisWhenSelection()
    }
  }

  appendStyle() {
    const { color, rtClassName } = this.props
    const style = document.createElement("style")
    document.head.appendChild(style)
    const styleSheet = style.sheet
    const rtCssDeclarations = [
      "-webkit-user-select: none",
      "-ms-user-select: none",
      "user-select: none",
    ]
    if (color) {
      rtCssDeclarations.push(`color: ${color}`)
    }
    const rtRules = rtCssDeclarations.join(";")
    const rtRuleBlock = `${this.props.selector} .${rtClassName} { ${rtRules} }`
    styleSheet.insertRule(rtRuleBlock, 0)
  }

  process(nodeList) {
    nodeList.forEach(node => {
      const { nodeType, tagName } = node
      if (nodeType === Node.TEXT_NODE) {
        this.applyEmphasis(node)
      }
      if (nodeType === Node.ELEMENT_NODE && tagName.toLowerCase() !== "ruby") {
        this.process(node.childNodes)
      }
    })
  }

  applyEmphasis(textNode) {
    const content = textNode.textContent
    const parent = textNode.parentElement || textNode.parentNode
    const fragment = document.createDocumentFragment()
    content
      .split(/(\s+)/)
      .reduce(this.createReplaceDocument.bind(this), fragment)
    parent.replaceChild(fragment, textNode)
  }

  createReplaceDocument(fragment, string) {
    if (string.match(/\s+/)) {
      const node = document.createTextNode(string)
      fragment.appendChild(node)
    } else {
      const text = this.props.splitter(string)
      const ruby = this.createRubyElement(string)
      text.reduce(this.createEmphasis.bind(this), ruby)
      fragment.appendChild(ruby)
    }
    return fragment
  }

  createRubyElement(content) {
    const ruby = document.createElement("ruby")
    ruby.classList.add(this.props.rubyClassName)
    ruby.setAttribute("aria-label", content)
    return ruby
  }

  createEmphasis(container, character) {
    const charNode = document.createTextNode(character)
    container.appendChild(charNode)
    if (!character.match(/\s/)) {
      const rt = this.createRtElements()
      container.appendChild(rt)
    }
    return container
  }

  createRtElements() {
    const rt = document.createElement("rt")
    const symbolNode = document.createTextNode(this.getEmphasisCharacter())
    rt.appendChild(symbolNode)
    rt.classList.add(this.props.rtClassName)
    rt.setAttribute("aria-hidden", "true")
    this.rtElements.push(rt)
    return rt
  }

  getEmphasisCharacter() {
    const { string, emphasisSymbol, symbolStyle } = this.props
    return string || EMPHASIS_SYMBOLS[emphasisSymbol][symbolStyle]
  }

  attachHideEmphasisWhenSelection() {
    document.addEventListener("selectionchange", this.hideEmphasis)
  }

  hideEmphasis() {
    // setTimeout入れないとIEでgetSelection.isCollapsedがtrueになるタイミングが取れない
    setTimeout(() => {
      const selection = document.getSelection()
      if (selection.isCollapsed) {
        this.revertRtElementsVisibility()
      } else {
        this.hideRtElements()
      }
    }, 100)
  }

  hideRtElements() {
    this.rtElements.forEach(element => {
      element.style.visibility = "hidden"
    })
  }

  revertRtElementsVisibility() {
    this.rtElements.forEach(element => {
      element.style.visibility = ""
    })
  }
}

export default TextEmphasis
