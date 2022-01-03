// @packages
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Sun, Moon, Menu } from 'react-feather';
import { isUserLoggedIn } from '@utils';

// @scripts
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';
import tokenGenerator from '../../../../views/chat/token-generator'; 
import { getUserData } from '../../../../utility/Utils';

const NavbarUser = ({ skin, setSkin, setMenuVisibility }) => {
  const [userData, setUserData] = useState(null);
  const {identity, token} = tokenGenerator();

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(getUserData());
    }
  }, []);

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      localStorage.setItem('userData', identity);
      localStorage.setItem('password', identity);
      localStorage.setItem('token', token);
    }
    tokenGenerator();
  }, []);

  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />;
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />;
    }
  };

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
        <NotificationDropdown />
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
