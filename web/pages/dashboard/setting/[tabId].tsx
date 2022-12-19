import { GetServerSidePropsContext } from 'next';
import React from 'react';
import AppLayout from '../../../@jumbo/components/AppLayout';
import MDSettings from '../../../src/dashboard/setting';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
  return {
    props: { params: params },
  };
}

export default function UpdateBusList(props: any) {
  return (
    <AppLayout>
      <MDSettings {...props} />
    </AppLayout>
  );
}
