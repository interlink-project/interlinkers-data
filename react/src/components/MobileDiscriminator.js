import {
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

const MobileDiscriminator = ({ defaultNode, onMobileNode }) => {
  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  if (onMobile) {
    return onMobileNode;
  }
  return defaultNode;
};

export default MobileDiscriminator;
