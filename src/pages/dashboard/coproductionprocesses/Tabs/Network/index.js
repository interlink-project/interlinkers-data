import React, { useState } from 'react';
import Graph from 'react-graph-network';
import { useSelector } from 'react-redux';

import Line from './Line';
import Node from './Node';
import deepCopy from 'utils/deepCopy';

const GraphTab = () => {
    const [props, setProps] = useState({
        nodeDistance: 1000,
        zoomDepth: 3,
        hoverOpacity: .3,
        enableDrag: true,
        pullIn: false,
    });
    const { network } = useSelector((state) => state.process);

    return (
        <div style={{ height: '83vh' }}>
            {network && network.nodes && network.links && <Graph
                data={deepCopy(network)}
                NodeComponent={Node}
                LineComponent={Line}
                {...props}
            />}
        </div>
    );
};

export default GraphTab;