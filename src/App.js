import React from 'react';
// import logo from './logo.svg';

function App() {
  return (
	<div className="App">
		<Board />
	</div>
  );
}

class Board extends React.Component {
	createBoard () {
		const boardSize = 9,
			squares = [];

		for (let i = 0; i < 9; i++) {
			squares.push(<Square />)
		}

		return squares;

	}

	render () {
		return (
			<div className="board">{this.createBoard()}</div>
		);
	}
}

class Square extends React.Component {
	render () {
		return (
			<div className="square"></div>
		)
	}
}

export default App;
