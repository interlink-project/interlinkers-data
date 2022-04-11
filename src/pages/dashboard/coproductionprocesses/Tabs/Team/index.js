import { CircularProgress, Typography } from '@material-ui/core';
import useMounted from 'hooks/useMounted';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from 'slices/process';
import PermissionsTable from './PermissionsTable';
import TeamsTable from './TeamsTable';

export default function TeamsTab() {
    const { process, updating } = useSelector((state) => state.process);
    const dispatch = useDispatch();
    const mounted = useMounted();
    const { t } = useTranslation()

    const init = React.useCallback(async () => {
        try {

            if (process && mounted.current) {
                dispatch(getRoles(process.id))
            }
        } catch (err) {
            console.error(err);
        }
    }, [mounted]);

    React.useEffect(() => {
        init();
    }, [init]);

    // <TeamsTable onChanges={updateAcl} />
    // <Divider sx={{ my: 2 }} />
    return !updating ? (
        <React.Fragment>
            <Typography variant="h5" sx={{ mb: 2 }}>
            {t("permissions-title")}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {t("permissions-subtitle")}
            </Typography>
            <TeamsTable onChanges={init} />
            <Typography variant="h5" sx={{ my: 2 }}>
                {t("Roles")}
            </Typography>
            <PermissionsTable onChanges={init} />
        </React.Fragment>) : <CircularProgress />
}