import { Box, Button, Paper, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import Link from 'next/link';
import { addBus, getBustListById, updateBusList } from '../../apis/bus/buses';
import { getRoute } from '../../apis/bus/route';
import { getBusTypeList } from '../../apis/bus/busType';
import { useMutation, useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import Router from 'next/router';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { findNextLanguage } from '../../utils/idnex';
import { format } from 'date-fns';

// Language Switching data========
const switchData = {
  busName: <IntlMessages id={'busname'} />,
  busNumber: <IntlMessages id={'busnumber'} />,
  choose: <IntlMessages id={'choose'} />,
  selectLanguage: <IntlMessages id={'selectlanguage'} />,
  busNumberPlate: <IntlMessages id={'busnumberplate'} />,
  route: <IntlMessages id={'route'} />,
  busTypes: <IntlMessages id={'bustypes'} />,
  ticketPrice: <IntlMessages id={'ticketprice'} />,
  departureTime: <IntlMessages id={'departuretime'} />,
  arrivalTime: <IntlMessages id={'arrivaltime'} />,
  periodOfOperating: <IntlMessages id={'periodofoperating'} />,
  from: <IntlMessages id={'from'} />,
  to: <IntlMessages id={'to'} />,
  recurring: <IntlMessages id={'recurring'} />,
  save: <IntlMessages id={'save'} />,
  cancel: <IntlMessages id={'cancel'} />,
  update: <IntlMessages id={'update'} />,
  add: <IntlMessages id={'add'} />,
  addBus: <IntlMessages id={'addbus'} />,
  filterRoute: <IntlMessages id={'filterbyroute'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  delete: <IntlMessages id={'delete'} />,
  outOfService: <IntlMessages id={'outOfService'} />,
  addBusDetails: <IntlMessages id={'addBusDetails'} />,
  chassis: <IntlMessages id={'chassis'} />,
  motorNumber: <IntlMessages id={'motorNumber'} />,
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '30px ',
    [theme.breakpoints.down('sm')]: {
      padding: 20,
    },
  },
  selectLanguage: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'unset',
      marginBottom: 5,
    },
  },
  pdivForBusName: {
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '50%',
    },
  },

  busNumberPlateContainer: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      width: '100%',
    },
  },

  pdiv: {
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  pTextContainer: {
    display: 'flex',
    justifyContent: 'start',
    marginTop: 20,
    background: 'white',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  textContainer: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: 5,
    },
  },
  pRouteBusType: {
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '30%',
    },
  },
  pTicket: {
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '60%',
    },
  },
  usdText: {
    width: '15%',
    [theme.breakpoints.down('sm')]: {
      width: '65%',
    },
  },
  birrText: {
    width: '15%',
    marginLeft: 10,
    [theme.breakpoints.down('sm')]: {
      width: '65%',
      marginLeft: 5,
    },
  },
  pDepartureArrival: {
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '60%',
      paddingTop: 10,
    },
  },
  departArriveContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
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
    minWidth: 300,
    marginLeft: 100,
  },
  busTypeFormControl: {
    minWidth: 300,
    marginLeft: 80,
  },
  pickUpFormControl: {
    minWidth: 300,
  },
  addMoreBtn: {
    textTransform: 'capitalize',
    marginLeft: 50,
  },
  languageFormControl: {
    marginLeft: 20,
    minWidth: '15%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '55%',
      marginLeft: 7,
    },
  },
  periodOfOperating: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  toFromContainer: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  pToFrom: {
    [theme.breakpoints.down('sm')]: {
      width: '20%',
      paddingTop: 10,
    },
  },
  pOperating: {
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  recurringContainer: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  pRecurring: {
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  btnContainer: {
    paddingLeft: 153,
    marginTop: 15,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
    },
  },
  headerContainer: {
    width: '100%',
    marginBottom: 20,
    // background:'red'
  },
}));

const languages = [
  { id: 1, name: 'English', value: 'english' },
  { id: 2, name: 'Amharic', value: 'amharic' },
  { id: 3, name: 'Oromifa', value: 'oromifa' },
];

