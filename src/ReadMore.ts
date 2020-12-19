import { html, css, LitElement, property, internalProperty } from 'lit-element';
export class ReadMore extends LitElement {
  static styles = css`
    div {
      overflow: hidden;
      transition: height 0.2s;
    }
  `;

  @property({ type: Number, attribute: true }) maxLines = 0;
  @property({ type: String, attribute: true }) fullText = '';
  @internalProperty()
  protected isOpen = false;
  @internalProperty()
  protected text = '';
  @internalProperty()
  protected textSmall = '';
  @internalProperty()
  protected height = '0px';
  @internalProperty()
  protected maxHeight = 0;

  constructor() {
    super();
    this.setSize = this.setSize.bind(this);
    this._handleResize = this._handleResize.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._handleResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('resize', this._handleResize);
  }

  setSize() {
    const width = this.shadowRoot?.querySelector('div')?.clientWidth ?? 0;
    const buttonWidth =
      this.shadowRoot?.querySelector('button')?.clientWidth ?? 0;

    this.calcMaxHeight(this.fullText);
    this.textSmall = this.calcLength(
      this.fullText,
      this.maxLines,
      width,
      buttonWidth
    );

    this.text = this.textSmall;
  }

  firstUpdated() {
    this.setSize();
  }

  _handleResize() {
    this.setSize();
  }

  calcMaxHeight(text: string) {
    const ruler = document.createElement('div');
    const div = this.shadowRoot?.querySelector('div');
    ruler.innerHTML = text;
    this.shadowRoot?.querySelector('div')?.appendChild(ruler);
    this.maxHeight = ruler.offsetHeight;

    ruler.parentNode?.removeChild(ruler);
  }

  calcLength(
    text: string,
    maxLines: number,
    width: number,
    buttonWidth: number
  ): string {
    const ruler = document.createElement('div');
    const div = this.shadowRoot?.querySelector('div');

    if (div) {
      const lineHeight = parseInt(getComputedStyle(div).lineHeight, 10);

      this.height = `${lineHeight * this.maxLines}px`;
    }

    ruler.style.width = 'auto';
    ruler.style.position = 'absolute';
    ruler.style.whiteSpace = 'nowrap';
    this.shadowRoot?.querySelector('div')?.appendChild(ruler);

    let line = '';

    const wordArray: string[] = text.split(' ');

    // you have to check by line, because when a word is to long for that line, all characters will jump to next line
    // if checking the last line, we need to take into account the width of the button
    for (let j = 0; j < maxLines; j++) {
      for (let i = 0; i < wordArray.length; i += 1) {
        const word = wordArray.shift();

        if (word) {
          const previousLine = ruler.innerHTML;
          i === 0 && j === 0
            ? (ruler.innerHTML += word)
            : (ruler.innerHTML += ` ${word}`);

          // if the line is too long, use the previousline and break
          // and add the last line back to the wordArray;
          if (
            (j < maxLines - 1 && ruler.offsetWidth > width) ||
            (j === maxLines - 1 && ruler.offsetWidth > width - buttonWidth)
          ) {
            ruler.innerHTML = previousLine;
            wordArray.unshift(word);
            break;
          }
        }
      }

      line += ruler.innerHTML;
      ruler.innerHTML = '';
    }

    ruler.parentNode?.removeChild(ruler);
    this.textSmall = line;
    return line;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.isOpen
      ? (this.text = this.fullText)
      : setTimeout(() => (this.text = this.textSmall), 150);
  }

  render() {
    return html`<div
      style="height: ${!this.isOpen ? this.height : `${this.maxHeight}px`}"
    >
      ${this.text}
      <button @click="${this.toggle}">readmore</button>
    </div>`;
  }
}
