import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import IntlMessages from '../../@jumbo/utils/IntlMessages';
import Button from '@material-ui/core/Button';
import { Box, Collapse, IconButton } from '@material-ui/core';
import { alpha, makeStyles } from '@material-ui/core/styles';
import CmtImage from '../../@coremat/CmtImage';
import Typography from '@material-ui/core/Typography';
import AuthWrapper from './AuthWrapper';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import Link from 'next/link';
import Router from 'next/router';
import { forgotPassword } from '../apis/auth';
import { useMutation } from 'react-query';
import { NotificationLoader } from '../../@jumbo/components/ContentLoader';
import LanguageSwitcher from '../../@jumbo/components/AppLayout/partials/LanguageSwitcher';
import { useIntl } from 'react-intl';

const switchData = {
  login: <IntlMessages id={'login'} />,
  signUp: <IntlMessages id={'signUp'} />,
  forgotPassword: <IntlMessages id={'forgotPassword'} />,
  resetPassword: <IntlMessages id={'resetPassword'} />,
  thisIsPrimaryAlertCheckItOut: <IntlMessages id={'thisIsPrimaryAlertCheckItOut'} />,
  signIn: <IntlMessages id={'signIn'} />,
  backToLogin: <IntlMessages id={'backToLogin'} />,
};

const useStyles = makeStyles((theme) => ({
  authThumb: {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 20,
    [theme.breakpoints.up('md')]: {
      width: '50%',
      order: 2,
    },
  },
  authContent: {
    padding: 30,
    [theme.breakpoints.up('md')]: {
      order: 1,
      width: (props) => (props.variant === 'default' ? '50%' : '100%'),
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
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.common.dark, 0.12),
    },
  },
  alertRoot: {
    marginBottom: 10,
  },
}));

const ForgotPassword = ({ variant = 'default', wrapperVariant = 'default' }) => {
  const classes = useStyles({ variant });
  const { locale } = useIntl();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = useState('');

  const onSubmit = () => {
    mutateAsync({ email });
  };

  const { mutateAsync, isSuccess, isError, isLoading, data, error } = useMutation(forgotPassword);
  console.log('forgot res', data);

  useEffect(() => {
    if (data && data.success) {
      setOpen(true);
      setTimeout(() => {
        Router.push(`/reset-password/${data.data}`);
      }, 2000);
    }
  }, [isSuccess, data]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 30, paddingTop: 10 }}>
        <LanguageSwitcher />
      </div>
      <AuthWrapper variant={wrapperVariant}>
        {variant === 'default' ? (
          <Box className={classes.authThumb}>
            <CmtImage
              src={`/images/auth/loginNew-${locale}.jpeg`}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
          </Box>
        ) : null}
        <Box className={classes.authContent}>
          <Box mb={7}>
            <CmtImage style={{ height: 100, width: 200 }} src={`/images/logos/${locale}.png`} />
          </Box>
          <Typography component="div" variant="h1" className={classes.titleRoot}>
            {switchData.forgotPassword}
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
                label={<IntlMessages id="appModule.email" />}
                fullWidth
                onChange={(event) => setEmail(event.target.value)}
                defaultValue={email}
                margin="normal"
                variant="outlined"
                className={classes.textFieldRoot}
              />
            </Box>
            <Box mb={5}>
              <Button onClick={onSubmit} variant="contained" color="primary" style={{ margin: 5 }}>
                {/* <IntlMessages id="appModule.resetPassword" /> */}
                {switchData.resetPassword}
              </Button>
              <Link href={'/'}>
                <Button variant="contained" color="secondary">
                  {/* <IntlMessages id="appModule.resetPassword" /> */}
                  {switchData.backToLogin}
                </Button>
              </Link>
            </Box>
            <NotificationLoader
              message={data?.success && data?.msg}
              loading={isLoading}
              error={!data?.success && JSON.stringify(data?.errors)}
            />
          </form>
        </Box>
      </AuthWrapper>
    </>
  );
};

export default ForgotPassword;
