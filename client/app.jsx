import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <h1>hello app.jsx !!!11</h1>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('main'));