import React from 'react';
import { makeStyles, Button, Paper, TextField, ThemeProvider, createTheme, Select, MenuItem } from '@material-ui/core';
import { useState, useContext } from 'react';
import { Context } from '../../Store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const useStyles = makeStyles({
    root: {
        maxWidth: 1000,
    },
    media: {
        height: 140,
    },
});

const theme = createTheme({
    typography: {
        fontFamily: 'Montserrat',
    },
});

const Profile = (props) => {
    const classes = useStyles();
    const option = {
        day: 'numeric', // numeric, 2-digit
        year: 'numeric', // numeric, 2-digit
        month: 'long', // numeric, 2-digit, long, short, narrow
    };
    const [orgfield, setOrgField] = useState({ name: 'None', cpname: '', cpnumber: '' });
    const [error, setError] = useState({ user_fname: '', user_lname: '', user_address: '', org_name: '' });
    const [canUpdate, setCanUpdate] = useState(false);
    const [user, setUser] = useContext(Context);
    const [updateBody, setUpdateBody] = useState({
        user_ID: user.user_ID,
        user_Fname: user.user_Fname,
        user_Lname: user.user_Lname,
        user_Address: user.user_Address,
        user_ConNum: user.user_ConNum,
        username: user.username,
        org_name: user.org_name,
        org_contact_person: user.org_contact_person,
        org_contact_number: user.org_contact_number,
        password: '',
        cpassword: '',
    });
    const handleUpdate = () => {
        setCanUpdate(true);
    };

    const saveUpdate = async () => {
        let isValid = false;
        if (
            updateBody.user_Fname === '' ||
            updateBody.user_Lname === '' ||
            updateBody.username === '' ||
            updateBody.user_Address === '' ||
            updateBody.user_ConNum === ''
        ) {
            missingInput();
        } else if (updateBody.user_ConNum.length !== 11 || updateBody.org_contact_number.length !== 11) {
            errorNum();
        } else {
            if (updateBody.password === '' && updateBody.cpassword === '') {
                //Api call here
                // setUpdateBody({ ...updateBody, password: null });
                // setUpdateBody({ ...updateBody, cpassword: null });
                setUpdateBody(delete updateBody.password);
                setUpdateBody(delete updateBody.cpassword);
                isValid = true;
            } else {
                if (updateBody.password.length < 8 || updateBody.cpassword.length < 8) {
                    passErr();
                    isValid = false;
                } else {
                    if (updateBody.cpassword === updateBody.password) {
                        // API call here
                        isValid = true;
                    } else {
                        passwordNotMatch();
                        isValid = false;
                    }
                }
            }
        }

        if (isValid === true) {
            try {
                await axios.put(`${user.api_url}user/update`, updateBody).then((res) => {
                    if (res.data.length > 0) {
                        setUser((prev) => ({
                            user_ID: res.data[0].user_ID,
                            user_Type: res.data[0].user_Type,
                            user_Fname: res.data[0].user_Fname,
                            user_Lname: res.data[0].user_Lname,
                            user_Address: res.data[0].user_Address,
                            user_ConNum: res.data[0].user_ConNum,
                            username: res.data[0].username,
                            location_Long: prev.location_Long,
                            location_Lat: prev.location_Lat,
                            reports: prev.reports,
                            org_id: prev.org_id,
                            org_name: prev.org_name,
                            org_contact_person: prev.org_contact_person,
                            org_contact_number: prev.org_contact_number,
                            api_url: prev.api_url,
                        }));
                    }
                });

                await axios
                    .post(`${user.api_url}organization/update?userId=${updateBody.user_ID}`, {
                        name: updateBody.org_name,
                        contact_Name: updateBody.org_contact_person,
                        contact_Number: updateBody.org_contact_number,
                    })
                    .then((org) => {
                        console.log(org);
                        setUser({
                            ...user,
                            org_name: org.data[0].name,
                            org_contact_number: org.data[0].contact_Number,
                            org_contact_person: org.data[0].contact_Name,
                        });
                    });
            } catch (error) {
                alert('Connection Error');
            }

            successUpdate();
            setCanUpdate(false);
            // props.userSet(updateBody);
            props.modalCLose();
        }
    };

    const onValueChanges = (e) => {
        let valId = e.target.id;
        let value = e.target.value;
        console.log(valId, value);
        if (valId === 'fname') {
            setUpdateBody({ ...updateBody, user_Fname: value });
        }
        if (valId === 'lname') {
            setUpdateBody({ ...updateBody, user_Lname: value });
        }
        if (valId === 'address') {
            setUpdateBody({ ...updateBody, user_Address: value });
        }
        if (valId === 'cnum') {
            setUpdateBody({ ...updateBody, user_ConNum: value });
        }
        if (valId === 'username') {
            setUpdateBody({ ...updateBody, username: value });
        }
        if (valId === 'password') {
            setUpdateBody({ ...updateBody, password: value });
        }
        if (valId === 'cpassword') {
            setUpdateBody({ ...updateBody, cpassword: value });
        }

        if (valId === 'orgcn') {
            setUpdateBody({ ...updateBody, org_contact_number: value });
            // setOrgField({ ...orgfield, cpnumber: e.target.value });
        }

        if (valId === 'orgcp') {
            const newValue = e.target.value;
            if (!newValue.match(/[%<>\\$'"*!@#^&()+={}|:;,.?_-]/)) {
                setError({ ...error, org_name: '' });
            } else {
                setError({ ...error, org_name: 'Special Character not allowed!' });
            }
            setUpdateBody({ ...updateBody, org_contact_person: value });
        }

        if (e.target.name === 'orgname') {
            setUpdateBody({ ...updateBody, org_name: value });
        }
    };

    const passwordNotMatch = () =>
        toast.error('Password and Confirm Password not match!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    const missingInput = () =>
        toast.error('Please fillup all fields!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    const passErr = () =>
        toast.error('Password must be 8 characters and above!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    const successUpdate = () =>
        toast.info('Profile Updated Successfully!', {
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
    return (
        <ThemeProvider theme={theme}>
            <Paper style={{ margin: '20px' }} className={classes.root}>
                <div
                    style={{
                        minHeight: '25rem',
                        width: '60rem',
                        padding: '30px 50px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        textAlign: 'center',
                    }}
                >
                    <h1>Admin Profile</h1>
                    <div style={{ display: 'flex' }}>
                        <div style={{ borderRight: '2px solid rgba(0,0,0,0.3)' }}>
                            <img src="../user.png" alt="Admin" style={{ width: '20rem' }} />
                            <h3 style={{ marginTop: '-20px' }}>Admin ID Number : {user.user_ID}</h3>
                        </div>
                        <div style={{ flex: 1, padding: '0 55px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div className="firstRow">
                                <TextField
                                    onChange={onValueChanges}
                                    id="fname"
                                    value={updateBody.user_Fname}
                                    type="text"
                                    label="First Name"
                                    disabled={!canUpdate}
                                />
                                <TextField
                                    onChange={onValueChanges}
                                    id="lname"
                                    value={updateBody.user_Lname}
                                    type="text"
                                    label="Last Name"
                                    disabled={!canUpdate}
                                />
                            </div>

                            <div className="secondRow">
                                <TextField
                                    onChange={onValueChanges}
                                    id="address"
                                    value={updateBody.user_Address}
                                    style={{ width: '100%' }}
                                    className="text-input"
                                    label="Address"
                                    multiline
                                    minRows={3}
                                    disabled={!canUpdate}
                                />
                            </div>
                            <div className="thirdRow">
                                <TextField
                                    onChange={onValueChanges}
                                    id="username"
                                    value={updateBody.username}
                                    type="text"
                                    label="Username"
                                    disabled={!canUpdate}
                                />
                                <TextField
                                    onChange={onValueChanges}
                                    id="cnum"
                                    value={updateBody.user_ConNum}
                                    type="text"
                                    label="Contact Number"
                                    disabled={!canUpdate}
                                />
                            </div>
                            <div className="thirdRow" style={{ flexDirection: 'column' }}>
                                <Select
                                    label="Organization Name"
                                    id="orgName"
                                    name={'orgname'}
                                    value={updateBody.org_name}
                                    onChange={onValueChanges}
                                    style={{ width: '100%', height: '48px', textAlign: 'left', marginBottom: 5 }}
                                    disabled={!canUpdate}
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
                                    value={updateBody.org_contact_person}
                                    onChange={onValueChanges}
                                    style={{ width: '100%' }}
                                    label="Organization Contact Person"
                                    disabled={!canUpdate}
                                />

                                <TextField
                                    id="orgcn"
                                    type="text"
                                    value={updateBody.org_contact_number}
                                    onChange={onValueChanges}
                                    style={{ width: '100%' }}
                                    label="Organization Contact Person Number"
                                    disabled={!canUpdate}
                                />
                            </div>

                            <div className="fourthRow">
                                <TextField
                                    onChange={onValueChanges}
                                    id="password"
                                    type="password"
                                    value={updateBody.password}
                                    label="Password"
                                    disabled={!canUpdate}
                                />
                                <TextField
                                    onChange={onValueChanges}
                                    id="cpassword"
                                    type="password"
                                    value={updateBody.cpassword}
                                    label="Confirm Password"
                                    disabled={!canUpdate}
                                />
                            </div>
                            <div style={{ display: 'flex', marginTop: '15px', justifyContent: 'end' }}>
                                {/* <Button style={{ width: 200, color: 'white', backgroundColor: '#794cfe' }}>Change Password</Button> */}
                                <Button
                                    onClick={handleUpdate}
                                    style={{ width: 150, color: 'white', backgroundColor: '#794cfe', display: canUpdate ? 'none' : 'block' }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={saveUpdate}
                                    style={{ width: 150, color: 'white', backgroundColor: '#794cfe', display: canUpdate ? 'block' : 'none' }}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
            <ToastContainer />
        </ThemeProvider>
    );
};

export default Profile;
