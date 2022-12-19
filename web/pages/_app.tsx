import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { wrapper } from '../redux/store/index';
import AppWrapper from '../@jumbo/components/AppWrapper';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-notifications/lib/notifications.css';
import 'prismjs/themes/prism-okaidia.css';
import { IntlProvider } from 'react-intl';
import AppLocale from '../i18n';
import { MuiThemeProvider } from '@material-ui/core';
import AppContext from '../@jumbo/components/contextProvider/AppContextProvider/AppContext';
import { createTheme, jssPreset, StylesProvider } from '@material-ui/core/styles';
import AppContextProvider from '../@jumbo/components/contextProvider/AppContextProvider';
import { useContext, useMemo } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { create } from 'jss';
import rtl from 'jss-rtl';
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
import CssBaseline from '@material-ui/core/CssBaseline';
import getSession from '../src/apis/getSession';
import Router from 'next/router';
import SignIn from '../src/authComponents/SignIn';

const clientQuery = new QueryClient();

const MainApp = (props: any) => {
  const { Component, pageProps } = props;
  const { theme, locale }: { theme: any, locale: any } = useContext(AppContext as any);

  const muiTheme = useMemo(() => {
    return createTheme(theme);
  }, [theme]);

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const { params } = pageProps;
  let isUserLogin = null;
  let userSession = getSession();

  const { token } = params || {};
  if ((userSession && userSession.access_token) || token) {
    isUserLogin = true;
  } else {
    isUserLogin = false;
  }

  return (
    // @ts-ignore
    <IntlProvider locale={AppLocale[locale.locale].locale} messages={AppLocale[locale.locale].messages}>
      <QueryClientProvider client={clientQuery}>
        <Hydrate state={pageProps.dehydratedState}>
          <AppContextProvider>
            <AppWrapper>
              <Component {...pageProps} />
            </AppWrapper>
          </AppContextProvider>
        </Hydrate>
      </QueryClientProvider>
    </IntlProvider>
  );
};

MainApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default wrapper.withRedux(MainApp);
