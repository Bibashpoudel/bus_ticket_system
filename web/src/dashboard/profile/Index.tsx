import { Box, Button, Paper, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { useIntl } from 'react-intl';
import React, { useEffect, useState } from 'react';
import { updateProfile } from '../../apis/profile';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

const switchData = {
  save: <IntlMessages id={'save'} />,
  email: <IntlMessages id={'email'} />,
  phone: <IntlMessages id={'phone'} />,
  name: <IntlMessages id={'name'} />,
  role: <IntlMessages id={'role'} />,
  basicInformation: <IntlMessages id={'basicInformation'} />,
  changePassword: <IntlMessages id={'changePassword'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  informationContainer: {
    width: 800,
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: 20,
    },
  },
  pDiv: {
    width: '10%',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 5,
      width: '25%',
    },
  },
  pDivPhone: {
    width: '11%',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 5,
      width: '33%',
    },
  },
}));

export default function Profile() {
  const classes = useStyles();
  const [formValue, setFormValue] = useState({} as any);

  const UpdateFformValue = (key: string, value: any) => {
    setFormValue({ ...formValue, [key]: value });
  };
  const { locale } = useIntl();

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      const userInfo = JSON.parse(userData);
      if (userInfo?.user?.role === 'bus-company') {
        setFormValue({ ...userInfo?.user, firstname: userInfo.companyDetails?.[locale].contact_name });
      } else {
        setFormValue(JSON.parse(userData)?.user);
      }
    }
  }, []);

  const {
    mutateAsync: mutateAsyncProfile,
    isSuccess: isSuccessProfile,
    isError: isErrorProfile,
    error: errorProfile,
    isLoading: isLoadingProfile,
    data: ProfileData,
  } = useMutation(updateProfile);

  const updateProfileClickListener = () => {
    mutateAsyncProfile(formValue);
  };

  useEffect(() => {
    if (ProfileData && ProfileData.success) {
      const userData = sessionStorage.getItem('user') as any;
      if (userData) {
        const { user, ...rest } = JSON.parse(userData) || {};
        sessionStorage.setItem('user', JSON.stringify({ ...rest, user: formValue }));
      }
    }
  }, [isSuccessProfile, ProfileData]);

  return (
    <div className={classes.paperContainer}>
      <Paper className={classes.informationContainer} elevation={5}>
        <Typography gutterBottom variant="h2">
          {switchData.basicInformation}
        </Typography>
        <form onSubmit={(e) => e.preventDefault()}>
          <Box style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <p className={classes.pDiv}>{switchData.name} :</p>
            <TextField
              onChange={(e) => UpdateFformValue('firstname', e.target.value)}
              variant="standard"
              value={formValue.firstname}
              size="small"
              required
              type="text"
              placeholder="Enter Your Name"
            />
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <p className={classes.pDiv}>{switchData.email} :</p>
            <TextField
              onChange={(e) => UpdateFformValue('email', e.target.value)}
              variant="standard"
              size="small"
              value={formValue.email}
              type="email"
              required
              InputProps={{
                readOnly: true,
              }}
              placeholder="Enter Your Email"
            />
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <p className={classes.pDiv}>{switchData.role} :</p>
            <TextField
              id="standard-read-only-input"
              variant="standard"
              size="small"
              required
              value={formValue.role}
              defaultValue="Admin"
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>

          <Box style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <p className={classes.pDivPhone}>{switchData.phone} :</p>
            {/* <TextField
              onChange={(e) => UpdateFformValue('phone', e.target.value)}
              variant="standard"
              size="small"
              value={formValue.phone}
              type="number"
              required
              placeholder="Enter Your Number"
            /> */}
            <PhoneInput
              masks={{ et: '.. ... ....' }}
              country={'et'}
              inputStyle={{ width: '200px' }}
              inputProps={{
                required: true,
              }}
              // style={{background:'red'}}
              value={formValue.phone}
              onChange={(e) => UpdateFformValue('phone', e)}
            />
          </Box>
          <div style={{ marginTop: 40 }}>
            <Button
              onClick={updateProfileClickListener}
              variant="contained"
              type="submit"
              style={{ marginRight: 5, background: '#4caf50', color: '#ffffff' }}>
              {switchData.save}
            </Button>
            <Link href="/dashboard/change-password">
              <Button variant="contained" color="primary">
                {switchData.changePassword}
              </Button>
            </Link>
          </div>
        </form>
        <NotificationLoader
          message={ProfileData && ProfileData.msg}
          loading={isLoadingProfile}
          error={JSON.stringify(ProfileData?.errors)}
        />
      </Paper>
    </div>
  );
}
