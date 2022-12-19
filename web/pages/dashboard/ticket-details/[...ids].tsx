import React from 'react';
import AppLayout from '../../../@jumbo/components/AppLayout';
import { GetServerSidePropsContext } from 'next';
import TicketDetails from '../../../src/dashboard/support-center/TicketDetails';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;

  return {
    props: { params: params },
  };
}

export default function Transaction(props: any) {
  return (
    <AppLayout>
      <TicketDetails {...props} />
    </AppLayout>
  );
}
