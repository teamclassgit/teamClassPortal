// @packages
import Avatar from '@components/avatar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { X } from 'react-feather';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { 
  Button,
  CustomInput,
  Input
} from 'reactstrap';

// @scripts
import mutationUpdateAllUsers from '../../graphql/MutationUpdateAllUsers';

const SidebarInfo = ({
  handleUserSidebarLeft,
  userData,
  status,
  setStatus
}) => {
  const [about, setAbout] = useState('');
  const [updateAllUsers] = useMutation(mutationUpdateAllUsers, {});

  const allUsers = async () => {
    try {
      await updateAllUsers({
        variables: {
          description: about,
          email: userData.email,
          id: userData._id,
          name: userData.name,
          role: userData.role,
          status
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <>
      <header className='chat-profile-header'>
        <div className='close-icon' onClick={handleUserSidebarLeft}>
          <X size={14} />
        </div>
        <div className='header-profile-sidebar'>
          <Avatar
            size= 'xl'
            className='avatar-border'
            color={`light-dark`} 
            content={(userData && userData['name']) || 'Uknown'} 
            initials
            status={status}
          />
          <h4 className='chat-user-name'>{userData?.name}</h4>
          <span className='user-post'>{userData?.role}</span>
        </div>
      </header>
      <PerfectScrollbar className='profile-sidebar-area' options={{ wheelPropagation: false }}>
        <h6 className='section-label mb-1'>About</h6>
        <div className='about-user'>
          <Input
            rows='5'
            defaultValue={userData?.description}
            type='textarea'
            onChange={e => setAbout(e.target.value)}
            className={classnames('char-textarea', {
              'text-danger': about && about.length > 120
            })}
          />
          <small className='counter-value float-right'>
            <span className='char-count'>{userData?.description ? userData?.description?.length : 0}</span>/ 120
          </small>
        </div>
        <h6 className='section-label mb-1 mt-3'>Status</h6>
        <ul className='list-unstyled user-status'>
          <li className='pb-1'>
            <CustomInput
              type='radio'
              className='custom-control-primary'
              id='online'
              label='Online'
              onChange={e => setStatus('online')}
              checked={status === 'online'}
            />
          </li>
          <li className='pb-1'>
            <CustomInput
              type='radio'
              className='custom-control-danger'
              id='busy'
              label='Do Not Disturb'
              onChange={e => setStatus('busy')}
              checked={status === 'busy'}
            />
          </li>
          <li className='pb-1'>
            <CustomInput
              type='radio'
              className='custom-control-warning'
              id='away'
              label='Away'
              onChange={e => setStatus('away')}
              checked={status === 'away'}
            />
          </li>
          <li className='pb-1'>
            <CustomInput
              type='radio'
              className='custom-control-secondary'
              id='offline'
              label='Offline'
              onChange={e => setStatus('offline')}
              checked={status === 'offline'}
            />
          </li>
        </ul>
        <div className='mt-3'>
          <Button 
            disabled={
              about.length === userData?.description?.length || 
              status === userData?.status
            }
            color='primary' 
            onClick={allUsers}
          >
            Save
          </Button>
        </div>
      </PerfectScrollbar>
    </>
  );
};

export default SidebarInfo;