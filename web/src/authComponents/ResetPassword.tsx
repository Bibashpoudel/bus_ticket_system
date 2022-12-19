import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Box, Collapse, IconButton } from '@material-ui/core';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AuthWrapper from './AuthWrapper';
import { useRouter } from 'next/router';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import Link from 'next/link';
import IntlMessages from '../../@jumbo/utils/IntlMessages';
import { NotificationLoader } from '../../@jumbo/components/ContentLoader';
import CmtImage from '../../@coremat/CmtImage';
import { resetPassword, verifyOtp } from '../apis/auth';
import { useMutation } from 'react-query';
import Router from 'next/router';

const useStyles = makeStyles((theme) => ({
  authThumb: {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    [theme.breakpoints.up('md')]: {
      width: '50%',
      order: 2,
    },
  },
  authContent: {
    padding: 30,
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
    [theme.breakpoints.up('xl')]: {
      padding: 50,
    },
  },
  titleRoot: {
    marginBottom: 14,
    color: theme.palette.text.primary,
  },
  textFieldRoot: {
    marginBottom: 15,
    '& .MuiOutlinedInput-notchedOutline': {},
  },
  alertRoot: {
    marginBottom: 10,
  },
}));

const ResetPassword = (props: any) => {
  const { params, variant } = props;
  console.log('params', params);
  const classes = useStyles({ variant });
  const [isOtpVerified, updateOptStatus] = useState(false);
  const [typeMismatchError, setMismatchError] = useState('');
  // const { isLoading, error, sendPasswordResetEmail } = {};
  const [open, setOpen] = React.useState(false);

  const [formValue, setFormValue] = useState({} as any);

  const updateFormValue = (key: string, value: any) => {
    setFormValue({ ...formValue, [key]: value });
  };

  console.log(formValue);

  const { mutateAsync, isSuccess, isError, isLoading, data, error } = useMutation(resetPassword);
  console.log('forgot res', data);

  useEffect(() => {
    if (data && data.success) {
      Router.push('/');
    }
  }, [isSuccess, data]);

  const {
    mutateAsync: verifyOtpMutation,
    isSuccess: isVerifyOptSuccess,
    isError: hasVerifyError,
    isLoading: isVerifyOptLoading,
    data: verifyOtpData,
    error: verifyOtpError,
  } = useMutation(verifyOtp);

  useEffect(() => {
    updateOptStatus(true);
  }, [isVerifyOptSuccess, verifyOtpData]);

  const resetClickHandler = () => {
    if (formValue.newpassword === formValue.confirmPassword) {
      mutateAsync({ user_id: params.user_id, password: formValue.newpassword, otp: formValue.otp });
    } else {
      setMismatchError('Password Mismatch.');
    }
  };

  useEffect(() => {
    if (data && data.success) {
      Router.push('/login');
    }
  }, [isSuccess, data]);

  return (
    <AuthWrapper variant={'default'}>
      {variant === 'default' ? (
        <Box className={classes.authThumb}>
          <CmtImage alt="" src={'/images/auth/forgot-img.png'} />
        </Box>
      ) : (
        <div />
      )}
      <Box className={classes.authContent}>
        <Box mb={7}>
          <CmtImage alt="" src={'/images/logo.png'} />
        </Box>

        <Typography component="div" variant="h1" className={classes.titleRoot}>
          Recover Your Password
        </Typography>
        <Collapse in={open}>
          <Alert
            variant="outlined"
            severity="success"
            className={classes.alertRoot}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }>
            A mail has been sent on your email address with reset password link.
          </Alert>
        </Collapse>
        <form>
          <Box mb={5}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Enter Your OTP"
              onChange={(e) => updateFormValue('otp', e.target.value)}
            />

            <>
              <TextField
                fullWidth
                onChange={(e) => updateFormValue('newpassword', e.target.value)}
                margin="normal"
                type="password"
                variant="outlined"
                placeholder="Enter New Password"
                className={classes.textFieldRoot}
              />
              <TextField
                variant="outlined"
                onChange={(e) => updateFormValue('confirmPassword', e.target.value)}
                fullWidth
                placeholder="Confirm Password"
                type="password"
                className={classes.textFieldRoot}
              />
            </>
          </Box>
          <Box mb={5}>
            <Button onClick={resetClickHandler} variant="contained" color="primary">
              <IntlMessages id="reset Password" />
            </Button>
          </Box>
        </form>
        <NotificationLoader
          message={data?.success && data?.msg}
          loading={isLoading || isVerifyOptLoading}
          error={(!data?.success && JSON.stringify(data?.errors)) || typeMismatchError}
        />
      </Box>
    </AuthWrapper>
  );
};

export default ResetPassword;
