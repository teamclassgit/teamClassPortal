// @packages
import PropTypes from 'prop-types';
import { NavItem, NavLink } from 'reactstrap';
import { Sun, Moon, Menu } from 'react-feather';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';

// @scripts
import UserDropdown from './UserDropdown';
import NotificationDropdown from './NotificationDropdown';
import queryAllMessageInteraction from '../../../../graphql/QueryAllMessageInteraction';
import { getUserData } from '../../../../utility/Utils';
import { isUserLoggedIn } from '@utils';

const NavbarUser = ({ skin, setSkin, setMenuVisibility }) => {
  const [messageInfo, setMessageInfo] = useState([]);
  const [filter] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(getUserData());
    }
  }, []);

  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />;
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />;
    }
  };

  const { ...allMessageInteractionResults } = useQuery(queryAllMessageInteraction, {
    fetchPolicy: 'no-cache',
    variables: {
      filter
    },
    pollInterval: 5000
  });

  useEffect(() => {
    if (allMessageInteractionResults.data) {
      setMessageInfo(allMessageInteractionResults.data.messageInteractions.filter((message) => message.toId === userData?.customData?._id));
    }
  }, [allMessageInteractionResults.data]);

  return (
    <>
      <ul className='navbar-nav d-xl-none d-flex align-items-center'>
        <NavItem className='mobile-menu mr-auto'>
          <NavLink className='nav-menu-main menu-toggle hidden-xs is-active' onClick={() => setMenuVisibility(true)}>
            <Menu className='ficon' />
          </NavLink>
        </NavItem>
      </ul>
      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <ThemeToggler />
          </NavLink>
        </NavItem>
      </div>
      <ul className='nav navbar-nav align-items-center ml-auto'>
        <NotificationDropdown filterData={messageInfo} />
        <UserDropdown userData={userData} />
      </ul>
    </>
  );
};

export default NavbarUser;

NavbarUser.propTypes = {
  skin: PropTypes.string,
  setSkin: PropTypes.func,
  setMenuVisibility: PropTypes.func
};
