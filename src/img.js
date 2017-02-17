import { Component, define, h, prop } from 'skatejs';

define(class extends Component {
  static is = 'talk-img'
  static props = {
    alt: prop.string({ attribute: true }),
    avatar: prop.boolean({ attribute: true }),
    height: prop.string({ attribute: true }),
    src: prop.string({ attribute: true }),
    title: prop.string({ attribute: true }),
    width: prop.string({ attribute: true })
  }
  get css () {
    const { avatar, height, width } = this;
    return `
      :host {
        display: block;
        text-align: center;
      }
      .img {
        display: inline-block;
        border-radius: ${avatar ? (height || width) : '0'}px;
      }
    `;
  }
  handleRef = (e) => {
    const { height, width } = this;
    if (height) {
      e.setAttribute('height', height);
    }
    if (width) {
      e.setAttribute('width', width);
    }
  }
  renderCallback ({ alt, css, handleRef, src, title }) {
    return [
      <style>{css}</style>,
      <img
        alt={alt || title || src}
        class="img"
        src={src}
        title={title || alt || src}
        ref={handleRef}
      />
    ];
  }
});
