// TODO: lint all this
/* eslint-disable */
import React, { Component } from 'react';
import firebase from './firebase-config';
const firestore = firebase.firestore();

import GameCard from './GameCard';

class GameManager extends Component {
	constructor(props) {
		super(props);
		this.state = {
			playerGames: [],
			activeGamesCardsInfo: []
		}

		this.observeUserGames();
	}

	observeUserGames () {
		return this.props.userRef.collection('games').onSnapshot(gamesSnapshot => this.constructActiveGameCards(gamesSnapshot));
	}

	constructActiveGameCards (gamesSnapshot) {
		const activeGamesCallback = (resolve, reject) => {
			const gameIds = gamesSnapshot.docs.map((game) => game.id),
				gamePromises = [],
				opposingPlayerPromises = [];
				
			gameIds.forEach(gameId => gamePromises.push(this.props.gamesRef.doc(gameId).collection('players').get()));
	
			// TODO: This is not particularly clean, and could likely use a refactor
			Promise.all(gamePromises)
				.then(activeGamesPlayersLists => {
					activeGamesPlayersLists.forEach((activeGamePlayerList, index) => {
						const opposingPlayer = activeGamePlayerList.docs.find(playerInfo => playerInfo.id !== this.props.userRef.id);

						// TODO: This logic is so painfully tortured. If this weird method of connecting player IDs to their
						// player info is really the best, then a separate function should be created whose sole purpose
						// is to take a player ID and use it to get the associated player info
						if (opposingPlayer) {
							opposingPlayerPromises.push(new Promise((resolve, reject) => {
								this.props.usersRef.doc(opposingPlayer.id).get()
								.then(opposingPlayerInfo => { 
									resolve({
										gameId: gameIds[index],
										opposingPlayerDisplay: opposingPlayerInfo.data().email
									});
								})
								.catch(reject);
							}));
						} else {
							opposingPlayerPromises.push(new Promise(resolve => {
								resolve({
									gameId: gameIds[index],
									opposingPlayerDisplay: null
								});
							}));
						}
					});

					Promise.all(opposingPlayerPromises)
					.then(opposingPlayers => {
						resolve(opposingPlayers);
					});					
				})
		},
		activeGamesPromise = new Promise(activeGamesCallback);

		activeGamesPromise.then(activeGameCardsInfo => {
			this.setState({
				activeGameCardsInfo
			});
		});
	}

	renderActiveGames (games) {
		if (games && games.length) {
			const columns = games.map((game) => {
				// TODO: Need a unique id for this list
				// TODO: Need logic for when game doesn't have an opposing player
				return <GameCard gameInfo={game}/>
			});

			return (
				<div className="columns is-multiline">
					{columns}
				</div>
			);
		}

		return (
			<div className="column is-half is-offset-one-quarter">
				<div className="column is-full">
					<progress className="progress is-large is-info" max="100">60%</progress>
				</div>
			</div>
		);
	}

	render () {
		return (
			<div className="box game-manager">
				<div className="game-manager__games">{this.renderActiveGames(this.state.activeGameCardsInfo)}</div>
				<button 
					onClick={this.props.createNewGame} 
					className="button game-manager__create-game"
				>
					New Game
				</button>
			</div>
		)
	}
}

export default GameManager;
