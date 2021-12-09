import { Button, TextField, makeStyles, Modal, Backdrop, Fade, Paper, Chip, CircularProgress } from '@material-ui/core';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import PanoramaOutlinedIcon from '@material-ui/icons/PanoramaOutlined';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Category from './Common/Category';
import axios from 'axios';
import { Context } from '../Store';
import { useContext } from 'react';
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Montserrat',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const chipStyle = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}));

function Procedure(props) {
    const [user, setUser] = useContext(Context);
    const classes = useStyles();
    const chipClass = chipStyle();
    const myStyle = {
        minHeight: '85vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };
    const [modal, setModal] = React.useState(false);
    const openModal = (e) => {
        if (e.target.id === 'img') {
            setAction('Image');
            setModal(true);
        }
        if (e.target.id === 'vid') {
            setAction('Video');
            setModal(true);
        }
        if (e.target.id === 'cat') {
            setAction('Category');
            //Last Modification
            if (data.title === '' || data.description === '' || data.vidFile === {} || imgArr.length < 1) {
                fieldValidation();
            } else {
                setModal(true);
            }
        }
    };

    async function sendPushNotification(expoPushToken) {
        await axios.get(`https://ligtasunaapi.azurewebsites.net/api/user?type=user`).then((res) => {
            if (res.data.length > 0) {
                let userWithToken = res.data.filter((out) => out.token);
                console.log(userWithToken);

                const tokens = [];
                for (let index = 0; index < userWithToken.length; index++) {
                    tokens.push(userWithToken[index].token);
                }
                const message = {
                    to: tokens,
                    sound: 'default',
                    title: 'New First Aid Procedure!',
                    body: 'LigtasUna Posted a new First Aid Procedure!',
                    data: { someData: 'goes here' },
                };

                fetch('https://exp.host/--/api/v2/push/send', {
                    mode: 'no-cors',
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Accept-encoding': 'gzip, deflate',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message),
                });
            }
        });
    }

    const closeModal = (e) => {
        setModal(false);
        setImgData(initialImg);
        setVidData(initialVid);
    };

    const [imgArr, setImgArr] = useState([]);
    const [data, setData] = useState({ title: '', description: '', vidFile: {} });
    const initialVid = { vidName: '', vidUrl: '', vidFile: [] };
    const initialImg = { imgName: '', imgUrl: '', imgFile: [] };
    const [imgData, setImgData] = useState(initialImg);
    const [vidData, setVidData] = useState(initialVid);
    const [action, setAction] = useState('');

    const [loading, isLoading] = useState(false);
    const handleLoading = () => {
        isLoading(false);
    };
    const handleToggle = () => {
        isLoading(!loading);
    };

    const handleChange = (events) => {
        if (events.target.id === 'title') {
            // events.target.value
            setData({ ...data, title: events.target.value });
        }
        if (events.target.id === 'description') {
            // events.target.value
            setData({ ...data, description: events.target.value });
        }
    };

    const extractItem = (e) => {
        if (action === 'Image') {
            if (imgData.imgName === '' || imgData.imgUrl === '') {
                fieldValidation();
            } else {
                setImgArr([...imgArr, imgData]);
                closeModal();
                successFileUpload();
            }
        } else {
            if (imgData.vidName === '' || imgData.vidUrl === '') {
                fieldValidation();
            } else {
                setData({ ...data, vidFile: vidData });
                closeModal();
                successFileUpload();
            }
        }
    };

    const itemOnchange = (e) => {
        // let name = e.target.files[0].name.split('.').slice(0, -1).join('');
        console.log(e.target.files);
        if (action === 'Image') {
            // e.target.id === 'item-name' ? setImgData({ ...imgData, imgName: e.target.value }) : setImgData({ ...imgData, imgUrl: e.target.value });
            // console.log(imgData);
            setImgData({
                ...imgData,
                imgName: e.target.files[0].name,
                imgUrl: `https://ligtasuna.blob.core.windows.net/files/${e.target.files[0].name}`,
                imgFile: e.target.files[0],
            });
        } else {
            // e.target.id === 'item-name' ? setVidData({ ...vidData, vidName: e.target.value }) : setVidData({ ...vidData, vidUrl: e.target.value });
            // console.log(vidData);
            setVidData({
                ...vidData,
                vidName: e.target.files[0].name,
                vidUrl: `https://ligtasuna.blob.core.windows.net/files/${e.target.files[0].name}`,
                vidFile: e.target.files[0],
            });
        }
    };

    const modalLoad = () => {
        return (
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={modal}
                onClose={closeModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modal}>
                    {action === 'Category' ? (
                        <Category done={closeModal} submitData={saveToDB} />
                    ) : (
                        <Paper className="modal-paper" elevation={3}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h2 id="transition-modal-title">Add {action}</h2>
                                <p id="transition-modal-description">Upload the {action.toLowerCase()} file</p>
                                {/* <TextField
                                    onChange={itemOnchange}
                                    id="item-name"
                                    type="text"
                                    value={action === 'Image' ? imgData.imgName : vidData.vidName}
                                    label={`${action} Name`}
                                />
                                <TextField
                                    onChange={itemOnchange}
                                    id="item-url"
                                    type="text"
                                    value={action === 'Image' ? imgData.imgUrl : vidData.vidUrl}
                                    style={{ marginTop: '10px' }}
                                    label={`${action} URL`}
                                /> */}
                                <div
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                        alignContent: 'flex-end',
                                        justifyContent: 'space-between',
                                        marginTop: 10,
                                    }}
                                >
                                    <TextField
                                        value={
                                            action === 'Image'
                                                ? imgData.imgName.split('.').slice(0, -1).join('')
                                                : vidData.vidName.split('.').slice(0, -1).join('')
                                        }
                                        type="text"
                                        style={{ width: '75%', border: '1px solid #ccc', borderRadius: 5, padding: '0 10px' }}
                                        disabled
                                    />
                                    <label className="inputStyle" style={{ width: '23%', borderRadius: 5 }}>
                                        <input
                                            type="file"
                                            id="myFile"
                                            name="filename"
                                            accept={action === 'Image' ? 'image/png, image/jpeg' : 'video/mp4'}
                                            onChange={itemOnchange}
                                        />
                                        Upload
                                    </label>
                                </div>
                                <Button onClick={extractItem} variant="contained" style={{ marginTop: '10px', backgroundColor: '#794cfe', color: 'white' }}>
                                    Add {action}
                                </Button>
                            </div>
                        </Paper>
                    )}
                </Fade>
            </Modal>
        );
    };

    const handleChipDelete = (e) => {
        let target;
        if (e.target.nodeName === 'path') {
            // console.log(e.target.nearestViewportElement.parentNode.id);
            target = e.target.nearestViewportElement.parentNode.id;
        }
        if (e.target.nodeName === 'svg') {
            // console.log(e.target.parentNode.id);
            target = e.target.parentNode.id;
        }
        //Remove the video
        if (target === 'vid-chip') {
            setData({ ...data, vidFile: {} });
        } else {
            let imgId = target.replace('img-chip-', '');
            imgArr.splice(parseInt(imgId), 1);
            setImgArr([...imgArr]);
        }
    };

    const fieldValidation = () => {
        toast.warning('All Field must be filled!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
    const successFileUpload = () => {
        toast.success(`${action} Added`, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const successDatatoDB = () => {
        toast.success(`First Aid Saved Successfully`, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const errorsDatatoDB = () => {
        toast.error(`First Aid Failed to save`, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const saveToDB = async (category) => {
        var formData = new FormData();
        let firstaidContent = {
            faidPR_Name: data.title,
            faidPR_Des: data.description,
        };
        handleToggle();
        let files = [data.vidFile.vidFile];
        // console.log(imgArr);
        // console.log(data.vidFile.vidFile);
        imgArr.forEach((file) => {
            files.push(file.imgFile);
        });

        if (files.length > 0) {
            let counter = 0;
            files.forEach(async (datas) => {
                var formData = new FormData();
                formData.append(`fileData`, datas);
                try {
                    await axios
                        .post('https://ligtasunaapi.azurewebsites.net/api/file/upload', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        })
                        .then((res) => {
                            counter++;
                        });
                } catch (error) {
                    console.log(error);
                    handleLoading();
                }
                formData.delete(`fileData`);

                if (counter === files.length) {
                    await axios.post(`${user.api_url}firstaid`, firstaidContent).then((fa) => {
                        if (fa.data.length) {
                            let videoContent = {
                                FaidPR_VidName: data.vidFile.vidName.split('.').slice(0, -1).join(''),
                                FaidPR_VidUrl: data.vidFile.vidUrl,
                                firstaids: {
                                    faidPR_ID: fa.data[0].faidPR_ID,
                                },
                            };

                            try {
                                axios.post(`${user.api_url}video`, videoContent);
                                for (let i = 0; i < imgArr.length; i++) {
                                    let imageContent = {
                                        faidPR_ImgName: imgArr[i].imgName.split('.').slice(0, -1).join(''),
                                        faidPR_ImgUrl: imgArr[i].imgUrl,
                                        firstaids: {
                                            faidPR_ID: fa.data[0].faidPR_ID,
                                        },
                                    };
                                    axios.post(`${user.api_url}image`, imageContent);
                                }
                                for (let j = 0; j < category.length; j++) {
                                    let categoryContent = {
                                        cat_Name: category[j],
                                        firstaids: {
                                            faidPR_ID: fa.data[0].faidPR_ID,
                                        },
                                    };
                                    axios.post(`${user.api_url}category`, categoryContent);
                                }
                            } catch (error) {
                                console.log(error);
                                errorsDatatoDB();
                                handleLoading();
                            }
                            console.log('Success');
                            successDatatoDB();
                            setImgArr([]);
                            setData({ title: '', description: '', vidFile: {} });
                            handleLoading();
                            sendPushNotification();
                        }
                    });
                }
            });
        }

        console.log(data);
        // await axios.post(`${user.api_url}firstaid`, firstaidContent).then((fa) => {
        //     if (fa.data.length) {
        //         let videoContent = {
        //             FaidPR_VidName: data.vidFile.vidName,
        //             FaidPR_VidUrl: data.vidFile.vidUrl,
        //             firstaids: {
        //                 faidPR_ID: fa.data[0].faidPR_ID,
        //             },
        //         };

        //         try {
        //             axios.post(`${user.api_url}video`, videoContent);
        //             for (let i = 0; i < imgArr.length; i++) {
        //                 let imageContent = {
        //                     faidPR_ImgName: imgArr[i].imgName,
        //                     faidPR_ImgUrl: imgArr[i].imgUrl,
        //                     firstaids: {
        //                         faidPR_ID: fa.data[0].faidPR_ID,
        //                     },
        //                 };
        //                 axios.post(`${user.api_url}image`, imageContent);
        //             }
        //             for (let j = 0; j < category.length; j++) {
        //                 let categoryContent = {
        //                     cat_Name: category[j],
        //                     firstaids: {
        //                         faidPR_ID: fa.data[0].faidPR_ID,
        //                     },
        //                 };
        //                 axios.post(`${user.api_url}category`, categoryContent);
        //             }
        //         } catch (error) {
        //             console.log(error);
        //             errorsDatatoDB();
        //             handleLoading();
        //         }
        //         console.log('Success');
        //         successDatatoDB();
        //         setImgArr([]);
        //         setData({ title: '', description: '', vidFile: {} });
        //         handleLoading();
        //         sendPushNotification();
        //     }
        // });
    };
    return (
        <div style={myStyle}>
            <div
                style={{
                    height: '100%',
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <h2>Create a new Procedure</h2>
                <div className="main_pro_box">
                    <div className="pro_box"></div>
                    <div className={`pro_box ${classes.root}`}>
                        <Button onClick={openModal} id="img" style={{ border: '2px solid' }} variant="outlined" className="pro_button">
                            <PanoramaOutlinedIcon style={{ marginRight: '5px', pointerEvents: 'none' }} />
                            Add an Image
                        </Button>
                    </div>
                    <div className="pro_box">
                        <Button onClick={openModal} id="vid" style={{ border: '2px solid' }} variant="outlined" className="pro_button">
                            <VideocamOutlinedIcon style={{ pointerEvents: 'none', marginRight: '5px' }} />
                            Add a Video
                        </Button>
                    </div>
                    <div className="pro_box"></div>
                </div>
                <div className="sub_box" style={{ display: Object.keys(data.vidFile).length === 0 ? 'none' : 'contents' }}>
                    <p>Videos</p>
                    <div
                        style={{
                            border: '1px solid rgba(133, 133, 133,0.6)',
                            width: '50rem',
                            display: 'flex',
                            minHeight: '1.1876em',
                            padding: '.5rem .5rem',
                            alignItems: 'center',
                            borderRadius: '3px',
                            justifyContent: 'center',
                        }}
                    >
                        <Chip
                            id="vid-chip"
                            style={{ backgroundColor: '#794cfe', color: 'white', padding: '2px 5px', cursor: 'pointer' }}
                            label={data.vidFile.vidName}
                            icon={<VideocamOutlinedIcon style={{ color: 'white' }} />}
                            onDelete={handleChipDelete}
                        />
                    </div>
                </div>
                <div className="sub_box" style={{ display: imgArr.length < 1 ? 'none' : 'contents' }}>
                    <p>Images</p>
                    <div
                        style={{
                            border: '1px solid rgba(133, 133, 133,0.6)',
                            width: '50rem',
                            display: 'flex',
                            minHeight: '1.1876em',
                            padding: '.5rem .5rem',
                            alignItems: 'center',
                            borderRadius: '3px',
                            justifyContent: 'center',
                        }}
                    >
                        <div className={chipClass.root}>
                            {imgArr.map((im, index) => {
                                return (
                                    <Chip
                                        id={`img-chip-${index}`}
                                        style={{ backgroundColor: '#794cfe', color: 'white', padding: '2px 5px', cursor: 'pointer' }}
                                        key={index}
                                        label={im.imgName}
                                        icon={<PanoramaOutlinedIcon style={{ color: 'white' }} />}
                                        onDelete={handleChipDelete}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="sub_box">
                    <TextField style={{ width: '50rem' }} id="title" onChange={handleChange} label="Title" value={data.title} variant="outlined" />
                </div>
                <div className="sub_box">
                    <TextField
                        style={{ width: '50rem' }}
                        id="description"
                        onChange={handleChange}
                        label="Description"
                        multiline
                        minRows={8}
                        variant="outlined"
                        value={data.description}
                    />
                </div>
                <div className="sub_box">
                    <Button onClick={openModal} id="cat" variant="contained" style={{ width: '50rem', backgroundColor: '#794cfe', color: 'white' }}>
                        Save First Aid Procedure
                    </Button>
                </div>
                {/* <Button onClick={sendPushNotification}>Test</Button> */}
            </div>
            {modalLoad()}
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <ToastContainer />
        </div>
    );
}

export default Procedure;
