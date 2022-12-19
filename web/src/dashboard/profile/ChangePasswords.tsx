import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Paper, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { changePassword } from '../../apis/auth/index';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import Router from 'next/router';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
const switchData = {
  changePassword: <IntlMessages id={'changePassword'} />,
  currentPassword: <IntlMessages id={'currentPassword'} />,
  confirmPassword: <IntlMessages id={'confirmPassword'} />,
  newPassword: <IntlMessages id={'newPassword'} />,
  resetPassword: <IntlMessages id={'resetPassword'} />,
  cancel: <IntlMessages id={'cancel'} />,
};


const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  informationContainer: {
    width: 800,
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: 20,
    },
  },
  pDiv: {
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 5,
    },
  },
  pTextBox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
}));

export default function ChangePassword() {
  const classes = useStyles();
  const [formValue, changeFormValue] = useState({} as any);
  const [localError, setError] = useState('');
  const UpdateFormValue = (key: string, value: any) => {
    changeFormValue({ ...formValue, [key]: value });
  };

  const { mutateAsync: changePasswordMutation, isSuccess, isError, error, isLoading, data } = useMutation(changePassword);

  const changePasswordHandlerCalled = () => {
    console.log('FORM VALUE', formValue);
    if (formValue.confirm_password === formValue.new_password) {
      changePasswordMutation(formValue);
    } else {
      setError('Password mismatched');
    }
  };

  useEffect(() => {
    if (data && data.success) {
      setTimeout(() => {
        Router.push('/');
      }, 2000);
    }
  }, [isSuccess, data]);

  return (
    <div className={classes.paperContainer}>
      <Paper className={classes.informationContainer} elevation={5}>
        <Typography gutterBottom variant="h2">
         {switchData.changePassword}
        </Typography>
        <form onSubmit={(e)=>e.preventDefault()}>
        <Box className={classes.pTextBox}>
          <p className={classes.pDiv}>{switchData.currentPassword} :</p>
          <TextField
            onChange={(e) => UpdateFormValue('password', e.target.value)}
            variant="standard"
            size="small"
            type="password"
            required
            placeholder="Enter Current Password"
          />
        </Box>
        <Box className={classes.pTextBox}>
          <p className={classes.pDiv}>{switchData.newPassword} :</p>
          <TextField
            onChange={(e) => UpdateFormValue('new_password', e.target.value)}
            variant="standard"
            size="small"
            type="password"
            required
            placeholder="Enter New Password"
          />
        </Box>
        <Box className={classes.pTextBox}>
          <p className={classes.pDiv}>{switchData.confirmPassword} :</p>
          <TextField
            onChange={(e) => UpdateFormValue('confirm_password', e.target.value)}
            variant="standard"
            size="small"
            type="password"
            required
            placeholder="Confirm Password"
          />
        </Box>

        <div style={{ marginTop: 40 }}>
          <Button
            onClick={changePasswordHandlerCalled}
            variant="contained"
            type='submit'
            style={{ marginRight: 5, background: '#4caf50', color: '#ffffff' }}>
            {switchData.resetPassword}
          </Button>

          <Link href="/dashboard/profile">
            <Button variant="contained" color="secondary">
             {switchData.cancel}
            </Button>
          </Link>
        </div>
        </form>
        <NotificationLoader
          message={data?.success && data?.data}
          loading={isLoading}
          error={JSON.stringify(data?.errors) || localError}
        />
      </Paper>
    </div>
  );
}
