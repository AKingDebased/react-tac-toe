// TODO: lint all this
/* eslint-disable */
import React, { Component } from 'react';
import firebase from './firebase-config';
const firestore = firebase.firestore();

class Square extends Component {
	constructor(props) {
		super(props);
	}

	renderActiveGames () {
		return (
			// TODO: Figure out how to flow these vertically
			<div className="columns">
				<div className="column">
					<div className="box">sample game 1</div>
				</div>

				<div className="column">
					<div className="box">sample game 2</div>
				</div>
				
				<div className="column">
					<div className="box">sample game 3</div>
				</div>
			</div>
		);
	}

	render () {
		return (
			<div className="box game-manager">
				<div className="game-manager__games">{this.renderActiveGames()}</div>
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

export default Square;
