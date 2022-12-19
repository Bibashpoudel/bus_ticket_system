import { Button, FormControl, InputLabel, MenuItem, Paper, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery } from 'react-query';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { getBustList } from '../../apis/bus/buses';
import { getFinanceList, checkedTransfere } from '../../apis/finance/finance';
import FinanceTable from './FinanceTable';
import { getBusCompnayList } from '../../apis/bus/busCompany';
import { getRoute } from '../../apis/bus/route';
import ReactToPrint from 'react-to-print';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';

const switchData = {
  timePeriod: <IntlMessages id={'timePeriod'} />,
  from: <IntlMessages id={'from'} />,
  to: <IntlMessages id={'to'} />,
  choose: <IntlMessages id={'choose'} />,
  bus: <IntlMessages id={'bus'} />,
  busnumber: <IntlMessages id={'busnumber'} />,
  latest: <IntlMessages id={'latest'} />,
  last7Days: <IntlMessages id={'last7Days'} />,
  last30Days: <IntlMessages id={'last30Days'} />,
  customDataRange: <IntlMessages id={'customDataRange'} />,
  transaction: <IntlMessages id={'transaction'} />,
  action: <IntlMessages id={'action'} />,
  busCompany: <IntlMessages id={'busCompany'} />,
  route: <IntlMessages id={'route'} />,
  printFinance: <IntlMessages id={'printFinance'} />,
  all: <IntlMessages id={'all'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 15,
    },
  },
  labelTextFieldContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexDirection: 'column',
      alignItems: 'unset',
    },
  },
  labelTextFieldBusNum: {
    display: 'flex',
    alignItems: 'center',
    margiinBottom: 5,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  formControl: {
    minWidth: '15%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '70%',
    },
  },
  selectFormControl: {
    minWidth: '61%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '65%',
    },
  },
  periodOperatingContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  pdiv: {
    width: '12%',
    [theme.breakpoints.down('sm')]: {
      width: '30%',
    },
  },
  pSelect: {
    width: '30%',
  },
  toFromWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 20,
    width: '60%',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      marginLeft: 0,
      width: '100%',
    },
  },
  toFromContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  selectWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '42%',
    // width:"auto",
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  pToFrom: {
    [theme.breakpoints.down('sm')]: {
      width: '30%',
    },
  },
  datePickerDsn: {
    marginLeft: 15,
    width: '65%',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
}));

