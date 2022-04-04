import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';
import { List, ListSubheader } from '@material-ui/core';
import NavItem from './NavItem';

const renderNavItems = ({ depth = 0, items, pathname, onClick }) => (
  <List disablePadding>
    {items.reduce(
      // eslint-disable-next-line no-use-before-define
      (acc, item) => reduceChildRoutes({
        acc,
        item,
        pathname,
        depth,
        onClick
      }), []
    )}
  </List>
);

const reduceChildRoutes = ({ acc, pathname, item, depth }) => {
  const key = `${item.title}-${depth}`;
  const exactMatch = item.path ? !!matchPath({
    path: item.path,
    end: true
  }, pathname) : false;

  if (item.children) {
    const partialMatch = item.path ? !!matchPath({
      path: item.path,
      end: false
    }, pathname) : false;

    acc.push(
      <NavItem
        active={partialMatch}
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={partialMatch}
        onClick={item.onClick}
        path={item.path}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          items: item.children,
          pathname,
          onClick: item.onClick
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        active={exactMatch}
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        onClick={item.onClick}
        path={item.path}
        title={item.title}
      />
    );
  }

  return acc;
};

const NavSection = (props) => {
  const { items, pathname, title, onClick, ...other } = props;

  return (
    <List
      subheader={(
        <ListSubheader
          disableGutters
          disableSticky
          sx={{
            fontSize: '0.75rem',
            lineHeight: 2.5,
            fontWeight: 700,
            textTransform: 'uppercase'
          }}
        >
          {title}
        </ListSubheader>
      )}
      {...other}
    >
      {renderNavItems({
        items,
        pathname,
        onClick
      })}
    </List>
  );
};

NavSection.propTypes = {
  items: PropTypes.array,
  pathname: PropTypes.string,
  title: PropTypes.any
};

export default NavSection;
