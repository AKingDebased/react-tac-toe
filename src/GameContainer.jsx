// TODO: lint all this
/* eslint-disable */
import React, { Fragment } from 'react';
import Board from './Board';
import GameState from './GameState';

function GameContainer (props) {
    const { 
        activeGameRef,
        currentTurn,
        activeGamePlayerDisplayNames,
        handleSquareClick,
        squareIds,
        toggleCurrentTurn,
        selectedSquares
    } = props;

    if (activeGameRef) {
        return (
            <Fragment>
                <GameState 
                    currentTurn={currentTurn} 
                    activeGamePlayerDisplayNames={activeGamePlayerDisplayNames}
                />
                <Board 
                    handleSquareClick={handleSquareClick} 
                    squareIds={squareIds} currentTurn={currentTurn} 
                    toggleCurrentTurn={toggleCurrentTurn}
                    selectedSquares={selectedSquares}
                />
            </Fragment>
        )
    }

    return <div>oops</div>
}
 
export default GameContainer;
