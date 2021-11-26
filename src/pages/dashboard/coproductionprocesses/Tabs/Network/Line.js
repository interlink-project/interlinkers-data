import React from 'react';
import { colorSwitch, familyMatchChecker } from './helpers';
import { useSelector } from 'react-redux';


const Line = ({ link, graph, ...restProps }) => {
    let familyMatch;
    const { network } = useSelector((state) => state.process);

    network.nodes.find(obj => {
        if ((obj.id === link.source || obj.id === link.source.id) && obj.family) {
            familyMatch = familyMatchChecker(obj.family);
        }
        return null
    });

    const stroke = colorSwitch(familyMatch);

    return (
        <line
            {...restProps}
            stroke={stroke}
        />
    )
};

export default Line;