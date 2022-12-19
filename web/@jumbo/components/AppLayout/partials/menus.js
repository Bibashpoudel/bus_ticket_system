import React from 'react';
import { PostAdd } from '@material-ui/icons';
import IntlMessages from '../../../utils/IntlMessages';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ReportIcon from '@material-ui/icons/Report';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ScheduleIcon from '@material-ui/icons/Schedule';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import CommuteIcon from '@material-ui/icons/Commute';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import StarsIcon from '@material-ui/icons/Stars';

const otherUserMenuProvider = (permissions, role) => {
  const { booking_management, bus_management, finance_management, reporting, schedule, setting, support, user_management } =
    permissions;
  return [
    bus_management && role === 'admin'
      ? bus_management && {
          icon: <DirectionsBusIcon />,
          name: <IntlMessages id={'busmanagement'} />,
          type: 'item',
          link: '/dashboard/bus-company-management',
          children: [],
        }
      : bus_management && {
          icon: <DirectionsBusIcon />,
          name: <IntlMessages id={'busmanagementofcompany'} />,
          type: 'collapse',
          children: [
            {
              name: <IntlMessages id={'bustype'} />,
              type: 'item',
              icon: <AirportShuttleIcon />,
              link: '/dashboard/bus-type-list',
            },
            {
              name: <IntlMessages id={'routes'} />,
              type: 'item',
              icon: <MergeTypeIcon />,
              link: '/dashboard/route-list',
            },
            {
              name: <IntlMessages id={'buses'} />,
              type: 'item',
              icon: <CommuteIcon />,
              link: '/dashboard/bus-list',
            },
          ],
        },
    user_management && {
      name: <IntlMessages id={'usermanagement'} />,
      icon: <SupervisorAccountIcon />,
      type: 'collapse',
      type: 'item',
      link: '/dashboard/user-management',
    },
    schedule && {
      icon: <ScheduleIcon />,
      name: <IntlMessages id={'schedule'} />,
      type: 'collapse',
      type: 'item',
      link: '/dashboard/schedule',
    },
    booking_management && {
      icon: <DateRangeIcon />,
      name: <IntlMessages id={'bookingmanagement'} />,
      type: 'collapse',
      type: 'item',
      link: '/dashboard/booking-management',
    },
    reporting && {
      icon: <ReportIcon />,
      name: <IntlMessages id={'reporting'} />,
      type: 'collapse',
      type: 'item',
      link: '/dashboard/reporting',
    },
    finance_management && {
      icon: <MonetizationOnIcon />,
      name: <IntlMessages id={'financemanagement'} />,
      type: 'collapse',
      type: 'item',
      link: '/dashboard/finance-management',
    },

    support && {
      icon: <HelpOutlineIcon />,
      name: <IntlMessages id={'supportcenter'} />,
      type: 'collapse',
      type: 'item',
      link: '/dashboard/support-center',
    },
    support &&
      role === 'admin' && {
        icon: <StarsIcon />,
        name: <IntlMessages id={'review'} />,
        type: 'collapse',
        type: 'item',
        link: '/dashboard/reviews',
      },
    {
      icon: <AccountCircleIcon />,
      name: <IntlMessages id={'profile'} />,
      type: 'collapse',
      type: 'item',
      link: '/dashboard/profile',
    },
    setting && {
      icon: <SettingsApplicationsIcon />,
      name: <IntlMessages id={'setting'} />,
      type: 'collapse',
      type: 'item',
      link: '/dashboard/setting/0',
    },
  ];
};

// const role = [
//   { id: 1, name: 'Bus Owner', value: 'bus-owner' },
//   { id: 2, name: 'Bus Manager', value: 'bus-manager' },
//   { id: 3, name: 'Bus Counter', value: 'bus-counter' },
//   { id: 4, name: 'Bus Validator', value: 'validator' },
// ];

