
import { Canvas, Node, Edge, Port, MarkerArrow, Icon } from 'reaflow';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { Star } from '@material-ui/icons';
import { getImageUrl } from 'axiosInstance';

const Network = () => {
    const { process } = useSelector((state) => state.process);

    const nodes = []
    const edges = []

    nodes.push(
        {
            id: process.id,
            text: process.name,
            icon: {
                url: getImageUrl(process.logotype),
                height: 35,
                width: 35
            }
        }
    )
    nodes.push(
        {
            id: process.team.id,
            text: process.team.name,
            icon: {
                url: getImageUrl(process.team.logotype),
                height: 25,
                width: 25
            }
        }
    )
    edges.push(
        {
            id: `${process.id}-${process.team.id}`,
            from: process.id,
            to: process.team.id
        }
    )


    process.team.memberships.forEach(membership => {
        nodes.push(
            {
                id: membership.user.id,
                text: membership.user.given_name,
                icon: {
                    url: membership.user.picture,
                    height: 20,
                    width: 20
                }
            }
        )
        edges.push(
            {
                id: `${process.team.id}-${membership.user.id}`,
                from: process.team.id,
                to: membership.user.id
            }
        )
    });

    console.log(nodes, edges)
    return <div style={{ height: '85vh' }}>
        < Canvas
            pannable={false}
            direction="RIGHT"
            nodes={nodes}
            edges={edges}
            node={<Node icon={<Icon />} onClick={(e, nodeData) => console.log("node clicked", nodeData)} />}
        />
    </div>
}
export default Network