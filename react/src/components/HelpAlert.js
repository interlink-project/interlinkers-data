import { Alert, Zoom } from '@material-ui/core';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import useSettings from 'hooks/useSettings';
import { getLanguage } from 'translations/i18n';


const HelpAlert = ({ language = getLanguage(), text, sx = {mt: 1}, visible = true}) => {
    const { settings: { showHelp } } = useSettings();
    const t = useCustomTranslation(language)

    const show = showHelp && visible
    return show ? <Zoom in={show}><Alert sx={sx} severity="info">
        {text}
        <br />
        <small>{t("You can disable these messages in the settings wheel")}</small>
         </Alert></Zoom> : <></>
};

export default HelpAlert;
