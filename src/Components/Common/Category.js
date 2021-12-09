import React, { useState } from 'react';
import { Button, TextField, makeStyles, Modal, Backdrop, Fade, Paper, Chip } from '@material-ui/core';
const Category = (props) => {
    const categories = [
        'Baby Sitter Course',
        'Home Alone Course',
        'Psychological First Aid',
        'Emergency First Aid',
        'Standard First Aid',
        'Child Care First Aid',
    ];
    const [other, setOther] = useState('');
    const [active, setActive] = useState([]);
    const selectCategory = (e) => {
        if (active.includes(parseInt(e.target.id))) {
            const index = active.indexOf(parseInt(e.target.id));
            active.splice(index, 1);
            setActive([...active]);
        } else {
            setActive([...active, parseInt(e.target.id)]);
        }
    };
    const sumbitFirstAid = () => {
        let selectedCategories = [];
        active.forEach((element) => {
            console.log(element);
            selectedCategories = [...selectedCategories, categories[element]];
        });

        if (other !== '') {
            let data = other.split(',');
            data.forEach((d) => {
                selectedCategories = [...selectedCategories, d];
            });
        }

        console.log(selectedCategories);
        // console.log(selectedCategories);
        props.submitData(selectedCategories);
        props.done();
    };
    const handleOther = (e) => {
        let value = e.target.value;
        setOther(value);
        console.log(e.target.value);
    };
    return (
        <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper className="modal-paper" elevation={3}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 id="transition-modal-title">Select First Aid Category</h2>
                    <br />
                    {categories.map((cat, index) => {
                        return (
                            <Button
                                onClick={selectCategory}
                                id={index}
                                key={index}
                                style={{
                                    marginBottom: '5px',
                                    backgroundColor: active.includes(index) ? '#794cfe' : 'white',
                                    color: active.includes(index) ? 'white' : 'black',
                                }}
                            >
                                {cat}
                            </Button>
                        );
                    })}
                    <TextField
                        value={other}
                        className="category_other"
                        type="text"
                        label="Other Category"
                        placeholder="Separate by comma ',' if many"
                        onChange={handleOther}
                    />
                    <br />

                    <Button onClick={sumbitFirstAid} style={{ marginBottom: '5px', backgroundColor: '#363537', color: 'white', padding: '10px 0' }}>
                        Submit
                    </Button>
                </div>
            </Paper>
        </div>
    );
};

export default Category;
