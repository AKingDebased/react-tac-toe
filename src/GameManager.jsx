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
		return <span>test</span>;
	}

	render () {
		return (
			<div className="game-manager">
				<div className="game-manager__games">{this.renderActiveGames()}</div>
				<button 
					onClick={this.props.createNewGame} 
					className="game-manager__create-game"
				>
					New Game
				</button>
			</div>
		)
	}
}

export default Square;
