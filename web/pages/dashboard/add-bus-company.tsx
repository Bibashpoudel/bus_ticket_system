import React from 'react';
import AppLayout from '../../@jumbo/components/AppLayout';
import AddBusCompanyWithTAbs from '../../src/dashboard/buses/AddBusCompanyWithTAbs';

export default function AddBusCompany() {
  return (
    <AppLayout>
      {/* <MDAddBusCompanyManagement /> */}
      <AddBusCompanyWithTAbs/>
    </AppLayout>
  );
}
