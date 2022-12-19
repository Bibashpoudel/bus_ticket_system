import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { addRoute, getRouteById, updateRoute } from '../../apis/bus/route';
import { getLocation } from '../../apis/bus/location';
import Router from 'next/router';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';

// Language Switching data========
const switchData = {
  name: <IntlMessages id={'name'} />,
  selectLanguage: <IntlMessages id={'selectlanguage'} />,
  choose: <IntlMessages id={'choose'} />,
  from: <IntlMessages id={'from'} />,
  to: <IntlMessages id={'to'} />,
  save: <IntlMessages id={'save'} />,
  cancel: <IntlMessages id={'cancel'} />,
  update: <IntlMessages id={'update'} />,
  distance: <IntlMessages id={'distance'} />,
  add: <IntlMessages id={'add'} />,
  addBusRoute: <IntlMessages id={'addBusRoute'} />,
};

const useStyles = makeStyles((theme) => ({
  addRouteContainer: {
    paddingBottom: 50,
    paddingLeft: '30px',
    paddingRight: '30px',
    paddingTop: 20,
    [theme.breakpoints.down('sm')]: {
      paddingBottom: 20,
      paddingRight: 0,
    },
  },
  addRoute: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  formControl: {
    minWidth: '16%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '65%',
    },
  },
  languageFormControl: {
    marginLeft: 20,
    minWidth: 200,
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  pDiv: {
    width: '15%',
    [theme.breakpoints.down('sm')]: {
      width: '37%',
    },
  },
  headerContainer: {
    width: '100%',
    // marginBottom:20,
  },
}));

export default function MDAddRoute(props: any) {
  const { params } = props;
  const classes = useStyles();
  const [formValue, updateFormValue] = React.useState({ language: 'english', from: '', to: '' } as any);

  const inputFormHandler = (key: string, value: any) => {
    updateFormValue({ ...formValue, [key]: value });
  };

  const { mutateAsync: mutateAsyncAddRoute, isSuccess, isError, error, isLoading, data } = useMutation(addRoute);
  // first make getRouteById api================================
  const {
    mutateAsync: mutateAsyncGetRouteById,
    isSuccess: isSuccessGetRoute,
    isError: isErrorGetRoute,
    error: errorGetRoute,
    isLoading: isLoadingGetRoute,
    data: dataGetRoute,
  } = useMutation(getRouteById);

  useEffect(() => {
    if (params && params.id) {
      mutateAsyncGetRouteById(params);
    }
  }, []);

  useEffect(() => {
    if (dataGetRoute && dataGetRoute.success) {
      updateFormValue({
        ...formValue,
        ...dataGetRoute.data,
        ...dataGetRoute.data?.added_by,
        from: dataGetRoute.data.from?._id,
        to: dataGetRoute.data.to?._id,
      });
    }
  }, [isSuccessGetRoute, dataGetRoute]);

  // This is the UpdateRoute api===================================

  const {
    mutateAsync: mutateAsyncUpdateRoute,
    isSuccess: isSuccessUpdateRoute,
    isError: isErrorUpdateRoute,
    error: errorUpdateRoute,
    isLoading: isLoadingUpdateRoute,
    data: dataUpdateRoute,
  } = useMutation(updateRoute);

  const saveRouteHandler = () => {
    if (params && params.id) {
      mutateAsyncUpdateRoute({ ...formValue, from: formValue.from, to: formValue.to, id: params.id });
    } else {
      mutateAsyncAddRoute({
        from: formValue.from,
        to: formValue.to,
        language: formValue.language,
        distance: formValue.distance,
        isActive: false,
      });
    }
  };

  useEffect(() => {
    if (data?.success || dataUpdateRoute?.success) {
      setTimeout(() => {
        Router.push('/dashboard/route-list');
      }, 2000);
    }
  }, [isSuccessUpdateRoute, isSuccess]);

  const {
    data: locations,
    refetch,
    isPreviousData,
    isLoading: locationLoading,
    isSuccess: locationSuccess,
  } = useQuery(['locations', formValue.language, ''], getLocation);
  console.log('locationList', locations);

  const routeFromName = locations?.data?.find((obj: any) => obj._id === formValue.from)?.[formValue.language]?.location;
  const routeToName = locations?.data?.find((obj: any) => obj._id === formValue.to)?.[formValue.language]?.location;
  const routeName = routeFromName && routeToName && `${routeFromName}-${routeToName}`;
  console.log('form value', formValue);
  return (
    <div>
      <Paper square style={{ padding: 20 }}>
        <div className={classes.headerContainer}>
          <Typography gutterBottom variant="h2">
           {switchData.addBusRoute}
          </Typography>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={classes.addRoute}>
            <p className={classes.pDiv}>{switchData.from}* :</p>
            <FormControl variant="outlined" size="small" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                <p>{switchData.choose}</p>
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                required
                disabled={params?.id}
                value={formValue.from}
                onChange={(e) => inputFormHandler('from', e.target.value)}
                label="- choose -">
                {locations
                  ? locations?.data?.map((obj: any, idx: number) => {
                      return (
                        <MenuItem key={idx} value={obj._id}>
                          {obj[formValue.language]?.location}
                        </MenuItem>
                      );
                    })
                  : []}
              </Select>
            </FormControl>
          </div>
          <div className={classes.addRoute}>
            <p className={classes.pDiv}>{switchData.to}* :</p>
            <FormControl variant="outlined" size="small" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                <p>{switchData.choose}</p>
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={formValue.to}
                disabled={params?.id}
                required
                onChange={(e) => inputFormHandler('to', e.target.value)}
                label="- choose -">
                {locations
                  ? locations?.data?.map((obj: any, idx: number) => {
                      return (
                        <MenuItem key={idx} value={obj._id}>
                          {obj[formValue.language]?.location}
                        </MenuItem>
                      );
                    })
                  : []}
              </Select>
            </FormControl>
          </div>
          <div className={classes.addRoute}>
            <p className={classes.pDiv}>{switchData.name} :</p>
            <TextField value={routeName} type="text" size="small" variant="standard" placeholder="Auto Select" />
          </div>
          <div className={classes.addRoute}>
            <p className={classes.pDiv}>{switchData.distance}* :</p>
            <TextField
              onChange={(e) => inputFormHandler('distance', e.target.value)}
              type="number"
              size="small"
              variant="outlined"
              placeholder=""
              required
              value={formValue.distance}
            />
          </div>
          <Box className={classes.addRouteContainer}>
            <div className={classes.btnContainer}>
              <Button
                onClick={saveRouteHandler}
                variant="contained"
                type="submit"
                style={{ background: '#4caf50', color: '#ffffff', marginRight: 5 }}>
                {params && params.id ? switchData.update : switchData.save}
              </Button>
              <Link href="/dashboard/route-list">
                <Button variant="contained" color="secondary">
                  {switchData.cancel}
                </Button>
              </Link>
            </div>
          </Box>
        </form>
        <NotificationLoader
          message={dataUpdateRoute?.msg || data?.msg}
          loading={isLoadingUpdateRoute || isLoading}
          error={JSON.stringify(data?.errors) || JSON.stringify(dataUpdateRoute?.errors)}
        />
      </Paper>
    </div>
  );
}
