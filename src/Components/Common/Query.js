import React, { useState } from 'react';
import { makeStyles, InputLabel, MenuItem, Select, Button, FormControl } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const Query = () => {
    const classes = useStyles();
    const categories = [
        'All',
        'Baby Sitter Course',
        'Home Alone Course',
        'Psychological First Aid',
        'Emergency First Aid',
        'Standard First Aid',
        'Child Care First Aid',
    ];
    const [open, setOpen] = React.useState(false);
    const [category, setCategory] = useState('All');
    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
        console.log(category);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    return (
        <div style={{ width: '100%' }}>
            <div
                style={{
                    width: '90%',
                    height: '4rem',
                    margin: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{ width: '60%' }}>
                    <FormControl style={{ width: '100%' }} className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-controlled-open-select-label"
                            id="category"
                            open={open}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            value={category}
                            onChange={handleChange}
                        >
                            {categories.map((cat) => {
                                return <MenuItem value={cat}>{cat}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                </div>
            </div>
        </div>
    );
};

export default Query;
