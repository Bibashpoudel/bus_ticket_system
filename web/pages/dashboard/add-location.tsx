import React from 'react';
import AppLayout from '../../@jumbo/components/AppLayout';
import MDAddLocation from '../../src/dashboard/buses/MDAddLocation';
import MDLocationListWithTabs from '../../src/dashboard/buses/MDLocationListWithTabs';

export default function AddLocation() {
  return (
    <AppLayout>
      <MDAddLocation />
    </AppLayout>
  );
}
