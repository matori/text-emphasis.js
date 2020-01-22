import TextEmphasis from "../src/index"
import stripLeadingWhitespace from "../utils/stripLeadingWhitespace"

describe("basics", () => {
  it("simple", () => {
    document.body.innerHTML = stripLeadingWhitespace`
<p>
  こうやって<em>圏点を打つ</em>。
</p>
`
    new TextEmphasis({
      selector: "em",
    })
    const p = document.querySelector("p")
    expect(p.outerHTML).toEqual(
      stripLeadingWhitespace`
<p>こうやって
  <em>
    <ruby class="js-textEmphasis-ruby" aria-label="圏点を打つ">
      圏<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      点<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      を<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      打<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      つ<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
    </ruby>
  </em>。
</p>
`,
    )
  })

  it("include whitespaces", () => {
    document.body.innerHTML = "<p>こうやって<em>圏\t点    を　打つ</em>。</p>"
    new TextEmphasis({
      selector: "em",
    })
    const p = document.querySelector("p")
    expect(p.outerHTML).toEqual(
      '<p>こうやって' +
      '<em>' +
      '<ruby class="js-textEmphasis-ruby" aria-label="圏">' +
      '圏<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>' +
      '</ruby>' +
      '\t' +
      '<ruby class="js-textEmphasis-ruby" aria-label="点">' +
      '点<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>' +
      '</ruby>' +
      '    ' +
      '<ruby class="js-textEmphasis-ruby" aria-label="を">' +
      'を<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>' +
      '</ruby>' +
      '　' +
      '<ruby class="js-textEmphasis-ruby" aria-label="打つ">' +
      '打<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>' +
      'つ<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>' +
      '</ruby>' +
      '</em>。' +
      '</p>'
    )
  })

  it("nested", () => {
    document.body.innerHTML = stripLeadingWhitespace`
<p>
  こうやって<em><span>圏点</span>を打つ</em>。
</p>
`
    new TextEmphasis({
      selector: "em",
    })
    const p = document.querySelector("p")
    expect(p.outerHTML).toEqual(
      stripLeadingWhitespace`
<p>こうやって
  <em>
    <span>
      <ruby class="js-textEmphasis-ruby" aria-label="圏点">
        圏<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
        点<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      </ruby>
    </span>
    <ruby class="js-textEmphasis-ruby" aria-label="を打つ">
      を<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      打<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      つ<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
    </ruby>
  </em>。
</p>
`,
    )
  })

  it("deep nested", () => {
    document.body.innerHTML = stripLeadingWhitespace`
<p>
  こうやって<em><span><a href=""><i>圏</i>点</a></span>を打つ</em>。
</p>
`
    new TextEmphasis({
      selector: "em",
    })
    const p = document.querySelector("p")
    expect(p.outerHTML).toEqual(
      stripLeadingWhitespace`
<p>こうやって
  <em>
    <span>
      <a href="">
        <i>
          <ruby class="js-textEmphasis-ruby" aria-label="圏">
            圏<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
          </ruby>
        </i>
        <ruby class="js-textEmphasis-ruby" aria-label="点">
          点<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
        </ruby>
      </a>
    </span>
    <ruby class="js-textEmphasis-ruby" aria-label="を打つ">
      を<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      打<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      つ<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
    </ruby>
  </em>。
</p>
`,
    )
  })

  it("nested target", () => {
    document.body.innerHTML = stripLeadingWhitespace`
<p>
  こうやって<em><em>圏点</em>を打つ</em>。
</p>
`
    new TextEmphasis({
      selector: "em",
    })
    const p = document.querySelector("p")
    expect(p.outerHTML).toEqual(
      stripLeadingWhitespace`
<p>こうやって
  <em>
    <em>
      <ruby class="js-textEmphasis-ruby" aria-label="圏点">
        圏<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
        点<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      </ruby>
    </em>
    <ruby class="js-textEmphasis-ruby" aria-label="を打つ">
      を<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      打<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      つ<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
    </ruby>
  </em>。
</p>
`,
    )
  })

  it("with ruby", () => {
    document.body.innerHTML = stripLeadingWhitespace`
<p>
  こうやって<em><ruby>圏点<rp>（</rp><rt>けんてん</rt><rp>）</rp></ruby>を打つ</em>。
</p>
`
    new TextEmphasis({
      selector: "em",
    })
    const p = document.querySelector("p")
    expect(p.outerHTML).toEqual(
      stripLeadingWhitespace`
<p>こうやって
  <em>
    <ruby>
      圏点<rp>（</rp><rt>けんてん</rt><rp>）</rp>
    </ruby>
    <ruby class="js-textEmphasis-ruby" aria-label="を打つ">
      を<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      打<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
      つ<rt class="js-textEmphasis-rt" aria-hidden="true">•</rt>
    </ruby>
  </em>。
</p>
`,
    )
  })
})
