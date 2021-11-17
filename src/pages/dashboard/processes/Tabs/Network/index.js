import React, { useState } from 'react';
import Graph from 'react-graph-network';

import Line from './Line';
import Node from './Node';
import tolstoy from './tolstoy';


const GraphTab = () => {
    const [props, setProps] = useState({
        nodeDistance: 200,
        zoomDepth: 3,
        hoverOpacity: .3,
        enableDrag: false,
        pullIn: false,
    });

    return (
        <div style={{ height: '70vh' }}>
            <Graph
                data={tolstoy}
                NodeComponent={Node}
                LineComponent={Line}
                {...props}
            />
        </div>
    );
};

export default GraphTab;