// TODO: lint all this
/* eslint-disable */
import React, { Component, Fragment } from 'react';
import Board from './Board';
import Modal from './Modal';

import { withRouter } from "react-router-dom";

// Database
// TODO: Figure out the correct firebase modules for production
import firebase from './firebase-config';
const firestore = firebase.firestore();

class GameContainer extends Component {
    constructor (props) { 
        super(props);
        this.state = {
            isLoading: true,
            activeGamePlayers: [],
            isInviteModalActive: false
        }

        this.initializeGame();
    }

    initializeGame () {
        const activeGameRef = this.props.activeGameRef || firestore.collection('games').doc(this.props.location.state.gameId),
            usersRef = firestore.collection('users');

        this.observeActiveGamePlayers(activeGameRef, usersRef);
    } 

    observeActiveGamePlayers (activeGame, usersRef) {
		// TODO: Is there a better way to find all users who are a) in a game with this id b) set to 'isActive'?

		// TODO: Should implement local caching so we don't have to constantly hit the DB unnecessarily
		// Frequently hit documents, like users and games, should have observers set up that watch for changes, cache them
		// locally, and pass them down to all the components using them

		// TODO: Need a way to ensure this observer is not called multiple times
		return activeGame.collection('players').onSnapshot(playersSnapshot => {
            this.getActiveGamePlayers(playersSnapshot, usersRef)
            .then(activeGamePlayers => {
                this.setState({
                    activeGamePlayers: this.orderActivePlayers(activeGamePlayers),
                    isLoading: false
                });
            })
        });
    }

    orderActivePlayers (activeGamePlayers) {
        // TODO: This function name is a misnomer, since they're not actually ordered
        // in the array, but rather, have an order "label" (isPlayer1)

        // TODO: Maybe 1st player status should be maintained in firestore
        return activeGamePlayers.reduce((accum, currentVal) => {
            if (currentVal.id === this.props.userRef.id) {
                accum['player1'] = currentVal;
            } else {
                accum['player2'] = currentVal;
            }   
            
            return accum;
        }, {});
    }
    
    getActiveGamePlayers (playersSnapshot, usersRef) {
        console.log('getting active game players');
        const userPromises = [];

        playersSnapshot.docs.forEach(playerData => userPromises.push(usersRef.doc(playerData.id).get()));

        return Promise.all(userPromises);
    }

    renderPlayersDisplay (activeGamePlayers) {
        let player2Copy;

        if (false) {
            player2Copy = activeGamePlayers.player2.data().email;
        } else {
            player2Copy = <button className="button" onClick={() => { this.setState({ isInviteModalActive: true })}}>Invite Player</button>
        }

        return (
            <div className="level">
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Player 1</p>
                        <p className="title">{activeGamePlayers.player1.data().email}</p>
                    </div>
                </div>
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Player 2</p>
                        <p className="title">{player2Copy}</p>
                    </div>
                </div>
            </div>
        );
    }

    render () {
        const { 
            currentTurn,
            handleSquareClick,
            squareIds,
            toggleCurrentTurn,
            selectedSquares
        } = this.props;

        const inviteLink = `${window.location.href}?invite=true`;

        let currentView;

        if (this.state.isLoading) {
            currentView = (
                <div className="column is-full">
                    <progress className="progress is-large is-info" max="100">60%</progress>
                </div>
            );
        } else {
            currentView = (
                <Fragment>
                    <div className="column is-full">
                        <Board 
                            handleSquareClick={handleSquareClick} 
                            squareIds={squareIds} currentTurn={currentTurn} 
                            toggleCurrentTurn={toggleCurrentTurn}
                            selectedSquares={selectedSquares}
                        />
                    </div>
                    <div className="column is-full">
                        {this.renderPlayersDisplay(this.state.activeGamePlayers)}
                    </div>

                    <Modal isActive={this.state.isInviteModalActive}>
                        <div className="columns is-multiline">
                            <div className="column is-full">
                                <label className="label">Copy Invite Link & Share with Player!</label>
                                <input type="text" className="input" readOnly value={inviteLink }/>
                            </div>
                            <div className="column is-full">
                                <div className="button">Copy Invite Link</div>
                            </div>
                        </div>
                    </Modal>
                </Fragment>
            );
        }
        
        if (/*activeGameRef*/true) {
            return (
                <Fragment>
                    <div className="columns is-multiline">
                        {currentView}
                    </div>
                </Fragment>
            )
        }
    }
}
 
export default withRouter(GameContainer);
