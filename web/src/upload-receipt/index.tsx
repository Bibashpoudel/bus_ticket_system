import { Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Router from 'next/router';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { uploadReceipt } from '../apis/upload-receipt';
import { useMutation } from 'react-query';
import IntlMessages from '../../@jumbo/utils/IntlMessages';
import { NotificationLoader } from '../../@jumbo/components/ContentLoader';
import MengedgnaTicket from '../components/MengedgnaTicket';
import ReactToPrint from 'react-to-print';

// Language Switching data========
const switchData = {
  enterReceiptDetails: <IntlMessages id={'enterReceiptDetails'} />,
  paymentType: <IntlMessages id={'paymentType'} />,
  bankName: <IntlMessages id={'bankName'} />,
  refrenceNo: <IntlMessages id={'refrenceNo'} />,
  uploadFileReceipt: <IntlMessages id={'uploadFileReceipt'} />,
  choose: <IntlMessages id={'choose'} />,
  submit: <IntlMessages id={'submit'} />,
  verifyReceiptDtails: <IntlMessages id={'verifyReceiptDtails'} />,
  print: <IntlMessages id={'print'} />,
};

const useStyles = makeStyles((theme) => ({
  paperWrapper: {
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems:'center',
    // height:'100vh',
    // width: '100vw',
  },
  paperContainer: {
    padding: 30,
    width: '80%',
    marginTop: 50,
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
      width: '90%',
      padding: 15,
    },
  },
  selectFormControl: {
    minWidth: '27%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '65%',
    },
  },
  labelTextFieldContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10,
    },
  },
  uploadFileContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  pTag: {
    width: '16%',
    [theme.breakpoints.down('sm')]: {
      width: '35%',
    },
  },
  pTagOfUploadFile: {
    width: '16%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  textField: {
    width: '27%',
    [theme.breakpoints.down('sm')]: {
      width: '65%',
    },
  },
  uploadFileTextField: {
    width: '27%',
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
  },
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      marginTop: 15,
    },
  },
}));

const paymentype = [
  {
    name: 'Cash Deposite',
    value: 'cash-deposit',
  },
  {
    name: 'Bank Transfer',
    value: 'bank-transfer',
  },
];

export default function UploadReceipt(props: any) {
  const classes = useStyles();

  const { params, variant } = props;
  console.log('params', params);
  // const classes = useStyles({ variant });
  const [isOtpVerified, updateOptStatus] = useState(false);
  const [typeMismatchError, setMismatchError] = useState('');
  // const { isLoading, error, sendPasswordResetEmail } = {};
  const [open, setOpen] = React.useState(false);

  const [formValue, setFormValue] = useState({ bank_name: 'Telebirr' } as any);

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef<(() => void) | null>(null);

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
      <Button variant="contained" color="primary">
        {switchData.print}
      </Button>
    );
  }, []);

  console.log('form value', formValue);
  return (
    <div>
      {/* <Paper className={classes.paperContainer}> */}
      <div ref={componentRef}>{/* <MengedgnaTicket/> */}</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 30, marginTop: 5 }}>
        <div>
          <Link href="/dashboard/booking-management">
            <Button style={{ marginRight: 5 }} variant="contained" color="secondary">
              Cancel
            </Button>
          </Link>
        </div>
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
      {/* <Typography gutterBottom variant="h2" style={{ marginBottom: 40 }}>
          {switchData.enterReceiptDetails}
        </Typography> */}
      {/* <div >
          <p >category :</p>
          <FormControl variant="outlined" size="small" style={{width:'27%'}}>
            <InputLabel id="demo-simple-select-outlined-label">
              <p>- {switchData.choose} -</p>
            </InputLabel>

            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="- choose -"
              value={formValue?.category}
              // onChange={(e) => updateFormValueHandler('category', e.target.value)}
              >

                <MenuItem value={''} key={1}>
                  category
                </MenuItem>
              
            </Select>
          </FormControl>
        </div> */}
      {/* <div className={classes.labelTextFieldContainer}>
          <p className={classes.pTag}>{switchData.paymentType} :</p>
          <FormControl variant="outlined" size="small" className={classes.selectFormControl}>
            <InputLabel variant="outlined">
              - {switchData.choose} -
            </InputLabel>
            <Select
              variant="outlined"
              label="- choose -"
              value={formValue?.payment_type}
              onChange={(e) => updateFormValue('payment_type', e.target.value)}>
              {paymentype.map((obj: any, idx: number) => (
                <MenuItem key={idx} value={obj.value}>
                  {obj.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={classes.labelTextFieldContainer}>
          <p className={classes.pTag}>{switchData.bankName} :</p>
          <TextField
            className={classes.textField}
            type="text"
            variant="outlined"
            size="small"
            placeholder="Enter Bank Name"
            value={formValue.bank_name}
            onChange={(e) => updateFormValue('bank_name', e.target.value)}
          />
        </div>
        <div className={classes.labelTextFieldContainer}>
          <p className={classes.pTag}>{switchData.refrenceNo} :</p>
          <TextField
            className={classes.textField}
            onChange={(e) => updateFormValue('reference_number', e.target.value)}
            type="text"
            variant="outlined"
            size="small"
            placeholder="Enter Refrence No. "
          />
        </div>
        <div className={classes.uploadFileContainer}>
          <p className={classes.pTagOfUploadFile}>{switchData.uploadFileReceipt} :</p>
          <TextField
            className={classes.uploadFileTextField}
            onChange={(e: any) => updateFormValue('receipt', e.target.files[0])}
            type="file"
            variant="outlined"
            size="small"
            placeholder="Enter Refrence No. "
          />
        </div> */}
      {/* <div className={classes.btnContainer}>
          <Button onClick={uploadRecieptHandler} variant="contained" color="primary">
            {switchData.submit}
          </Button>
        </div> */}
      <NotificationLoader message={data?.success && data?.msg} loading={isLoading} error={JSON.stringify(data?.errors)} />
      {/* </Paper> */}
    </div>
  );
}
