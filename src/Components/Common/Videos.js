import React, { useState } from 'react';
import { Card, makeStyles, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Firstaid from './Firstaid';
const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});
const Videos = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const option = {
        day: 'numeric', // numeric, 2-digit
        year: 'numeric', // numeric, 2-digit
        month: 'long', // numeric, 2-digit, long, short, narrow
    };
    // const [item, setItem] = useState(props.status);
    const handleClick = (e) => {
        console.log(e);
        localStorage.setItem('faid', props.faid);
        localStorage.setItem('vidUrl', props.vid.url);
        localStorage.setItem('images', JSON.stringify(props.imgList));
        localStorage.setItem('category', JSON.stringify(props.cat));
        localStorage.setItem('title', props.title);
        localStorage.setItem('description', props.description);
        localStorage.setItem('created', new Date(props.created).toLocaleDateString('en-US', option));
        history.push(`/firstaid/${props.faid}`);
        // return <Firstaid />;
    };
    return (
        <Card style={{ margin: '20px', position: 'relative' }} className={classes.root}>
            {props.status === 'inactive' ? (
                <div
                    style={{
                        position: 'absolute',
                        top: '35%',
                        backgroundColor: '#b10505',
                        width: '30%',
                        height: 27,
                        zIndex: 1,
                        right: 0,
                        borderTopLeftRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                >
                    Disabled
                </div>
            ) : null}
            <CardActionArea id={props.title} onClick={handleClick}>
                <CardMedia style={{ pointerEvents: 'none' }} alt={props.title} className={classes.media} image={props.img} title={props.title} />
                <CardContent style={{ pointerEvents: 'none' }}>
                    <Typography gutterBottom variant="h5" component="h2" style={{ marginBottom: '-5px' }}>
                        {props.title.substring(0, 21)} {props.title.length > 21 ? '...' : ''}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" style={{ marginBottom: '5px' }}>
                        {new Date(props.created).toLocaleDateString('en-US', option)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.description.substring(0, 165)} {props.description.length > 165 ? '...' : ''}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default Videos;
