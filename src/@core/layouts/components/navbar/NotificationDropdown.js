// @packages
import Avatar from '@components/avatar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { Bell } from 'react-feather';
import React from 'react';
import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  UncontrolledDropdown
} from 'reactstrap';

const NotificationDropdown = ({
  filterData
}) => {
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {filterData.map((item, index) => {
          return (
            <a key={index} className='d-flex' href='/' onClick={e => e.preventDefault()}>
              <Media
                className={classnames('d-flex', {
                  'align-items-start': !item.switch,
                  'align-items-center': item.switch
                })}
              >
                <>
                  <Media left>
                    <Avatar
                      {...(item.img
                        ? { img: item.img, imgHeight: 32, imgWidth: 32 }
                        : item.avatarContent
                        ? {
                            content: item.avatarContent,
                            color: item.color
                          }
                        : item.avatarIcon
                        ? {
                            icon: item.avatarIcon,
                            color: item.color
                          }
                        : null)}
                    />
                  </Media>
                  <Media body>
                    <span>{item.fromName}</span>
                    <Media tag='p' heading>
                      <span className='font-weight-bolder'>{item.message}</span>&nbsp;
                    </Media>
                  </Media>
                </>
              </Media>
            </a>
          )
        })}
      </PerfectScrollbar>
    )
  }

  return (
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item mr-25'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={e => e.preventDefault()}>
        <Bell size={21} />
        {filterData.length > 0 && (
          <Badge pill color='danger' className='badge-up'>
            {filterData.length}
          </Badge>
        )}
      </DropdownToggle>
      <DropdownMenu tag='ul' right className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 mr-auto'>Notifications</h4>
            {filterData.length > 0 && (
              <Badge tag='div' color='light-primary' pill>
                {`${filterData.length} New`}
              </Badge>
            )}
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        <li className='dropdown-menu-footer'>
          <Button.Ripple color='primary' block>
            Read all notifications
          </Button.Ripple>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default NotificationDropdown;
