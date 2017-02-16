module.exports = {
  type: 'web-module',
  npm: {
    esModules: false,
    umd: {
      global: 'talks',
      externals: {}
    }
  },
  babel: {
    plugins: [
      'transform-flow-strip-types',
      ['transform-react-jsx', { pragma: 'h' }]
    ]
  }
}
