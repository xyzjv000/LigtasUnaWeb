import React, { useState, useContext, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { makeStyles, Chip, Paper, Avatar, Button, CircularProgress, Backdrop, Modal, Fade, TextField } from '@material-ui/core';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateOutlinedIcon from '@material-ui/icons/UpdateOutlined';
import axios from 'axios';
import { Context } from '../../Store';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CastConnectedSharp } from '@material-ui/icons';
import BlockIcon from '@material-ui/icons/Block';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import Category from './Category';
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    imageList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
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
        width: '50vw',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: 10,
    },
}));

const Firstaid = () => {
    useEffect(() => {
        getFirstAid();
        getFeedbacks();
    }, []);
    const history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const initialImage = JSON.parse(localStorage.getItem('images'));
    const initialCategory = JSON.parse(localStorage.getItem('category'));
    const [imgs] = useState(initialImage);
    const [cats, setCats] = useState(initialCategory);
    const [user] = useContext(Context);
    const [data, setData] = useState({ faidPR_Des: '' });
    const [feedbacks, setFeedbacks] = useState([]);
    const [title, setTitle] = useState(localStorage.getItem('title'));

    const [newUpdates, setNewUpdates] = useState({ title: title, desc: '', categories: cats });
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        getFirstAid();
        getFeedbacks();
    };

    const handleOpen1 = () => {
        setOpen1(true);
    };

    const handleClose1 = () => {
        setOpen1(false);
    };
    const getFirstAid = async () => {
        await axios.get(`${user.api_url}firstaid/view?id=${parseInt(localStorage.getItem('faid'))}`).then((res) => {
            if (res.data.length > 0) {
                console.log(res.data[0]);
                setData(res.data[0]);
                setNewUpdates({ ...newUpdates, desc: res.data[0].faidPR_Des });
            }
        });
    };
    const getFeedbacks = async () => {
        await axios.get(`${user.api_url}feedback/list?id=${parseInt(localStorage.getItem('faid'))}`).then((res) => {
            if (res.data.length > 0) {
                setFeedbacks(res.data);
            }
        });
    };
    const [loading, isLoading] = useState(false);
    const deleteProcedure = async () => {
        isLoading(true);
        try {
            await axios.post(`${user.api_url}firstaid/remove?faid=${parseInt(localStorage.getItem('faid'))}`).then((res) => {
                if (res.data.length === 0) {
                    successDelete();
                    setTimeout(() => {
                        isLoading(false);
                        history.push('/videos');
                    }, 2000);
                }
            });
        } catch (error) {
            isLoading(false);
        }
    };

    const disableProcedure = async () => {
        let query;
        if (data.status === 'active') {
            query = 'inactive';
        }
        if (data.status === 'inactive') {
            query = 'active';
        }
        await axios.post(`https://ligtasunaapi.azurewebsites.net/api/firstaid/video_option?faid=${data.faidPR_ID}&status=${query}`).then((res) => {
            if (res.data.length > 0) {
                getFirstAid();
                successDisable();
            }
        });
    };

    const updateProcedure = async () => {
        let _name = newUpdates.title === title ? 0 : 1;
        let _desc = newUpdates.desc === data.faidPR_Des ? 0 : 1;
        setData({ ...data, faidPR_Des: newUpdates.desc }); //{}
        setTitle(newUpdates.title); //""
        setCats(newUpdates.categories); //[]
        handleClose();

        let request_body = {
            FaidPR_Name: newUpdates.title,
            FaidPR_Des: newUpdates.desc,
        };
        await axios
            .post(`https://ligtasunaapi.azurewebsites.net/api/firstaid/edit?faid=${data.faidPR_ID}&name=${_name}&desc=${_desc}&cat=1`, request_body)
            .then((res) => {
                if (res.data.length > 0) {
                    for (let j = 0; j < newUpdates.categories.length; j++) {
                        let categoryContent = {
                            cat_Name: newUpdates.categories[j],
                            firstaids: {
                                faidPR_ID: data.faidPR_ID,
                            },
                        };
                        axios.post(`${user.api_url}category`, categoryContent);
                    }
                }
            });
    };

    const titleHandler = (event) => {
        let value = event.target.value;
        setNewUpdates({ ...newUpdates, title: value });
    };
    const descHandler = (event) => {
        let value = event.target.value;
        setNewUpdates({ ...newUpdates, desc: value });
    };

    const updateCategory = (categories) => {
        // categories.length > 0 ? setCats(categories) : console.log('No Category changes');
        categories.length > 0 ? setNewUpdates({ ...newUpdates, categories: categories }) : console.log('No Category changes');
    };

    const successDelete = () => {
        toast.success(`Procedure Sucessfully Removed`, {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const successDisable = () => {
        toast.success(`Procedure Status Sucessfully Changed!`, {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <div style={{ width: '62.5rem', margin: 'auto' }}>
            <ReactPlayer
                style={{ margin: 'auto', marginTop: '20px' }}
                width="62.5rem"
                height="32rem"
                url={localStorage.getItem('vidUrl')}
                controls={true}
                config={{
                    youtube: {
                        playerVars: { showinfo: 1 },
                    },
                }}
            />

            <div className={imgs.length > 1 ? classes.root : ''}>
                <ImageList
                    style={{ width: '100%', margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    className={classes.imageList}
                    cols={2.5}
                >
                    {imgs.map((img, index) => (
                        <ImageListItem key={index}>
                            <img src={img.url} alt={img.name} />
                            <ImageListItemBar
                                title={img.name}
                                classes={{
                                    root: classes.titleBar,
                                    title: classes.title,
                                }}
                                // actionIcon={
                                //     <IconButton aria-label={`star ${img.name}`}>
                                //         <StarBorderIcon className={classes.title} />
                                //     </IconButton>
                                // }
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
            <h1 style={{ marginTop: '5px' }}>{title}</h1>
            <p style={{ marginBottom: '5px', fontWeight: 'bold', color: 'rgba(0,0,0,0.7)' }}>
                Posted : {localStorage.getItem('created')} | <span style={{ marginLeft: 5, color: 'darkgrey' }}>{data.views} Views</span>
            </p>

            <p>
                {cats.map((cat) => {
                    return <Chip style={{ marginRight: '5px' }} label={cat} variant="outlined" />;
                })}
            </p>

            {data.faidPR_Tools ? (
                <p style={{ marginTop: 10, fontSize: '1rem' }}>
                    <span style={{ fontWeight: 600 }}>Tools : </span>
                    {data.faidPR_Tools.split(',').map((item, index) => {
                        return (
                            <span style={{ fontSize: '1rem', color: 'rgba(0,0,0,0.7)' }} key={index}>
                                {item} <b>|</b>
                            </span>
                        );
                    })}
                </p>
            ) : null}

            {data.faidPR_Medicine ? (
                <p style={{ fontSize: '1rem' }}>
                    <span style={{ fontWeight: 600 }}>Medicine : </span>
                    {data.faidPR_Medicine.split(',').map((item, index) => {
                        return (
                            <span style={{ fontSize: '1rem', color: 'rgba(0,0,0,0.7)' }} key={index}>
                                {item} <b>|</b>
                            </span>
                        );
                    })}
                </p>
            ) : null}

            <div style={{ marginBottom: '50px', marginTop: 10 }}>
                {data.faidPR_Des.split('\n').map((item, index) => {
                    return (
                        <span style={{ fontSize: '1rem', color: 'rgba(0,0,0,0.7)' }} key={index}>
                            {item}
                            <br />
                        </span>
                    );
                })}
            </div>

            <div style={{ width: '100%', marginBottom: '50px' }}>
                <h2>
                    Feedbacks <span style={{ fontSize: '15px' }}>({feedbacks.length})</span>
                </h2>
                <div style={{ width: '95%', margin: 'auto', marginTop: '10px' }}>
                    {feedbacks.map((feed, index) => {
                        return (
                            <div key={index}>
                                <Paper style={{ marginBottom: '20px', padding: '1.2rem 0' }} elevation={1}>
                                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 2.4rem .8rem 2.4rem' }}>
                                        <Avatar style={{ backgroundColor: '#363537', marginRight: '.8rem' }}>
                                            {feed.fname.charAt(0).toUpperCase()}
                                            {feed.lname.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <div>
                                            <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                                {feed.fname.charAt(0).toUpperCase() + feed.fname.slice(1)}{' '}
                                                {feed.lname.charAt(0).toUpperCase() + feed.lname.slice(1)}
                                            </p>
                                            <p>{new Date(feed.created).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 3rem' }}>
                                        <p>{feed.description}</p>
                                    </div>
                                </Paper>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <Button
                    onClick={handleOpen}
                    startIcon={<UpdateOutlinedIcon />}
                    style={{ backgroundColor: 'rgb(121, 76, 254)', color: 'white', height: '3rem', fontFamily: 'Montserrat', width: '40%' }}
                >
                    Edit First Aid Procedure
                </Button>
                <Button
                    onClick={disableProcedure}
                    startIcon={data.status === 'active' ? <BlockIcon /> : <CheckCircleOutlineOutlinedIcon />}
                    style={{
                        backgroundColor: data.status === 'active' ? '#363537' : '#1f7034',
                        color: 'white',
                        height: '3rem',
                        fontFamily: 'Montserrat',
                        width: '40%',
                    }}
                >
                    {data.status === 'active' ? 'Disable' : 'Enable'} First Aid Procedure
                </Button>
                {/* <Button
                    onClick={deleteProcedure}
                    startIcon={<DeleteIcon />}
                    style={{ backgroundColor: '#b33e3e', color: 'white', height: '3rem', fontFamily: 'Montserrat', width: '32%' }}
                >
                    Delete First Aid Procedure
                </Button> */}
            </div>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 20px' }}>
                        <h2 id="transition-modal-title" style={{ fontSize: 26, fontFamily: 'Montserrat' }}>
                            Update First Aid Procedure
                        </h2>
                        <div
                            style={{
                                width: '80%',
                                margin: '0 auto',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignContent: 'space-around',
                                justifyContent: 'space-around',
                                padding: '15px 0',
                            }}
                        >
                            <TextField label="Title" variant="outlined" value={newUpdates.title} onChange={titleHandler} />
                            <TextField
                                label="Description"
                                variant="outlined"
                                minRows="5"
                                multiline
                                style={{ marginTop: 15 }}
                                value={newUpdates.desc}
                                onChange={descHandler}
                            />

                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    marginTop: 10,
                                }}
                            >
                                <Button onClick={handleOpen1}>Change Category</Button>
                            </div>
                        </div>

                        <div
                            style={{ width: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 10 }}
                        >
                            <Button
                                onClick={handleClose}
                                style={{
                                    backgroundColor: 'rgb(121, 76, 254)',
                                    color: 'white',
                                    width: '45%',
                                    height: '3rem',
                                    fontFamily: 'Montserrat',
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={updateProcedure}
                                style={{
                                    backgroundColor: 'rgb(121, 76, 254)',
                                    color: 'white',
                                    width: '45%',
                                    height: '3rem',
                                    fontFamily: 'Montserrat',
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </Fade>
            </Modal>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open1}
                onClose={handleClose1}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open1}>{<Category done={handleClose1} submitData={updateCategory} />}</Fade>
            </Modal>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <ToastContainer />
        </div>
    );
};

export default Firstaid;
