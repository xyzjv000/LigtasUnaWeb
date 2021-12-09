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

const LoginForm = (props) => {
    useEffect(() => {
        getuser();
        getReportList();
    }, []);
    const getuser = () => {
        setUser({ ...user });
    };
    const history = useHistory();
    const [user, setUser] = useContext(Context);
    const [field, setField] = useState({ username: '', password: '' });
    const [reports, udpateReports] = useState(0);
    const customStyle = {
        textAlign: 'center',
        width: '100%',
        margin: '10px 0',
    };
    const onChangeHandler = (e) => {
        if (e.target.id === 'username') {
            setField({ ...field, username: e.target.value });
        } else {
            setField({ ...field, password: e.target.value });
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

    const loginCLick = async () => {
        if (field.username === '' || field.password === '') {
            missingInput();
        } else {
            await axios.post(`${user.api_url}user/login?type=admin`, field).then((res) => {
                if (res.data.length < 1) {
                    axios.post(`${user.api_url}user/login?type=_admin`, field).then((_res) => {
                        if (_res.data.length < 1) {
                            errorLogin();
                        } else {
                            if (_res.data[0].status === 'active') {
                                setUser((prev) => ({
                                    user_ID: _res.data[0].user_ID,
                                    user_Type: _res.data[0].user_Type,
                                    user_Fname: _res.data[0].user_Fname,
                                    user_Lname: _res.data[0].user_Lname,
                                    user_Address: _res.data[0].user_Address,
                                    user_ConNum: _res.data[0].user_ConNum,
                                    username: _res.data[0].username,
                                    location_Long: _res.data[0].location_Long,
                                    location_Lat: _res.data[0].location_Lat,
                                    reports: reports,
                                    api_url: prev.api_url,
                                }));

                                //get order count here
                                welcome();
                                props.setActive();
                                history.push('/procedures');
                            } else {
                                errorLogin();
                            }
                        }
                    });
                } else {
                    if (res.data[0].status === 'active') {
                        setUser((prev) => ({
                            user_ID: res.data[0].user_ID,
                            user_Type: res.data[0].user_Type,
                            user_Fname: res.data[0].user_Fname,
                            user_Lname: res.data[0].user_Lname,
                            user_Address: res.data[0].user_Address,
                            user_ConNum: res.data[0].user_ConNum,
                            username: res.data[0].username,
                            location_Long: res.data[0].location_Long,
                            location_Lat: res.data[0].location_Lat,
                            reports: reports,
                            api_url: prev.api_url,
                        }));

                        //get order count here
                        welcome();
                        props.setActive();
                        history.push('/procedures');
                    } else {
                        errorLogin();
                    }
                }
            });
        }
    };

    const welcome = () => {
        console.log(user);
        toast.success('Welcome back Admin!', {
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
        toast.warn('Incorrect Credentials!', {
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
            <div style={{ height: '440px', width: '100%' }}>
                <Paper elevation={3} style={{ height: '100%', width: '900px', padding: '50px 20px', margin: 'auto', display: 'flex' }}>
                    <div className="content">
                        <img src="../icon.png" alt="icon" style={{ width: '12rem' }} />
                        <h1 style={{ fontSize: '2rem', fontFamily: 'Montserrat', fontWeight: '500' }}>LigtasUna</h1>
                    </div>
                    <div className="content">
                        <h2 style={{ fontFamily: 'Montserrat' }}>Admin Login</h2>
                        <div style={{ marginTop: '30px' }}>
                            <TextField id="username" type="text" style={customStyle} value={field.username} onChange={onChangeHandler} label="Username" />
                            <TextField id="password" type="password" style={customStyle} value={field.password} onChange={onChangeHandler} label="Password" />
                        </div>
                        <div style={{ marginTop: '30px', width: '100%', textAlign: 'center' }}>
                            <Button
                                onClick={loginCLick}
                                style={{
                                    backgroundColor: '#794cfe',
                                    color: 'white',
                                    width: '100%',
                                    height: '3rem',
                                    fontFamily: 'Montserrat',
                                    marginBottom: 10,
                                }}
                            >
                                Login
                            </Button>
                            <Button onClick={props.switchToForget} style={{ fontFamily: 'Montserrat', textDecoration: 'none', width: '100%' }}>
                                Forgot Password
                            </Button>
                        </div>
                    </div>
                </Paper>
            </div>
            <ToastContainer />
        </ThemeProvider>
    );
};

export default LoginForm;
