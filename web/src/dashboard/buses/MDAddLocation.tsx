import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Link from 'next/link';
import  Router  from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { addLocation, getLocationById, updateLocation } from '../../apis/bus/location';
import { findNextLanguage } from '../../utils/idnex';

// Language Switching data========
const switchData = {
  selectLanguage: <IntlMessages id={'selectlanguage'} />,
  choose: <IntlMessages id={'choose'} />,
  location: <IntlMessages id={'location'} />,
  save: <IntlMessages id={'save'} />,
  cancel: <IntlMessages id={'cancel'} />,
  update: <IntlMessages id={'update'} />,
  add: <IntlMessages id={'add'} />,
  addlocation: <IntlMessages id={'addlocation'} />,
};

const useStyles = makeStyles((theme) => ({
  addLocationContainer: {
    paddingBottom: 50,
    paddingRight: '30px',
    // paddingTop: 20,
    [theme.breakpoints.down('sm')]: {
      paddingBottom: 20,
      paddingTop: 0,
      paddingRight: 0,
    },
  },
  addLocation: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
  formControl: {
    minWidth: 200,
  },
  languageFormControl: {
    marginLeft: 20,
    minWidth: 200,
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 30,
  },
  txtBtnContainer: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      width: '100%',
    },
  },
  headerContainer:{
    width:'100%',
    // marginBottom:20,
  }
}));

const languages = [
  { id: 1, name: 'English', value: 'english' },
  { id: 2, name: 'Amharic', value: 'amharic' },
  { id: 3, name: 'Oromifa', value: 'oromifa' },
];

