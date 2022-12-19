import React from 'react';
import AppLayout from '../../@jumbo/components/AppLayout';
import MDBusList from '../../src/dashboard/buses/MDBusList';

export default function BusList() {
  return (
    <AppLayout>
      <MDBusList />
    </AppLayout>
  );
}
