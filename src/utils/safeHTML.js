var html = require('react-escape-html');

export const SafeHTMLElement = ({ data }) => data ? <div dangerouslySetInnerHTML={html(data.split())} /> : <></>;
