// TODO: lint all this
/* eslint-disable */
import React, { Fragment } from 'react';

function GameState(props) {
	const { activeGamePlayerDisplayNames } = props;
	// TODO: Need unique IDs for the renderPlayers array
	const renderPlayers = Array.from(activeGamePlayerDisplayNames).map(activeGamePlayerDisplayName => <li>{activeGamePlayerDisplayName}</li>);

	return (
		<div className="game-state">
			<div>
				<h3>players:</h3> 
				<ul>
					{renderPlayers}
				</ul>
			</div>
			<div>current turn: {props.currentTurn}</div>
		</div>
	);
}
 
export default GameState;
