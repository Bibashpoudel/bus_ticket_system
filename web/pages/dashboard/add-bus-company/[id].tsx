import { GetServerSidePropsContext } from 'next';
import React from 'react';
import AppLayout from '../../../@jumbo/components/AppLayout';
import AddBusCompanyWithTAbs from '../../../src/dashboard/buses/AddBusCompanyWithTAbs';
import MDBusAdd from '../../../src/dashboard/buses/MDAddBusCompanyManagement';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
  return {
    props: { params: params },
  };
}

export default function UpdateBusList(props: any) {
  return (
    <AppLayout>
      {/* <MDBusAdd {...props} /> */}
      <AddBusCompanyWithTAbs {...props}/>
    </AppLayout>
  );
}
