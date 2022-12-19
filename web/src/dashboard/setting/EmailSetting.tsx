import { Button, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { getEmailSettingsList, saveEmailsettings, updateEmailsettings } from '../../apis/settings/email';


// Language Switching data========
const switchData = {
  service: <IntlMessages id={'service'} />,
  smtpHost: <IntlMessages id={'smtpHost'} />,
  smtpPort: <IntlMessages id={'smtpPort'} />,
  fromName: <IntlMessages id={'fromName'} />,
  sender: <IntlMessages id={'sender'} />,
  account: <IntlMessages id={'account'} />,
  smtpSecurity: <IntlMessages id={'smtpSecurity'} />,
  smtpPassword: <IntlMessages id={'smtpPassword'} />,
  save: <IntlMessages id={'save'} />,
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
    width: '20%',
    [theme.breakpoints.down('sm')]: {
      width: '60%',
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

export default function EmailSetting() {
  const [formValue, updateFormValue] = useState({} as any);

  const updateFormValueHandler = (key: string, value: any) => {
    updateFormValue({ ...formValue, [key]: value });
  };

  const classes = useStyles();


  const {
    mutateAsync: mutateAsyncSaveEmailSettings,
    isSuccess: isSuccessSaveEmail,
    isError: isErrorSaveEmail,
    error: errorSaveEmail,
    isLoading: isLoadingSaveEmail,
    data: saveEmailRes,
  } = useMutation(saveEmailsettings);


  const {
    mutateAsync: mutateAsyncUpdateEmailSettings,
    isSuccess: isSuccessUpdateEmail,
    isError: isErrorUpdateEmail,
    error: errorUpdateEmail,
    isLoading: isLoadingUpdateEmail,
    data: updateEmailRes,
  } = useMutation(updateEmailsettings);


  const saveHandler = () => {
    if (formValue._id) {
      mutateAsyncUpdateEmailSettings(formValue);
    } else {
      mutateAsyncSaveEmailSettings(formValue);
    }
  };

  const {
    refetch,
    isSuccess: isSuccessGetEmailSettings,
    isError: isErrorGetEmailSettings,
    error: errorGetEmailSettings,
    isLoading: isLoadingGetEmailSettings,
    data: emailData,
  } = useQuery(['email-settings'], getEmailSettingsList);


  useEffect(() => {
    if (emailData && emailData.success) {
      updateFormValue(emailData.data[0] || {} );
    }
  }, [emailData, isSuccessGetEmailSettings]);

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <div className={classes.pTextContainer}>
          <p className={classes.pContainer}>{switchData.service} :</p>
          <TextField
            value={formValue?.service}
            type="text"
            size="small"
            onChange={(e) => updateFormValueHandler('service', e.target.value)}
          />
        </div>
        <div className={classes.pTextContainer}>
          <p className={classes.pContainer}>{switchData.smtpHost} :</p>
          <TextField
            type="text"
            size="small"
            value={formValue?.host}
            onChange={(e) => updateFormValueHandler('host', e.target.value)}
          />
        </div>
        <div className={classes.pTextContainer}>
          <p className={classes.pContainer}>{switchData.smtpPort} :</p>
          <TextField
            type="number"
            size="small"
            value={formValue?.port}
            onChange={(e) => updateFormValueHandler('port', e.target.value)}
          />
        </div>
        <div className={classes.pTextContainer}>
          <p className={classes.pContainer}>{switchData.fromName} :</p>
          <TextField
            type="text"
            size="small"
            value={formValue?.name}
            onChange={(e) => updateFormValueHandler('name', e.target.value)}
          />
        </div>
        <div className={classes.pTextContainer}>
          <p className={classes.pContainer}>{switchData.sender} :</p>
          <TextField
            type="text"
            size="small"
            value={formValue?.sender}
            onChange={(e) => updateFormValueHandler('sender', e.target.value)}
          />
        </div>
        <div className={classes.pTextContainer}>
          <p className={classes.pContainer}>{switchData.account} :</p>
          <TextField
            type="text"
            size="small"
            value={formValue.account}
            onChange={(e) => updateFormValueHandler('account', e.target.value)}
          />
        </div>
        <div className={classes.pTextContainer}>
          <p className={classes.pContainer}>{switchData.smtpSecurity} :</p>
          <TextField
            type="text"
            size="small"
            value={formValue.security}
            onChange={(e) => updateFormValueHandler('security', e.target.value)}
          />
        </div>

        <div className={classes.pTextContainer}>
          <p className={classes.pContainer}>{switchData.smtpPassword} :</p>
          <TextField
            type="text"
            size="small"
            value={formValue.password}
            onChange={(e) => updateFormValueHandler('password', e.target.value)}
          />
        </div>
        <div className={classes.saveBtnContainer}>
          <Button onClick={saveHandler} variant="contained" color="primary">
            {switchData.save}
          </Button>
        </div>
        <NotificationLoader
          message={(saveEmailRes?.success && saveEmailRes?.msg) || (updateEmailRes?.success && updateEmailRes?.msg)}
          loading={isLoadingSaveEmail || isLoadingUpdateEmail}
          error={JSON.stringify(saveEmailRes?.errors) || JSON.stringify(updateEmailRes?.errors)}
        />
      </Paper>
    </div>
  );
}
