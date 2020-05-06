// TODO: lint all this
/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";

class GameCard extends Component {
    constructor (props) {
        super(props);
    }

    transitionToGame () {
        console.log('transitioning to game', this.props.gameInfo.gameId);
        this.props.history.push(`/game/${this.props.gameInfo.gameId}`, {
            gameId: this.props.gameInfo.gameId
        });
    }

    render () {
        return (
            <div className="column is-one-half">    
                <div className="box">
                    <div className="columns is-multiline">
                        <div className="column">        
                            { this.props.gameInfo.opposingPlayerDisplay ? `Game with ${this.props.gameInfo.opposingPlayerDisplay}` : `Empty game` }
                        </div>
                        <div className="column">
                            <button onClick={this.transitionToGame.bind(this)} className="button is-link">Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default withRouter(GameCard);
