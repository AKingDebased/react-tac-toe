import React from 'react';
// TODO: Only import the firebase modules i need
import firebase from './firebase-config';
import update from 'immutability-helper';

class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			currentTurn: 'X',
			selectedSquares: []
		}

		this.squareIds = [0, 1, 2, 3, 4, 5, 6, 7, 8];

		firebase.database();
	}

	checkGameState (selectedSquares) {
		const winConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		  ];

		
		for (let i = 0; i < winConditions.length; i++) {
			const [a, b, c] = winConditions[i];

			if (!selectedSquares[a] || !selectedSquares[b] || !selectedSquares [c]) continue;


			if (selectedSquares[a].symbol && selectedSquares[a].symbol === selectedSquares[b].symbol && selectedSquares[a].symbol === selectedSquares[c].symbol) {
				return selectedSquares[a];
			}
		}
		
		return null;
	}

	handleSquareClick (id) {
		this.setState((state) => {
			// TODO: This needs to be respect immutability
			const selectedSquaresCopy = state.selectedSquares;

			selectedSquaresCopy[id] = { id: id, symbol: state.currentTurn};

			return {
				...state,
				selectedSquares: selectedSquaresCopy
			}
		}, () => {
			if (this.checkGameState(this.state.selectedSquares)) {
				alert('we have a winner!');
				return;
			}
	
			this.toggleCurrentTurn();
		});
	}

	toggleCurrentTurn () {
		this.setState((state) => ({ currentTurn: state.currentTurn === 'X' ? 'O' : 'X'}));
	}

	render () {
		return (
			<div className="App">
				<GameState currentTurn={this.state.currentTurn}/>
				<Board 
					handleSquareClick={this.handleSquareClick.bind(this)} 
					squareIds={this.squareIds} currentTurn={this.state.currentTurn} 
					toggleCurrentTurn={this.toggleCurrentTurn.bind(this)}
					selectedSquares={this.state.selectedSquares}
				/>
			</div>
		);
	}
}

class Board extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			<div className="board">{this.props.squareIds.map((squareId) => {
				return <Square 
					key={squareId} 
					squareId={squareId} 
					handleSquareClick={this.props.handleSquareClick}
					selectedSquares={this.props.selectedSquares}
				/>
			})}</div>
		);
	}
}

function GameState(props) {
	return (
		<div className="game-state">{props.currentTurn}</div>
	);
}

function Symbol(props) {
	return (
		// TODO: These are slightly off center, why?
		<div className="symbol">{props.symbol}</div>
	)
}

class Square extends React.Component {
	constructor(props) {
		super(props);
	}

	handleClick (squareId) {
		this.props.handleSquareClick(squareId);
	}

	renderSymbol () {
		const currentSquare = this.props.selectedSquares[this.props.squareId];

		return currentSquare ? currentSquare.symbol : null;
	}

	render () {
		return (
			<div onClick={this.handleClick.bind(this, this.props.squareId)} className="square">
				<Symbol symbol={this.renderSymbol()} />	
			</div>
		)
	}
}

export default App;
