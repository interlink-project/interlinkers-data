import { Box, Dialog } from '@material-ui/core';
import React from 'react';
import { TreeItemData } from '.';

const TreeItemDialog = ({ element, onClose }) => {
  return <Dialog onClose={onClose} open fullWidth>
    <Box sx={{ p: 4 }}>
      <TreeItemData type={element.type} onSave={onClose} element={element} />
    </Box>
  </Dialog>

}

export default TreeItemDialog