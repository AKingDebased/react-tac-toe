import React from 'react';
// TODO: Only import the firebase modules i need
import firebase from './firebase-config';

class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			currentTurn: 'X'
		}

		// this.handleSquareClick = this.handleSquareClick.bind(this);

		firebase.database();
	}

	toggleCurrentTurn () {
		this.setState((state) => ({ currentTurn: state.currentTurn === 'X' ? 'O' : 'X'}));
	}

	render () {
		return (
			<div className="App">
				<GameState currentTurn={this.state.currentTurn}/>
				<Board currentTurn={this.state.currentTurn} toggleCurrentTurn={this.toggleCurrentTurn.bind(this)}/>
			</div>
		);
	}
}

class Board extends React.Component {
	constructor(props) {
		super(props);
	}

	createBoard () {
		// TODO: Probably a better way to do IDs, huh?
		const boardIds = [1, 2, 3, 4, 5, 6, 7, 8, 9],
			squares = [];

		for (let i = 0; i < boardIds.length; i++) {
			squares.push(<Square key={boardIds[i]} currentTurn={this.props.currentTurn} toggleCurrentTurn={this.props.toggleCurrentTurn}/>)
		}

		return squares;
	}

	render () {
		return (
			<div className="board">{this.createBoard()}</div>
		);
	}
}

function GameState(props) {
	return (
		<div className="game-state">{props.currentTurn}</div>
	);
}

class Square extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			symbol: null
		}
	}

	handleClick (e) {
		this.setState((state, props) => {
			return { symbol: props.currentTurn };
		});

		this.props.toggleCurrentTurn();
	}

	render () {
		return (
			<div onClick={this.handleClick.bind(this)} className="square">{this.state.symbol}</div>
		)
	}
}

export default App;
