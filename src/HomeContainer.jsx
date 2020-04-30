// TODO: lint all this
/* eslint-disable */
import React, { Fragment } from 'react';
import GameManager from './GameManager';
import UserAuthForm from './UserAuthForm';

function HomeContainer (props) {
	const { 
		isLoggedIn, 
		isLoading, 
		createNewGame,
		activeGameRef
	} = props;
	let currentView;

	if (isLoading) {
		currentView = (
			<Fragment>
				<p>Loading!</p>
			</Fragment>
		);
	} else if (isLoggedIn) {
		currentView = <GameManager 
			createNewGame={createNewGame}
			activeGameRef={activeGameRef}
		/>;
	} else {
		currentView = <UserAuthForm />;
	}

	return ( 
		<div className="columns">
			<div className="column is-half is-offset-one-quarter">
				{currentView}
			</div>
		</div> 
	);
}
 
export default HomeContainer;
