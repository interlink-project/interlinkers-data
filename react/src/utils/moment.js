import moment from "moment";
import 'moment/src/locale/en-gb'
import 'moment/src/locale/es'
import 'moment/src/locale/lv'
import 'moment/src/locale/it'

export const getLocalizedDate = (language, date) => {
    moment.locale(language === "en" ? "en-gb" : language);
    return moment(date)
}