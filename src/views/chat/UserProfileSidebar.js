// @packages
import Avatar from '@components/avatar';

// @scripts
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { X, Mail } from 'react-feather';

const UserProfileSidebar = ({
  handleUserSidebarRight,
  user,
  userSidebarRight
}) => {
  return (
    <div className={classnames('user-profile-sidebar', { show: userSidebarRight === true })}>
      <header className='user-profile-header'>
        <span className='close-icon' onClick={handleUserSidebarRight}>
          <X size={14} />
        </span>
        <div className='header-profile-sidebar'>
          <Avatar
            className='box-shadow-1 avatar-border'
            size='xl'
            status={user.status}
            img={user.avatar}
            imgHeight='70'
            imgWidth='70'
          />
          <h4 className='chat-user-name'>{user.fullName}</h4>
          <span className='user-post'>{user.role}</span>
        </div>
      </header>
      <PerfectScrollbar className='user-profile-sidebar-area' options={{ wheelPropagation: false }}>
        <h6 className='section-label mb-1'>About</h6>
        <p>{user.about}</p>
        <div className='personal-info'>
          <h6 className='section-label mb-1 mt-3'>Personal Information</h6>
          <ul className='list-unstyled'>
            <li className='mb-1'>
              <Mail className='mr-50' size={17} />
              <span className='align-middle'>lucifer@email.com</span>
            </li>
          </ul>
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default UserProfileSidebar;
