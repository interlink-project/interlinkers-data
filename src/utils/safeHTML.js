var html = require('react-escape-html');

export const HTMLtoText = (str) => str.replace(/<[^>]+>/g, '');

export const SafeHTMLElement = ({ data }) => data ? <div dangerouslySetInnerHTML={html(data.split())} /> : <></>;
