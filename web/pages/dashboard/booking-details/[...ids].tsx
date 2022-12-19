import { GetServerSidePropsContext } from 'next';
import React from 'react';
import AppLayout from '../../../@jumbo/components/AppLayout';
import MDBookingDetails from '../../../src/dashboard/schedule/MDBookingDetails';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
  return {
    props: { params: params },
  };
}

export default function UpdateBusList(props: any) {
  return (
    <AppLayout>
      <MDBookingDetails {...props} />
    </AppLayout>
  );
}
