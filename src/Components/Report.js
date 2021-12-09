import React, { useState, useContext, useEffect } from 'react';
import { Paper, Avatar, Fab, makeStyles, CircularProgress, Backdrop } from '@material-ui/core';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import FeedbackOutlinedIcon from '@material-ui/icons/FeedbackOutlined';
import FiberNewOutlinedIcon from '@material-ui/icons/FiberNewOutlined';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import AllInclusiveOutlinedIcon from '@material-ui/icons/AllInclusiveOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import axios from 'axios';

import { Context } from '../Store';
import moment from 'moment-timezone';

const useStyles = makeStyles((theme) => ({
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

function Report() {
    useEffect(() => {
        getReports();
    }, []);
    const classes = useStyles();
    const [user, setUser] = useContext(Context);
    const [action, setAction] = useState({ active: true, tag: 'Recent' });
    const [reports, setReports] = useState([]);
    const [count, udpateCount] = useState(0);
    const getReports = async () => {
        handleToggle();
        try {
            await axios.get(`${user.api_url}report`).then((res) => {
                if (res.data.length > 0) {
                    console.log(res.data);
                    setReports(res.data);
                    handleClose();
                    getReportList();
                }
            });
        } catch {
            handleClose();
            alert('Connection Error');
        }
    };

    const updateReport = async (event) => {
        handleToggle();
        try {
            await axios.put(`${user.api_url}report/one?id=${event.target.id}`).then((res) => {
                if (res.data.length > 0) {
                    handleClose();
                    getReports();
                }
            });
            getReports();
            setUser({ ...user, reports: count });
        } catch {
            handleClose();
            alert('Connection Error');
        }
    };

    const getReportList = async () => {
        await axios.get(`${user.api_url}report/active`).then((rep) => {
            if (rep.data.length > 0) {
                udpateCount(rep.data.length);
            }
        });
        setUser({ ...user, reports: count });
    };

    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    const getRecent = () => {
        setAction({ active: true || false, tag: 'Recent' });
        getReports();
    };
    const getNew = () => {
        setAction({ active: true, tag: 'New' });
    };

    const getViewed = () => {
        setAction({ active: false, tag: 'Viewed' });
    };
    const updateAll = async () => {
        handleToggle();
        try {
            await axios.put(`${user.api_url}report`).then((res) => {
                if (res.data.length > 0) {
                    handleClose();
                }
            });
            setUser({ ...user, reports: 0 });
            getReports();
        } catch {
            handleClose();
            alert('Connection Error');
        }
    };
    return (
        <div
            style={{
                minHeight: '89vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <h2>{action.tag} User Logs</h2>
            <br />
            <div className="box">
                {reports
                    .filter((repo) => (action.tag === 'Recent' ? repo : repo.active === action.active))
                    .map((rep, indx) => {
                        return (
                            <Paper
                                key={indx}
                                id={rep.id}
                                className="reports"
                                elevation={rep.active ? 3 : 1}
                                onClick={rep.active === true ? updateReport : console.log('already viewed')}
                            >
                                <div className="ribbon" style={{ display: rep.active ? 'block' : 'none' }}>
                                    <h5>New</h5>
                                </div>
                                <Avatar style={{ backgroundColor: '#794cfe', marginRight: '10px', pointerEvents: 'none' }}>
                                    {rep.subscribe && !rep.feedback ? <BookmarkBorderOutlinedIcon /> : <FeedbackOutlinedIcon />}
                                </Avatar>
                                <p>
                                    {rep.fname} {rep.lname} {rep.subscribe && !rep.feedback ? 'is now a Subscriber' : 'created a Feedback'}
                                </p>
                                <p style={{ right: 50, position: 'absolute', top: '50%', transform: 'translate(0, -50%)', fontSize: '12px' }}>
                                    {moment.tz(rep.created, 'Asia/Manila').tz('America/Los_Angeles').format('lll')}
                                </p>
                            </Paper>
                        );
                    })}

                <Fab
                    onClick={getRecent}
                    variant="extended"
                    style={{
                        color: 'white',
                        backgroundColor: '#794cfe',
                        position: 'absolute',
                        // width: '8rem',
                        bottom: 20,
                        right: 265,
                        display: 'flex',
                        justifyContent: 'space-evenly',
                    }}
                    className={classes.margin}
                >
                    <AllInclusiveOutlinedIcon className={classes.extendedIcon} />
                    All
                </Fab>
                <Fab
                    onClick={getNew}
                    variant="extended"
                    style={{
                        color: 'white',
                        backgroundColor: '#794cfe',
                        position: 'absolute',
                        // width: '8rem',
                        bottom: 20,
                        right: 155,
                        display: 'flex',
                        justifyContent: 'space-evenly',
                    }}
                    className={classes.margin}
                >
                    <FiberNewOutlinedIcon className={classes.extendedIcon} />
                    New
                </Fab>
                <Fab
                    onClick={getViewed}
                    variant="extended"
                    style={{
                        color: 'white',
                        backgroundColor: '#794cfe',
                        position: 'absolute',
                        // width: '8rem',
                        bottom: 20,
                        right: 20,
                        display: 'flex',
                        justifyContent: 'space-evenly',
                    }}
                    className={classes.margin}
                >
                    <HistoryOutlinedIcon className={classes.extendedIcon} />
                    Viewed
                </Fab>
                <Fab
                    onClick={updateAll}
                    variant="extended"
                    style={{
                        color: 'white',
                        backgroundColor: '#794cfe',
                        position: 'absolute',
                        // width: '8rem',
                        bottom: 80,
                        right: 20,
                        display: 'flex',
                        justifyContent: 'space-evenly',
                    }}
                    className={classes.margin}
                >
                    <CheckCircleOutlineOutlinedIcon className={classes.extendedIcon} />
                    Mark All as Viewed
                </Fab>
            </div>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default Report;
