import { GetServerSidePropsContext } from 'next';
import React from 'react';
import AppLayout from '../../../@jumbo/components/AppLayout';
import AddUsers from '../../../src/dashboard/user-management/AddUsers';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
  return {
    props: { params: params },
  };
}

export default function UpdateUserManagement(props: any) {
  return (
    <AppLayout>
      <AddUsers {...props} />
    </AppLayout>
  );
}
