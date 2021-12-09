import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import LoginForm from './Common/LoginForm';
import RegisterForm from './Common/RegisterForm';
import { geolocated } from 'react-geolocated';
import Forget from './Common/Forget';
function Login(props) {
    const [selected, setSelected] = useState('LOGIN');

    const switchpage = (e) => {
        setSelected(e.target.innerText);
    };

    const switchPage = () => {
        if (selected === 'LOGIN') {
            setSelected('FORGET');
        } else {
            setSelected('LOGIN');
        }
    };

    const getPage = () => {
        if (selected === 'LOGIN') {
            return <LoginForm setActive={props.loginSuccess} switchToForget={switchPage} />;
        } else {
            return <Forget switchToLogin={switchPage} />;
        }
    };
    return (
        <div>
            {/* <header>
                <nav>
                    <div style={{ display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                        <img src="../icon.png" alt="icon" style={{ width: '2.5rem', marginRight: 5 }} />
                        <h1 style={{ fontSize: '1.4rem', fontFamily: 'Montserrat' }}>LigtasUna</h1>
                    </div>
                    <div></div>
                </nav>
            </header> */}
            <div
                style={{
                    minHeight: '100vh',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                className="container-fluid"
            >
                <img
                    src="../health2.png"
                    alt="icon"
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: -1,
                        objectFit: 'contain',
                        opacity: 0.8,
                    }}
                />
                {getPage()}
                {/* <Footer /> */}
            </div>
        </div>
    );
}
// #794cfe
export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(Login);
