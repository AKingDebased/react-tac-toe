import React from 'react';

function GameState(props) {
  return (
    <div className="game-state">{props.currentTurn}</div>
  );
}

export default GameState;
