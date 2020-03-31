// TODO: lint all this
/* eslint-disable */
import React from 'react';
import Square from './Square';

class Board extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			<div className="board">{this.props.squareIds.map((squareId) => {
				return <Square 
					key={squareId} 
					squareId={squareId} 
					handleSquareClick={this.props.handleSquareClick}
					selectedSquares={this.props.selectedSquares}
				/>
			})}</div>
		);
	}
}

export default Board;