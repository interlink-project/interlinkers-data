import * as React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Box, MobileStepper, Paper, Typography, Button } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { getImageUrl } from 'axiosInstance';

// autoPlay(SwipeableViews);
const AutoPlaySwipeableViews = SwipeableViews;

const MAX_WIDTH = 600
const HEIGHT = MAX_WIDTH * 3 / 5
function SwipeableTextMobileStepper({images = []}) {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    let imageList = []
    if(images.length === 0) {
        imageList = ["https://cdn.dribbble.com/users/308895/screenshots/2598725/no-results.gif"]
    } else {
        imageList = images.map(el => getImageUrl("catalogue", el)) 
    }
    
    const maxSteps = imageList.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    return (
        <Box sx={{ maxWidth: MAX_WIDTH, flexGrow: 1 }}>
           
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {imageList.map((image, index) => (
                    <div key={image}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <Box
                                component="img"
                                sx={{
                                    height: HEIGHT,
                                    display: 'block',
                                    maxWidth: MAX_WIDTH,
                                    overflow: 'hidden',
                                    width: '100%',
                                }}
                                src={image}
                                alt={image}
                            />
                        ) : null}
                    </div>
                ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                    </Button>
                }
            />
            
        </Box>
    );
}

export default SwipeableTextMobileStepper;
