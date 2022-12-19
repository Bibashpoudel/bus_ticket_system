import { GetServerSidePropsContext } from 'next';
import React from 'react';
import AppLayout from '../../../@jumbo/components/AppLayout';
import MDOutOfService from '../../../src/dashboard/buses/MDOutOfService';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
  return {
    props: { params: params },
  };
}

export default function UpdateBusList(props: any) {
  return (
    <AppLayout>
      <MDOutOfService {...props} />
    </AppLayout>
  );
}
