import React, { useContext, useEffect, useState } from 'react';
import { Button, Paper, TextField, createTheme, ThemeProvider } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from '../../Store';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const theme = createTheme({
    typography: {
        fontFamily: 'Montserrat',
    },
});
function Forget(props) {
    useEffect(() => {
        getuser();
        getReportList();
    }, []);
    const getuser = () => {
        setUser({ ...user });
    };
    const [user, setUser] = useContext(Context);
    const [field, setField] = useState({ username: '', secret: '', npassword: '', cpassword: '' });
    const [reports, udpateReports] = useState(0);
    const customStyle = {
        textAlign: 'center',
        width: '100%',
        margin: '10px 0',
    };
    const onChangeHandler = (e) => {
        if (e.target.id === 'username') {
            setField({ ...field, username: e.target.value });
        }

        if (e.target.id === 'secret') {
            setField({ ...field, secret: e.target.value });
        }

        if (e.target.id === 'npassword') {
            setField({ ...field, npassword: e.target.value });
        }

        if (e.target.id === 'cpassword') {
            setField({ ...field, cpassword: e.target.value });
        }
    };

    const getReportList = async () => {
        await axios.get(`${user.api_url}report/active`).then((rep) => {
            if (rep.data.length > 0) {
                udpateReports(rep.data.length);
            }
        });
        console.log(reports);
    };

    const forgetSubmit = async () => {
        if (field.username === '' || field.npassword === '' || field.cpassword === '') {
            missingInput();
        } else if (field.npassword !== field.cpassword) {
            notMatch();
        } else if (field.npassword.length < 8 || field.cpassword.length < 8) {
            characterErr();
        } else {
            await axios
                .post(`${user.api_url}user/forget_password?username=${field.username}&password=${field.npassword}&secret=${field.secret}`)
                .then((res) => {
                    console.log(res.data);
                    if (res.data.length < 1 || res.data[0].password !== field.npassword) {
                        errorLogin();
                    } else {
                        welcome();
                        setTimeout(() => {
                            props.switchToLogin();
                        }, 1500);
                        // history.push('/procedures');
                    }
                });
        }
    };

    const welcome = () => {
        console.log(user);
        toast.success('Password changed successfully!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const errorLogin = () =>
        toast.warn('Incorrect Username or Secret word!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    const characterErr = () =>
        toast.warn('Password must be 6 characters or above', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    const notMatch = () =>
        toast.warn(`Password didn't match!`, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    const missingInput = () =>
        toast.error('Please fill all fields!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    return (
        <ThemeProvider theme={theme}>
            <div style={{ height: '550px', width: '900px' }}>
                <Paper elevation={3} style={{ height: '100%', width: '45%', padding: '40px 20px', margin: 'auto' }}>
                    <div className="content">
                        <h2 style={{ fontFamily: 'Montserrat' }}>Forgot Password</h2>
                        <div style={{ marginTop: '30px' }}>
                            <TextField id="username" type="text" style={customStyle} value={field.username} onChange={onChangeHandler} label="Username" />
                            {/* <TextField id="secret" type="secret" style={customStyle} value={field.secret} onChange={onChangeHandler} label="Secret word" /> */}
                            <TextField
                                id="npassword"
                                type="password"
                                style={customStyle}
                                value={field.password}
                                onChange={onChangeHandler}
                                label="New Password"
                            />
                            <TextField
                                id="cpassword"
                                type="password"
                                style={customStyle}
                                value={field.password}
                                onChange={onChangeHandler}
                                label="Confirm Password"
                            />
                        </div>
                        <div style={{ marginTop: '30px', width: '100%', textAlign: 'center' }}>
                            <Button
                                onClick={forgetSubmit}
                                style={{
                                    backgroundColor: '#794cfe',
                                    color: 'white',
                                    width: '100%',
                                    height: '3rem',
                                    fontFamily: 'Montserrat',
                                    marginBottom: 10,
                                }}
                            >
                                Submit
                            </Button>
                            <Button onClick={props.switchToLogin} style={{ fontFamily: 'Montserrat', textDecoration: 'none', width: '100%' }}>
                                Back to login
                            </Button>
                        </div>
                    </div>
                </Paper>
            </div>
            <ToastContainer />
        </ThemeProvider>
    );
}

export default Forget;
