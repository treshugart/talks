/** @jsx h */
/* eslint import/no-webpack-loader-syntax: 0 */

import { Component, define, h, prop, props } from 'skatejs';
import hljs from 'highlight.js';
import hlcss from '!css-loader!highlight.js/styles/monokai.css';
import marked from 'marked';


// Colour palette: https://coolors.co/4e598c-ffd9ce-f9c784-fcaf58-ff8c42
//
// - #4E598C (purple navy)
// - #FFD9CE (unbleached silk)
// - #F9C784 (topaz)
// - #FCAF58 (rajah)
// - #FF8C42 (mango tango)


// Helpers
// -------

const styles = `
  a {
    color: #4E598C;
    text-decoration: none;
  }
  blockquote {
    border-left: 4px solid #FF8C42;
    color: #333;
    margin: 20px 0;
    padding: 10px 20px;
  }
  blockquote p:first-of-type {
    margin-top: 0;
  }
  blockquote p:last-of-type {
    margin-bottom: 0;
  }
  div {
    padding: 20px;
  }
  h1 {
    margin: 0;
    margin-bottom: 20px;
  }
  li {
    margin: 5px;
    padding: 0;
  }
  pre {
    background-color: #4E598C;
    color: #fff;
    padding: 20px;
  }
  sup {
    display: inline-block;
    padding-left: 5px;
  }
  ul {
    list-style-type: disc;
    margin: 20px 0;
    padding: 0 0 0 20px;
  }
  ul ul {
    margin-top: 0;
    padding-left: 10px;
  }
`;
const textarea = document.createElement('textarea');

function decode (html) {
  textarea.innerHTML = html;
  return textarea.value;
}

export const ComponentNext = (Base = Component) => class extends Base {
  propsChangedCallback () {}
  shouldRenderCallback (next, prev) {
    return super.updatedCallback(prev);
  }
  updatedCallback (prev) {
    const next = props(this);
    if (this.shouldRenderCallback(next, prev)) {
      this.propsChangedCallback(next, prev);
      return true;
    }
  }
};

export const ChildrenChanged = (Base = HTMLElement) => class extends Base {
  childrenChangedCallback () {}
  connectedCallback () {
    super.connectedCallback();
    this.childrenChangedCallback();
    const mo = new MutationObserver(this.childrenChangedCallback.bind(this));
    mo.observe(this, { childList: true });
  }
};


// Internal
// --------

const renderer = new marked.Renderer();

renderer.code = (code, lang) => {
  return `<pre><code>${hljs.highlightAuto(code, [lang]).value}</code></pre>`;
};

function parse (markdown) {
  const lines = markdown.split('\n');
  const firstLine = lines.filter(Boolean)[0];
  const indent = firstLine && firstLine.match(/^\s*/)[0].length;
  return lines.map(t => t.substring(indent)).join('\n');
}

const Markdown = define(class extends ChildrenChanged(ComponentNext()) {
  static props = {
    content: prop.string()
  }
  childrenChangedCallback () {
    props(this, { content: parse(decode(this.innerHTML)) });
  }
  renderCallback ({ content }) {
    return [
      <style>{styles}</style>,
      <style>{hlcss.toString()}</style>,
      <div ref={e => (e.innerHTML = marked(content, { renderer }))} />
    ];
  }
});

const Notes = define(class extends ComponentNext() {
  static props = {
    notes: prop.array({ attribute: true })
  }
  renderCallback ({ notes }) {
    return [
      <style>{`
        :host {
          background-color: #FFD9CE;
          display: block;
          padding: 0 20px;
        }
        ${styles}
      `}</style>
    ].concat(notes.map(n => <p ref={e => (e.innerHTML = marked(n, renderer))} />));
  }
});

const Progress = define(class extends ComponentNext() {
  static props = {
    current: prop.number({ attribute: true, default: 1 }),
    total: prop.number({ attribute: true, default: 1 })
  }
  renderCallback ({ current, total }) {
    return [
      <style>{`
        li {
          color: rgba(0, 0, 0, 0);
          flex-grow: 1;
          height: 5px;
          margin: 0;
          padding: 0;
        }
        li[done] {
          background-color: #4E598C;
        }
        ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          width: 100%;
        }
      `}</style>,
      <ul>
        {[...Array(total)].map((n, i) =>
          <li done={i < current}>Slide {i}</li>)}
      </ul>
    ];
  }
});

