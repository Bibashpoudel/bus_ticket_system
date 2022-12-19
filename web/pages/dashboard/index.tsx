import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { wrapper } from '../../redux/store/index';
import AppWrapper from '../../@jumbo/components/AppWrapper';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-notifications/lib/notifications.css';
import 'prismjs/themes/prism-okaidia.css';

import AppContextProvider from '../../@jumbo/components/contextProvider/AppContextProvider';
import AppLayout from '../../@jumbo/components/AppLayout';
import Index from '../../src/dashboard/Bus-Comany-Dashboard/Index';
import MDIndex from '../../src/dashboard/Admin-Dashboard/MDIndex';
import getSession from '../../src/apis/getSession';

const MainApp = (props: any) => {
  const { Component, pageProps } = props;
  const [userInfo, setUserInfo] = useState({} as any);

  useEffect(() => {
    const userInfo = getSession();
    setUserInfo(userInfo);
  }, []);
  console.log('userinforrr===', userInfo);

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <AppLayout>
      {userInfo?.user && userInfo?.user.role == 'super-admin' ? <MDIndex {...props} /> : <Index {...props} />}
    </AppLayout>
  );
};

MainApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default wrapper.withRedux(MainApp);
