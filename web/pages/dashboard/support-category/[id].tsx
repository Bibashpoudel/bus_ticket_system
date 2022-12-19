import { GetServerSidePropsContext } from 'next';
import React from 'react';
import AppLayout from '../../../@jumbo/components/AppLayout';
import AddCategory from '../../../src/dashboard/setting/ticket-category/AddCategory';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
  return {
    props: { params: params },
  };
}

export default function UpdateSupportCategory(props: any) {
  return (
    <AppLayout>
      <AddCategory {...props} />
    </AppLayout>
  );
}
