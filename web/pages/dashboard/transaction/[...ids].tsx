import React from 'react';
import AppLayout from '../../../@jumbo/components/AppLayout';
import MDTransaction from '../../../src/dashboard/finance-management/MDTransaction';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;

  return {
    props: { params: params }, // will be passed to the page component as props
  };
}

export default function Transaction(props: any) {
  return (
    <AppLayout>
      <MDTransaction {...props} />
    </AppLayout>
  );
}
