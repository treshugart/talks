import 'skatejs-web-components';
import '@skatejs/vert';
import { Component, define, h, prop } from 'skatejs';

define(class extends Component {
  static is = 'talk-img'
  static props = {
    alt: prop.string({ attribute: true }),
    height: prop.string({ attribute: true }),
    src: prop.string({ attribute: true }),
    title: prop.string({ attribute: true }),
    width: prop.string({ attribute: true })
  }
  css = `
    :host {
      display: block;
      text-align: center;
    }
    .img {
      display: inline-block;
    }
  `
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
        alt={alt || title}
        class="img"
        src={src}
        title={title || alt}
        ref={handleRef}
      />
    ];
  }
});