export default function MDAddLocation(props: any) {
  const { params } = props;
  const classes = useStyles();
  const [formValue, updateFormValue] = useState({ language: 'english' } as any);
  const [languageLocation, updateLanguage] = useState({ language: 'english' } as any);
  const [locationLanguage, updateLocationLanguage] = useState([] as any);

  const inputFormHandler = (key: string, value: any) => {
    console.log('language change handler', key, value);
    updateFormValue({ ...formValue, [key]: value });
  };

  

  const { mutateAsync: mutateAsyncAddLocation, isSuccess, isError, error, isLoading, data } = useMutation(addLocation);

  const {
    mutateAsync: mutateAsyncUpdateLocation,
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isLoading: isLoadingUpdate,
    data: dataUpdate,
  } = useMutation(updateLocation);

  const saveLocationHandler = () => {
    // modified section
    const payload = languages.map((obj: any) => ({
      [obj.value]: {
        location: locationLanguage.find((b: any) => b[obj.value])?.[obj.value]?.location || formValue.location,
      },
    }));
    // *****
    const payloadFinal = payload.reduce((t: any, n: any) => {
      t[Object.keys(n)[0]] = Object.values(n)[0];
      return t;
    }, {});
    console.log('location payload', payloadFinal);
    if (params && params.id) {
      mutateAsyncUpdateLocation({ ...formValue, ...payloadFinal });
    } else {
      mutateAsyncAddLocation(payloadFinal);
    }
  };
 
  const {
    mutateAsync: mutateAsyncGetLocatioById,
    isSuccess: isSuccessGetLocation,
    isError: isErrorGetLocation,
    error: errorGetLocation,
    isLoading: isLoadingGetLocation,
    data: getLocationData,
  } = useMutation(getLocationById);

  useEffect(() => {
    if (getLocationData && getLocationData.data) {
      const { english, oromifa, amharic, ...rest } = getLocationData.data;
      updateLocationLanguage([{ english }, { oromifa }, { amharic }]);
      updateFormValue(rest);
    }
  }, [isSuccessGetLocation]);

  useEffect(() => {
    if (params && params.id) {
      mutateAsyncGetLocatioById(params);
    }
  }, []);

  useEffect(() => {
    if (getLocationData && getLocationData.success) {
      updateFormValue(getLocationData.data);
    }
  }, [isSuccessGetLocation, getLocationData]);

  useEffect(() => {
    if (data?.success || dataUpdate?.success) {
      if (!params && !params?.id) {
        updateLocationLanguage([]);
        updateFormValue({ language: 'english' });
      }
     
    }
  }, [isSuccessUpdate, isSuccess]);

  const addLocationClickHandler = () => {
    if (locationLanguage.length === 1) {
      updateLocationLanguage([
        ...locationLanguage,
        { [languageLocation.language]: { location: formValue.location } },
        { [`${findNextLanguage(languageLocation.language)}`]: { location: ' ' } },
      ]);
      updateLanguage({ language: findNextLanguage(languageLocation.language) });
      updateFormValue({ ...formValue, language: findNextLanguage(formValue.language), location: '' });
    } else {
      updateLocationLanguage([...locationLanguage, { [languageLocation.language]: { location: formValue.location } }]);
      updateLanguage({ language: findNextLanguage(languageLocation.language) });
      updateFormValue({ ...formValue, language: findNextLanguage(formValue.language), location: '' });
    }
    // const isAdded = locationLanguage.find((obj: any) => obj[formValue.language]);
    // if (!isAdded) {
    //   updateLocationLanguage([...locationLanguage, { [formValue.language]: { location: formValue.location } }]);
    //   updateFormValue({ ...formValue, language: findNextLanguage(formValue.language), location: '' });
    // }
  };

  const updateExistingLocation = (key: string, value: any) => {
    updateLocationLanguage(locationLanguage.map((obj: any) => (obj[key] ? { [key]: { location: value } } : obj)));
  };
 
  useEffect(() => {
    if (data?.success || dataUpdate?.success) {
      setTimeout(() => {
        Router.push('/dashboard/setting/4');
      }, 2000);
    }
  }, [isSuccessUpdate, isSuccess]);

  return (
    <div>
      <Paper square style={{ padding: 20 }}>
      <div className={classes.headerContainer}>
          <Typography gutterBottom variant="h2"> {switchData.addlocation} </Typography>
        </div>
        <form onSubmit={(e)=>e.preventDefault()}>
        <Box className={classes.addLocationContainer}>
          <div className={classes.addLocation}>
            <Box className={classes.txtBtnContainer}>
              {locationLanguage.map((obj: object, idx: number) => (
                <TextField
                  key={idx}
                  onChange={(e) => updateExistingLocation(Object.keys(obj)[0], e.target.value)}
                  type="text"
                  required
                  label={`Loaction[${`${Object.keys(obj)[0]}`.trim().slice(0, 2).toUpperCase()}]`}
                  value={Object.values(obj)[0]?.location}
                  focused
                  style={{ margin: 5 }}
                  size="small"
                  variant="outlined"
                  placeholder="Enter Location Name"
                />
              ))}
              {locationLanguage.length <= 2 && (
                <div style={{ display: 'flex', margin: 5 }}>
                  <TextField
                    onChange={(e) => inputFormHandler('location', e.target.value)}
                    type="text"
                    required
                    label={`Loaction[${`${formValue.language}`.trim().slice(0, 2).toUpperCase()}]`}
                    value={formValue.location}
                    size="small"
                    variant="outlined"
                    
                    placeholder="Enter Location Name"
                  />

                  <Button
                    onClick={addLocationClickHandler}
                    variant="contained"
                    size="small"
                    style={{ background: '#4caf50', color: '#ffffff', margin: 5 }}>
                  {switchData.add}
                  </Button>
                </div>
              )}
            </Box>
          </div>
          <div className={classes.btnContainer}>
            <Button
              onClick={saveLocationHandler}
              variant="contained"
              type='submit'
              style={{ background: '#4caf50', color: '#ffffff', marginRight: 5 }}>
              {params && params.id ? switchData.update : switchData.save}
            </Button>
            <Link href="/dashboard/setting/4">
              <Button variant="contained" color="secondary">
                {switchData.cancel}
              </Button>
            </Link>
          </div>
        </Box>
        </form>
        <NotificationLoader
          message={dataUpdate?.msg || data?.msg}
          loading={isLoadingUpdate || isLoading}
          error={JSON.stringify(data?.errors) || JSON.stringify(dataUpdate?.errors)}
        />
      </Paper>
    </div>
  );
}