const days = [
  { id: 1, name: <IntlMessages id={'everymonday'} />, value: 'monday' },
  { id: 2, name: <IntlMessages id={'everytuesday'} />, value: 'tuesday' },
  { id: 3, name: <IntlMessages id={'everywednesday'} />, value: 'wednesday' },
  { id: 4, name: <IntlMessages id={'everythursday'} />, value: 'thursday' },
  { id: 5, name: <IntlMessages id={'everyfriday'} />, value: 'friday' },
  { id: 6, name: <IntlMessages id={'everysaturday'} />, value: 'saturday' },
  { id: 7, name: <IntlMessages id={'everysunday'} />, value: 'sunday' },
];

export default function BusAddSection(props: any) {
  const { params } = props;
  const classes = useStyles();
  const { locale } = useIntl();
  const [formValue, updateFormValue] = useState({
    language: 'english',
    bus_type_id: '',
    route_id: '',
    arrival: '20:00',
    departure: '8:00',
  } as any);
  const [recurring, setRecurring] = useState({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  } as any);
  const [price, setPrice] = useState({} as any);
  const [routeList, updateRouteList] = useState([]);
  const [operation_date, updateOperationDate] = useState({
    from: new Date(),
    to: new Date(Date.now() + 24 * 60 * 60 * 1000),
  } as any);
  const [busLanguage, updateBusLanguage] = useState([
    { english: { name: 'E' } },
    { amharic: { name: 'A' } },
    { oromifa: { name: 'O' } },
  ] as any);
  const [busNumber, updateBusNumber] = useState({ language: 'english' } as any);
  const [busNumberLanguage, updateBusNumberLanguage] = useState([] as any);
  const [busPlateNumber, updateBusPlateNumber] = useState({ language: 'english' } as any);
  const [busPlateNumberLanguage, updateBusPlateNumberLanguage] = useState([] as any);
  const [chassis, updateChassis] = useState({ language: 'english' } as any);
  const [chassisLanguage, updateChassisLanguage] = useState([] as any);
  const [motorNumber, updateMotorNumber] = useState({ language: 'english' } as any);
  const [motorNumberLanguage, updateMotorNumberLanguage] = useState([] as any);
  const [userInfo, setUserInfo] = useState({} as any);

  const updateRecurring = (day: any) => {
    setRecurring({ ...recurring, [day.value]: !recurring[day.value] });
  };

  const inputFormHandler = (key: string, value: any) => {
    console.log('Value', key, value);
    if (key === 'departure' || key === 'arrival') {
      const hoursMins = format(new Date(value), 'HH:mm');
      console.log('hours and mins', hoursMins);
      updateFormValue({ ...formValue, [key]: hoursMins });
    } else {
      updateFormValue({ ...formValue, [key]: value });
    }
  };



  const priceChangeHandler = (key: string, value: any) => {
    setPrice({ ...price, [key]: value });
  };

  //API CALL FOR GET DATA BY ID====================
  const {
    mutateAsync: mutateAsyncGetBusListById,
    isSuccess: isSuccessGetBusList,
    isError: isErrorGetBusList,
    error: errorGetBusList,
    isLoading: isLoadingGetBusList,
    data: dataGetBusList,
  } = useMutation(getBustListById);

  useEffect(() => {
    if (params && params.id) {
      mutateAsyncGetBusListById(params);
    }
  }, []);

  useEffect(() => {
    if (dataGetBusList && dataGetBusList.success) {
      const { amharic, oromifa, english } = dataGetBusList.data;
      console.log("bus details", dataGetBusList.data)
      const busNameArr = languages.map((obj: any) => ({ [obj.value]: { name: dataGetBusList.data[obj.value].name } }));
      updateBusLanguage(busNameArr);
      const busNumberArr = languages.map((obj: any) => ({
        [obj.value]: { bus_number: dataGetBusList.data[obj.value].bus_number },
      }));
      updateBusNumberLanguage(busNumberArr);
      const busPlateNumberArr = languages.map((obj: any) => ({
        [obj.value]: { plate_number: dataGetBusList.data[obj.value].plate_number },
      }));
      updateBusPlateNumberLanguage(busPlateNumberArr);

      const chassisArr = languages.map((obj: any) => ({
        [obj.value]: { chassis: dataGetBusList.data[obj.value].chasis },
      }));

      updateChassisLanguage(chassisArr)

      const motorNumberArr = languages.map((obj: any) => ({
        [obj.value]: { motor_number: dataGetBusList.data[obj.value].motor_number },
      }));

      updateMotorNumberLanguage(motorNumberArr)

      updateFormValue({
        ...formValue,
        ...dataGetBusList.data,
        bus_type_id: dataGetBusList.data?.bus_type_id?._id,
        route_id: dataGetBusList.data?.route_id?._id,
      });
      setRecurring(dataGetBusList.data.recurring);
      setPrice(dataGetBusList.data.price);
      updateOperationDate(dataGetBusList.data.operation_date);
    }
  }, [isSuccessGetBusList, dataGetBusList]);
  //====================================================

  // API CALL FOR UPDATE AND ADD NEW DATA=================
  const {
    mutateAsync: mutateAsyncUpdateBusList,
    isSuccess: isSuccessUpdateBusList,
    isError: isErrorUpdateBusList,
    error: errorUpdateBusList,
    isLoading: isLoadingUpdateBusList,
    data: dataUpdateBusList,
  } = useMutation(updateBusList);

  const formMultiInputHandler = (key: string, value: any) => {
    const isKeyExist = formValue[key];
    if (isKeyExist) {
      const isValueExist = isKeyExist.find((obj: any) => obj.id === value.id);
      if (isValueExist) {
        const filteredValue = isKeyExist.filter((obj: any) => obj.id !== value.id);
        updateFormValue({ ...formValue, [key]: filteredValue });
      } else {
        updateFormValue({ ...formValue, [key]: [...formValue[key], value] });
      }
    } else {
      updateFormValue({ ...formValue, [key]: [value] });
    }
  };

  const { mutateAsync: mutateAsyncAddBusList, isSuccess, isError, error, isLoading, data } = useMutation(addBus);

  const {
    data: getRouteData,
    refetch,
    isPreviousData,
    isLoading: isLoadingAllClients,
    isSuccess: isGetRouteSuccess,
  } = useQuery(['Routes', formValue?.language, ''], getRoute);

  useEffect(() => {
    if (getRouteData && getRouteData.success) {
      const mapedRoutes = getRouteData.data.map((obj: any) => ({
        ...obj,
        name: `${obj.from[locale]?.location} - ${obj.to[locale]?.location}`,
        value: obj._id,
      }));
      updateRouteList(mapedRoutes);
    }
  }, [isGetRouteSuccess, getRouteData]);

  const {
    data: getBustypeData,
    refetch: busTypeRefetch,
    isPreviousData: isPreviousBusTypeData,
    isLoading: isBusTypeFetchLoading,
    isSuccess: isBusTypeFetchSuccess,
  } = useQuery(['bustypes', formValue.language, ''], getBusTypeList);

  const addBusHandler = () => {
    const { companyDetails } = userInfo;
    const payload = languages.map((obj: any) => ({
      [obj.value]: {
        name: companyDetails?.[obj.value]?.bus_name,
        plate_number:
          busPlateNumberLanguage.find((b: any) => b[obj.value])?.[obj.value]?.plate_number || formValue.plate_number,
        bus_number: busNumberLanguage.find((b: any) => b[obj.value])?.[obj.value]?.bus_number || formValue.bus_number,
        chasis: chassisLanguage.find((b: any) => b[obj.value])?.[obj.value]?.chassis || formValue.chassis,
        motor_number: motorNumberLanguage.find((b: any) => b[obj.value])?.[obj.value]?.motor_number || formValue.motor_number,
      },
    }));
    const payloadFinal = payload.reduce((t: any, n: any) => {
      t[Object.keys(n)[0]] = Object.values(n)[0];
      return t;
    }, {});


    if (params && params.id) {
      mutateAsyncUpdateBusList({
        ...formValue,
        price,
        recurring,
        operation_date,
        ...payloadFinal,
      });
    } else {
      mutateAsyncAddBusList({
        ...formValue,
        ...payloadFinal,
        price,
        operation_date,
        recurring,
        class_type: 'C',
      });
    }
  };

  // Re-directing after success==
  useEffect(() => {
    if (data?.success || dataUpdateBusList?.success) {
      setTimeout(() => {
        Router.push('/dashboard/bus-list');
      }, 200);
    }
  }, [isSuccessUpdateBusList, isSuccess]);

  const addBusNumberClickHandler = (type: string) => {
    console.log('add bus number type', type, formValue);
    if (busNumberLanguage.length === 1) {
      updateBusNumberLanguage([
        ...busNumberLanguage,
        { [busNumber.language]: { [type]: formValue[type] } },
        { [`${findNextLanguage(busNumber.language)}`]: { [type]: ' ' } },
      ]);
      updateBusNumber({ language: findNextLanguage(busNumber.language) });
      updateFormValue({ ...formValue, language: findNextLanguage(formValue.language), [type]: '' });
    } else {
      updateBusNumberLanguage([...busNumberLanguage, { [busNumber.language]: { [type]: formValue[type] } }]);
      updateBusNumber({ language: findNextLanguage(busNumber.language) });
      updateFormValue({ ...formValue, language: findNextLanguage(formValue.language), [type]: '' });
    }
  };

  const updateExistingBusNumber = (key: string, value: any) => {
    updateBusNumberLanguage(busNumberLanguage.map((obj: any) => (obj[key] ? { [key]: { bus_number: value } } : obj)));
  };

  const addBusPlateNumberClickHandler = (type: string) => {
    if (busPlateNumberLanguage.length === 1) {
      updateBusPlateNumberLanguage([
        ...busPlateNumberLanguage,
        { [busPlateNumber.language]: { [type]: formValue[type] } },
        { [`${findNextLanguage(busPlateNumber.language)}`]: { [type]: ' ' } },
      ]);
      updateBusPlateNumber({ language: findNextLanguage(busPlateNumber.language) });
      updateFormValue({ ...formValue, language: findNextLanguage(formValue.language), [type]: '' });
    } else {
      updateBusPlateNumberLanguage([...busPlateNumberLanguage, { [busPlateNumber.language]: { [type]: formValue[type] } }]);
      updateBusPlateNumber({ language: findNextLanguage(busPlateNumber.language) });
      updateFormValue({ ...formValue, language: findNextLanguage(formValue.language), [type]: '' });
    }
  };

  const updateExistingBusPlateNumber = (key: string, value: any) => {
    updateBusPlateNumberLanguage(
      busPlateNumberLanguage.map((obj: any) => (obj[key] ? { [key]: { plate_number: value } } : obj)),
    );
  };

  //chassis language
  const addChassisClickHandler = (type: string) => {
    console.log('add bus number type', type, formValue);
    if (chassisLanguage.length === 1) {
      updateChassisLanguage([
        ...chassisLanguage,
        { [chassis.language]: { [type]: formValue[type] } },
        { [`${findNextLanguage(chassis.language)}`]: { [type]: ' ' } },
      ]);
      updateChassis({ language: findNextLanguage(chassis.language) });
      updateFormValue({ ...formValue, language: findNextLanguage(formValue.language), [type]: '' });
    } else {
      updateChassisLanguage([...chassisLanguage, { [chassis.language]: { [type]: formValue[type] } }]);
      updateChassis({ language: findNextLanguage(chassis.language) });
      updateFormValue({ ...formValue, language: findNextLanguage(formValue.language), [type]: '' });
    }
  };

  const updateExistingChassis = (key: string, value: any) => {
    updateChassisLanguage(chassisLanguage.map((obj: any) => (obj[key] ? { [key]: { chassis: value } } : obj)));
  };

  //motor number

  const addMotorNumberClickHandler = (type: string) => {
    if (motorNumberLanguage.length === 1) {
      updateMotorNumberLanguage([
        ...motorNumberLanguage,
        { [motorNumber.language]: { [type]: formValue[type] } },
        { [`${findNextLanguage(motorNumber.language)}`]: { [type]: ' ' } },
      ]);
      updateMotorNumber({ language: findNextLanguage(motorNumber.language) });
      updateFormValue({ ...formValue, language: findNextLanguage(formValue.language), [type]: '' });
    } else {
      updateMotorNumberLanguage([...motorNumberLanguage, { [motorNumber.language]: { [type]: formValue[type] } }]);
      updateMotorNumber({ language: findNextLanguage(motorNumber.language) });
      updateFormValue({ ...formValue, language: findNextLanguage(formValue.language), [type]: '' });
    }
  };

  const updateExistingMotorNumber = (key: string, value: any) => {
    updateMotorNumberLanguage(motorNumberLanguage.map((obj: any) => (obj[key] ? { [key]: { motor_number: value } } : obj)));
  };

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  console.log('get bus details', busNumberLanguage);
  const getHoursAndMins = (str: string) => {
    if (typeof str === 'string') {
      return [str.substring(0, 2), str.substring(3, 5)];
    }
    return [12, 0];
  };
  return (
    <div>
      <Paper className={classes.container}>
        <div className={classes.headerContainer}>
          <Typography gutterBottom variant="h2">
            {switchData.addBusDetails}
          </Typography>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <Box>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <p className={classes.pdivForBusName}>{switchData.busName}* :</p>
              <TextField
                variant="standard"
                size="small"
                type="text"
                placeholder="Bus Company Name"
                InputProps={{
                  readOnly: true,
                }}
                value={params?.id ? dataGetBusList?.data?.english?.name : userInfo?.companyDetails?.english?.bus_name}
                onChange={(e) => inputFormHandler('name', e.target.value)}
              />
            </div>
            <div className={classes.pTextContainer}>
              <p className={classes.pdiv}>{switchData.busNumber}* :</p>
              <div className={classes.busNumberPlateContainer}>
                {busNumberLanguage.map((obj: object, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      key={idx}
                      onChange={(e) => updateExistingBusNumber(Object.keys(obj)[0], e.target.value)}
                      type="text"
                      label={`[${`${Object.keys(obj)[0]}`.trim().slice(0, 2).toUpperCase()}]`}
                      value={Object.values(obj)[0]?.bus_number}
                      focused
                      size="small"
                      variant="outlined"
                      style={{ margin: 5 }}
                    />
                  </div>
                ))}
              </div>
              {busNumberLanguage.length <= 2 && (
                <div className={classes.textContainer}>
                  <div>
                    <TextField
                      variant="outlined"
                      size="small"
                      type="text"
                      label={`[${`${busNumber.language}`.trim().slice(0, 2).toUpperCase()}]`}
                      placeholder="Enter Bus No..."
                      value={formValue.bus_number}
                      onChange={(e) => inputFormHandler('bus_number', e.target.value)}
                    />

                    <Button
                      onClick={() => addBusNumberClickHandler('bus_number')}
                      variant="contained"
                      size="small"
                      style={{ background: '#4caf50', color: '#ffffff', marginTop: 5, marginLeft: 10 }}>
                      {switchData.add}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className={classes.pTextContainer}>
              <p className={classes.pdiv}>{switchData.busNumberPlate}* :</p>
              <div className={classes.busNumberPlateContainer}>
                {busPlateNumberLanguage.map((obj: object, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      key={idx}
                      onChange={(e) => updateExistingBusPlateNumber(Object.keys(obj)[0], e.target.value)}
                      type="text"

                      label={`[${`${Object.keys(obj)[0]}`.trim().slice(0, 2).toUpperCase()}]`}
                      value={Object.values(obj)[0]?.plate_number}
                      focused
                      size="small"
                      variant="outlined"
                      style={{ margin: 5 }}
                    />
                  </div>
                ))}
              </div>
              {busPlateNumberLanguage.length <= 2 && (
                <div className={classes.textContainer}>
                  <span>
                    <TextField
                      variant="outlined"
                      size="small"
                      type="text"
                      label={`[${`${busPlateNumber.language}`.trim().slice(0, 2).toUpperCase()}]`}
                      value={formValue.plate_number}
                      placeholder="Enter bus plate..."
                      onChange={(e) => inputFormHandler('plate_number', e.target.value)}
                    />
                  </span>
                  <Button
                    onClick={() => addBusPlateNumberClickHandler('plate_number')}
                    variant="contained"
                    size="small"
                    style={{ background: '#4caf50', color: '#ffffff', marginLeft: 10, marginTop: 5, marginBottom: 5 }}>
                    {switchData.add}
                  </Button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
              <p className={classes.pRouteBusType}>{switchData.route}* : </p>
              <FormControl size="small">
                <InputLabel
                  id="demo-controlled-open-select-label"
                  variant="outlined"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#000000',
                  }}>
                  <span>{switchData.choose}</span>
                </InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  variant="outlined"
                  label="- choose -"
                  style={{ minWidth: 200 }}
                  value={formValue.route_id}
                  onChange={(e) => inputFormHandler('route_id', e.target.value)}>
                  {routeList.map((obj: any, idx: number) => (
                    <MenuItem key={idx} value={obj._id}>
                      {obj.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {/* chassis && moter number */}
            <div className={classes.pTextContainer}>
              <p className={classes.pdiv}>{switchData.chassis} :</p>
              <div className={classes.busNumberPlateContainer}>
                {chassisLanguage.map((obj: object, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      key={idx}
                      onChange={(e) => updateExistingChassis(Object.keys(obj)[0], e.target.value)}
                      type="text"

                      label={`[${`${Object.keys(obj)[0]}`.trim().slice(0, 2).toUpperCase()}]`}
                      value={Object.values(obj)[0]?.chassis}
                      focused
                      size="small"
                      variant="outlined"
                      style={{ margin: 5 }}
                    />
                  </div>
                ))}
              </div>
              {chassisLanguage.length <= 2 && (
                <div className={classes.textContainer}>
                  <span>
                    <TextField
                      variant="outlined"
                      size="small"
                      type="text"
                      label={`[${`${chassis.language}`.trim().slice(0, 2).toUpperCase()}]`}
                      value={formValue.chassis}
                      placeholder="Enter chassis"
                      onChange={(e) => inputFormHandler('chassis', e.target.value)}
                    />
                  </span>
                  <Button
                    onClick={() => addChassisClickHandler('chassis')}
                    variant="contained"
                    size="small"
                    style={{ background: '#4caf50', color: '#ffffff', marginLeft: 10, marginTop: 5, marginBottom: 5 }}>
                    {switchData.add}
                  </Button>
                </div>
              )}
            </div>
            {/* motor number */}
            <div className={classes.pTextContainer}>
              <p className={classes.pdiv}>{switchData.motorNumber} :</p>
              <div className={classes.busNumberPlateContainer}>
                {motorNumberLanguage.map((obj: object, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      key={idx}
                      onChange={(e) => updateExistingMotorNumber(Object.keys(obj)[0], e.target.value)}
                      type="text"

                      label={`[${`${Object.keys(obj)[0]}`.trim().slice(0, 2).toUpperCase()}]`}
                      value={Object.values(obj)[0]?.motor_number}
                      focused
                      size="small"
                      variant="outlined"
                      style={{ margin: 5 }}
                    />
                  </div>
                ))}
              </div>
              {motorNumberLanguage.length <= 2 && (
                <div className={classes.textContainer}>
                  <span>
                    <TextField
                      variant="outlined"
                      size="small"
                      type="text"
                      label={`[${`${motorNumber.language}`.trim().slice(0, 2).toUpperCase()}]`}
                      value={formValue.motor_number}
                      placeholder="Enter motor number..."
                      onChange={(e) => inputFormHandler('motor_number', e.target.value)}
                    />
                  </span>
                  <Button
                    onClick={() => addMotorNumberClickHandler('motor_number')}
                    variant="contained"
                    size="small"
                    style={{ background: '#4caf50', color: '#ffffff', marginLeft: 10, marginTop: 5, marginBottom: 5 }}>
                    {switchData.add}
                  </Button>
                </div>
              )}
            </div>
            {/* close  */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
              <p className={classes.pRouteBusType}>{switchData.busTypes}* : </p>
              <FormControl size="small">
                <InputLabel
                  variant="outlined"
                  id="demo-controlled-open-select-label"
                  style={{ display: 'flex', alignItems: 'center', color: '#000000' }}>
                  <p>{switchData.choose}</p>
                </InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  variant="outlined"
                  label="- choose -"
                  style={{ width: 200 }}
                  value={formValue.bus_type_id}
                  onChange={(e) => inputFormHandler('bus_type_id', e.target.value)}>
                  {getBustypeData?.data?.map((obj: any) => (
                    <MenuItem key={obj?.name} value={obj?._id}>
                      {obj[formValue.language]?.bus_type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
              <p className={classes.pTicket}>{switchData.ticketPrice}* : </p>
              {/* <TextField
              variant="outlined"
              required
              placeholder="PriceUSD"
              size="small"
              type="number"
              value={price.usd}
              className={classes.usdText}
              onChange={(e) => priceChangeHandler('usd', e.target.value)}
            /> */}
              <TextField
                variant="outlined"
                required
                placeholder="PriceBirr"
                size="small"
                type="number"
                value={price.birr}
                className={classes.birrText}
                onChange={(e) => priceChangeHandler('birr', e.target.value)}
              />
            </div>
            <div className={classes.departArriveContainer}>
              <p className={classes.pDepartureArrival}>{switchData.departureTime} :</p>
              <div style={{ display: 'flex' }}>
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  InputProps={{ readOnly: true }}
                  value={new Date().setHours(
                    parseInt(`${getHoursAndMins(formValue.departure)[0]}`, 10),
                    parseInt(`${getHoursAndMins(formValue.departure)[1]}`, 10),
                  )}
                  onChange={(e) => inputFormHandler('departure', e)}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </div>
            </div>
            <div className={classes.departArriveContainer}>
              <p className={classes.pDepartureArrival}>{switchData.arrivalTime} : </p>
              <div>
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  InputProps={{ readOnly: true }}
                  value={new Date().setHours(
                    parseInt(`${getHoursAndMins(formValue.arrival)[0]}`, 10),
                    parseInt(`${getHoursAndMins(formValue.arrival)[1]}`, 10),
                  )}
                  onChange={(e) => inputFormHandler('arrival', e)}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </div>
            </div>
            <div className={classes.periodOfOperating}>
              <p className={classes.pOperating}>{switchData.periodOfOperating} </p>
              <div className={classes.toFromContainer}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <p className={classes.pToFrom}>{switchData.from} : </p>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="DD/MM/YYYY"
                    margin="normal"
                    id="date-picker-inline"
                    value={operation_date.from}
                    onChange={(e) => updateOperationDate({ ...operation_date, from: e })}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    style={{ marginLeft: 20, marginRight: 15, width: 165 }}
                  />
                </div>
                <div className={classes.toContainer}>
                  <p className={classes.pToFrom}>{switchData.to} : </p>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="DD/MM/YYYY"
                    margin="normal"
                    id="date-picker-inline"
                    value={operation_date.to}
                    onChange={(e) => updateOperationDate({ ...operation_date, to: e })}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    style={{ marginLeft: 20, width: 165 }}
                  />
                </div>
              </div>
            </div>
            <div className={classes.recurringContainer}>
              <p className={classes.pRecurring}>{switchData.recurring} </p>
              <Box style={{ display: 'flex', flexDirection: 'column' }}>
                {days.map((obj: any, idx: number) => (
                  <div key={idx}>
                    <Checkbox
                      checked={recurring[obj.value]}
                      value={obj.value}
                      onChange={(e) => updateRecurring(obj)}
                      color="primary"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                      size="small"
                    />
                    <span>{obj.name}</span>
                  </div>
                ))}
              </Box>
            </div>
            <Box style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
              <Box className={classes.btnContainer}>
                <Button onClick={addBusHandler} variant="contained" type="submit" color="primary" style={{ margin: 5 }}>
                  {params && params.id ? switchData.update : switchData.save}
                </Button>
                <Link href="/dashboard/bus-list">
                  <Button variant="contained" color="secondary">
                    {switchData.cancel}
                  </Button>
                </Link>
              </Box>
              {params && params.id && (
                <Box style={{ marginTop: 20 }}>
                  <Link href={`/dashboard/out-of-service/${params.id}`}>
                    <Button variant="contained" color="secondary">
                      {switchData.outOfService}
                    </Button>
                  </Link>
                </Box>
              )}
            </Box>
          </Box>
        </form>
        <NotificationLoader
          message={(dataUpdateBusList?.success && dataUpdateBusList?.msg) || (data?.success && data?.msg)}
          loading={isLoadingUpdateBusList || isLoading}
          error={JSON.stringify(data?.errors) || JSON.stringify(dataUpdateBusList?.errors)}
        />
      </Paper>
    </div>
  );
}
