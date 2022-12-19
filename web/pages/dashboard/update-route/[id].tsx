import React from 'react';
import AppLayout from '../../../@jumbo/components/AppLayout';
import { GetServerSidePropsContext } from 'next';
import MDAddRoute from '../../../src/dashboard/buses/MDAddRoute';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;

  return {
    props: { params: params }, // will be passed to the page component as props
  };
}

export default function UpdateRoute(props: any) {
  return (
    <AppLayout>
      <MDAddRoute {...props} />
    </AppLayout>
  );
}
