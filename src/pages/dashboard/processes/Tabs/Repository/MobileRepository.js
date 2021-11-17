import { useState } from 'react';
import {
    Tab,
    Tabs,
    Select,
    MenuItem,
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';

const styles = {
    tabs: {
        background: '#fff',
    },
    slide: {
        padding: 15,
        minHeight: 100,
        color: '#fff',
    },
    slide1: {
        backgroundColor: '#FEA900',
    },
    slide2: {
        backgroundColor: '#B3DC4A',
    },
    slide3: {
        backgroundColor: '#6AC0FF',
    },
};


const MobileRepository = () => {
    const [index, setIndex] = useState(0);


    const handleChange = (event, value) => {
        setIndex(value)
    };

    const handleChangeIndex = index => {
        setIndex(index)
    };


    return (
        <>
            <Tabs value={index} onChange={handleChange} style={styles.tabs}>
                <Tab label="tab n°1" />
                <Tab label="tab n°2" />
                <Tab label="tab n°3" />
            </Tabs>
            <SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
                <div style={Object.assign({}, styles.slide, styles.slide1)}>slide n°1</div>
                <div style={Object.assign({}, styles.slide, styles.slide2)}>
                    slide n°2
                    <Select value={10} autoWidth={false}>
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                    </Select>
                </div>
                <div style={Object.assign({}, styles.slide, styles.slide3)}>slide n°3</div>
            </SwipeableViews>
        </>
    );
};

export default MobileRepository;
