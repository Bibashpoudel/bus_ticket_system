import { Box, Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { savePymentMethodSetting, getBusCompanyPaymentDetails } from '../../apis/settings/payment';

// Language Switching data========
const switchData = {
  selectLanguage: <IntlMessages id={'selectlanguage'} />,
  choose: <IntlMessages id={'choose'} />,
  location: <IntlMessages id={'location'} />,
  save: <IntlMessages id={'save'} />,
  cancel: <IntlMessages id={'cancel'} />,
  update: <IntlMessages id={'update'} />,
  add: <IntlMessages id={'add'} />,
  cbeAccount: <IntlMessages id={'cbeAccount'} />,
  telebirr: <IntlMessages id={'telebirr'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 10,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: 0,
    },
  },
  teleBirrMPessaWrapper: {
    paddingBottom: 50,
    paddingRight: '30px',
    paddingTop: 20,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
      width: '100%',
    },
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
  teleBirrMPessaContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'unset',
    },
  },
  pDiv: {
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 5,
    },
  },
}));

export default function PaymentSetting(props: any) {
  const classes = useStyles();
  const { params } = props;
  console.log('props in paymnet', props);
  const [formValue, updateFormValue] = useState({} as any);
  console.log('FORMVALUE', formValue);

  const updateFormValueHandler = (key: string, value: any) => {
    updateFormValue({ ...formValue, [key]: value });
  };

  const {
    data: paymentDetails,
    refetch,
    isPreviousData,
    isLoading: isLoadingAllClients,
    isSuccess,
  } = useQuery(['buscompany-payment-details', params?.id], getBusCompanyPaymentDetails);
  console.log('pament setting details', paymentDetails);

  useEffect(() => {
    if (paymentDetails && paymentDetails.data) {
      updateFormValue({ ...paymentDetails.data });
    }
  }, [isSuccess, paymentDetails?.success]);

  const {
    mutateAsync: mutateAsyncPaymentMethodSetting,
    isSuccess: isSuccessPayment,
    isError: isErrorPaymentMethod,
    isLoading: isLoadingPaymentMehthod,
    data: paymenMethodtData,
  } = useMutation(savePymentMethodSetting);

  console.log('Payment settings res', paymenMethodtData, isLoadingPaymentMehthod);

  const saveHandler = () => {
    if (params?.id) {
      mutateAsyncPaymentMethodSetting({ ...formValue, company_id: params.id });
    }
  };

  return (
    <div className={classes.paperContainer}>
      <form onSubmit={(e) => e.preventDefault()}>
        <Box className={classes.teleBirrMPessaWrapper}>
          <div>
            <div className={classes.teleBirrMPessaContainer}>
              <p className={classes.pDiv}>{switchData.telebirr} :</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  variant="outlined"
                  size="small"
                  type="text"
                  required
                  value={formValue?.telebirr_account}
                  onChange={(e) => updateFormValueHandler('telebirr_account', e.target.value)}
                />
                {/* <Button variant="contained" size="medium" style={{ background: '#4caf50', color: '#ffffff', margin: 5 }}>
                {switchData.add}
              </Button> */}
              </div>
            </div>
            {/* <div className={classes.teleBirrMPessaContainer}>
              <p className={classes.pDiv}>CBE Account :</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  variant="outlined"
                  size="small"
                  type="text"
                  required
                  value={formValue?.cbe_account}
                  onChange={(e) => updateFormValueHandler('cbe_account', e.target.value)}
                />
                <Button variant="contained" size="medium" style={{ background: '#4caf50', color: '#ffffff', margin: 5 }}>
              {switchData.add}
              </Button>
              </div>
            </div> */}
          </div>
          <div className={classes.btnContainer}>
            <Button
              variant="contained"
              type="submit"
              onClick={saveHandler}
              style={{ background: '#4caf50', color: '#ffffff', marginRight: 5 }}>
              {switchData.save}
            </Button>
            <Link href="/dashboard/bus-company-management">
              <Button variant="contained" color="secondary">
                {switchData.cancel}
              </Button>
            </Link>
          </div>
        </Box>
      </form>
      <NotificationLoader
        message={paymenMethodtData?.success && paymenMethodtData?.msg}
        loading={isLoadingPaymentMehthod}
        error={JSON.stringify(paymenMethodtData?.errors)}
      />
    </div>
  );
}
