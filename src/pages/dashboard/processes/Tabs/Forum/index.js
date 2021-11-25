import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@material-ui/core';
import { ChatSidebar, ChatThread } from 'components/dashboard/chat';
import gtm from 'lib/gtm';
import { getThreads } from 'slices/chat';
import { useDispatch, useSelector } from 'react-redux';

const Chat = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        gtm.push({ event: 'page_view' });
    }, []);

    useEffect(() => {
        dispatch(getThreads());
    }, []);

    // return <iframe src="http://localhost:3001" style={{width: "100%", height: "85vh"}} frameBorder="0">Browser not compatible.</iframe>

    return true ? <iframe src="http://localhost/forum/index" style={{width: "100%", height: "85vh"}} frameBorder="0">Browser not compatible.</iframe>    : (
        <Box
            sx={{
                display: 'flex',
                width: '100%', bgcolor: 'background.paper', minHeight: '85vh'
            }}
        >
            <ChatSidebar />
            <ChatThread />
        </Box>
    );
};

export default Chat;
