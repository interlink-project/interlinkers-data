import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar, ListItemSecondaryAction, ListItemText, Skeleton, Typography
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import { representationsApi } from '__fakeApi__';

const RepresentationItem = ({ representation, checked, onCheck }) => {
    const labelId = `checkbox-for-${representation.id}`;
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    const updateData = async () => {
        representationsApi.getExternal(representation.id).then((res) => {
            setData(res)
            setLoading(false)
        }
        )
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
        <ListItemText id={labelId} primary={data.name} secondary={data.created_date} />
        <ListItemSecondaryAction>
        </ListItemSecondaryAction>
    </ListItem> : <Skeleton animation="wave" height={60} />
}


export default function RepresentationsList({ knowledgeinterlinker, onAssetCreate, onFinish }) {
    const [checkedRepresentations, setCheckedRepresentations] = useState([]);
    const [loading, setLoading] = useState(false);

    const {representations = []} = knowledgeinterlinker
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
            const interlinker_response = await representationsApi.clone(representation.id)
            const coproduction_response = await onAssetCreate(interlinker_response, representation.softwareinterlinker_id, knowledgeinterlinker.id)
            results.push({ ...coproduction_response, ...interlinker_response })
            if (i === checkedRepresentations.length - 1) {
                sendResults()
            }
        });

    }

    return <>
        <Typography sx={{ textAlign: "center" }} variant="h5">Possible representations for this interlinker</Typography>
        <List dense sx={{ mt: 2, width: '100%', bgcolor: 'background.paper' }}>
            {representations.map(representation => <RepresentationItem key={representation.id} representation={representation} checked={checkedRepresentations.indexOf(representation.id) !== -1} onCheck={handleToggle} />)}
        </List>
        <LoadingButton loading={loading} disabled={checkedRepresentations.length === 0} sx={{ mt: 2 }} fullWidth variant="contained" onClick={() => clone()}>Clone</LoadingButton>
    </>
}