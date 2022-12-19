import React from 'react';
import AppLayout from '../../@jumbo/components/AppLayout';
import MDRouteList from '../../src/dashboard/buses/MDRouteList';
import MDBusRouteList from '../../src/dashboard/buses/MDRouteList';
import MDRouteListWithTabs from '../../src/dashboard/buses/MDRouteListWithTabs';

export default function RouteList() {
  return (
    <AppLayout>
      {/* <MDRouteListWithTabs /> */}
      <MDRouteList />
    </AppLayout>
  );
}
