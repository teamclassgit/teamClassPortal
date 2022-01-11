// @packages
import React from 'react';
import Proptypes from 'prop-types';
import Avatar from '@components/avatar';
import { Link } from 'react-router-dom';
import { Power } from 'react-feather';
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';

// @scripts
import { logoutUser } from '../../../../utility/RealmApolloClient';

const UserDropdown = ({ userData }) => {
  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle href="/" tag="a" className="nav-link dropdown-user-link" onClick={(e) => e.preventDefault()}>
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name font-weight-bold">{(userData && userData.customData && userData.customData['name']) || 'Unknown'}</span>
          <span className="user-status">{(userData && userData.customData && userData.customData['role']) || ''}</span>
        </div>
        <Avatar color={`light-dark`} content={(userData && userData.customData && userData.customData['name']) || 'Unknown'} initials />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to="/login" onClick={() => logoutUser()}>
          <Power size={14} className="mr-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

UserDropdown.Proptypes = {
  userData: Proptypes.object
};

export default UserDropdown;
