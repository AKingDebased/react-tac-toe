// TODO: lint all this
/* eslint-disable */
import React, { Component } from 'react';

class Modal extends Component {
	constructor(props) {
        super(props);
	}

	render () {
		return (
			<div className="modal">
                <div className="modal-background"></div>
                <div className="modal-content">
                    <div className="box">{this.props.children}</div>
                </div>
                <button className="modal-close is-large" aria-label="close"></button>
            </div>
		)
	}
}

export default Modal;