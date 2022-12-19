import React from 'react';
import AppLayout from '../../@jumbo/components/AppLayout';
import BusCompanyManagementWithTab from '../../src/dashboard/buses/BusCompanyManagementWithTab';

export default function BusCompanyManagement() {
  return (
    <AppLayout>
      <BusCompanyManagementWithTab />
    </AppLayout>
  );
}
