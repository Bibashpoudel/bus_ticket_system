import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select } from '@material-ui/core';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { getBusSchedule } from '../../apis/booking/booking';
import { getRoute } from '../../apis/bus/route';
import BookingTable from './BookingTable';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useIntl } from 'react-intl';

// Language Switching data========
const switchData = {
  addBooking: <IntlMessages id={'addbooking'} />,
  filterName: <IntlMessages id={'filterbyname'} />,
  choose: <IntlMessages id={'choose'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  cancel: <IntlMessages id={'cancel'} />,
  routes: <IntlMessages id={'routes'} />,
  all: <IntlMessages id={'all'} />,
  selectRoute: <IntlMessages id={'selectRoute'} />,
  pending: <IntlMessages id={'pending'} />,
  from: <IntlMessages id={'from'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: 10,
    },
  },
  dsgnBox: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  routeDsgnBox: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 20,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginRight: 0,
      width: '100%',
      marginBottom: 10,
    },
  },
  pFrom: {
    marginTop: 5,
    marginRight: 20,
    [theme.breakpoints.down('sm')]: {
      width: '32%',
      marginRight: 0,
    },
  },
  formControl: {
    minWidth: 200,
    [theme.breakpoints.down('sm')]: {
      minWidth: '55%',
    },
  },
  keyboardDateContainer: {
    [theme.breakpoints.down('sm')]: {
      width: '55%',
    },
  },
  routeSerachContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
}));

export default function MDAddBooking() {
  const classes = useStyles();

  const [filterValue, updateFilterValue] = useState({ route_id: 'all' } as any);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const { locale } = useIntl();
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const {
    data: dataBusList,
    refetch,
    isPreviousData,
    isLoading: isLoadingAllClients,
  } = useQuery(['BusList', filterValue.route_id, new Date(selectedDate), pageInfo?.page, pageInfo.size], getBusSchedule);

  const { data: routeListData, isLoading: isGetRouteLoading, isSuccess } = useQuery(['Routes', '', ''], getRoute);

  const [finalRouteList, updatRouteList] = useState([] as any);
  useEffect(() => {
    if (routeListData && routeListData.data) {
      let oldRouteList = routeListData.data.slice();
      oldRouteList.unshift({ _id: 'all', name: 'All' });
      updatRouteList(oldRouteList);
    }
  }, [isSuccess, routeListData]);

  const updateFilterValueHandler = (key: string, value: any) => {
    updateFilterValue({ ...filterValue, [key]: value });
  };

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };

  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.routeSerachContainer}>
        <Box className={classes.dsgnBox}>
          <p className={classes.pFrom}>{switchData.from} :</p>

          <div className={classes.keyboardDateContainer}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="DD/MM/YYYY"
              margin="normal"
              minDate={new Date()}
              id="date-picker-inline"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              size="small"
            />
          </div>
        </Box>
        <Box className={classes.routeDsgnBox}>
          <p className={classes.pFrom}>{switchData.selectRoute} :</p>
          <FormControl size="small" variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label" style={{ display: 'flex', alignItems: 'center' }}>
              <p>- {switchData.choose} -</p>
            </InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              variant="outlined"
              value={filterValue?.route_id}
              onChange={(e) => updateFilterValueHandler('route_id', e.target.value)}
              label="- choose -">
              {routeListData && routeListData.data
                ? finalRouteList.map((obj: any) => {
                  const { from, to, _id, name } = obj;
                  const routeName = name || `${from?.[locale]?.location}-${to?.[locale]?.location}`;
                  return (
                    <MenuItem key={obj.name} value={obj._id}>
                      {routeName}
                    </MenuItem>
                  );
                })
                : []}
            </Select>
          </FormControl>
        </Box>
        <div>
          <Button size="medium" variant="contained" color="primary">
            {switchData.search}
          </Button>
        </div>
      </div>

      <BookingTable dataBusList={dataBusList} selectedDate={format(new Date(selectedDate), 'yyyy-MM-dd')} pageNoHandlerState={(pageKey: any, pageValue: any) => pageNoHandler(pageKey, pageValue)} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <Link href="/dashboard/booking-management">
          <Button variant="contained" size="small" color="secondary" style={{ marginLeft: 5 }}>
            {switchData.cancel}
          </Button>
        </Link>
      </div>
    </Paper>
  );
}
