import * as React from 'react';
import { Drawer } from '@material-ui/core';
import SelectedTaskElement from './SelectedTaskElement';

export default function TaskDrawer({ open, onClose, task }) {

    return (

        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
        >
            <SelectedTaskElement selectedTask={task} onSaved={onClose} />
        </Drawer>
    );
}