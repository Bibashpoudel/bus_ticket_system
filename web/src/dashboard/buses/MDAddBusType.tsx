import { Box, Button, FormControl, FormControlLabel, Paper, Radio, RadioGroup, TextField, Typography } from '@material-ui/core';
import { useMutation } from 'react-query';
import { addBusType, getBustypeById, updateBusType } from '../../apis/bus/busType';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import BusSeatLayout from './MDBusSeatLayout';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import Router from 'next/router';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { findNextLanguage } from '../../utils/idnex';

// Language Switching data========
const switchData = {
  name: <IntlMessages id={'name'} />,
  driverSeat: <IntlMessages id={'driverseat'} />,
  leftSeat: <IntlMessages id={'leftseat'} />,
  rightSeat: <IntlMessages id={'rightseat'} />,
  lastRowSeat: <IntlMessages id={'lastrowseat'} />,
  cabinSeat: <IntlMessages id={'cabinseat'} />,
  add: <IntlMessages id={'add'} />,
  left: <IntlMessages id={'left'} />,
  right: <IntlMessages id={'right'} />,

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

  addBus: <IntlMessages id={'addbus'} />,
  filterRoute: <IntlMessages id={'filterbyroute'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  delete: <IntlMessages id={'delete'} />,
  addbustype: <IntlMessages id={'addbustype'} />,
};

const useStyles = makeStyles((theme) => ({
  seatLayoutContainer: {
    padding: 15,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  langContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  formSeatContainer: {
    display: 'flex',
    position: 'relative',
    marginTop: 40,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  formContainer: {
    width: '60%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  seatContainer: {
    width: '50%',
    margin: 5,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
    },
  },
  driverSeatContainer: {
    marginTop: 10,
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
  leftBoxContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  leftSeat: {
    display: 'flex',
    marginLeft: 20,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 15,
      width: '70%',
    },
  },
  rightSeat: {
    display: 'flex',
    marginLeft: 23,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 15,
      width: '70%',
    },
  },
  textDivCol: {
    marginRight: 20,
    [theme.breakpoints.down('sm')]: {
      marginRight: 10,
    },
  },
  lastRowSeat: {
    // marginLeft: 10,
    [theme.breakpoints.down('sm')]: {
      width: '61%',
    },
  },

  cabinSeat: {
    // marginLeft: 43,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 10,
    },
  },

  inputTextDesign: {
    marginLeft: 40,
  },
  formControl: {
    marginLeft: 40,
    minWidth: 200,
  },
  languageFormControl: {
    marginLeft: 20,
    minWidth: 200,
    [theme.breakpoints.down('sm')]: {
      minWidth: 180,
      marginLeft: 10,
    },
  },
  pTag: {
    width: '25%',
    [theme.breakpoints.down('sm')]: {
      width: '37%',
    },
  },
  headerContainer: {
    width: '100%',
    // marginBottom:20,
  }
}));

const languages = [
  { id: 1, name: 'English', value: 'english' },
  { id: 2, name: 'Amharic', value: 'amharic' },
  { id: 3, name: 'Oromifa', value: 'oromifa' },
];

