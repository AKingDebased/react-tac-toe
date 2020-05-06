// TODO: lint all this
/* eslint-disable */
import React, { Fragment, Component } from 'react';
import {
	Switch,
	Route,
	withRouter,
  } from "react-router-dom";

// Database
// TODO: Figure out the correct firebase modules for production
import firebase from './firebase-config';
const firestore = firebase.firestore();

// Components
import GameContainer from './GameContainer';
import HomeContainer from './HomeContainer';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userRef: null,
			activeGameId: null,
			activeGameRef: null,
			gameInProgress: false,
			activeGamePlayerDisplayNames: [],
			currentTurn: 'X',
			selectedSquares: [],
			isLoading: true,
			isInvited: false,
			usersRef: firestore.collection('users')
		};

		this.squareIds = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		this.gamesRef = firestore.collection('games');

		// Check if user is logged in already
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				console.log('user is authenticated')
				this.setState({ userRef: firestore.collection('users').doc(user.uid) });

				if (this.state.isInvited) {
					this.attachGameToPlayer(this.state.activeGameId, user.uid).then(() => {
						console.log('attached game to invited player, redirecting to game');
						
						this.props.history.push(`/game/${this.state.activeGameId}`);
						this.setState({ 
							isInvited: false
						})
					});
				}
			}

			this.handleArrivalRouting();

			this.setState({
				isLoading: false,
			});
		});
	}

	handleArrivalRouting () {
		const queryParams = new URLSearchParams(this.props.location.search),
			activeGameId = this.props.location.pathname.split('/')[2],
			isGameView = this.props.location.pathname.split('/')[1] === 'game';

		if (isGameView && queryParams.get('invite') == 'true') {
			console.log('user was invited, redirecting home')
			this.setState({ 
				isInvited: queryParams.get('invite') == 'true',
				activeGameRef: firestore.collection('games').doc(activeGameId)
			}, this.props.history.push('/'));
		} else if (isGameView) {
			console.log(`user wasn't invited, landed on game page, sending home`)
			this.props.history.push('/');
		}
	}

	createNewGame () {
		this.gamesRef.add({
			inProgress: true,	
		})
		.then(ref => {
			const activeGame = ref;

			// TODO: Might want to keep a separate variable for the user id, and not rely on the 
			// ID that's been saved to the user document
			this.attachGameToPlayer(activeGame, this.state.userRef.id)
			.then(() => {
				console.log('new game associated with current user');
				alert('new game created! entering now.');

				// TODO: history.push or Redirect component?
				// https://tylermcginnis.com/react-router-programmatically-navigate/
				this.setState({
					activeGameRef: activeGame
				}, () => this.props.history.push(`/game/${activeGame.id}`));
			})
		})
		.catch(err => {
			alert('error creating game. see console');
			console.log('error', err);
		});
	}

	attachGameToPlayer (activeGame, playerId) {		
		return activeGame.collection('players').doc(playerId).set({
			isActive: true
		})
		.then(ref => {		
			console.log('player added to game');

			this.state.userRef.collection('games').doc(activeGame.id).set({
				isActive: true
			}).then(() => { console.log('game added to player ref') });
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
		return (
			<div className="container">
				<Switch>
					<Route path="/game/:id">
						<GameContainer 
							activeGameRef={this.state.activeGameRef}
							currentTurn={this.state.currentTurn} 
							activeGamePlayerDisplayNames={this.state.activeGamePlayerDisplayNames}
							handleSquareClick={this.handleSquareClick.bind(this)} 
							squareIds={this.squareIds} currentTurn={this.state.currentTurn} 
							toggleCurrentTurn={this.toggleCurrentTurn.bind(this)}
							selectedSquares={this.state.selectedSquares}
							usersRef={this.state.usersRef}
							userRef={this.state.userRef}
						/>
					</Route>

					<Route path="/">
						<HomeContainer 
							isLoading={this.state.isLoading}
							userRef={this.state.userRef}
							usersRef={this.state.usersRef}
							createNewGame={this.createNewGame.bind(this)}
							activeGameRef={this.state.activeGameRef}
							isInvited={this.state.isInvited}
							activeGameId={this.state.activeGameId}
							gamesRef={this.gamesRef}
						/>
					</Route>
				</Switch>
			</div>
		)
	}
}

export default withRouter(App);
