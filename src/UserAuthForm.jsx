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
                    <div className="box has-text-centered">
                        <h2 className="user-auth__title">React Tac Toe</h2>
                        <div className="control user-auth__log-in">
                            <div className="field">
                                <input autoFocus name="email" placeholder="email" className="input email" value={this.state.email} onChange={this.handleFormChange.bind(this)}/>
                            </div>

                            <div className="field">
                                <input name="password" placeholder="password" className="input password" type="password" value={this.state.password} onChange={this.handleFormChange.bind(this)}/>
                            </div>

                            <button 
                                onClick={this.handleLogIn.bind(this)} 
                                className="button log-inv">
                                    log in!
                            </button>
                        </div>

                        <div className="user-auth__register">
                            <div className="separator">New to React Tac Toe?</div>
                            <button
                                className="button"
                                onClick={ () => this.setState({ isRegistering: true }) }>
                                    Create Your React Tac Toe Account!
                            </button>
                        </div>
                    </div>
                </Fragment>
            );
        } else {
            currentView = (
                <Fragment>
                    <div className="box has-text-centered">
                        <h2 className="user-auth__title">React Tac Toe</h2>
                        <div className="control user-auth__register">
                            <div className="field">
                            <label className="label">email</label>
                                <input autoFocus placeholder="email" name="email" className="input email" value={this.state.email} onChange={this.handleFormChange.bind(this)}/>
                            </div>

                            <div className="field">
                                <label className="label">password</label>
                                <input name="password" className="input password" placeholder="password" type="password" value={this.state.password} onChange={this.handleFormChange.bind(this)}/>

                                <label className="label">verify password</label>
                                <input name="verifyPassword" className="input password" placeholder="verify password" type="password" value={this.state.verifyPassword} onChange={this.handleFormChange.bind(this)}/>
                            </div>

                            <button 
                                onClick={this.handleRegistration.bind(this)} 
                                className="button log-inv">
                                    sign up!
                            </button>
                        </div>
                    </div>
                </Fragment>
            )
        }

        return <Fragment>{currentView}</Fragment>;
    }
}

export default UserAuthForm;