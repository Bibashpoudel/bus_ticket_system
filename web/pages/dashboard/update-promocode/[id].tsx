import React from 'react';
import AppLayout from '../../../@jumbo/components/AppLayout';
import PromoCode from '../../../src/dashboard/setting/PromoCode';
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
      <PromoCode {...props} />
    </AppLayout>
  );
}
