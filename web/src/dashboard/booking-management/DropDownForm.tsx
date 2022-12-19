import { Box, FormControl, InputLabel, MenuItem, Paper, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from 'react-query';
import { getBustList } from '../../apis/bus/buses';
import { getRoute } from '../../apis/bus/route';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useIntl } from 'react-intl';

// Language Switching data========
const switchData = {
  addBooking: <IntlMessages id={'addbooking'} />,
  filterName: <IntlMessages id={'filterbyname'} />,
  choose: <IntlMessages id={'choose'} />,
  route: <IntlMessages id={'route'} />,
  busNo: <IntlMessages id={'busNo'} />,
  to: <IntlMessages id={'to'} />,
  routes: <IntlMessages id={'routes'} />,
  all: <IntlMessages id={'all'} />,
  confirmed: <IntlMessages id={'confirmed'} />,
  pending: <IntlMessages id={'pending'} />,
  from: <IntlMessages id={'from'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 20,
    },
  },
  dsgnBox: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  boxDsgn: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  labelDsgn: {
    width: '15%',
    [theme.breakpoints.down('sm')]: {
      width: '25%',
    },
  },
  fromToLabel: {
    width: '30%',
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      width: '25%',
    },
  },
  toContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 30,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  formControl: {
    minWidth: 200,
  },
}));

export default function DropDownForm(props: any) {
  const { updateFilterValueHandler, filterValue } = props;
  const classes = useStyles();
  const { locale } = useIntl();
  const [formValue, setFormValue] = useState({} as any);
  const [userInfo, setUserInfo] = useState({} as any);

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  const { data: routeListData, refetch, isLoading: isGetRouteLoading, isSuccess } = useQuery(['Routes', '', ''], getRoute);

  const [finalRouteList, updatRouteList] = useState([] as any);
  useEffect(() => {
    if (routeListData && routeListData.data) {
      let oldRouteList = routeListData.data.slice();
      oldRouteList.unshift({ _id: 'all', name: switchData.all });
      updatRouteList(oldRouteList);
    }
  }, [isSuccess, routeListData]);

  const {
    data: dataBusList,
    isPreviousData,
    isLoading: isLoadingAllClients,
  } = useQuery(['BusList', '', '', '', '', '', filterValue?.route_id], getBustList);

  const [finalBusList, updatBusList] = useState([] as any);
  useEffect(() => {
    if (dataBusList && dataBusList.data) {
      let oldBusList = dataBusList.data.slice();
      oldBusList.unshift({ _id: 'all', name: switchData.all });
      updatBusList(oldBusList);
    }
  }, [isSuccess, dataBusList]);

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <Box className={classes.dsgnBox}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p className={classes.fromToLabel}>{switchData.from} :</p>

            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="DD/MM/YYYY"
              margin="normal"
              id="date-picker-inline"
              value={filterValue.from}
              onChange={(e) => updateFilterValueHandler('from', e)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              size="small"
              style={{ width: '70%' }}
            />
          </div>
          <div className={classes.toContainer}>
            <p className={classes.fromToLabel}>{switchData.to} :</p>

            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="DD/MM/YYYY"
              margin="normal"
              id="date-picker-inline"
              value={filterValue.to || new Date()}
              onChange={(e) => updateFilterValueHandler('to', e)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              size="small"
              style={{ width: '70%' }}
            />
          </div>
        </Box>
        <Box className={classes.boxDsgn} style={{ marginTop: 20 }}>
          <p className={classes.labelDsgn}>{switchData.routes} :</p>
          <FormControl size="small" variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label" style={{ display: 'flex', alignItems: 'center' }}>
              <p>- {switchData.choose} -</p>
            </InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              variant="outlined"
              value={filterValue.route_id}
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
        <Box className={classes.boxDsgn} style={{ marginTop: 20, marginBottom: 30 }}>
          <p className={classes.labelDsgn}>{switchData.busNo} :</p>
          <FormControl size="small" variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label" style={{ display: 'flex', alignItems: 'center' }}>
              <p>- {switchData.choose} -</p>
            </InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              variant="outlined"
              onChange={(e) => updateFilterValueHandler('bus_number', e.target.value)}
              value={filterValue.bus_number}
              label="- choose -">
              {dataBusList && dataBusList.data
                ? finalBusList.map((obj: any) => (
                    <MenuItem key={obj.name} value={obj?._id}>
                      {/* {`${obj?.[locale]?.name} (${obj?.[locale]?.bus_number})`}  */}
                      {userInfo.role === 'super-admin' || userInfo.rol === 'admin'
                        ? obj.name || `${obj?.[locale]?.name}(${obj?.[locale]?.bus_number})`
                        : obj.name || `${obj?.[locale]?.plate_number}(${obj?.[locale]?.bus_number})`}
                    </MenuItem>
                  ))
                : []}
            </Select>
          </FormControl>
        </Box>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}></div>
      </Paper>
    </div>
  );
}
