import React, { useContext, useEffect, useState } from 'react';
import {
    makeStyles,
    withStyles,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Table,
    TableBody,
    Button,
    Fab,
    CircularProgress,
    Backdrop,
    Switch,
} from '@material-ui/core';
import axios from 'axios';
import { Context } from '../Store';
import RefreshIcon from '@material-ui/icons/Refresh';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import emailjs from 'emailjs-com';
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#363537',
        color: theme.palette.common.white,
    },
    body: {
        fontFamily: 'Montserrat',
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 700,
        maxHeight: 1000,
    },
    typography: {
        fontFamily: 'Montserrat',
        padding: theme.spacing(2),
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    margin: {
        margin: theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));
function Admin() {
    useEffect(() => {
        getSubscribers();
    }, []);
    const [user] = useContext(Context);
    const classes = useStyles();
    const [subs, setSubs] = useState([]);
    const [_page, setPage] = useState('active');
    const [status, setStatus] = useState('active');
    const getSubscribers = async () => {
        handleToggle();
        try {
            await axios.get(`${user.api_url}user?type=_admin`).then((res) => {
                if (res.data.length > 0) {
                    setSubs(res.data);
                    console.log(subs);
                    handleClose();
                }
            });
        } catch {
            handleClose();
            alert('Connection Error');
        }
    };
    const [tableHead, setTableHead] = useState(['First Name', 'Last Name', 'Username / Email', 'Number', 'Registered Date', 'Status']);
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    const changePage = (val) => {
        // val === 'active' ? setStatus('active') : val === 'pending' ? setStatus('inactive') : setStatus('reject');

        if (val === 'active') {
            setStatus('active');
            setTableHead(['First Name', 'Last Name', 'Username / Email', 'Number', 'Registered Date', 'Status']);
        }
        setPage(val);
    };

    const takeAction = async (val, id, name, email) => {
        await axios.post(`${user.api_url}user/approve_user?id=${id}&status=${val}`).then((res) => {
            if (res.data) {
                console.log(res.data);
                getSubscribers();
                if (val === 'active') {
                    sendEmailNotification(name, email, 1);
                }
                if (val === 'inactive') {
                    sendEmailNotification(name, email, 0);
                }
            }
        });
    };

    const sendEmailNotification = (name, username, respond) => {
        let templateParams = {
            to_name: name,
            message:
                respond === 1
                    ? `Hi ${name}, 
            Our team would like to let you know that your LigtasUna account has been activated. You can now login you account in our app. 
            Thank you`
                    : `Hi ${name}, 
            Our team would like to let you know that your LigtasUna account has been deactivated.`,
            send_to: username,
            status: respond === 1 ? 'Activated' : 'Deactivated',
        };
        emailjs.send('service_qu96fx6', 'template_z0tfl4l', templateParams, 'user_rPC97bVeRs911SdPmJfZq').then(
            function (response) {
                console.log('SUCCESS!', response.status, response.text);
            },
            function (error) {
                console.log('FAILED...', error);
            }
        );
    };

    return (
        <div style={{ marginTop: '30px' }}>
            <Fab
                onClick={getSubscribers}
                variant="extended"
                style={{ color: 'white', backgroundColor: '#794cfe', position: 'absolute', bottom: 20, right: 20 }}
                className={classes.margin}
            >
                <RefreshIcon className={classes.extendedIcon} />
                Refresh
            </Fab>
            <div>
                <Button variant="outlined" className={_page === 'active' ? 'userButtonCheck' : null} onClick={() => changePage('active')}>
                    Admin Accounts
                </Button>
            </div>
            <TableContainer style={{ height: '80vh' }} component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {tableHead.map((th, index) => {
                                return (
                                    <StyledTableCell key={index} align="center">
                                        {th}
                                    </StyledTableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subs.map((item, index) => {
                            return (
                                <StyledTableRow key={item.productID} id={item.productID} style={{ cursor: 'pointer' }}>
                                    <StyledTableCell key={item.index} align="center" component="th" scope="row">
                                        {item.user_Fname.charAt(0).toUpperCase()}
                                        {item.user_Fname.slice(1).toLowerCase()}
                                    </StyledTableCell>
                                    <StyledTableCell key={item.index} align="center" component="th" scope="row">
                                        {item.user_Lname.charAt(0).toUpperCase()}
                                        {item.user_Lname.slice(1).toLowerCase()}
                                    </StyledTableCell>
                                    <StyledTableCell key={item.index} align="center" component="th" scope="row">
                                        {item.username}
                                    </StyledTableCell>
                                    <StyledTableCell key={item.index} align="center" component="th" scope="row">
                                        {item.user_ConNum}
                                    </StyledTableCell>
                                    <StyledTableCell key={item.index} align="center" component="th" scope="row">
                                        {new Date(item.user_CreatedAt).toLocaleDateString()}
                                    </StyledTableCell>
                                    {_page === 'active' ? (
                                        <StyledTableCell key={item.index} align="center" component="th" scope="row">
                                            <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                                                <Switch
                                                    checked={item.status === 'active' ? true : false}
                                                    color="primary"
                                                    name="checkedB"
                                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                                    onChange={() =>
                                                        takeAction(
                                                            item.status === 'active' ? 'inactive' : 'active',
                                                            item.user_ID,
                                                            item.user_Fname,
                                                            item.username
                                                        )
                                                    }
                                                />
                                            </div>
                                        </StyledTableCell>
                                    ) : null}
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default Admin;