export const sidebarNavs = (props) => {
  const { user } = props;
  const permissions = props.permissions || {};

  const role = user?.role;

  console.log('user info in side bar', user);
  switch (role) {
    case 'bus-company':
      return [
        {
          icon: <DirectionsBusIcon />,
          name: <IntlMessages id={'busmanagementofcompany'} />,
          type: 'collapse',
          children: [
            {
              name: <IntlMessages id={'bustype'} />,
              type: 'item',
              icon: <AirportShuttleIcon />,
              link: '/dashboard/bus-type-list',
            },
            {
              name: <IntlMessages id={'routes'} />,
              type: 'item',
              icon: <MergeTypeIcon />,
              link: '/dashboard/route-list',
            },
            {
              name: <IntlMessages id={'buses'} />,
              type: 'item',
              icon: <CommuteIcon />,
              link: '/dashboard/bus-list',
            },
          ],
        },
        {
          name: <IntlMessages id={'usermanagement'} />,
          icon: <SupervisorAccountIcon />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/user-management',
        },
        {
          icon: <ScheduleIcon />,
          name: <IntlMessages id={'schedule'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/schedule',
        },
        {
          icon: <DateRangeIcon />,
          name: <IntlMessages id={'bookingmanagement'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/booking-management',
        },
        {
          icon: <ReportIcon />,
          name: <IntlMessages id={'reporting'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/reporting',
        },
        {
          icon: <MonetizationOnIcon />,
          name: <IntlMessages id={'financemanagement'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/finance-management',
        },

        {
          icon: <HelpOutlineIcon />,
          name: <IntlMessages id={'supportcenter'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/support-center',
        },
        {
          icon: <AccountCircleIcon />,
          name: <IntlMessages id={'profile'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/profile',
        },
        {
          icon: <SettingsApplicationsIcon />,
          name: <IntlMessages id={'setting'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/setting/0',
        },
      ];
    case 'super-admin':
      return [
        {
          icon: <DirectionsBusIcon />,
          name: <IntlMessages id={'busmanagement'} />,
          type: 'item',
          link: '/dashboard/bus-company-management',
          children: [],
        },
        {
          name: <IntlMessages id={'usermanagement'} />,
          icon: <SupervisorAccountIcon />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/user-management',
        },
        {
          icon: <ScheduleIcon />,
          name: <IntlMessages id={'schedule'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/schedule',
        },
        {
          icon: <DateRangeIcon />,
          name: <IntlMessages id={'bookingmanagement'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/booking-management',
        },
        {
          icon: <ReportIcon />,
          name: <IntlMessages id={'reporting'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/reporting',
        },
        {
          icon: <MonetizationOnIcon />,
          name: <IntlMessages id={'financemanagement'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/finance-management',
        },

        {
          icon: <HelpOutlineIcon />,
          name: <IntlMessages id={'supportcenter'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/support-center',
        },
        {
          icon: <StarsIcon />,
          name: <IntlMessages id={'review'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/reviews',
        },
        {
          icon: <AccountCircleIcon />,
          name: <IntlMessages id={'profile'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/profile',
        },
        {
          icon: <SettingsApplicationsIcon />,
          name: <IntlMessages id={'setting'} />,
          type: 'collapse',
          type: 'item',
          link: '/dashboard/setting/0',
        },
      ];
    case 'bus-counter':
    case 'bus-manager':
    case 'bus-owner':
    case 'validator':
    case 'admin':
      return otherUserMenuProvider(permissions, role);
    default:
      return [];
  }
};
export const horizontalDefaultNavs = [
  {
    name: <IntlMessages id={'sidebar.main'} />,
    type: 'collapse',
    children: [
      {
        name: <IntlMessages id={'pages.samplePage'} />,
        type: 'item',
        icon: <PostAdd />,
        link: '/sample-page',
      },
    ],
  },
];

export const minimalHorizontalMenus = [
  {
    name: <IntlMessages id={'sidebar.main'} />,
    type: 'collapse',
    children: [
      {
        name: <IntlMessages id={'pages.samplePage'} />,
        type: 'item',
        icon: <PostAdd />,
        link: '/sample-page',
      },
    ],
  },
];
