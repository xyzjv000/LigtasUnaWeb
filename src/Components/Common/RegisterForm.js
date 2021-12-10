import React, { useContext, useEffect, useState } from 'react';
import { Button, Paper, TextField, createTheme, ThemeProvider, Backdrop, CircularProgress, makeStyles, Select, MenuItem } from '@material-ui/core';
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

    const [orgfield, setOrgField] = useState({ name: 'None', cpname: '', cpnumber: '' });
    const [loading, isLoading] = useState(false);
    const [admins, setAdmins] = useState([]);

    const [error, setError] = useState({ user_fname: '', user_lname: '', user_address: '', org_name: '' });
    const [reports, udpateReports] = useState(0);
    const handleLoading = () => {
        isLoading(false);
    };
    const handleToggle = () => {
        isLoading(!loading);
    };

    const customStyle = {
        textAlign: 'left',
        width: '100%',
        margin: '10px 0',
    };
    const _customStyle = {
        textAlign: 'left',
        width: '100%',
        margin: '10px 0',
        height: '48px',
    };
    const onChangeHandler = (e) => {
        console.log(e);
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
        if (e.target.id === 'orgcn') {
            setOrgField({ ...orgfield, cpnumber: e.target.value });
        }

        if (e.target.id === 'orgcp') {
            const newValue = e.target.value;
            if (!newValue.match(/[%<>\\$'"*!@#^&()+={}|:;,.?_-]/)) {
                setError({ ...error, org_name: '' });
            } else {
                setError({ ...error, org_name: 'Special Character not allowed!' });
            }
            setOrgField({ ...orgfield, cpname: e.target.value });
        }

        if (e.target.name === 'orgname') {
            setOrgField({ ...orgfield, name: e.target.value });
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
            field.user_conNum === '' ||
            orgfield.name === 'None'
        ) {
            missingInput();
        } else if (isExists === true) {
            usernameTaken();
        } else if (error.user_lname !== '' || error.user_fname !== '' || error.org_name !== '') {
            specialChar();
        } else if (field.password !== field.cpassword) {
            errorPass();
        } else if (field.password.length < 8 || field.cpassword.length < 8) {
            errorPassLength();
        } else if (field.user_conNum.length !== 11 || orgfield.cpnumber.length !== 11) {
            errorNum();
        } else {
            handleToggle();
            await axios.post(`${user.api_url}user?type=_admin`, field).then((res) => {
                if (res.data.length < 1) {
                    errorCreate();
                } else {
                    axios.post(`${user.api_url}organization/new`, {
                        name: orgfield.name,
                        contact_Name: orgfield.cpname,
                        contact_Number: orgfield.cpnumber,
                        users: { user_ID: res.data[0].user_ID },
                    });
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
                    setOrgField({
                        name: 'None',
                        cpname: '',
                        cpnumber: '',
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

                            <Select
                                label="Organization Name"
                                id="orgName"
                                name={'orgname'}
                                value={orgfield.name}
                                style={_customStyle}
                                onChange={onChangeHandler}
                            >
                                <MenuItem value={'None'}>None</MenuItem>
                                <MenuItem value={'Department of Health'}>Department of Health</MenuItem>
                                <MenuItem value={'Red Cross'}>Red Cross</MenuItem>
                            </Select>

                            <TextField
                                id="orgcp"
                                type="text"
                                error={error.org_name === '' ? false : true}
                                helperText={error.org_name}
                                style={customStyle}
                                value={orgfield.cpname}
                                onChange={onChangeHandler}
                                label="Organization Contact Person"
                            />

                            <TextField
                                id="orgcn"
                                type="text"
                                style={customStyle}
                                value={orgfield.cpnumber}
                                onChange={onChangeHandler}
                                label="Organization Contact Person Number"
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
