import { GetServerSidePropsContext } from 'next';
import React from 'react';
import ResetPasswords from '../../src/authComponents/ResetPassword';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
  return {
    props: { params: params },
  };
}

export default function UpdateBusList(props: any) {
  return <ResetPasswords {...props} />;
}
