import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Box, Collapse, FormControl, IconButton, InputLabel, MenuItem, Select } from '@material-ui/core';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AuthWrapper from '../authComponents/AuthWrapper';
import { useRouter } from 'next/router';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import Link from 'next/link';
import IntlMessages from '../../@jumbo/utils/IntlMessages';
import { NotificationLoader } from '../../@jumbo/components/ContentLoader';
import CmtImage from '../../@coremat/CmtImage';
import { uploadReceipt } from '../apis/upload-receipt';
import { useMutation } from 'react-query';
import Router from 'next/router';
import { objectOf } from 'prop-types';

const useStyles = makeStyles((theme) => ({
  authThumb: {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    [theme.breakpoints.up('md')]: {
      width: '50%',
      order: 2,
    },
  },
  authContent: {
    padding: 30,
    [theme.breakpoints.up('md')]: {
      order: 1,
      // width: (props) => (props.variant === 'default' ? '50%' : '100%'),
    },
    [theme.breakpoints.up('xl')]: {
      padding: 50,
    },
  },
  titleRoot: {
    marginBottom: 14,
    color: theme.palette.text.primary,
  },
  textFieldRoot: {
    marginBottom: 15,
    '& .MuiOutlinedInput-notchedOutline': {
      // borderColor: alpha(theme.palette.common.dark, 0.12),
    },
  },
  alertRoot: {
    marginBottom: 10,
  },
}));

const paymentype = [
  {
    name: 'Cash Deposite',
    value: 'cash_deposite',
  },
  {
    name: 'Bank Transfer',
    value: 'bank_transfer',
  },
];

const UploadReceipt = (props: any) => {
  const { params, variant } = props;
  console.log('params', params);
  const classes = useStyles({ variant });
  const [isOtpVerified, updateOptStatus] = useState(false);
  const [typeMismatchError, setMismatchError] = useState('');
  // const { isLoading, error, sendPasswordResetEmail } = {};
  const [open, setOpen] = React.useState(false);

  const [formValue, setFormValue] = useState({} as any);

  const updateFormValue = (key: string, value: any) => {
    setFormValue({ ...formValue, [key]: value });
  };

  console.log(formValue);

  const { mutateAsync: uploadReciept, isSuccess, isError, isLoading, data, error } = useMutation(uploadReceipt);
  console.log('forgot res', data);

  useEffect(() => {
    if (data && data.success) {
      Router.push('/');
    }
  }, [isSuccess, data]);

  const uploadRecieptHandler = () => {
    uploadReciept({ ...formValue, ticket_id: params?.ticket_id });
  };

  console.log('form value', formValue);

  return (
    <AuthWrapper variant={'default'}>
      {variant === 'default' ? (
        <Box className={classes.authThumb}>
          <CmtImage alt="" src={'/images/auth/forgot-img.png'} />
        </Box>
      ) : null}
      <Box className={classes.authContent}>
        <Box mb={7}>
          <CmtImage alt="" src={'/images/logo.png'} />
        </Box>

        <Typography component="div" variant="h1" className={classes.titleRoot}>
          Enter Receipt Details
        </Typography>
        <Collapse in={open}>
          <Alert
            variant="outlined"
            severity="success"
            className={classes.alertRoot}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }>
            A mail has been sent on your email address with reset password link.
          </Alert>
        </Collapse>
        
          <Box mb={5}>
            <div style={{ display: 'flex', alignItems:'center' }}>
              {/* <p>PaymentType</p> */}
              <FormControl size="small" variant="outlined" style={{minWidth:'15%'}} >
            <InputLabel id="demo-customized-select-label">
              <p>- choose -</p>
            </InputLabel>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              // value={bus_number}
              variant="outlined"
              label="- choose -"
              onChange={(e) => updateFormValue('payment_type',e.target.value)}>
             {paymentype.map((obj: any, idx: number) => (
                <MenuItem key={idx} value={obj.value}>
                    {obj.name}
                 </MenuItem>
                ))}
            </Select>
              </FormControl>
            </div>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Bank Name"
              onChange={(e) => updateFormValue('bank_name', e.target.value)}
            />

            <>
              <TextField
                fullWidth
                onChange={(e) => updateFormValue('reference_number', e.target.value)}
                margin="normal"
                type="text"
                variant="outlined"
                placeholder="Reference No:"
                className={classes.textFieldRoot}
              />
              <TextField
                type="file"
                size="small"
                variant="standard"
                placeholder="Enter Your Telephone"
                // value={formValue.company_logo?.name}
                onChange={(e: any) => updateFormValue('receipt', e.target.files[0])}
              />
            </>
          </Box>
          <Box mb={5}>
            <Button onClick={uploadRecieptHandler} variant="contained" color="primary">
              <IntlMessages id="Submit" />
            </Button>
          </Box>
        
        <NotificationLoader
          message={data?.success && data?.msg}
          loading={isLoading}
          error={(!data?.success && JSON.stringify(data?.errors)) || typeMismatchError}
        />
      </Box>
    </AuthWrapper>
  );
};

export default UploadReceipt;
