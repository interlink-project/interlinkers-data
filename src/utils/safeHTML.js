var html = require('react-escape-html');

export const SafeHTMLElement = ({ data }) => <div dangerouslySetInnerHTML={html(data.split())} />;
