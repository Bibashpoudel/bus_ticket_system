import React, { useEffect, useRef, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import IntlMessages from '../../@jumbo/utils/IntlMessages';
import Button from '@material-ui/core/Button';
import { Box } from '@material-ui/core';
import { alpha, makeStyles } from '@material-ui/core/styles';
import CmtImage from '../../@coremat/CmtImage';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import AuthWrapper from './AuthWrapper';
import { NotificationLoader } from '../../@jumbo/components/ContentLoader';
import { useMutation } from 'react-query';
import { authenticateUser } from '../apis/auth';
import Router from 'next/router';
import { useCookies } from 'react-cookie';
import CmtFooter from '../../@coremat/CmtLayouts/Vertical/Footer';
import Footer from '../../@jumbo/components/AppLayout/partials/Footer';
import FooterLogo from '../../@jumbo/components/AppLayout/partials/FooterLogo';
import Logo from '../../@jumbo/components/AppLayout/partials/Logo';
import LanguageSwitcher from '../../@jumbo/components/AppLayout/partials/LanguageSwitcher';

// Language Switching data========
const switchData = {
  login: <IntlMessages id={'login'} />,
  email: <IntlMessages id={'email'} />,
  password: <IntlMessages id={'password'} />,
  forgotPassword: <IntlMessages id={'forgotPassword'} />,
  signIn: <IntlMessages id={'signIn'} />,
};

const useStyles = makeStyles((theme) => ({
  authThumb: {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50%',
      order: 2,
    },
  },
  authContent: {
    padding: 30,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: (props) => (props.variant === 'default' ? '50%' : '100%'),
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
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.common.dark, 0.12),
    },
  },

  formcontrolLabelRoot: {
    '& .MuiFormControlLabel-label': {
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
      },
    },
  },
}));

const SignIn = ({ variant = 'default', wrapperVariant = 'default' }) => {
  const classes = useStyles({ variant });


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberCheck, updateRemember] = useState(false);
  const [cookie, setCookie] = useCookies();
  const { locale } = useIntl();



  const {
    mutateAsync: mutateAsynclogin,
    isSuccess: isLoginSuccess,
    isError: isLoginError,
    error: loginError,
    isLoading,
    data: loginRes,
  } = useMutation(authenticateUser);

  const onSubmit = () => {
    mutateAsynclogin({ email, password });
  };

  const storeAndRoute = async (loginRes) => {
    await sessionStorage.setItem('user', JSON.stringify(loginRes.token));
    Router.push(`/dashboard/`);
  };

  useEffect(() => {
    if (isLoginSuccess && loginRes && loginRes.success) {
      const cookieData = {
        userId: loginRes.userId,
        role: loginRes.role,
        displayName: loginRes.displayName,
        token: loginRes.message,
      };
      if (rememberCheck) {
        setCookie('user', JSON.stringify(cookieData), {
          path: '/',
          maxAge: 3600, // Expires after 1hr
          sameSite: true,
        });
      } else {
        storeAndRoute(loginRes);
      }
    }
  }, [isLoginSuccess, loginRes]);

  const onKeyDownHandler = e => {
    if (e.keyCode === 13) {
      onSubmit()
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 30, paddingTop: 10 }}>
        {/* @ts-ignore */}
        <LanguageSwitcher />
      </div>
      <AuthWrapper variant={wrapperVariant}>
        {variant === 'default' ? (
          <div className={classes.authThumb} style={{ padding: 0 }}>
            <img
              alt={'test'}
              src={`/images/auth/loginNew-${locale}.jpeg`}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : null}
        <div className={classes.authContent}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', background: '' }}>
            <img style={{ height: 100, width: 200 }} src={`/images/logos/${locale}.png`} />
          </div>

          <Typography component="div" variant="h1" className={classes.titleRoot}>
            {switchData.login}
          </Typography>
          <form onKeyDown={onKeyDownHandler}>
            <Box mb={2}>
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
            <Box mb={2}>
              <TextField
                type="password"
                label={<IntlMessages id="appModule.password" />}
                fullWidth
                onChange={(event) => setPassword(event.target.value)}
                defaultValue={password}
                margin="normal"
                variant="outlined"
                className={classes.textFieldRoot}
              />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={5}>
              <Box component="p" fontSize={{ xs: 12, sm: 16 }}>
                <Link href="/forgot-password">
                  <a>
                    <IntlMessages id="forgotPassword" />
                  </a>
                </Link>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={5}>
              <Button onClick={onSubmit} variant="contained" color="primary"  >
                <IntlMessages id="signIn" />
              </Button>
            </Box>
          </form>

          <NotificationLoader
            message={loginRes?.success && loginRes?.msg}
            loading={isLoading}
            error={JSON.stringify(loginRes?.errors)}
          />
        </div>
      </AuthWrapper>
      <Footer style={{ marginRight: 10 }} />
    </>
  );
};

export default SignIn;
