import { AcUnit, Check, Loop } from '@material-ui/icons';
import {
    Chip,
    IconButton
} from '@material-ui/core';

export const InProgressIcon = () => <Loop fontSize="small" sx={{ color: "#f0ad4e" }} />

export const FinishedIcon = () => <Check fontSize="small" sx={{ color: "#22bb33" }} />

export const InProgressIconButton = ({ onClick }) => <IconButton size="small" onClick={onClick}>
    <InProgressIcon />
</IconButton>

export const FinishedIconButton = ({ onClick }) => <IconButton size="small" onClick={onClick}>
    <FinishedIcon />
</IconButton>


export const statusText = (status) => status === "finished" ? "Finished" : status === "in_progress" ? "In progress" : "Awaiting"

export const statusIcon = (status) => status === "finished" ? <FinishedIcon /> : status === "in_progress" && <InProgressIcon />


export const OfficialityChip = ({ officiality = "official" }) => {
    let label = ""
    let color = ""
    switch (officiality) {
        case 'official':
            label = "Official"
            color = "success"
            break;

        case 'community':
            label = "Community"
            color = "warning"
            break;
    }

    return <Chip label={label} color={color} size="small" />
}


export const NatureChip = ({ interlinker }) => {
    let label = ""
    let color = ""
    if (interlinker.nature === 'softwareinterlinker') {
        label = "Integrated software"
        color = "primary"

    } else if (interlinker.nature === 'knowledgeinterlinker') {
        label = "Integrated knowledge"
        color = "secondary"
    }
    else if (interlinker.nature === 'externalsoftwareinterlinker') {
        label = "External software"
        color = "success"
    }
    else if (interlinker.nature === 'externalknowledgeinterlinker') {
        label = "External knowledge"
        color = "warning"
    }

    return <Chip label={label} color={color} size="small" />
}
