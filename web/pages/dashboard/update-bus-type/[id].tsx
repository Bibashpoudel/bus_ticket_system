import React from 'react';
import AppLayout from '../../../@jumbo/components/AppLayout';
import MDAddLocation from '../../../src/dashboard/buses/MDAddLocation';
import { GetServerSidePropsContext } from 'next';
import MDAddRoute from '../../../src/dashboard/buses/MDAddRoute';
import MDAddBusType from '../../../src/dashboard/buses/MDAddBusType';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;

  return {
    props: { params: params }, // will be passed to the page component as props
  };
}

export default function UpdateBusType(props: any) {
  return (
    <AppLayout>
      <MDAddBusType {...props} />
    </AppLayout>
  );
}
