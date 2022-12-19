import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import IntlMessages from '../../../../utils/IntlMessages';

import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { Avatar, Divider } from '@material-ui/core';
import { logout } from '../../../../../src/apis/auth/';
import { useMutation } from 'react-query';
import Router from 'next/router';
import CircularProgress from '@material-ui/core/CircularProgress';


const switchData = {
  name: <IntlMessages id={'name'} />,
  logout: <IntlMessages id={'logout'} />,
  role: <IntlMessages id={'role'} />,
  thisIsPrimaryAlertCheckItOut: <IntlMessages id={'thisIsPrimaryAlertCheckItOut'} />,
  signIn: <IntlMessages id={'signIn'} />,
};

export default function PopoverPopupState() {
  const [userInfo, updateUserInfo] = useState({});

  const { mutateAsync, isError, error, isSuccess, data, isLoading } = useMutation(logout);
 

  const logoutHandler = () => {
    sessionStorage.clear();
    Router.push('/');
    mutateAsync();
  };

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    console.log('user', user);
    if (user) {
      const userObj = JSON.parse(user);
      updateUserInfo(userObj);
    }
  }, []);

  console.log('state user', userInfo);
  const { user, companyDetails } = userInfo;
  const name = companyDetails?.english ? companyDetails.english?.bus_name : user?.firstname;

  return (
    <div>
      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
          <div>
            <Avatar
              style={{ height: 35, width: 35, cursor: 'pointer' }}
              variant="contained"
              color="primary"
              {...bindTrigger(popupState)}>
              {userInfo.firstname && userInfo.firstname.split('')[0]}
            </Avatar>
            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}>
              <Box p={4}>
                <Typography gutterBottom>{switchData.name}: {name}</Typography>
                <Typography gutterBottom>{switchData.role}: {user?.role}</Typography>
              </Box>
              <Divider />

              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                {isLoading && <CircularProgress size={20} />}
                <Button
                  variant="contained"
                  color="primary"
                  size="full"
                  onClick={logoutHandler}
                  style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                 {switchData.logout}
                </Button>
              </Box>
            </Popover>
          </div>
        )}
      </PopupState>
    </div>
  );
}
