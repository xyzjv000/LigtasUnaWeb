import React, { useContext, useEffect, useState } from 'react';
import {
    Popover,
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
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Fab,
    CircularProgress,
    Backdrop,
} from '@material-ui/core';
import axios from 'axios';
import { Context } from '../Store';
import RefreshIcon from '@material-ui/icons/Refresh';
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
function Subscribers() {
    useEffect(() => {
        getSubscribers();
    }, []);
    const [user] = useContext(Context);
    const classes = useStyles();
    const [subs, setSubs] = useState([]);
    const getSubscribers = async () => {
        handleToggle();
        try {
            await axios.get(`${user.api_url}subscription`).then((res) => {
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
    const tableHead = ['First Name', 'Last Name', 'Username', 'Address', 'Number', 'Subscriber Since'];
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
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
                                        {item.fname}
                                    </StyledTableCell>
                                    <StyledTableCell key={item.index} align="center" component="th" scope="row">
                                        {item.lname}
                                    </StyledTableCell>
                                    <StyledTableCell key={item.index} align="center" component="th" scope="row">
                                        {item.username}
                                    </StyledTableCell>
                                    <StyledTableCell key={item.index} align="center" component="th" scope="row">
                                        {item.address}
                                    </StyledTableCell>
                                    <StyledTableCell key={item.index} align="center" component="th" scope="row">
                                        {item.number}
                                    </StyledTableCell>
                                    <StyledTableCell key={item.index} align="center" component="th" scope="row">
                                        {new Date(item.subDate).toLocaleDateString()}
                                    </StyledTableCell>
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

export default Subscribers;
