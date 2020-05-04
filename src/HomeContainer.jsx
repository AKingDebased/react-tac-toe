// TODO: lint all this
/* eslint-disable */
import React, { Fragment } from 'react';
import GameManager from './GameManager';
import UserAuthForm from './UserAuthForm';

function HomeContainer (props) {
	const { 
		userRef, 
		usersRef,
		isLoading, 
		createNewGame,
		activeGameRef,
		isInvited,
		gamesRef,
	} = props;
	let currentView;

	if (isLoading) {
		// TODO: Should make a component for this
		currentView = (
			<div className="column is-half is-offset-one-quarter">
				<Fragment>
					<div className="column is-full">
						<progress className="progress is-large is-info" max="100">60%</progress>
					</div>
				</Fragment>
			</div>
		);
	} else if (userRef && !isInvited) {
		currentView = (
			<div className="column is-half is-offset-one-quarter">
				<GameManager 
					userRef={userRef}
					usersRef={usersRef}
					createNewGame={createNewGame}
					activeGameRef={activeGameRef}
					gamesRef={gamesRef}
				/>;
			</div>
		)
	} else if (!userRef && isInvited) {
		currentView = (
			<Fragment>
				<div className="column is-half is-offset-one-quarter">
					<div className="notification is-warning">
						<button className="delete"></button>
						Before joining this game, you must either sign in or register. You will be redirected after authenticating.
					</div>
				</div>
				<div className="column is-half is-offset-one-quarter">
					<UserAuthForm />
				</div>
			</Fragment>
		);
	} else {
		currentView = (
			<div className="column is-half is-offset-one-quarter">
				<UserAuthForm />
			</div>
		);
	}

	return ( 
		<div className="columns columns is-multiline">
			{currentView}
		</div> 
	);
}
 
export default HomeContainer;
