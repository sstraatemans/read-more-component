import { html, css, LitElement, property, query } from 'lit-element';

export class ReadMore extends LitElement {
  static styles = css``;

  @property({ type: Number }) maxLines = 0;
  @property({ type: Boolean }) isOpen = false;
  @property({ type: String }) fullText = '';
  @property({ type: String }) text = '';
  @property({ type: Number }) textLength = 0;

  firstUpdated() {
    const width = this.shadowRoot?.querySelector('div')?.clientWidth ?? 0;
    const buttonWidth =
      this.shadowRoot?.querySelector('button')?.clientWidth ?? 0;

    this.textLength = this.calcLength(
      this.fullText,
      this.maxLines,
      width,
      buttonWidth
    );
  }

  calcLength(text:string, maxLines:number, width:number, buttonWidth:number):number {
    const ruler = document.createElement('div');
    ruler.style.width = 'auto';
    ruler.style.position = 'absolute';
    ruler.style.whiteSpace = 'nowrap';
    this.shadowRoot?.querySelector('div')?.appendChild(ruler);
    let i = 0;

    const wordArray: string[] = text.split(' ');
    console.log(wordArray);

    for (; i < text.length; i += 1) {
      ruler.innerHTML = text.substring(0, i);
      if (ruler.offsetWidth > maxLines * width - buttonWidth * 2) {
        break;
      }
    }

    //ruler.parentNode?.removeChild(ruler);
    return i;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.isOpen
      ? (this.text = this.fullText)
      : (this.text = this.fullText.substring(0, this.textLength));
  }

  render() {
    return html`<div>
      ${this.text}
      <button @click="${this.toggle}">readmore</button>
    </div>`;
  }
}
