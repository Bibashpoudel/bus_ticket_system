import { Box, Button, Paper } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import { format } from 'date-fns';
import Link from 'next/link';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useQuery } from 'react-query';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { getBusSchedule } from '../../apis/booking/booking';
import { getRoute } from '../../apis/bus/route';
import { AiOutlineArrowRight } from 'react-icons/ai';
import ReactToPrint from 'react-to-print';
import { useIntl } from 'react-intl';

// Language Switching data========
const switchData = {
  addBooking: <IntlMessages id={'addbooking'} />,
  filterName: <IntlMessages id={'filterbyname'} />,
  choose: <IntlMessages id={'choose'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  delete: <IntlMessages id={'delete'} />,
  routes: <IntlMessages id={'routes'} />,
  busesOn: <IntlMessages id={'busesOn'} />,
  printSchedule: <IntlMessages id={'printSchedule'} />,
  route: <IntlMessages id={'route'} />,
  filterbyroute: <IntlMessages id={'filterbyroute'} />,
  all: <IntlMessages id={'all'} />,
};

interface Data {
  [key: string]: any;
}

interface HeadCell {
  key: string;
  label: any;
}

const headCells: HeadCell[] = [
  { key: 'name', label: <IntlMessages id={'busname'} /> },
  { key: 'routes', label: <IntlMessages id={'routes'} /> },
  { key: 'departure', label: <IntlMessages id={'departure'} /> },
  { key: 'arrival', label: <IntlMessages id={'arrival'} /> },
  { key: 'total_ticket', label: <IntlMessages id={'totalticket'} /> },
  { key: 'action', label: <IntlMessages id={'action'} /> },
];

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 15,
    },
  },
  dsgnBox: {
    display: 'flex',
    alignItems: 'center',
    width: '36%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  dsgnBoxFilter: {
    width: '38%',
    display: 'flex',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginRight: 0,
      width: '100%',
      marginTop: 5,
      marginBottom: 10,
    },
  },
  formControl: {
    minWidth: '60%',
  },
  dateControl: {
    marginLeft: 15,
    width: '50%',
  },
  filterPrintContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  pdiv: {
    width: '25%',
    marginTop: 5,
    [theme.breakpoints.down('sm')]: {
      width: '40%',
    },
  },
}));

export default function MDSchedule() {
  const classes = useStyles();
  const [searchKey, updateSearchKey] = useState('');
  const [userInfo, setUserInfo] = useState({} as any);
  const addNewDate = new Date();
  addNewDate.setDate(addNewDate.getDate() + 1);
  const [filterValue, updateFilterValue] = useState({ route_id: 'all' } as any);
  const [selectedDate, setSelectedDate] = React.useState<Date>(addNewDate);
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  const { locale } = useIntl();

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef<(() => void) | null>(null);

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  console.log('userData', userInfo);

  const {
    data: dataBusList,
    refetch,
    isLoading: isLoadingBusList,
  } = useQuery(['BusList', filterValue.route_id, new Date(selectedDate), pageInfo?.page, pageInfo.size], getBusSchedule);

  const updateFilterValueHandler = (key: string, value: any) => {
    updateFilterValue({ ...filterValue, [key]: value });
  };

  const { data: routeListData, isLoading: isGetRouteLoading, isSuccess } = useQuery(['Routes', '', ''], getRoute);
  const [finalRouteList, updatRouteList] = useState([] as any);
  useEffect(() => {
    if (routeListData && routeListData.data) {
      let oldRouteList = routeListData.data.slice();
      oldRouteList.unshift({ _id: 'all', name: switchData.all });
      updatRouteList(oldRouteList);
    }
  }, [isSuccess, routeListData]);

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };

  const [loading, setLoading] = React.useState(false);
  const [printState, togglePrintState] = React.useState(false);
  const [text, setText] = React.useState('Some cool text from the parent');

  const handleAfterPrint = React.useCallback(() => {
    console.log('`onAfterPrint` called'); // tslint:disable-line no-console
    togglePrintState(false);
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log('`onBeforePrint` called'); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log('`onBeforeGetContent` called'); // tslint:disable-line no-console
    setLoading(true);
    setText('Loading new text...');
    togglePrintState(true);
    return new Promise<void>((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText('New, Updated Text!');
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

  React.useEffect(() => {
    if (text === 'New, Updated Text!' && typeof onBeforeGetContentResolve.current === 'function') {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const reactToPrintTrigger = React.useCallback(() => {
    return (
      <Button size="medium" variant="contained" color="primary">
        {switchData.printSchedule}
      </Button>
    );
  }, []);

  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.filterPrintContainer}>
        <Box className={classes.dsgnBox}>
          <p className={classes.pdiv}>{switchData.busesOn} :</p>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="DD/MM/YYYY"
            margin="normal"
            id="date-picker-inline"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            size="small"
            className={classes.dateControl}
          />
        </Box>
        <Box className={classes.dsgnBoxFilter}>
          <p className={classes.pdiv} style={{ width: '40%' }}>
            {switchData.filterbyroute}:
          </p>
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
          <ReactToPrint
            content={reactToPrintContent}
            documentTitle="AwesomeFileName"
            onAfterPrint={handleAfterPrint}
            onBeforeGetContent={handleOnBeforeGetContent}
            onBeforePrint={handleBeforePrint}
            removeAfterPrint
            trigger={reactToPrintTrigger}
          />
        </div>
      </div>

      <div ref={componentRef}>
        <GrdTable
          headCells={!printState ? headCells : headCells.slice(0, headCells.length - 1)}
          pageNoHandler={pageNoHandler}
          totalRecordCount={dataBusList?.totaldata}
          loading={isLoadingBusList || loading}
          rows={
            dataBusList && dataBusList.data
              ? dataBusList.data.map((r: any) => {
                  console.log('bus details', r);
                  return {
                    ...r,
                    // name: r[locale]?.name,
                    name:
                      userInfo.role === 'super-admin' || userInfo.role === 'admin'
                        ? `${r[locale]?.name}(${r[locale]?.bus_number})`
                        : `${r[locale]?.plate_number}(${r[locale]?.bus_number})`,
                    departure: `${r.departure}`,
                    arrival: `${r.arrival}`,
                    routes: `${r.route_id?.from?.[locale]?.location}-${r.route_id?.to?.[locale]?.location}`,
                    total_ticket: `${r.total_seat - r.available_seat} / ${r.total_seat}`,
                    action: !printState
                      ? [
                          <Link
                            key={1}
                            href={`/dashboard/book-now/${r._id}/${format(new Date(selectedDate), 'yyyy-MM-dd')}`}>
                            <Button key={1} variant="contained" color="primary" style={{ margin: 5 }}>
                              {switchData.addBooking}
                            </Button>
                          </Link>,
                          <Link
                            key={1}
                            href={`/dashboard/booking-details/${r._id}/${format(new Date(selectedDate), 'yyyy-MM-dd')}`}>
                            <Button key={1} variant="contained" color="primary" style={{ margin: 5 }}>
                              <AiOutlineArrowRight size={20} />
                            </Button>
                          </Link>,
                        ]
                      : [],
                  };
                })
              : []
          }
        />
      </div>
    </Paper>
  );
}
