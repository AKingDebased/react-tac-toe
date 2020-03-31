// TODO: lint all this
/* eslint-disable */
import React, { Fragment, Component } from 'react';
// import update from 'immutability-helper';

// Components
import Board from './Board';
import GameState from './GameState';
import UserAuthForm from './UserAuthForm';

// Database
// TODO: Figure out the correct firebase modules for production
import firebase from './firebase-config';
const firestore = firebase.firestore();

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTurn: 'X',
			selectedSquares: [],
			isLoggedIn: false,
			isLoading: true,
		};

		this.squareIds = [0, 1, 2, 3, 4, 5, 6, 7, 8];

		const gamesRef = firestore.collection('games');

		let currentGameRef;
		let currentPlayersRef;

		// Authentication
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					isLoggedIn: true,
				});
			}

			this.setState({
				isLoading: false,
			});
		});

		gamesRef.get()
			.then((gamesSnapshot) => {
				if (gamesSnapshot.size < 1) {
					gamesRef.add({
						inProgress: true
					})
						.then(ref => {
							currentGameRef = ref;

							currentPlayersRef = currentGameRef.collection('players');

							currentPlayersRef.get()
								.then(currentPlayersSnapshot => {
									// if (currentPlayersSnapshot.size < 2) {
									// }
								});
						});
				}
			});

		// currentGameRef.get()
		// .then(docSnapshot => {
		// 	if (docSnapshot.exists) {
		// 		// Check if room is full. If not full, permit the user to enter
		// 	} else {
		// 		gamesRef.add({
		// 			inProgress: true
		// 		})
		// 		.then(docRef => {
		// 			currentGameUsersRef = docRef.collection('users');
		
		// 			currentGameUsersRef.add({})
		// 			.then(docRef => {
		// 				currentGameUsersRef.get()
		// 				.then(snapshot => {
		// 					console.log('size', snapshot.size);
		// 				});
		// 			});
		// 		});
		// 	}
		// });
	}

	checkGameState(selectedSquares) {
		this.winConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for (let i = 0; i < this.winConditions.length; i += 1) {
			const [a, b, c] = this.winConditions[i];

			if (!selectedSquares[a] || !selectedSquares[b] || !selectedSquares[c]) continue;


			if (selectedSquares[a].symbol 
				&& selectedSquares[a].symbol === selectedSquares[b].symbol
				&& selectedSquares[a].symbol === selectedSquares[c].symbol) {
				return selectedSquares[a];
			}
		}

		return null;
	}

	handleSquareClick(id) {
		this.setState((state) => {
			// TODO: This needs to be respect immutability
			const selectedSquaresCopy = state.selectedSquares;

			selectedSquaresCopy[id] = { id: id, symbol: state.currentTurn};

			return {
				...state,
				selectedSquares: selectedSquaresCopy
			};
		}, () => {
			const { selectedSquares } = this.state;

			if (this.checkGameState(selectedSquares)) {
				// alert('we have a winner!');
				return;
			}

			this.toggleCurrentTurn();
		});
	}

	toggleCurrentTurn() {
		this.setState((state) => ({ currentTurn: state.currentTurn === 'X' ? 'O' : 'X'}));
	}

	render() {
		const { isLoggedIn, isLoading } = this.state;
		let currentView;

		if (isLoading) {
			currentView = (
				<Fragment>
					<p>Loading!</p>
				</Fragment>
			);
		} else if (isLoggedIn) {
			currentView = (
				<Fragment>
					<GameState currentTurn={this.state.currentTurn}/>
					<Board 
						handleSquareClick={this.handleSquareClick.bind(this)} 
						squareIds={this.squareIds} currentTurn={this.state.currentTurn} 
						toggleCurrentTurn={this.toggleCurrentTurn.bind(this)}
						selectedSquares={this.state.selectedSquares}
					/>
				</Fragment>
			);
		} else {
			currentView = <UserAuthForm />;
		}

		return (
			<div className="App">
				{currentView}
			</div>
		);
	}
}

export default App;
