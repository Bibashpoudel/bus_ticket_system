import React from 'react';
import SignIn from '../src/authComponents/SignIn';
import cookie from 'cookie';
import { GetServerSidePropsContext } from 'next';
import CmtFooter from '../@coremat/CmtLayouts/Vertical/Footer';
import Footer from '../@jumbo/components/AppLayout/partials/Footer';

type CookieDataType = {
  userId?: string;
  role?: string;
  displayName?: string;
  token?: string;
};

export type MainIndexProp = {
  params: CookieDataType;
};

export function parseCookies(req: any): any {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params, req } = context;

  const parseData = parseCookies(req);
  let userCookie = parseData.user;
  let user = {};
  let isAdmin = false;
  let isCaseWorker = false;
  if (userCookie) {
    user = JSON.parse(userCookie);
    return { props: { params: { ...user } } };
  }
  return {
    props: { params: {} },
  };
}

const HomePage = (props: any) => {
  return (
    <>
    <SignIn {...props} />
    {/* <CmtFooter {...props} >
      <Footer {...props} />
    </CmtFooter> */}
    </>
  )
 
  
};

export default HomePage;
