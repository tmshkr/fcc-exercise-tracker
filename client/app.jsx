const React = require('react');
const ReactDOM = require('react-dom');

class App extends React.Component {
  render() {
    return (
      <h1>hello app.jsx !!!1</h1>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('main'));