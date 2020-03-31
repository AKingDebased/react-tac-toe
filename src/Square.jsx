// TODO: lint all this
/* eslint-disable */
import React from 'react';
import Symbol from './Symbol';

// TODO: Figure out this line break bullshit

class Square extends React.Component {
	constructor(props) {
		super(props);
	}

	handleClick (squareId) {
		this.props.handleSquareClick(squareId);
	}

	renderSymbol () {
		const currentSquare = this.props.selectedSquares[this.props.squareId];

		return currentSquare ? currentSquare.symbol : null;
	}

	render () {
		return (
			<div onClick={this.handleClick.bind(this, this.props.squareId)} className="square">
				<Symbol symbol={this.renderSymbol()} />	
			</div>
		)
	}
}

export default Square;
