import { customizationPath } from "configuration";


const Logo = () => (
  <img
    alt='Components'
    src={`/static/pilots/${customizationPath}/logo-light.svg`}
    height='40px'
  />
);

export default Logo;
