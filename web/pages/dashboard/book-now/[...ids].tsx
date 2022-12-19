import React from 'react';
import AppLayout from '../../../@jumbo/components/AppLayout';
import MDAddBoking from '../../../src/dashboard/booking-management/BookingForm';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;

  return {
    props: { params: params }, // will be passed to the page component as props
  };
}

export default function UpdateLocation(props: any) {
  return (
    <AppLayout>
      <MDAddBoking {...props} />
    </AppLayout>
  );
}
