import {
    Chip,
    IconButton
} from '@material-ui/core';
import { AccessTime, Check, Done, Loop } from '@material-ui/icons';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import i18n from 'translations/i18n';

export const InProgressIcon = () => <Loop fontSize="small" sx={{ color: statusColor("in_progress") }} />

export const FinishedIcon = () => <Check fontSize="small" sx={{ color: statusColor("finished") }} />

export const AwaitingIcon = () => <AccessTime fontSize="small" sx={{ color: statusColor("awaiting") }} />

export const DoneIcon = () => <Done fontSize="small" sx={{ color: "#4caf50" }} />

export const InProgressIconButton = ({ onClick }) => <IconButton size="small" onClick={onClick}>
    <InProgressIcon />
</IconButton>

export const FinishedIconButton = ({ onClick }) => <IconButton size="small" onClick={onClick}>
    <FinishedIcon />
</IconButton>


export const StatusText = ({ status, language = null }) => {
    const t = useCustomTranslation(language)
    return <>{status === "finished" ? t("Finished") : status === "in_progress" ? t("In progress") : t("Awaiting")}</>
}

export const statusIcon = (status) => status === "finished" ? <FinishedIcon /> : status === "in_progress" ? <InProgressIcon /> : <AwaitingIcon />

export const statusColor = (status) => status === "finished" ? "#22bb33" : status === "in_progress" ? "#f0ad4e" : "#Oda2ff"


export const OfficialityChip = ({ officiality = "official" }) => {
    let label = ""
    let color = ""
    switch (officiality) {
        case 'official':
            label = i18n.t("Official")
            color = "success"
            break;

        case 'community':
            label = i18n.t("Community")
            color = "warning"
            break;
    }

    return <Chip label={label} color={color} size="small" />
}


export const StatusChip = ({ status }) => {
    let label = i18n.t("Awaiting")
    let color = "primary"
    switch (status) {
        case 'awaiting':
            label = i18n.t("Awaiting")
            color = "light"
            break;

        case 'in_progress':
            label = i18n.t("In progress")
            color = "warning"
            break;
        
        case 'finished':
            label = i18n.t("Finished")
            color = "primary"
            break;
    }

    return <Chip label={label} color={color} size="small" />
}


export const OrganizationChip = ({ type }) => {
    let label = ""
    let color = ""
    switch (type) {
        case 'citizen':
            label = i18n.t("Citizens")
            color = "success"
            break;

        case 'public_office':
            label = i18n.t("Public office")
            color = "warning"
            break;
        
        case 'nonprofit_organization':
            label = i18n.t("Non profit organization")
            color = "primary"
            break;

        case 'forprofit_organization':
            label = i18n.t("For profit organization")
            color = "secondary"
            break;
    }

    return <Chip label={label} color={color} size="small" />
}

export const NatureChip = ({ interlinker, language = null }) => {
    const t = useCustomTranslation(language)
    let label = ""
    let color = ""
    if (interlinker.nature === 'softwareinterlinker') {
        label = t("Internal software")
        color = "primary"

    } else if (interlinker.nature === 'knowledgeinterlinker') {
        label = t("Internal knowledge")
        color = "secondary"
    }
    else if (interlinker.nature === 'externalsoftwareinterlinker') {
        label = t("External software")
        color = "success"
    }
    else if (interlinker.nature === 'externalknowledgeinterlinker') {
        label = t("External knowledge")
        color = "warning"
    }

    return <Chip label={label} color={color} size="small" />
}
