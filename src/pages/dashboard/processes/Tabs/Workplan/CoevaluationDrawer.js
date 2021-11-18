import * as React from 'react';
import { Drawer } from '@material-ui/core';
import CheckboxesGroup from './CheckboxList';

export default function CoevaluationDrawer({ open, onClose, objective }) {

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
        >
            <CheckboxesGroup />
        </Drawer>
    );
}