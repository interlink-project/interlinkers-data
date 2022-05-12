import { Box, Container, Fade, Grid, Divider } from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import { useInViewport } from 'react-in-viewport';

const HomeRow = ({ light = true, graphic, right }) => {
    const myRef = useRef();
    const [show, setShow] = useState(true)
    const {
        inViewport,
    } = useInViewport(
        myRef
    );

    useEffect(() => {
        if (inViewport) {
            setShow(true)
        }
    }, [inViewport])

    return (
        <>
        <Box
            sx={{
                backgroundColor: light ? 'background.paper' : 'background.default',
                py: 10
            }}
        >
            <Container maxWidth="lg">
                <Grid
                    alignItems="center"
                    container
                    justifyContent="center"
                    spacing={10}
                >
                    {light ? <><Grid
                        item
                        md={6}
                        xs={12}
                        sx={{
                            order: {
                                xs: 2,
                                md: 1
                            },
                        }}
                    >
                        {right}
                    </Grid>
                        <Grid
                            item
                            md={6}
                            sm={8}
                            xs={12}
                            sx={{
                                order: {
                                    xs: 1,
                                    md: 2
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',

                                }}
                            >
                                {graphic}
                            </Box>
                        </Grid></> : <><Grid
                            item
                            md={6}
                            sm={8}
                            xs={12}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                }}
                            >
                                {graphic}
                            </Box>
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            {right}
                        </Grid></>}
                </Grid>
            </Container>
        </Box>
        <Divider />
        </>)
}

export default HomeRow