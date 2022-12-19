import { Box, Button, Checkbox, FormControl, Grid, MenuItem, Paper, Select, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { addUser, getUserById, updateUserManagement } from '../../apis/user';
import { useMutation, useQuery } from 'react-query';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import Router from 'next/router';
import { getBustList } from '../../apis/bus/buses';

// Language Switching data========
const switchData = {
  name: <IntlMessages id={'firstname'} />,
  selectLanguage: <IntlMessages id={'selectlanguage'} />,
  choose: <IntlMessages id={'choose'} />,
  location: <IntlMessages id={'location'} />,
  save: <IntlMessages id={'save'} />,
  cancel: <IntlMessages id={'cancel'} />,
  update: <IntlMessages id={'update'} />,
  add: <IntlMessages id={'add'} />,
  lastName: <IntlMessages id={'lastname'} />,
  email: <IntlMessages id={'email'} />,
  phoneNumber: <IntlMessages id={'phoneNumberUA'} />,
  status: <IntlMessages id={'status'} />,
  role: <IntlMessages id={'role'} />,
  assignBuses: <IntlMessages id={'assignbuses'} />,
  assignPermission: <IntlMessages id={'assignpermission'} />,
  addUserInformation: <IntlMessages id={'addUserInformation'} />,
};

const permissions = [
  { id: 1, name: <IntlMessages id={'busmanagement'} />, value: 'bus_management' },
  { id: 2, name: <IntlMessages id={'schedule'} />, value: 'schedule' },
  { id: 3, name: <IntlMessages id={'bookingmanagement'} />, value: 'booking_management' },
  { id: 4, name: <IntlMessages id={'reporting'} />, value: 'reporting' },
  { id: 5, name: <IntlMessages id={'financemanagement'} />, value: 'finance_management' },
  { id: 6, name: <IntlMessages id={'supportcenter'} />, value: 'support' },
  { id: 6, name: <IntlMessages id={'setting'} />, value: 'setting' },
  { id: 7, name: <IntlMessages id={'users'} />, value: 'user_management' },
];

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 20,
    },
  },
  addUserContainer: {
    paddingBottom: 50,
    paddingTop: 10,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 5,
      paddingBottom: 20,
    },
  },
  addUser: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'unset',
    },
  },
  formControl: {
    marginLeft: 55,
    minWidth: 200,
  },
  roleFormControl: {
    marginLeft: 70,
    minWidth: 200,
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  languageFormControl: {
    marginLeft: 20,
    minWidth: 200,
  },
  pLabel: {
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 5,
    },
  },
  pLabelPhoneNumber: {
    width: '25%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 5,
    },
  },
  headerContainer: {
    width: '100%',
    // marginBottom:20,
  },
}));

const role = [
  { id: 1, name: 'Bus Owner', value: 'bus-owner' },
  { id: 2, name: 'Bus Manager', value: 'bus-manager' },
  { id: 3, name: 'Bus Counter', value: 'bus-counter' },
  { id: 4, name: 'Bus Validator', value: 'validator' },
];

