import { useEffect, useState } from 'react';
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Skeleton,
    Button,
    Typography
} from '@material-ui/core';
import axiosInstance from 'axiosInstance';

const RepresentationItem = ({ representation, checked, onCheck }) => {
    const labelId = `checkbox-for-${representation.id}`;
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    const updateData = async () => {
        const res = await axiosInstance.get(representation.link)
        setData(res.data)
        setLoading(false)
    }
    useEffect(() => {
        updateData()
    }, [])

    return !loading ? <ListItem
        button
        selected={checked}
        key={representation.id}
        onClick={onCheck(representation.id)}
    >
        <ListItemAvatar>
            <Avatar
                alt={`Avatar n°${representation.id}`}
                src={data.icon}
            />
        </ListItemAvatar>
        <ListItemText id={labelId} primary={data.name} secondary={data.interlinker_name} />
        <ListItemSecondaryAction>
        </ListItemSecondaryAction>
    </ListItem> : <Skeleton animation="wave" height={60} />
}


export default function RepresentationsList({ representations, onAssetCreate, onFinish }) {
    const [checkedRepresentations, setCheckedRepresentations] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleToggle = (value) => () => {
        const currentIndex = checkedRepresentations.indexOf(value);
        const newChecked = [...checkedRepresentations];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedRepresentations(newChecked);
    };

    const clone = () => {
        setLoading(true)
        const results = []
        const sendResults = () => {
            onFinish(results)
            setLoading(false)
        }
        checkedRepresentations.forEach(async (repr_id, i) => {
            const representation = representations.find(el => el.id === repr_id)
            let interlinker_response = await axiosInstance.post(representation.link + "/clone")
            const coproduction_response = await onAssetCreate(interlinker_response.data, representation.softwareinterlinker_id)
            interlinker_response = await axiosInstance.get(coproduction_response.link)
            results.push(interlinker_response.data)
            if (i === checkedRepresentations.length - 1) {
                sendResults()
            }
        });

    }

    return <>
        <Typography sx={{textAlign: "center"}} variant="h5">Possible representations for this interlinker</Typography>
        <List dense sx={{ mt:2, width: '100%', bgcolor: 'background.paper' }}>
            {representations.map(representation => <RepresentationItem key={representation.id} representation={representation} checked={checkedRepresentations.indexOf(representation.id) !== -1} onCheck={handleToggle} />)}
        </List>
        <Button disabled={loading || checkedRepresentations.length === 0} sx={{ mt: 2 }} fullWidth variant="contained" onClick={() => clone()}>Clone</Button>
    </>
}