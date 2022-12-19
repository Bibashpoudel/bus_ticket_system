import React, { useContext } from 'react';
import FooterLogo from './FooterLogo';
import { Box, Button, makeStyles } from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
import AppContext from '../../contextProvider/AppContextProvider/AppContext';
import { THEME_TYPES } from '../../../constants/ThemeOptions';
import Link from 'next/link';
import IntlMessages from '../../../utils/IntlMessages';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRoot: {
    [theme.breakpoints.down('xs')]: {
      padding: '6px 12px',
      fontSize: 11,
    },
  },
}));

const Footer = (props) => {
  const classes = useStyles();
  const { themeType } = useContext(AppContext);
  const date = new Date();

  return (
    <Box className={classes.root} {...props}>
      <Box display="flex" alignItems="center">
        {/* <Hidden xsDown><FooterLogo mr={5} color={themeType === THEME_TYPES.DARK ? 'white' : ''} /></Hidden> */}
        <Box fontSize={{ xs: 12, sm: 14 }} component="p" color="text.disabled">
          {/* <IntlMessages id="reservedDate" /> */}
          {`© ${date.getFullYear()} `}
          <a target="#" href="https://waliatechnologies.net/">
            <IntlMessages id="copyRights" />
          </a>
          <IntlMessages id="reservedRights" />|
          <a target="#" href="https://mengedegna.com/terms-and-conditions">
            <IntlMessages id="termsAndConditions" />
          </a>
          |
          <a target="#" href="https://mengedegna.com/privacy-policy">
            <IntlMessages id="privacyPolicy" />
          </a>
        </Box>
      </Box>
      {/* <Box display="flex" alignItems="center">
        <Hidden xsDown>
          <Box component="span" fontSize={16} fontWeight={700} color="primary.main" mr={5}>
            $24 Only
          </Box>
        </Hidden>
        <Button
          className={classes.btnRoot}
          color="primary"
          variant="contained"
          href="https://themeforest.net/item/react-material-bootstrap-4-admin-template/20978545"
          target="_blank"
        >
          Buy Now
        </Button>
      </Box> */}
    </Box>
  );
};

export default Footer;
