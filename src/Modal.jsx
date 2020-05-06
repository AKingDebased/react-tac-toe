// TODO: lint all this
/* eslint-disable */
import React, { Component } from 'react';

class Modal extends Component {
	constructor(props) {
        super(props);
        this.state = {
            isActive: props.isActive
        }
    }
    
    componentWillReceiveProps({isActive}) {
        // State from the parent is being passed in 
        // We want this child component to rerender when the parent state changes
        // So, we use componentWillReceiveProps
        // https://medium.com/@admin_86118/react-re-render-child-components-on-parent-state-change-387720c3cff8
        this.setState({
            isActive
        })
    }

	render () {
		return (
			<div className={`modal ${this.state.isActive ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <div className="box">{this.props.children}</div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={ () => { this.setState({ isActive: false})} }></button>
            </div>
		)
	}
}

export default Modal;