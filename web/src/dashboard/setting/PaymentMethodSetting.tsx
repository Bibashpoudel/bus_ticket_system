import { Button, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import {
  getPaymentSettingDetails,
  savePaymentSetting,
  updatePaymentSettings,
  getAdminPaymentSettingDetails,
} from '../../apis/settings/payment';

// Language Switching data========
const switchData = {
  paypalClientId: <IntlMessages id={'paypalClientId'} />,
  paypalSecretKey: <IntlMessages id={'paypalSecretKey'} />,
  telebirrAccount: <IntlMessages id={'telebirrAccount'} />,
  mPesaAccount: <IntlMessages id={'mPesaAccount'} />,
  cbeAccount: <IntlMessages id={'cbeAccount'} />,
  save: <IntlMessages id={'save'} />,
  ticketPriceInUSD: <IntlMessages id={'ticketPriceInUSD'} />,
  telebirrProcessingCharge: <IntlMessages id={'telebirrProcessingCharge'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      padding: 15,
    },
  },
  pTextContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  pContainer: {
    marginTop: 15,
    width: '22%',
    [theme.breakpoints.down('sm')]: {
      width: '72%',
    },
  },
  saveBtnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      marginTop: 10,
    },
  },
}));

export default function PaymentMethodSetting() {
  const classes = useStyles();

  const [formValue, updateFormValue] = useState({} as any);

  const updateFormValueHandler = (key: string, value: any) => {
    updateFormValue({ ...formValue, [key]: value });
  };

  const {
    mutateAsync: mutateAsyncPaymentMethodSetting,
    isSuccess: isSuccessPayment,
    isError: isErrorPaymentMethod,
    isLoading: isLoadingPaymentMehthod,
    data: paymenMethodtData,
  } = useMutation(savePaymentSetting);

  const {
    mutateAsync: mutateAsyncUpdatePayment,
    isSuccess: isSuccessPaymentUpdate,
    isError: isPaymentUpdateError,
    error: paymentUpdateError,
    isLoading: isPaymentUpdateLoading,
    data: paymentDataUpdate,
  } = useMutation(updatePaymentSettings);

  const saveHandler = () => {
    if (formValue?._id) {
      mutateAsyncPaymentMethodSetting(formValue);
    } else {
      mutateAsyncPaymentMethodSetting(formValue);
    }
  };

  const {
    refetch,
    isSuccess: isSuccessGetPayment,
    isError: isErrorPayment,
    error: paymentError,
    isLoading: isLoadingPayment,
    data: paymentData,
  } = useQuery(['payment-setting'], getAdminPaymentSettingDetails);
  //  console.log('ADMIN PAYMENT', paymentData)
  useEffect(() => {
    if (paymentData && paymentData.success) {
      updateFormValue(paymentData.data[0]);
    }
  }, [paymentData, isSuccessGetPayment]);
  return (
    <div>
      <Paper className={classes.paperContainer}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={classes.pTextContainer}>
            <p className={classes.pContainer}>{switchData.paypalClientId} :</p>
            <TextField
              type="text"
              size="small"
              required
              key={1}
              value={formValue?.paypal_client_id}
              onChange={(e) => updateFormValueHandler('paypal_client_id', e.target.value)}
            />
          </div>
          <div className={classes.pTextContainer}>
            <p className={classes.pContainer}>{switchData.paypalSecretKey} :</p>
            <TextField
              type="text"
              size="small"
              required
              value={formValue?.paypal_secret_key}
              onChange={(e) => updateFormValueHandler('paypal_secret_key', e.target.value)}
            />
          </div>
          <div className={classes.pTextContainer}>
            <p className={classes.pContainer}>{switchData.telebirrAccount} :</p>
            <TextField
              type="text"
              size="small"
              required
              value={formValue?.telebirr_account}
              onChange={(e) => updateFormValueHandler('telebirr_account', e.target.value)}
            />
          </div>
          <div className={classes.pTextContainer}>
            <p className={classes.pContainer}>{switchData.telebirrProcessingCharge} (%) :</p>
            <TextField
              type="text"
              size="small"
              required
              value={formValue?.telebirr_charge}
              onChange={(e) => updateFormValueHandler('telebirr_charge', e.target.value)}
            />
          </div>
          {/* <div className={classes.pTextContainer}>
            <p className={classes.pContainer}>{switchData.cbeAccount} :</p>
            <TextField
              type="text"
              size="small"
              required
              value={formValue?.cbe_account}
              onChange={(e) => updateFormValueHandler('cbe_account', e.target.value)}
            />
          </div> */}
          <div className={classes.pTextContainer}>
            <p className={classes.pContainer}>{switchData.ticketPriceInUSD} :</p>

            <TextField
              type="number"
              size="small"
              required
              value={formValue?.ticket_price_usd}
              onChange={(e) => updateFormValueHandler('ticket_price_usd', e.target.value)}
            />
          </div>
          <div className={classes.saveBtnContainer}>
            <Button variant="contained" type="submit" color="primary" onClick={saveHandler}>
              {switchData.save}
            </Button>
          </div>
        </form>
        <NotificationLoader
          message={
            (paymenMethodtData?.success && paymenMethodtData?.msg) || (paymentDataUpdate?.success && paymentDataUpdate?.msg)
          }
          loading={isLoadingPaymentMehthod || isPaymentUpdateLoading}
          error={JSON.stringify(paymenMethodtData?.errors) || JSON.stringify(paymentDataUpdate?.errors)}
        />
      </Paper>
    </div>
  );
}