export default function MDFinance() {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState({} as any);
  const [formatedData, setFormatData] = useState([]);
  const [bus_number, setBusNumber] = useState('all');
  const [start_date, setStartDate] = useState(new Date());
  const [end_date, setEndDate] = useState(new Date());
  const [time_period, setTimePeriod] = useState('today');
  const [busList, setBusList] = useState({} as any);
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  const { locale } = useIntl();
  const [route_id, setRouteId] = useState('all');
  const [bus_company, updateBusCompany] = useState<any>('all');

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef<(() => void) | null>(null);

  const updateBus = (value: any) => {
    setBusNumber(value);
  };

  const updateStartDate = (date: any) => {
    setStartDate(date);
  };

  const updateEndDate = (date: any) => {
    setEndDate(date);
  };

  const {
    data: financeList,
    refetch,
    isPreviousData,
    isLoading: isFinanceListLoading,
    isSuccess,
    remove,
  } = useQuery(
    ['finance-list', bus_number, start_date, end_date, pageInfo?.page, pageInfo.size, bus_company, route_id],
    getFinanceList,
  );

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  //getting buslist====
  const {
    data: dataBusList,
    refetch: fetchBusList,
    isPreviousData: isPreviousDataBusList,
    isLoading: isLoadingAllClients,
    isSuccess: isSuccessBusList,
  } = useQuery(['BusList', '', '', '', '', bus_company, route_id], getBustList);

  const [finalBusList, updatBusList] = useState([] as any);
  useEffect(() => {
    if (dataBusList && dataBusList.data) {
      let oldBusList = dataBusList.data.slice();
      oldBusList.unshift({ _id: 'all', name: switchData.all });
      updatBusList(oldBusList);
    }
  }, [isSuccessBusList, dataBusList]);

  useEffect(() => {
    const busData = sessionStorage.getItem('bus') || '';
    if (busData) {
      setBusList(JSON.parse(busData)?.bus);
    }
  }, []);

  const updateDateRange = (range: string) => {
    console;
    setTimePeriod(range);
    switch (range) {
      case 'today':
        setStartDate(new Date());
        break;
      case 'last-7-days':
        setStartDate(new Date(Date.now() - 24 * 60 * 60 * 1000 * 6));
        break;
      case 'last-30-days':
        setStartDate(new Date(Date.now() - 24 * 60 * 60 * 1000 * 29));
        break;
      default:
        return;
    }
  };

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };

  const {
    data: busCompanyList,
    refetch: busCompanyListRefetch,
    isPreviousData: busCompanyListPreviousData,
    isLoading: busCompanyListLoadingAllClients,
    isSuccess: isSuccessBusCompanyList,
  } = useQuery(['BusCompanyList', , ''], getBusCompnayList, {
    enabled: userInfo.role === 'super-admin' || userInfo?.role === 'admin' || userInfo?.role === 'bus-company',
  });

  const [finalCompanyList, updatCompanyList] = useState([] as any);
  useEffect(() => {
    if (busCompanyList && busCompanyList.data) {
      let oldCompanyList = busCompanyList.data.slice();
      oldCompanyList.unshift({ _id: 'all', name: switchData.all });
      updatCompanyList(oldCompanyList);
    }
  }, [isSuccessBusCompanyList, busCompanyList]);

  const updateRoute = (value: any) => {
    setRouteId(value);
  };

  //getting routeList====
  const {
    data: getRouteData,
    refetch: fetchRouteList,
    isPreviousData: isPreviousDataRouteList,
    isLoading: isLoadingAllClientsRouteList,
    isSuccess: isGetRouteSuccess,
  } = useQuery(['RouteList', '', '', '', '', bus_company], getRoute);

  const [finalRouteList, updatRouteList] = useState([] as any);
  useEffect(() => {
    if (getRouteData && getRouteData.data) {
      let oldRouteList = getRouteData.data.slice();
      oldRouteList.unshift({ _id: 'all', name: switchData.all });
      updatRouteList(oldRouteList);
    }
  }, [isSuccess, getRouteData]);
  // _, language, searchKey, page, size, company_id

  const [loading, setLoading] = React.useState(false);
  const [printState, togglePrintState] = React.useState(false);
  const [text, setText] = React.useState('Some cool text from the parent');

  const handleAfterPrint = React.useCallback(() => {
    // console.log('`onAfterPrint` called'); // tslint:disable-line no-console
    togglePrintState(false);
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    // console.log('`onBeforePrint` called'); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
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
      <Button variant="contained" color="primary">
        {switchData.printFinance}
      </Button>
    );
  }, []);

  const isTransferred = (r: any) => {
    return true;
  };

  const {
    mutateAsync: checkedTransferMutation,
    isSuccess: isTranserCheckSuccess,
    isError,
    error,
    isLoading,
    data,
  } = useMutation(checkedTransfere);

  const transferCheckHandler = (record: any, e: any) => {
    const { bus_details, date, isSettal, financeReportStatus } = record || {};
    if (financeReportStatus) {
      checkedTransferMutation({ ...financeReportStatus, isSettle: !financeReportStatus?.isSettle });
    } else {
      checkedTransferMutation({ bus_id: bus_details?._id, date, isSettle: true });
    }
  };

  useEffect(() => {
    if (data && data.success) {
      refetch();
    }
  }, [isTranserCheckSuccess, data]);

  useEffect(() => {
    if (financeList && financeList.success) {
      const { dataSets, dateRanges } = financeList.data || {};
      const formatedData = dataSets.map((obj: any, idx: number) => {
        return { ...obj };
      });
      // const singleArray = formatedData.reduce((t: any, arr: any, idx: number) => {
      //   t = [...t, ...arr];
      //   return t;
      // }, []);

      setFormatData(formatedData);
    }
  }, [isSuccess, financeList]);

  return (
    <div>
      <Paper className={classes.paperContainer}>
        {userInfo && userInfo.role === 'super-admin' && (
          <div className={classes.labelTextFieldContainer}>
            <div className={classes.selectWrapper}>
              <p className={classes.pSelect}>{switchData.busCompany} :</p>
              <FormControl size="small" variant="outlined" className={classes.selectFormControl}>
                <InputLabel id="demo-customized-select-label">
                  <p>- {switchData.choose} -</p>
                </InputLabel>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={bus_company}
                  variant="outlined"
                  label="- choose -"
                  onChange={(e) => updateBusCompany(e.target.value)}>
                  {busCompanyList && busCompanyList.data
                    ? finalCompanyList.map((obj: any, idx: number) => (
                        <MenuItem key={idx} value={obj?._id}>
                          {obj.name || obj?.[locale]?.bus_legal_name}
                        </MenuItem>
                      ))
                    : []}
                </Select>
              </FormControl>
            </div>
          </div>
        )}
        <div className={classes.labelTextFieldContainer}>
          <div className={classes.selectWrapper}>
            <p className={classes.pSelect}>{switchData.route} :</p>
            <FormControl size="small" variant="outlined" className={classes.selectFormControl}>
              <InputLabel id="demo-customized-select-label">
                <p>- {switchData.choose} -</p>
              </InputLabel>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={route_id}
                variant="outlined"
                label="- choose -"
                onChange={(e) => updateRoute(e.target.value)}>
                {getRouteData && getRouteData.data
                  ? finalRouteList.map((obj: any, idx: number) => (
                      <MenuItem key={idx} value={obj._id}>
                        {obj.name || `${obj?.from?.[locale]?.location} - ${obj?.to?.[locale]?.location}`}
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={classes.labelTextFieldBusNum}>
          <div className={classes.selectWrapper}>
            <p className={classes.pSelect}>{switchData.busnumber} :</p>
            <FormControl size="small" variant="outlined" className={classes.selectFormControl}>
              <InputLabel id="demo-customized-select-label">
                <p>- {switchData.choose} -</p>
              </InputLabel>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={bus_number}
                variant="outlined"
                label="- choose -"
                onChange={(e) => updateBus(e.target.value)}>
                {dataBusList && dataBusList.data
                  ? finalBusList.map((obj: any) => (
                      <MenuItem key={obj.id} value={obj._id}>
                        {userInfo.role === 'super-admin' || userInfo.role === 'admin'
                          ? obj.name || `${obj?.[locale].name}(${obj?.[locale]?.bus_number})`
                          : obj.name || `${obj?.[locale]?.plate_number}(${obj?.[locale]?.bus_number})`}
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={classes.labelTextFieldContainer} style={{ marginTop: 10 }}>
          <div className={classes.selectWrapper}>
            <p className={classes.pSelect}>{switchData.timePeriod} :</p>
            <FormControl size="small" variant="outlined" className={classes.selectFormControl}>
              <InputLabel id="demo-customized-select-label">{/* <p>- {switchData.choose} -</p> */}</InputLabel>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={time_period}
                variant="outlined"
                label="- choose -"
                onChange={(e: any) => updateDateRange(e.target.value)}>
                <MenuItem value={'today'}>{switchData.latest} </MenuItem>
                <MenuItem value={'last-7-days'}>{switchData.last7Days} </MenuItem>
                <MenuItem value={'last-30-days'}>{switchData.last30Days}</MenuItem>
                <MenuItem value={'custom-data-range'}>{switchData.customDataRange} </MenuItem>
              </Select>
            </FormControl>
          </div>
          {time_period === 'custom-data-range' && (
            <div className={classes.toFromWrapper}>
              <div className={classes.toFromContainer}>
                <p className={classes.pToFrom}>{switchData.from} : </p>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="DD/MM/YYYY"
                  margin="normal"
                  id="date-picker-inline"
                  value={start_date}
                  onChange={updateStartDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  className={classes.datePickerDsn}
                />
              </div>
              <div className={classes.toFromContainer}>
                <p className={classes.pToFrom}>{switchData.to} : </p>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="DD/MM/YYYY"
                  margin="normal"
                  id="date-picker-inline"
                  value={end_date}
                  onChange={updateEndDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  className={classes.datePickerDsn}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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

        <div ref={componentRef}>
          <FinanceTable
            data={formatedData}
            isTransferred={isTransferred}
            loading={isFinanceListLoading}
            pageHandler={pageNoHandler}
            tableData={financeList}
            transferCheckHandler={transferCheckHandler}
          />
        </div>
        <NotificationLoader message={data?.success && data.msg} loading={isLoading} error={JSON.stringify(data?.errors)} />
      </Paper>
    </div>
  );
}
