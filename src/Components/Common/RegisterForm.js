import React, { useContext, useEffect, useState } from 'react';
import { Button, Paper, TextField, createTheme, ThemeProvider, Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from '../../Store';

import axios from 'axios';
const theme = createTheme({
    typography: {
        fontFamily: 'Poppins',
    },
});

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));
function RegisterForm(props) {
    const classes = useStyles();
    useEffect(() => {
        getuser();
        getAllAdmin();
        getLocation();
        getReportList();
    }, []);
    const getuser = () => {
        setUser({ ...user });
    };
    const [user, setUser] = useContext(Context);
    const [field, setField] = useState({
        user_fname: '',
        user_lname: '',
        user_address: '',
        user_conNum: '',
        username: '',
        secret: '',
        password: '',
        cpassword: '',
        location_long: '',
        location_lat: '',
    });
    const [loading, isLoading] = useState(false);
    const [admins, setAdmins] = useState([]);

    const [error, setError] = useState({ user_fname: '', user_lname: '', user_address: '' });
    const [reports, udpateReports] = useState(0);
    const handleLoading = () => {
        isLoading(false);
    };
    const handleToggle = () => {
        isLoading(!loading);
    };

    const customStyle = {
        textAlign: 'center',
        width: '100%',
        margin: '10px 0',
    };
    const onChangeHandler = (e) => {
        if (e.target.id === 'fname') {
            const newValue = e.target.value;
            if (!newValue.match(/[%<>\\$'"*!@#^&()+={}|:;,.?_-]/)) {
                setError({ ...error, user_fname: '' });
            } else {
                setError({ ...error, user_fname: 'Special Character not allowed!' });
            }
            setField({ ...field, user_fname: newValue });
        }
        if (e.target.id === 'lname') {
            const newValue = e.target.value;
            if (!newValue.match(/[%<>\\$'"*!@#^&()+={}|:;,.?_-]/)) {
                setError({ ...error, user_lname: '' });
            } else {
                setError({ ...error, user_lname: 'Special Character not allowed!' });
            }
            setField({ ...field, user_lname: newValue });
        }
        if (e.target.id === 'cnum') {
            setField({ ...field, user_conNum: e.target.value });
        }
        if (e.target.id === 'address') {
            setField({ ...field, user_address: e.target.value });
        }
        if (e.target.id === 'username') {
            setField({ ...field, username: e.target.value });
        }
        if (e.target.id === 'password') {
            setField({ ...field, password: e.target.value });
        }
        if (e.target.id === 'cpassword') {
            setField({ ...field, cpassword: e.target.value });
        }
    };
    const getLocation = () => {
        if (props.long && props.lat) {
            setField({ ...field, location_long: String(props.long), location_lat: String(props.lat) });
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
    const getAllAdmin = async () => {
        await axios.get(`${user.api_url}user?type=admin`).then((res) => {
            if (res.data.length) {
                setAdmins(res.data);
            }
        });
    };

    const createClick = async () => {
        getLocation();
        let isExists = false;
        admins.forEach((admin) => {
            if (admin.username === field.username) {
                isExists = true;
            }
        });

        if (
            field.username === '' ||
            field.password === '' ||
            field.user_fname === '' ||
            field.user_lname === '' ||
            field.user_address === '' ||
            field.user_conNum === ''
        ) {
            missingInput();
        } else if (isExists === true) {
            usernameTaken();
        } else if (error.user_lname !== '' || error.user_fname !== '') {
            specialChar();
        } else if (field.password !== field.cpassword) {
            errorPass();
        } else if (field.password.length < 8 || field.cpassword.length < 8) {
            errorPassLength();
        } else if (field.user_conNum.length !== 11) {
            errorNum();
        } else {
            handleToggle();
            await axios.post(`${user.api_url}user?type=_admin`, field).then((res) => {
                if (res.data.length < 1) {
                    errorCreate();
                } else {
                    // setUser((prev) => ({
                    //     user_ID: res.data[0].user_ID,
                    //     user_Type: res.data[0].user_Type,
                    //     user_Fname: res.data[0].user_Fname,
                    //     user_Lname: res.data[0].user_Lname,
                    //     user_Address: res.data[0].user_Address,
                    //     user_ConNum: res.data[0].user_ConNum,
                    //     username: res.data[0].username,
                    //     location_Long: res.data[0].location_Long,
                    //     location_Lat: res.data[0].location_Lat,
                    //     reports: reports,
                    //     api_url: prev.api_url,
                    // }));
                    // //get order count here
                    // props.setActive();
                    // handleLoading();
                    // welcome();
                    success();
                    handleLoading();
                    setField({
                        user_fname: '',
                        user_lname: '',
                        user_address: '',
                        user_conNum: '',
                        username: '',
                        secret: '',
                        password: '',
                        cpassword: '',
                        location_long: '',
                        location_lat: '',
                    });
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

    const success = () => {
        console.log(user);
        toast.success('Admin account created!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const errorPass = () =>
        toast.warn('Password ddnt match!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    const specialChar = () =>
        toast.warn('Special character not allowed!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    const errorNum = () =>
        toast.warn('Contact Number must be 11 digits!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    const errorPassLength = () =>
        toast.warn('Password must be 8 characters and more!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    const errorCreate = () =>
        toast.warn('Something went wrong', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    const usernameTaken = () =>
        toast.warn('Username already taken!', {
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
            <div style={{ minHeight: '600px', width: '900px', padding: '40px 0', margin: 'auto' }}>
                <Paper elevation={3} style={{ height: '100%', width: '45%', padding: '40px 20px', margin: 'auto' }}>
                    <div className="content">
                        <h3 style={{ fontFamily: 'Montserrat' }}>Create an Admin Account</h3>
                        <div style={{ marginTop: '30px' }}>
                            <TextField
                                id="fname"
                                type="text"
                                error={error.user_fname === '' ? false : true}
                                helperText={error.user_fname}
                                style={customStyle}
                                value={field.user_fname}
                                onChange={onChangeHandler}
                                label="Firstname"
                            />
                            <TextField
                                id="lname"
                                type="text"
                                error={error.user_lname === '' ? false : true}
                                helperText={error.user_lname}
                                style={customStyle}
                                value={field.user_lname}
                                onChange={onChangeHandler}
                                label="Lastname"
                            />
                            <TextField id="cnum" type="text" style={customStyle} value={field.user_conNum} onChange={onChangeHandler} label="Contact Number" />
                            <TextField
                                multiline
                                maxRows={3}
                                id="address"
                                type="text"
                                style={customStyle}
                                value={field.user_address}
                                onChange={onChangeHandler}
                                label="Address"
                            />
                            <TextField id="username" type="text" style={customStyle} value={field.username} onChange={onChangeHandler} label="Username" />
                            {/* <TextField id="secret" type="text" style={customStyle} value={field.secret} onChange={onChangeHandler} label="Secret Word" /> */}
                            <TextField id="password" type="password" style={customStyle} value={field.password} onChange={onChangeHandler} label="Password" />
                            <TextField
                                id="cpassword"
                                type="password"
                                style={customStyle}
                                value={field.cpassword}
                                onChange={onChangeHandler}
                                label="Confirm Password"
                            />
                        </div>
                        <div style={{ marginTop: '30px', width: '100%' }}>
                            <Button
                                onClick={createClick}
                                style={{ backgroundColor: '#794cfe', color: 'white', width: '100%', height: '3rem', fontFamily: 'Montserrat' }}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </Paper>
            </div>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <ToastContainer />
        </ThemeProvider>
    );
}

export default RegisterForm;