export default function MDAddBusType(props: any) {
  const { params } = props;
  const classes = useStyles();
  const [value, changeValue] = useState({ language: 'english' } as any);
  const [languageBusType, updateLanguageBusType] = useState({ language: 'english' } as any);
  const [busTypeLanguage, updateBusTypeLanguage] = useState([] as any);

  const addBusTypeClickHandler = () => {
    if (busTypeLanguage.length === 1) {
      updateBusTypeLanguage([
        ...busTypeLanguage,
        { [languageBusType.language]: { bus_type: value.bus_type } },
        { [`${findNextLanguage(languageBusType.language)}`]: { bus_type: ' ' } },
      ]);
      updateLanguageBusType({ language: findNextLanguage(languageBusType.language) });
      changeValue({ ...value, language: findNextLanguage(value.language), bus_type: '' });
    } else {
      updateBusTypeLanguage([
        ...busTypeLanguage,
        { [languageBusType.language]: { bus_type: value.bus_type } },
      ]);
      updateLanguageBusType({ language: findNextLanguage(languageBusType.language) });
      changeValue({ ...value, language: findNextLanguage(value.language), bus_type: '' });
    }
    // const isAdded = busTypeLanguage.find((obj: any) => obj[value.language]);
    // if (!isAdded) {
    //   updateBusTypeLanguage([...busTypeLanguage, { [value.language]: { bus_type: value.bus_type } }]);
    //   changeValue({ ...value, language: findNextLanguage(value.language), bus_type: '' });
    // }
  };

  const updateExistingLocation = (key: string, value: any) => {
    updateBusTypeLanguage(busTypeLanguage.map((obj: any) => (obj[key] ? { [key]: { bus_type: value } } : obj)));
  };

  const inputChangeHandler = (v: any, key: string) => {
    console.log('event', key, v);
    changeValue({ ...value, [key]: v });
  };

  // API CALL FOR GET BUT TYPE DETAILS ==============================
  const {
    mutateAsync: mutateAsyncGetBustypeById,
    isSuccess: isSuccessGetBustype,
    isError: isErrorGetBustype,
    error: errorGetBustype,
    isLoading: isLoadingGetBustype,
    data: getBustypeData,
  } = useMutation(getBustypeById);

  useEffect(() => {
    if (params && params.id) {
      mutateAsyncGetBustypeById(params);
    }
  }, []);

  useEffect(() => {
    if (getBustypeData && getBustypeData.success && getBustypeData.data) {
      const { english, oromifa, amharic, ...rest } = getBustypeData.data;
      updateBusTypeLanguage([{ english }, { oromifa }, { amharic }]);
      changeValue(rest);
    }
  }, [isSuccessGetBustype, getBustypeData]);

  // API CALL FOR UPDATE AND ADD BUS TYPE ==========================
  const { mutateAsync: mutateAsyncAddBusType, isSuccess, isError, error, isLoading, data } = useMutation(addBusType);
  const {
    mutateAsync: mutateAsyncUpdateBustype,
    isSuccess: isSuccessUpdateBustype,
    isError: isErrorUpdateBustype,
    error: errorUpdateBustype,
    isLoading: isLoadingUpdateBustype,
    data: UpdateBustypeData,
  } = useMutation(updateBusType);

  const addBusTypeHandler = () => {
    // modified section
    const payload = languages.map((obj: any) => ({
      [obj.value]: {
        bus_type: busTypeLanguage.find((b: any) => b[obj.value])?.[obj.value]?.bus_type || value.bus_type,
      },
    }));
    const busTypePayload = payload.reduce((t: any, n: any) => {
      t[Object.keys(n)[0]] = Object.values(n)[0];
      return t;
    }, {});
    if (params && params.id) {
      mutateAsyncUpdateBustype({ ...value, ...busTypePayload, bus_type: 'B' });
    } else {
      console.log('Value during add', value, busTypePayload);
      mutateAsyncAddBusType({
        ...value,
        ...busTypePayload,
        bus_type: 'T',
      });
    }
  };

  // RE_DIRECTING AFTER SUCCESS
  useEffect(() => {
    if (data?.success || UpdateBustypeData?.success) {
      setTimeout(() => {
        Router.push('/dashboard/bus-type-list');
      }, 2000);
    }
  }, [isSuccessUpdateBustype, isSuccess]);

  console.log('busType language', value);

  return (
    <div>
      <Paper className={classes.seatLayoutContainer}>
        <div className={classes.headerContainer}>
          <Typography gutterBottom variant="h2"> {switchData.addbustype} </Typography>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={classes.formSeatContainer}>
            <Box className={classes.formContainer}>
              <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
                {busTypeLanguage.map((obj: object, idx: number) => (
                  <TextField
                    key={idx}
                    onChange={(e) => updateExistingLocation(Object.keys(obj)[0], e.target.value)}
                    type="text"
                    required
                    label={`Bus Type[${`${Object.keys(obj)[0]}`.trim().slice(0, 2).toUpperCase()}]`}
                    value={Object.values(obj)[0]?.bus_type}
                    focused
                    size="small"
                    style={{ margin: 5, marginBottom: 10 }}
                    variant="outlined"
                    placeholder="Enter Bus Type Name"
                  />
                ))}
                {busTypeLanguage.length <= 2 && (
                  <div>
                    <TextField
                      onChange={(e) => inputChangeHandler(e.target.value, 'bus_type')}
                      type="text"
                      required
                      label={`Bus Type[${`${value.language}`.trim().slice(0, 2).toUpperCase()}]`}
                      value={value.bus_type}
                      size="small"
                      variant="outlined"
                      placeholder="Enter Bus Type Name"
                    />
                    <Button
                      onClick={addBusTypeClickHandler}
                      variant="contained"
                      style={{ background: '#4caf50', color: '#ffffff', marginLeft: 10 }}>
                      {switchData.add}
                    </Button>
                  </div>
                )}
              </Box>

              <FormControl component="fieldset" className={classes.driverSeatContainer}>
                <p>{switchData.driverSeat} : </p>
                <div>
                  <RadioGroup
                    row
                    value={value.driver_seat_position}
                    onChange={(e) => inputChangeHandler(e.target.value, 'driver_seat_position')}
                    style={{ display: 'flex' }}>
                    <FormControlLabel
                      checked={value.driver_seat_position === 'LEFT'}
                      value="LEFT"
                      control={<Radio color="primary" />}
                      label={switchData.left}

                    />
                    <FormControlLabel
                      checked={value.driver_seat_position === 'RIGHT'}
                      value="RIGHT"
                      control={<Radio color="primary" />}
                      label={switchData.right}
                    />
                  </RadioGroup>
                </div>
              </FormControl>
              <div style={{ display: 'flex', marginTop: 20, alignItems: 'center' }}>
                <p className={classes.pTag}>{switchData.leftSeat} : </p>
                <Box className={classes.leftSeat}>
                  <div className={classes.textDivCol}>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={value?.bus_type_column_left?.number}
                      placeholder="Column"
                      type="number"
                      required
                      defaultValue={0}
                      // InputProps={{ inputProps: { min: 0, max: 10 } }}
                      onChange={(e) => {
                        if (!e.target.value || !value?.bus_type_column_left?.number || parseInt(e.target.value, 10) < 0) {
                          inputChangeHandler({ number: '', name: 'A' }, 'bus_type_column_left');
                        }
                        if (parseInt(e.target.value, 10) >= 1 && parseInt(e.target.value, 10) <= 20) {
                          console.log('left value need', parseInt(e.target.value, 10));
                          inputChangeHandler({ number: parseInt(e.target.value, 10), name: 'A' }, 'bus_type_column_left');
                        }
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={value?.bus_type_row_left?.number}
                      placeholder="Rows"
                      // InputProps={{ inputProps: { min: 0, max: 10 } }}
                      defaultValue={0}
                      type="number"
                      required
                      onChange={
                        (e) => {
                          if (!e.target.value || !value?.bus_type_column_left?.number || parseInt(e.target.value, 10) < 0) {
                            inputChangeHandler({ number: '', name: 'A' }, 'bus_type_row_left');
                          }
                          if (parseInt(e.target.value, 10) >= 1 && parseInt(e.target.value, 10) <= 20) {
                            console.log('left value need', parseInt(e.target.value, 10));
                            inputChangeHandler({ number: parseInt(e.target.value, 10), name: 'A' }, 'bus_type_row_left');
                          }
                        }
                        // inputChangeHandler({ number: parseInt(e.target.value, 10), name: 'A' }, 'bus_type_row_left')
                      }
                    />
                  </div>
                </Box>
              </div>
              <div style={{ display: 'flex', marginTop: 20, alignItems: 'center' }}>
                <p className={classes.pTag}>{switchData.rightSeat} :</p>
                <Box className={classes.rightSeat}>
                  <div className={classes.textDivCol}>
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Column"
                      required
                      value={value?.bus_type_column_right?.number}
                      type="number"
                      // InputProps={{ inputProps: { min: 0, max: 10 } }}
                      defaultValue={0}
                      onChange={
                        (e) => {
                          if (!e.target.value || !value?.bus_type_column_left?.number || parseInt(e.target.value, 10) < 0) {
                            inputChangeHandler({ number: '', name: 'B' }, 'bus_type_column_right');
                          }
                          if (parseInt(e.target.value, 10) >= 1 && parseInt(e.target.value, 10) <= 20) {
                            console.log('left value need', parseInt(e.target.value, 10));
                            inputChangeHandler({ number: parseInt(e.target.value, 10), name: 'B' }, 'bus_type_column_right');
                          }
                        }
                        // inputChangeHandler({ number: parseInt(e.target.value, 10), name: 'B' }, 'bus_type_column_right')
                      }
                    />
                  </div>
                  <div>
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Rows"
                      value={value?.bus_type_row_right?.number}
                      type="number"
                      required
                      // InputProps={{ inputProps: { min: 0, max: 10 } }}
                      defaultValue={0}
                      onChange={
                        (e) => {
                          if (!e.target.value || !value?.bus_type_column_left?.number || parseInt(e.target.value, 10) < 0) {
                            inputChangeHandler({ number: '', name: 'B' }, 'bus_type_row_right');
                          }
                          if (parseInt(e.target.value, 10) >= 1 && parseInt(e.target.value, 10) <= 20) {
                            console.log('left value need', parseInt(e.target.value, 10));
                            inputChangeHandler({ number: parseInt(e.target.value, 10), name: 'B' }, 'bus_type_row_right');
                          }
                        }
                        // inputChangeHandler({ number: parseInt(e.target.value, 10), name: 'B' }, 'bus_type_row_right')
                      }
                    />
                  </div>
                </Box>
              </div>
              <div style={{ display: 'flex', marginTop: 20, alignItems: 'center' }}>
                <p className={classes.pTag}>{switchData.lastRowSeat} :</p>
                <Box className={classes.lastRowSeat}>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={value?.bus_type_back?.number}
                    placeholder=""
                    // InputProps={{ inputProps: { min: 0, max: 10 } }}
                    defaultValue={0}
                    type="number"
                    required
                    onChange={
                      (e) => {
                        if (!e.target.value || !value?.bus_type_column_left?.number || parseInt(e.target.value, 10) < 0) {
                          inputChangeHandler({ number: '', name: 'L' }, 'bus_type_back');
                        }
                        if (parseInt(e.target.value, 10) >= 1 && parseInt(e.target.value, 10) <= 20) {
                          console.log('left value need', parseInt(e.target.value, 10));
                          inputChangeHandler({ number: parseInt(e.target.value, 10), name: 'L' }, 'bus_type_back');
                        }
                      }
                      // inputChangeHandler({ number: parseInt(e.target.value, 10), name: 'L' }, 'bus_type_back')
                    }
                  />
                </Box>
              </div>
              <div style={{ display: 'flex', marginTop: 20, alignItems: 'center' }}>
                <p className={classes.pTag}>{switchData.cabinSeat} :</p>
                <Box className={classes.cabinSeat}>
                  <TextField
                    variant="outlined"
                    size="small"
                    // InputProps={{ inputProps: { min: 0, max: 10 } }}
                    defaultValue={0}
                    placeholder=""
                    // required
                    value={value?.bus_type_cabin?.number}
                    type="number"
                    onChange={
                      (e) => {
                        if (!e.target.value || !value?.bus_type_column_left?.number || parseInt(e.target.value, 10) < 0) {
                          inputChangeHandler({ number: '', name: 'C' }, 'bus_type_cabin');
                        }
                        if (parseInt(e.target.value, 10) >= 1 && parseInt(e.target.value, 10) <= 20) {
                          console.log('left value need', parseInt(e.target.value, 10));
                          inputChangeHandler({ number: parseInt(e.target.value, 10), name: 'C' }, 'bus_type_cabin');
                        }
                      }
                      // inputChangeHandler({ number: parseInt(e.target.value, 10), name: 'C' }, 'bus_type_cabin')
                    }
                  />
                </Box>
              </div>
            </Box>
            <Box className={classes.seatContainer}>
              <BusSeatLayout formValue={value} />
              <Box style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', margin: 20 }}>
                <Button
                  onClick={addBusTypeHandler}
                  variant="contained"
                  type='submit'
                  style={{ background: '#4caf50', color: '#ffffff', marginRight: 10 }}>
                  {params && params.id ? switchData.update : switchData.save}
                </Button>
                <Link href="/dashboard/bus-type-list">
                  <Button variant="contained" color="secondary">
                    {switchData.cancel}
                  </Button>
                </Link>
              </Box>
            </Box>
          </div>
        </form>
        <NotificationLoader
          message={UpdateBustypeData?.msg || data?.msg}
          loading={isLoadingUpdateBustype || isLoading}
          error={JSON.stringify(data?.errors) || JSON.stringify(UpdateBustypeData?.errors)}
        />
      </Paper>
    </div>
  );
}
