import moment from "moment";

export const getLocalizedDate = (language, date) => {
    moment.locale(language === "en" ? "en-gb" : language);
    return moment(date)
}