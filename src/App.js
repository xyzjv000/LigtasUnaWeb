import './App.css';
import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import {
    makeStyles,
    useTheme,
    Drawer,
    CssBaseline,
    AppBar,
    Toolbar,
    List,
    Divider,
    ListItem,
    Avatar,
    Badge,
    ThemeProvider,
    ListItemText,
    createTheme,
    Popover,
    Typography,
    Button,
    CircularProgress,
    Backdrop,
    Modal,
    Fade,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl';
import MovieFilterOutlinedIcon from '@material-ui/icons/MovieFilterOutlined';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import CardMembershipOutlinedIcon from '@material-ui/icons/CardMembershipOutlined';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import AddIcon from '@material-ui/icons/Add';
import Login from './Components/Login';
import Profile from './Components/Common/Profile';
import { Context } from './Store';
import { Route, Switch, useHistory } from 'react-router-dom';
import Procedures from './Components/Procedure';
import Home from './Components/Home';
import Video from './Components/Video';
import Report from './Components/Report';
import Subscribers from './Components/Subscribers';
import Firstaid from './Components/Common/Firstaid';
import RegisterForm from './Components/Common/RegisterForm';
import Users from './Components/Users';
import Admin from './Components/Admin';
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        fontFamily: 'Montserrat',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: 'white',
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundColor: 'white',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#363537',
        color: 'white',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
        backgroundColor: 'white',
    },

    typography: {
        padding: theme.spacing(2),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const myStyle = {
    color: '#363537',
    display: 'flex',
    alignItems: 'center',
};

const headerRightStyle = {
    width: 150,
    color: '#363537',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
};

const fontTheme = createTheme({
    typography: {
        fontFamily: 'Montserrat',
    },
});
const spacingStyle = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const drawerWidth = 280;
function App() {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const [isLogin, setIsLogin] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [isSelected, setIsSelected] = React.useState(0);
    const [title, setTitle] = React.useState('First Aid Procedures');
    const [user, serUser] = useContext(Context);
    const [notification, openNotification] = useState(null);
    const [profile, openProfile] = useState(null);
    const [openModal, setOpenModal] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const icons =
        user.user_Type === 'admin'
            ? [
                  <FormatListNumberedRtlIcon />,
                  <MovieFilterOutlinedIcon />,
                  <PeopleAltOutlinedIcon />,
                  <AssessmentOutlinedIcon />,
                  <VerifiedUserOutlinedIcon />,
                  <CardMembershipOutlinedIcon />,
                  <AddIcon />,
              ]
            : [
                  <FormatListNumberedRtlIcon />,
                  <MovieFilterOutlinedIcon />,
                  <PeopleAltOutlinedIcon />,
                  <AssessmentOutlinedIcon />,
                  <CardMembershipOutlinedIcon />,
              ];
    const navUrls =
        user.user_Type === 'admin'
            ? ['/procedures', '/videos', '/users', '/reports', '/admin', '/subscribers', '/register']
            : ['/procedures', '/videos', '/users', '/reports', '/subscribers'];
    const navList =
        user.user_Type === 'admin'
            ? ['First Aid Procedures', 'First Aid Video', 'Users', 'User Logs', 'Admin', 'Subscribers', 'Create Admin Account']
            : ['First Aid Procedures', 'First Aid Video', 'Users', 'User Logs', 'Subscribers'];
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleChange = (e) => {
        console.log(e);
        setIsSelected(parseInt(e.target.id));
        setTitle(e.target.innerText);
        history.push(navUrls[e.target.id]);
    };

    const handleNotificationClose = () => {
        openNotification(null);
    };

    const handleNotificationOpen = (event) => {
        openNotification(event.currentTarget);
    };

    const handleProfileClose = () => {
        openProfile(null);
    };

    const handleProfileOpen = (event) => {
        openProfile(event.currentTarget);
    };

    const openNotif = Boolean(notification);
    const notifId = open ? 'simple-popover' : undefined;

    const openProf = Boolean(profile);
    const profileId = open ? 'simple-popover' : undefined;

    const setLogin = () => {
        loadingOpen();
        setTimeout(() => {
            loadingClose();
            setIsLogin(true);
        }, 2000);
    };

    const setLogout = () => {
        loadingOpen();
        handleProfileClose();
        setTimeout(() => {
            loadingClose();
            setIsLogin(false);
        }, 2000);
    };

    const viewReports = () => {
        handleNotificationClose();
        history.push('/reports');
        setIsSelected(3);
        setTitle('Reports');
    };

    const [loading, setLoading] = React.useState(false);
    const loadingClose = () => {
        setLoading(false);
    };
    const loadingOpen = () => {
        setLoading(!loading);
    };

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const checkIfLogin = () => {
        if (isLogin) {
            return (
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar
                        position="fixed"
                        className={clsx(classes.appBar, {
                            [classes.appBarShift]: open,
                        })}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={clsx(classes.menuButton, open && classes.hide)}
                                style={{ color: '#363537' }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <div style={spacingStyle}>
                                <h3 style={myStyle}>
                                    {icons[isSelected]}
                                    <span style={{ marginLeft: '10px' }}>{title}</span>
                                </h3>
                                <div style={headerRightStyle}>
                                    <IconButton>
                                        <Badge color="secondary" badgeContent={user.reports} aria-describedby={notifId} onClick={handleNotificationOpen}>
                                            <NotificationsNoneOutlinedIcon />
                                        </Badge>
                                        <Popover
                                            id={notifId}
                                            open={openNotif}
                                            anchorEl={notification}
                                            onClose={handleNotificationClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                        >
                                            <div style={{ padding: '10px 20px' }}>
                                                <Typography className={classes.typography}>
                                                    {user.reports < 1 ? 'There is no new reports recieved' : `${user.reports} Reports have been recieved`}
                                                </Typography>
                                                <Button
                                                    onClick={viewReports}
                                                    varian="contained"
                                                    style={{ width: '100%', backgroundColor: '#794cfe', color: 'white' }}
                                                >
                                                    View Reports
                                                </Button>
                                            </div>
                                        </Popover>
                                    </IconButton>
                                    <IconButton>
                                        <Avatar style={{ backgroundColor: '#363537' }} onClick={handleProfileOpen}>
                                            {user.user_Fname.charAt(0).toUpperCase()}
                                            {user.user_Lname.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Popover
                                            id={profileId}
                                            open={openProf}
                                            anchorEl={profile}
                                            onClose={handleProfileClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                        >
                                            <List component="nav" style={{ width: '10rem', display: 'flex', flexDirection: 'column' }}>
                                                <ListItem button onClick={handleModalOpen}>
                                                    <ListItemIcon className="user-child">
                                                        <AccountCircleOutlinedIcon className="user-child" />
                                                    </ListItemIcon>
                                                    <ListItemText className="user-child" primary="Profile" />
                                                </ListItem>
                                                <ListItem button onClick={setLogout}>
                                                    <ListItemIcon className="user-child">
                                                        <ExitToAppOutlinedIcon className="user-child" />
                                                    </ListItemIcon>
                                                    <ListItemText className="user-child" primary="Logout" />
                                                </ListItem>
                                            </List>
                                        </Popover>
                                    </IconButton>
                                </div>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={classes.drawer}
                        variant="persistent"
                        anchor="left"
                        open={open}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        style={{ position: 'relative' }}
                    >
                        <div className={classes.drawerHeader} style={{ position: 'relative' }}>
                            <h3 style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src="../icon.png" alt="icon" style={{ width: '30px', marginRight: 5 }} />
                                <span style={{ marginLeft: '5px' }}>LigtasUna</span>
                            </h3>
                            <IconButton style={{ color: 'white' }} onClick={handleDrawerClose}>
                                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                            </IconButton>
                        </div>
                        <Divider />
                        <List>
                            {navList.map((text, index) => (
                                <ListItem
                                    style={{ backgroundColor: index === isSelected ? '#794cfe' : '#363537' }}
                                    onClick={handleChange}
                                    button
                                    key={index}
                                    id={index}
                                >
                                    <ListItemIcon style={{ color: 'white', pointerEvents: 'none' }}>{icons[index]}</ListItemIcon>
                                    <p style={{ fontSize: '15px', pointerEvents: 'none' }}>{text}</p>
                                </ListItem>
                            ))}
                        </List>
                    </Drawer>
                    <main
                        className={clsx(classes.content, {
                            [classes.contentShift]: open,
                        })}
                    >
                        <div className={classes.drawerHeader} />
                        <ThemeProvider theme={fontTheme}>
                            <Switch>
                                <Route path="/procedures" exact component={Procedures} />
                                <Route path="/reports" exact component={Report} />
                                <Route path="/videos" exact component={Video} />
                                <Route path="/users" exact component={Users} />
                                <Route path="/admin" exact component={Admin} />
                                <Route path="/firstaid/:id" exact component={Firstaid} />
                                <Route path="/subscribers" exact component={Subscribers} />
                                <Route path="/register" exact component={RegisterForm} />
                            </Switch>
                        </ThemeProvider>
                    </main>
                </div>
            );
        } else {
            return <Login loginSuccess={setLogin} />;
        }
    };
    return (
        <div>
            {checkIfLogin()}{' '}
            <Backdrop className={classes.backdrop} open={loading} onClick={loadingClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openModal}
                onClose={handleModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModal}>
                    <Profile modalCLose={handleModalClose} userSet={serUser} />
                </Fade>
            </Modal>
        </div>
    );
}

export default App;
