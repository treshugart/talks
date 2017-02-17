import { Component, define, h, prop, props } from 'skatejs';

define(class extends Component {
  static is = 'talk-code'
  static props = {
    code: prop.string(),
    src: prop.string({ attribute: true })
  }
  get type () {
    return this.src.split('.').pop();
  }
  updatedCallback (prev) {
    const { code, src } = this;
    if (super.updatedCallback(prev)) {
      fetch(src)
        .then(r => r.text())
        .then(r => props(this, { code: r }));
      return true;
    }
  }
  renderCallback ({ code, type }) {
    return (
      <vert-markdown content={`\`\`\`${type}
${code}
\`\`\``} />
    );
  }
});
