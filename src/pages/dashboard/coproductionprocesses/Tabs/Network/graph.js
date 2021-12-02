import { getImageUrl } from "axiosInstance";

const generateGraph = (process) => {
    const initNodes = [
        {
            "id": "main",
            "family": "main",
            "img": getImageUrl("coproduction", process.logotype) || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Leo_Tolstoy%2C_portrait.jpg/1200px-Leo_Tolstoy%2C_portrait.jpg",
            "name": process.name
        },
        {
            "id": "main2",
            "family": "stakeholder",
            "name": "Stakeholders",
            "img": "",
        },
        {
            "id": "main3",
            "family": "working",
            "name": "Working team",
            "img": "",
        },
        {
            "id": process.team_id,
            "family": "working",
            "name": "process.team.name",
            "img": getImageUrl("users", "process.team.logotype"),
        },
    ]

    const initLinks = [
        {
            "source": "main",
            "target": "main2",
        },
        {
            "source": "main",
            "target": "main3",
        },
        {
            "source": "main3",
            "target": process.team_id,
        },

    ]
    const otherNodes = []
    const otherLinks = []
    /*
    process.team.memberships.forEach(membership => {
        otherNodes.push({
            "id": membership.id,
            "family": "working",
            "name": membership.user.given_name,
            "img": membership.user.picture,
        })
        otherLinks.push({
            "source": process.team_id,
            "target": membership.id,
        })
    });
    */

    return {
        "nodes": [...initNodes, ...otherNodes],
        "links": [...initLinks, ...otherLinks]
    };
}
export default generateGraph;