export default function MDAddUser(props: any) {
  const { params } = props;
  const classes = useStyles();
  const [formValue, updateFormValue] = useState({ role: '' } as any);
  const [userInfo, setUserValue] = useState({} as any);
  console.log('USER INFO', userInfo);

  const formInputHandler = (key: string, value: any) => {
    updateFormValue({ ...formValue, [key]: value });
  };

  const formMultiInputHandler = (key: string, value: any) => {
    const isKeyExist = formValue[key];
    if (isKeyExist) {
      const isValueExist = isKeyExist.find((obj: any) => obj?.id === value.id);
      if (isValueExist) {
        const filteredValue = isKeyExist.filter((obj: any) => obj?.id !== value.id);
        updateFormValue({ ...formValue, [key]: filteredValue });
      } else {
        updateFormValue({ ...formValue, [key]: [...formValue[key], value] });
      }
    } else {
      updateFormValue({ ...formValue, [key]: [value] });
    }
  };

  const addPermissionHandler = (key: string, value: any) => {
    updateFormValue({ ...formValue, [key]: !formValue[key] });
  };

  const {
    data: dataBusList,
    refetch,
    isPreviousData,
    isLoading: isLoadingAllClients,
    isSuccess,
  } = useQuery(['BusList', '', ''], getBustList);

  // Api call for getUserManagementById======
  const {
    mutateAsync: mutateAsyncGetUserManagementById,
    isSuccess: isSuccessGetUserManagement,
    isError: isErrorGetUserManagement,
    error: errorGetUserManagement,
    isLoading: isLoadingGetUserManagement,
    data: getUserManagementData,
  } = useMutation(getUserById);

  useEffect(() => {
    if (params && params.id) {
      mutateAsyncGetUserManagementById(params);
    }
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserValue(JSON.parse(userData)?.user);
    }
  }, []);

  useEffect(() => {
    if (getUserManagementData && getUserManagementData.success) {
      const {
        booking_management,
        bus_management,
        finance_management,
        reporting,
        schedule,
        setting,
        support,
        user_management,
      } = getUserManagementData?.data?.permission ? getUserManagementData?.data?.permission : '';
      const { busAllocated } = getUserManagementData?.data;
      const assignedBus = busAllocated.map((obj: any) => obj.bus_id);
      console.log('user data', getUserManagementData);
      updateFormValue({
        ...formValue,
        ...getUserManagementData?.data,
        booking_management,
        bus_management,
        finance_management,
        reporting,
        schedule,
        setting,
        support,
        assignedBus,
        user_management,
      });
    }
  }, [isSuccessGetUserManagement, getUserManagementData]);

  //Api call for update and add userManagement===
  const {
    mutateAsync: mutateAsyncAddUser,
    isSuccess: isUserAddSuccess,
    isError: isLoginError,
    error: addUserError,
    isLoading,
    data: addUserResponse,
  } = useMutation(addUser);

  const {
    mutateAsync: mutateAsyncUpdateUserManagement,
    isSuccess: isSuccessUpdateUserManagement,
    isError: isErrorUpdateUserManagement,
    error: errorUpdateUserManagement,
    isLoading: isLoadingUpdateUserManagement,
    data: updateUserManagementData,
  } = useMutation(updateUserManagement);

  const saveHandler = () => {
    const bus_id = formValue?.assignedBus?.map((obj: any) => obj?._id);

    if (params && params.id) {
      mutateAsyncUpdateUserManagement({ ...formValue, bus_id });
    } else {
      mutateAsyncAddUser({
        ...formValue,
        role: userInfo?.role !== 'super-admin' ? formValue.role : 'admin',
        bus_id,
        calling_code: '+977',
      });
    }
  };

  useEffect(() => {
    if (addUserResponse?.success || updateUserManagementData?.success) {
      setTimeout(() => {
        Router.push('/dashboard/user-management');
      }, 2000);
    }
  }, [isSuccessUpdateUserManagement, isUserAddSuccess]);

  function FormRow() {
    return (
      <React.Fragment>
        {dataBusList &&
          dataBusList.data?.map((obj: any, idx: number) => (
            <Grid key={idx} item xs={4}>
              <Checkbox
                checked={formValue?.assignedBus?.find((bus: any) => bus?.id === obj.id)}
                value={obj.name}
                color="primary"
                onChange={(e) => formMultiInputHandler('assignedBus', obj)}
              />
              <span>{obj.english.bus_number}</span>
            </Grid>
          ))}
      </React.Fragment>
    );
  }

  function AssignPermission() {
    return (
      <React.Fragment>
        {permissions.map((obj1: any, idx: number) => (
          <Grid key={idx} item xs={4}>
            <Checkbox
              checked={formValue[obj1.value]}
              value={obj1.name}
              color="primary"
              onChange={(e) => addPermissionHandler(obj1.value, obj1)}
            />
            <span>{obj1.name}</span>
          </Grid>
        ))}
      </React.Fragment>
    );
  }

  console.log('FormValue', formValue, userInfo);

  return (
    <div>
      <Paper square className={classes.paperContainer}>
        <div className={classes.headerContainer}>
          <Typography variant="h2">{switchData.addUserInformation}</Typography>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <Box className={classes.addUserContainer}>
            <div className={classes.addUser}>
              <p className={classes.pLabel}>{switchData.name}* :</p>
              <TextField
                type="text"
                size="small"
                variant="standard"
                placeholder="Enter First Name"
                required
                value={formValue.firstname}
                onChange={(e) => formInputHandler('firstname', e.target.value)}
              />
            </div>
            <div className={classes.addUser}>
              <p className={classes.pLabel}>{switchData.lastName} :</p>
              <TextField
                type="text"
                size="small"
                variant="standard"
                required
                placeholder="Enter Last Name"
                value={formValue.lastname}
                onChange={(e) => formInputHandler('lastname', e.target.value)}
              />
            </div>
            <div className={classes.addUser}>
              <p className={classes.pLabel}>{switchData.email}* :</p>
              <TextField
                type="email"
                size="small"
                required
                variant="standard"
                placeholder="Enter Your Email"
                value={formValue.email}
                onChange={(e) => formInputHandler('email', e.target.value)}
              />
            </div>
            <div className={classes.addUser}>
              <p className={classes.pLabelPhoneNumber}>{switchData.phoneNumber}* :</p>
              <PhoneInput
                masks={{ et: '.. ... ....' }}
                country={'et'}
                inputProps={{
                  required: true,
                }}
                value={formValue.phone}
                onChange={(e) => formInputHandler('phone', e)}
              />
            </div>

            {userInfo && userInfo.role !== 'super-admin' && userInfo.role !== 'admin' && (
              <div className={classes.addUser}>
                <p className={classes.pLabel}>{switchData.role}* :</p>
                <FormControl variant="outlined" size="small">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="- Choose -"
                    value={formValue?.role}
                    style={{ minWidth: 200 }}
                    onChange={(e) => formInputHandler('role', e.target.value)}
                    variant="outlined">
                    {role.map((obj: any) => (
                      <MenuItem key={obj.name} value={obj.value}>
                        {obj.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
            {userInfo && userInfo.role !== 'super-admin' && userInfo.role !== 'admin' && (
              <div style={{ marginTop: 30 }}>
                <p style={{ marginBottom: 15 }}>{switchData.assignBuses}</p>
                <div>
                  <Grid container spacing={1}>
                    <Grid container item xs={12} spacing={3}>
                      <FormRow />
                    </Grid>
                  </Grid>
                </div>
              </div>
            )}
            <div style={{ marginTop: 30 }}>
              <p style={{ marginBottom: 15 }}>{switchData.assignPermission}</p>
              <div>
                <Grid container spacing={1}>
                  <Grid container item xs={12} spacing={3}>
                    <AssignPermission />
                  </Grid>
                </Grid>
              </div>
            </div>

            <div className={classes.btnContainer}>
              <Button
                onClick={saveHandler}
                variant="contained"
                type="submit"
                style={{ background: '#4caf50', color: '#ffffff', marginRight: 5 }}>
                {params && params.id ? switchData.update : switchData.save}
              </Button>
              <Link href="/dashboard/user-management">
                <Button variant="contained" color="secondary">
                  {switchData.cancel}
                </Button>
              </Link>
            </div>
          </Box>
        </form>
        <NotificationLoader
          message={
            (addUserResponse?.success && addUserResponse?.msg) ||
            (updateUserManagementData?.success && updateUserManagementData?.msg)
          }
          loading={isLoading || isLoadingUpdateUserManagement}
          error={JSON.stringify(addUserResponse?.errors || updateUserManagementData?.errors)}
        />
      </Paper>
    </div>
  );
}
