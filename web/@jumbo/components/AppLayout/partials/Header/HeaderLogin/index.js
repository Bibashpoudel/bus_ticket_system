import React from 'react';
import { Box, Button, Divider } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import { makeStyles } from '@material-ui/styles';

// Language Switching data========
const switchData = {
  login: <IntlMessages id={'login'} />,
  signUp: <IntlMessages id={'signUp'} />,
  password: <IntlMessages id={'password'} />,
  thisIsPrimaryAlertCheckItOut: <IntlMessages id={'thisIsPrimaryAlertCheckItOut'} />,
  signIn: <IntlMessages id={'signIn'} />,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  loginSection: {
    display: 'flex',
    alignItems: 'center',
    '& > .MuiDivider-root': {
      height: 14,
      marginLeft: 8,
      marginRight: 8,
      backgroundColor: theme.palette.text.secondary,
    },
  },
}));

const HeaderLogin = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box display="flex" alignItems="center" color="warning.main">
        <CachedIcon fontSize="small" />
        <div className="ml-3">{switchData.thisIsPrimaryAlertCheckItOut}</div>
      </Box>
      <div className={classes.loginSection}>
        <Button className="Cmt-btn" size="small">
          {switchData.login}
        </Button>
        <Divider className="Cmt-divider" orientation="vertical" />
        <Button className="Cmt-btn" size="small">
          {switchData.signUp}
        </Button>
      </div>
    </div>
  );
};

export default HeaderLogin;
