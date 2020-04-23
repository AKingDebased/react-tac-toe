// TODO: lint all this
/* eslint-disable */
import React, { Fragment, Component } from 'react';
import firebase from './firebase-config';
const firestore = firebase.firestore();

class UserAuthForm extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            verifyPassword: '',
            isRegistering: false,
        };
    }

    handleFormChange(event) {
        const { target } = event;
    
        this.setState({
            [target.name]: target.value,
        });
    }
    
    handleLogIn() {
        const { email, password } = this.state;
    
        // firebase.auth().createUserWithEmailAndPassword(email, password)
        //     .then((data) => firestore.collection('users').doc(data.user.uid).set({ isActive: true }))
        //     .catch((error) => console.log('error creating user', error));
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((data) => {
                alert('user logged in successfully!');
            })
            .catch(function(error) {
                alert('error logging in! see console');
                console.log('error logging in', error);
            });
    }
    
    handleRegistration() {
        // TODO: Implement error handling & validation
        const { email, password, verifyPassword } = this.state;

        if (!email.includes('@')) {
            alert('invalid email!');
            return;
        }

        if (password.trim() !== verifyPassword.trim()) {
            alert ('passwords must match!');
            return;
        }

        // TODO: Should automatically register when 'enter' is hit while in any form field

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((data) => {
                alert('user created successfully!');
                console.log('created user', data.user);
                firestore.collection('users').doc(data.user.uid).set({
                    email: data.user.email,
                    isActive: true ,
                })
            })
            .catch((error) => {
                alert('error creating user! see console');
                console.log('error creating user', error)
            });
    }

    render() {
        const { isRegistering } = this.state;
        let currentView;

        if (!isRegistering) {
            currentView = (
                <Fragment>
                    <h2 className="user-auth__title">React Tac Toe</h2>
                    <div className="user-auth__log-in">
                        <input autoFocus name="email" className="email" value={this.state.email} onChange={this.handleFormChange.bind(this)}/>
                        <input name="password" className="password" type="password" value={this.state.password} onChange={this.handleFormChange.bind(this)}/>
                        <button 
                            onClick={this.handleLogIn.bind(this)} 
                            className="log-inv">
                                log in!
                        </button>
                    </div>
                    <div className="user-auth__register">
                        <div className="separator">New to React Tac Toe?</div>
                        <button
                            onClick={ () => this.setState({ isRegistering: true }) }>
                                Create Your React Tac Toe Account!
                        </button>
                    </div>
                </Fragment>
            );
        } else {
            currentView = (
                <Fragment>
                    <h2 className="user-auth__title">React Tac Toe</h2>
                    <div className="user-auth__register">
                        <div>email</div>
                        <input autoFocus name="email" className="email" value={this.state.email} onChange={this.handleFormChange.bind(this)}/>
                        
                        <div>password</div>
                        <input name="password" className="password" type="password" value={this.state.password} onChange={this.handleFormChange.bind(this)}/>
                        
                        <div>verify password</div>
                        <input name="verifyPassword" className="password" type="password" value={this.state.verifyPassword} onChange={this.handleFormChange.bind(this)}/>
                        
                        <button 
                            onClick={this.handleRegistration.bind(this)} 
                            className="log-inv">
                                sign up!
                        </button>
                    </div>
                </Fragment>
            )
        }

        return (
            <div className="user-auth">
                {currentView}
            </div>
        );
    }
}

export default UserAuthForm;