const { localStorage } = window;
const Store = define(class extends ComponentNext() {
  static props = {
    id: prop.string({ attribute: true }),
    name: prop.string({ attribute: true }),
    value: prop.string({ attribute: true })
  }
  static get (name, { id }) {
    return JSON.parse(localStorage.getItem(id + name));
  }
  static set (name, value, { id }) {
    return localStorage.setItem(id + name, JSON.stringify(value));
  }
  propsChangedCallback ({ id, name, value }) {
    localStorage.setItem(id + name, value);
  }
});


// Public
// ------

const keys = {
  37 (elem, e) {
    const { actualSelected, children } = elem;
    props(elem, {
      selected: actualSelected > 1 ? actualSelected - 1 : children.length
    });
  },
  39 (elem, e) {
    const { actualSelected, children } = elem;
    props(elem, {
      selected: actualSelected < children.length ? actualSelected + 1 : 1
    });
  }
};

export const Deck = class extends ChildrenChanged(ComponentNext()) {
  static props = {
    focused: prop.boolean({ attribute: true }),
    id: prop.string({ attribute: true }),
    mouseX: prop.number(),
    mouseY: prop.number(),
    selected: prop.number({ attribute: true })
  }
  get actualSelected () {
    return this.selected || Store.get('currentSlide', this) || 1;
  }
  get slide () {
    const { actualSelected, children } = this;
    return children[actualSelected - 1];
  }
  handleFocused = e => {
    if (this.focused) {
      e.focus();
    }
  }
  handleKeyDown = e => {
    const handler = keys[e.keyCode];
    if (handler) {
      handler(this, e);
    }
  }
  childrenChangedCallback () {
    this.propsChangedCallback();
  }
  propsChangedCallback () {
    const { slide } = this;
    [...this.children].filter(c => c.selected).forEach(c => (c.selected = false));
    if (slide) {
      slide.selected = true;
    }
  }
  handleMousemove = e => {
    const { pageX: mouseX, pageY: mouseY } = e;
    props(this, { mouseX, mouseY });
  }
  renderCallback ({ actualSelected, children, handleFocused, handleKeyDown, handleMousemove, id, mouseX, mouseY }) {
    const { notes } = this.slide || {};
    return [
      <style>{`
        :host {
          cursor: none;
          display: block;
        }
        .container {
          height: 100vh;
          width: 100vw;
        }
        .notes {
          bottom: 10px;
          cursor: default;
          position: fixed;
          right: 10px;
          width: 300px;
        }
        .cursor {
          background-color: black;
          border-radius: 20px;
          height: 20px;
          opacity: .75;
          position: absolute;
          width: 20px;
        }
      `}</style>,
      <div class="cursor" style={{ left: `${mouseX}px`, top: `${mouseY}px` }} />,
      <div class="container" onmousemove={handleMousemove} onkeydown={handleKeyDown} tabindex="0" ref={handleFocused}>
        <Store id={id} name="currentSlide" value={actualSelected} />
        <Progress current={actualSelected} total={children.length} />
        <Notes class="notes" notes={notes} />
        <slot />
      </div>
    ];
  }
};


function parseNotesFromMarkdown (markdown) {
  return markdown.split('\n').reduce((prev, next) => {
    const trimmed = next.trim();
    if (trimmed.substring(0, 2) === '< ') {
      prev.notes.push(trimmed.substring(2));
    } else {
      prev.lines.push(next);
    }
    return prev;
  }, {
    lines: [],
    notes: []
  });
}

export const Slide = class extends ChildrenChanged(ComponentNext()) {
  static props = {
    content: prop.string(),
    selected: prop.boolean({ attribute: true })
  }
  childrenChangedCallback () {
    const { lines, notes } = parseNotesFromMarkdown(decode(this.innerHTML));
    const content = lines.join('\n');
    props(this, { content, notes });
  }
  renderCallback ({ content }) {
    return [
      <style>{`
        :host {
          display: none;
          margin: auto;
          max-width: 800px;
        }
        :host([selected]) {
          display: block;
        }
      `}</style>,
      <Markdown>{content}</Markdown>
    ];
  }
};
