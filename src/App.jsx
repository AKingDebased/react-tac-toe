// TODO: lint all this
/* eslint-disable */
import React, { Fragment, Component } from 'react';
// import update from 'immutability-helper';

// Components
import Board from './Board';
import GameState from './GameState';
import UserAuthForm from './UserAuthForm';
import GameManager from './GameManager';

// Database
// TODO: Figure out the correct firebase modules for production
import firebase from './firebase-config';
const firestore = firebase.firestore();

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userRef: null,
			activeGameRef: null,
			gameInProgress: false,
			activeGamePlayerDisplayNames: [],
			currentTurn: 'X',
			selectedSquares: [],
			isLoggedIn: false,
			isLoading: true,
		};

		this.squareIds = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		this.gamesRef = firestore.collection('games');

		let activeGameRef;
		let currentPlayersRef;

		// Check if user is logged in already
		firebase.auth().onAuthStateChanged(user => {
			console.log('auth state changed', user)
			// // console.log('does this user exist at this uid?', firestore.collection('users').doc(user.uid));
			// userRef.get()
			// 	.then(userSnapshot => {
			// 		if (!userSnapshot.exists) {
			// 			userRef.set({
			// 				isActive: true
			// 			});
			// 		}
			// 	});


			if (user) {
				this.setState({
					isLoggedIn: true,
					userRef: firestore.collection('users').doc(user.uid),
				});
			}

			this.setState({
				isLoading: false,
			});
		});

		// activeGameRef.get()
		// .then(docSnapshot => {
		// 	if (docSnapshot.exists) {
		// 		// Check if room is full. If not full, permit the user to enter
		// 	} else {
		// 		gamesRef.add({
		// 			inProgress: true
		// 		})
		// 		.then(docRef => {
		// 			activeGameUsersRef = docRef.collection('users');
		
		// 			activeGameUsersRef.add({})
		// 			.then(docRef => {
		// 				activeGameUsersRef.get()
		// 				.then(snapshot => {
		// 					console.log('size', snapshot.size);
		// 				});
		// 			});
		// 		});
		// 	}
		// });
	}

	createNewGame () {
		this.gamesRef.add({
			inProgress: true,	
		})
		.then(ref => {
			const activeGame = ref;

			// TODO: Might want to keep a separate variable for the user id, and not rely on the 
			// ID that's been saved to the user document
			this.attachGameToPlayer(activeGame, this.state.userRef.id, activeGame.id)
			.then(this.observeActiveGamePlayers.bind(this, activeGame, firestore.collection('users')))
			.then(() => {
				console.log('new game associated with current user');
				alert('new game created! entering now.');

				this.setState({
					gameInProgress: true,
					activeGameRef: activeGame
				});
			})
		})
		.catch(err => {
			alert('error creating game. see console');
			console.log('error', err);
		});
	}

	attachGameToPlayer (activeGame, playerId, gameId) {
		console.log('attaching game to player');
		return activeGame.collection('players').doc(playerId).set({
			isActive: true
		})
		.then(ref => {		
			console.log('new game added', activeGame);

			this.state.userRef.collection('games').doc(gameId).set({
				isActive: true
			})
		});
	}

	observeActiveGamePlayers (activeGame, usersRef) {
		// TODO: Is there a better way to find all users who are a) in a game with this id b) set to 'isActive'?

		// TODO: Should implement local caching so we don't have to constantly hit the DB unnecessarily

		// TODO: Need a way to ensure this observer is not called multiple times
		return activeGame.collection('players').onSnapshot(playersSnapshot => {
			const userPromises = [];

			playersSnapshot.docs.forEach(playerData => userPromises.push(usersRef.doc(playerData.id).get()));

			// this.setState({ activeGamePlayerDisplayNames: playerEmails});
			Promise.all(userPromises)
			.then(users => {
				this.setState({
					activeGamePlayerDisplayNames: users.map(user => user.data().email)
				});
			});
		});
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

	toggleCurrentTurn () {
		this.setState((state) => ({ currentTurn: state.currentTurn === 'X' ? 'O' : 'X'}));
	}

	render() {
		const { isLoggedIn, isLoading, gameInProgress } = this.state;
		let currentView;

		if (isLoading) {
			currentView = (
				<Fragment>
					<p>Loading!</p>
				</Fragment>
			);
		} else if (isLoggedIn) {
			if (gameInProgress) {
				currentView = (
					<Fragment>
						<GameState 
							currentTurn={this.state.currentTurn} 
							activeGamePlayerDisplayNames={this.state.activeGamePlayerDisplayNames}
						/>
						<Board 
							handleSquareClick={this.handleSquareClick.bind(this)} 
							squareIds={this.squareIds} currentTurn={this.state.currentTurn} 
							toggleCurrentTurn={this.toggleCurrentTurn.bind(this)}
							selectedSquares={this.state.selectedSquares}
						/>
					</Fragment>
				);
			} else {
				currentView = <GameManager 
					createNewGame={this.createNewGame.bind(this)}
					activeGameRef={this.state.activeGameRef}
				/>;
			}
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
