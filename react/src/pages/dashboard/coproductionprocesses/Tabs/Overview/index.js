import { Alert, Button, Collapse, Stack, Typography } from '@material-ui/core';
import { AccountTree, Add, Done, Edit } from '@material-ui/icons';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@material-ui/lab';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import moment from "moment";
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const DoneAlert = ({ t, date = null }) => {
    return <Alert sx={{ mt: 1 }} severity="success">{date ? t("Done on", { date: moment(date).fromNow() }) : t("Done")}</Alert>
}

const WarningAlert = ({ t, explanation }) => {
    return <Alert sx={{ mt: 1 }} severity="warning">{explanation}</Alert>
}

const TimeItem = ({ actions = null, title, subtitle, icon }) => <TimelineItem>
    <TimelineOppositeContent
        sx={{ m: 'auto 0', flex: 0 }}
    >
    </TimelineOppositeContent>
    <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot color="primary" variant="outlined">
            {icon}
        </TimelineDot>
        <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent sx={{ py: '12px', px: 2 }}>
        <Stack direction="column" spacing={1}>
            <Typography variant="h6" component="span">
                {title}
            </Typography>
            {subtitle}
            {actions}
        </Stack>

    </TimelineContent>
</TimelineItem>

export default function TimeLine({ expanded = false }) {
    const { process, hasSchema, phases } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language)
    const navigate = useNavigate();

    if (!process) {
        return
    }
    return (
        <Timeline position="right">
        <TimeItem
            title={t("Coproduction process creation")}
            subtitle={<DoneAlert t={t} date={process.created_at} />}
            icon={<Add />} />
        <TimeItem
            actions={false && <Button variant="outlined">{t("Go to settings section")}</Button>}
            title={t("Coproduction process settings")}
            subtitle={<DoneAlert t={t} />}
            icon={<Edit />} />
        <TimeItem
            actions={!hasSchema && <Button onClick={(value) => navigate(`/dashboard/coproductionprocesses/${process.id}/guide`)} variant="outlined">{t("Go to guide section")}</Button>}
            title={t("Schema selection")}
            subtitle={hasSchema ? <DoneAlert t={t} /> : <WarningAlert t={t} explanation={t("Schema has not been selected yet")} />}
            icon={<AccountTree />} />

        {phases.map((phase, i) => <TimeItem
            key={phase.id}
            actions={<Button onClick={(value) => navigate(`/dashboard/coproductionprocesses/${process.id}/guide`)} size="small" variant="outlined">{t("See phase in the guide")}</Button>}
            title={t("Complete", { what: phase.name })}
            subtitle={<>
                {phase.status === "finished" ? <DoneAlert t={t} /> : <WarningAlert t={t} explanation={t("Phase is not finished yet")} />}
                {phase.objectives.map(objective =>
                    <Collapse in={expanded} key={objective.id} timeout="auto" unmountOnExit>
                        <Timeline position="right">
                            <TimeItem title={objective.name} subtitle={objective.status} />
                        </Timeline>
                    </Collapse>)}
            </>}
            icon={<AccountTree />}
        />)}
        <TimeItem
            title={t("Mark process as finished")}
            subtitle={phases.length > 0 && phases.every(phase => phase.status === "finished") ? <DoneAlert t={t} /> : <WarningAlert t={t} explanation={t("All phases must be finished to mark the process as finished")} />}
            icon={<Done />} />
    </Timeline>);
}