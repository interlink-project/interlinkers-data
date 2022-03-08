import { AcUnit, Check, Loop } from '@material-ui/icons';
import {
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