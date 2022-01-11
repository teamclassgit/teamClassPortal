// @packages
import Avatar from '@components/avatar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { X } from 'react-feather';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { 
  Button,
  CustomInput,
  Input
} from 'reactstrap';

// @scripts
import mutationUpdateAllUsers from '../../graphql/MutationUpdateAllUsers';

const SidebarInfo = ({
  handleUserSidebarLeft,
  setStatus,
  status,
  userData
}) => {
  const [about, setAbout] = useState('');
  const [updateAllUsers] = useMutation(mutationUpdateAllUsers, {});

  const allUsers = async () => {
    try {
      await updateAllUsers({
        variables: {
          description: about,
          email: userData?.email,
          id: userData?._id,
          name: userData?.name,
          role: userData?.role,
          status
        }
      });
      handleUserSidebarLeft();
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    setStatus(userData?.status);
  }, [userData?.status]);

  return (
    <>
      <header className='chat-profile-header'>
        <div className='close-icon' onClick={handleUserSidebarLeft}>
          <X size={14} />
        </div>
        <div className='header-profile-sidebar'>
          <Avatar
            className='avatar-border'
            color={`light-dark`} 
            content={(userData && userData['name']) || 'Uknown'} 
            initials
            size= 'xl'
            status={status}
          />
          <h4 className='chat-user-name'>{userData?.name}</h4>
          <span className='user-post'>{userData?.role}</span>
        </div>
      </header>
      <PerfectScrollbar className='profile-sidebar-area' options={{ wheelPropagation: true }}>
        <h6 className='section-label mb-1'>About</h6>
        <div className='about-user'>
          <Input
            className={classnames('char-textarea', {
              'text-danger': about && about.length > 120
            })}
            defaultValue={userData?.description}
            onChange={e => setAbout(e.target.value)}
            rows='5'
            type='textarea'
          />
          <small className='counter-value float-right'>
            <span className='char-count'>{userData?.description ? userData?.description?.length : 0}</span>/ 120
          </small>
        </div>
        <h6 className='section-label mb-1 mt-3'>Status</h6>
        <ul className='list-unstyled user-status'>
          <li className='pb-1'>
            <CustomInput
              checked={status === 'online'}
              className='custom-control-success'
              id='online'
              label='Online'
              onChange={() => setStatus('online')}
              type='radio'
            />
          </li>
          <li className='pb-1'>
            <CustomInput
              checked={status === 'busy'}
              className='custom-control-danger'
              id='busy'
              label='Do Not Disturb'
              onChange={() => setStatus('busy')}
              type='radio'
            />
          </li>
          <li className='pb-1'>
            <CustomInput
              checked={status === 'away'}
              className='custom-control-warning'
              id='away'
              label='Away'
              onChange={() => setStatus('away')}
              type='radio'
            />
          </li>
          <li className='pb-1'>
            <CustomInput
              checked={status === 'offline'}
              className='custom-control-secondary'
              id='offline'
              label='Offline'
              onChange={() => setStatus('offline')}
              type='radio'
            />
          </li>
        </ul>
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '1rem'
          }}
        >
          <Button 
            disabled={
              about?.length === userData?.description?.length && 
              status === userData?.status
            }
            color='primary' 
            onClick={allUsers}
          >
            Save
          </Button>
          <Button 
            onClick={handleUserSidebarLeft}
            color='primary'
          >
            Cancel
          </Button>
        </div>
      </PerfectScrollbar>
    </>
  );
};

export default SidebarInfo;