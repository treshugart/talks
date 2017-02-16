import 'skatejs-web-components';
import '@skatejs/vert';
import { Component, define, h, prop } from 'skatejs';

define(class extends Component {
  static is = 'talk-img'
  static props = {
    alt: prop.string({ attribute: true }),
    src: prop.string({ attribute: true }),
    title: prop.string({ attribute: true })
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
  renderCallback ({ alt, css, src, title }) {
    return [
      <style>{css}</style>,
      <img class="img" alt={alt || title} src={src} title={title || alt} />
    ];
  }
});
