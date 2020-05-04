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
        }

        // this.props.observeActiveGamePlayers(this.props.activeGameRef, firestore.collection('users')).then(() => this.setState({ `isLoading`: false }));
    }

    render () {
        const { 
            activeGamePlayerDisplayNames,
            currentTurn,
            handleSquareClick,
            squareIds,
            toggleCurrentTurn,
            selectedSquares
        } = this.props;

        const inviteLink = `${window.location.href}?invite=true`;

        let currentView;

        console.log('activeGamePlayerDisplayNames', activeGamePlayerDisplayNames);

        // if (this.state.isLoading) {
        //     currentView = (
        //         <div className="column is-full">
        //             <progress className="progress is-large is-info" max="100">60%</progress>
        //         </div>
        //     );
        // } else {
        
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
                        <div className="level">
                            <div className="level-item has-text-centered">
                                <div>
                                    <p className="heading">Player 1</p>
                                    <p className="title">{activeGamePlayerDisplayNames[0]}</p>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div>
                                    <p className="heading">Player 2</p>
                                    <p className="title">{activeGamePlayerDisplayNames[1] || 'Invite Player'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal>
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
        
        if (/*activeGameRef*/true) {
            return (
                <Fragment>
                    <div className="columns is-multiline">
                        {currentView}
                    </div>
                </Fragment>
            )
        }

        return <div>oops</div>
    }
}
 
export default withRouter(GameContainer);
