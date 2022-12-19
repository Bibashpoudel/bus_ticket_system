import { Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Link from 'next/link';
import { addPromocode, getPromoCodeDetails, updatePromocode } from '../../apis/settings/promocode/promo_code';
import { useMutation } from 'react-query';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import Router from 'next/router';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';

// Language Switching data========
const switchData = {
  discountCode: <IntlMessages id={'discountCode'} />,
  startDAte: <IntlMessages id={'startDAte'} />,
  endDate: <IntlMessages id={'endDate'} />,
  discountType: <IntlMessages id={'discountType'} />,
  fixed: <IntlMessages id={'fixed'} />,
  percent: <IntlMessages id={'percent'} />,
  dicountValueUsd: <IntlMessages id={'dicountValueUsd'} />,
  discountValueBirr: <IntlMessages id={'discountValueBirr'} />,
  discount: <IntlMessages id={'discount'} />,
  cancel: <IntlMessages id={'cancel'} />,
  choose: <IntlMessages id={'choose'} />,
  update: <IntlMessages id={'update'} />,
  save: <IntlMessages id={'save'} />,
  addPromoCode: <IntlMessages id={'addPromoCode'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 15,
    },
  },
  pTextContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  pContainer: {
    width: '18%',
    // marginTop: 15,
    [theme.breakpoints.down('sm')]: {
      width: '50%',
    },
  },
  datePicker: {
    width: '18%',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      width: '60%',
    },
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: '18%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '57%',
    },
  },
  textField: {
    // minWidth: '18%',
  },
  headerContainer: {
    width: '100%',
    marginBottom: 20,
  },
}));

export default function AddPromoCode(props: any) {
  const { params } = props;
  const classes = useStyles();
  const [start_date, setStartDate] = useState(new Date());
  const [end_date, setEndDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [discountType, updateDiscountType] = useState<any>('percent');
  const [discountValue, updateDiscountValue] = useState<any>();
  const [code, updateCode] = useState<any>('');
  const [percent, updatePercentValue] = useState<any>();

  const {
    mutateAsync: mutateAsyncGetPromocodeById,
    isSuccess: isSuccessGetPromocode,
    isError: isErrorGetPromocode,
    error: errorGetPromocode,
    isLoading: isLoadingGetPromocode,
    data: getPromocodeData,
  } = useMutation(getPromoCodeDetails);

  useEffect(() => {
    if (params && params.id) {
      mutateAsyncGetPromocodeById(params);
    }
  }, []);

  useEffect(() => {
    if (getPromocodeData?.data) {
      const { code, amount, code_type, start_date, end_date, percent } = getPromocodeData.data;
      setStartDate(start_date);
      setEndDate(end_date);
      updateCode(code);
      updateDiscountType(code_type);
      updateDiscountValue(amount);
      updatePercentValue(percent);
    }
  }, [getPromocodeData, isSuccessGetPromocode]);

  const updateStartDate = (date: any) => {
    setStartDate(date);
  };

  const updateEndDate = (date: any) => {
    setEndDate(date);
  };

  const {
    mutateAsync: mutateAsyncAddPromocode,
    isSuccess: isSuccessAddPromoCode,
    isError: isErrorAddPromoCode,
    error: errorAddPromoCode,
    isLoading: isLoadingAddPromoCode,
    data: addPromoCodeRes,
  } = useMutation(addPromocode);

  const {
    mutateAsync: mutateAsyncUpdatePromocode,
    isSuccess: isSuccessUpdatePromocode,
    isError: isErrorUpdatePromocode,
    error: errorUpdatePromocode,
    isLoading: isLoadingUpdatePromocode,
    data: updatePromocodeRes,
  } = useMutation(updatePromocode);

  useEffect(() => {
    if (addPromoCodeRes?.success || updatePromocodeRes?.success) {
      setTimeout(() => {
        Router.push('/dashboard/setting/0');
      }, 2000);
    }
  }, [addPromoCodeRes, isSuccessAddPromoCode, updatePromocodeRes]);

  const saveHandler = () => {
    if (params?.id) {
      mutateAsyncUpdatePromocode({
        _id: params.id,
        code,
        code_type: discountType,
        start_date,
        end_date,
        amount: discountValue,
        reach_count: 10,
        percent,
      });
    } else {
      mutateAsyncAddPromocode({
        code,
        code_type: discountType,
        start_date,
        end_date,
        amount: discountValue,
        reach_count: 10,
        percent,
      });
    }
  };

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <div className={classes.headerContainer}>
          <Typography variant="h2"> {switchData.addPromoCode}</Typography>
        </div>
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <FormControl style={{ width: '100%' }}>
            <div className={classes.pTextContainer}>
              <p className={classes.pContainer}>{switchData.startDAte} :</p>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="DD/MM/YYYY"
                margin="normal"
                id="date-picker-inline"
                value={start_date}
                onChange={updateStartDate}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                className={classes.datePicker}
                size="small"
              />
            </div>
            <div className={classes.pTextContainer}>
              <p className={classes.pContainer}>{switchData.endDate} :</p>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="DD/MM/YYYY"
                margin="normal"
                id="date-picker-inline"
                value={end_date}
                onChange={updateEndDate}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                className={classes.datePicker}
                size="small"
              />
            </div>
            <div className={classes.pTextContainer}>
              <p className={classes.pContainer}>{switchData.discountCode} :</p>
              <TextField
                value={code}
                onChange={(e) => updateCode(e.target.value)}
                variant="outlined"
                size="small"
                required
                className={classes.textField}
              />
            </div>
            <div className={classes.pTextContainer}>
              <p className={classes.pContainer}>{switchData.discountType} :</p>
              <FormControl size="small" variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-customized-select-label">
                  <p>- {switchData.choose} -</p>
                </InputLabel>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={discountType}
                  variant="outlined"
                  label="- choose -"
                  // @ts-ignore
                  onChange={(e) => updateDiscountType(e.target.value)}>
                  {/* <MenuItem value={'fixed'}>{switchData.fixed}</MenuItem> */}
                  <MenuItem value={'percent'}>{switchData.percent}</MenuItem>
                </Select>
              </FormControl>
            </div>

            {discountType === 'fixed' && (
              <>
                {' '}
                <div className={classes.pTextContainer}>
                  <p className={classes.pContainer}>{switchData.dicountValueUsd}:</p>
                  <TextField
                    value={discountValue?.usd}
                    onChange={(e) => updateDiscountValue({ ...discountValue, usd: e.target.value })}
                    variant="outlined"
                    size="small"
                    type="number"
                    required
                    className={classes.textField}
                  />
                </div>
                <div className={classes.pTextContainer}>
                  <p className={classes.pContainer}>{switchData.discountValueBirr}:</p>
                  <TextField
                    value={discountValue?.birr}
                    onChange={(e) => updateDiscountValue({ ...discountValue, birr: e.target.value })}
                    variant="outlined"
                    size="small"
                    type="number"
                    // required
                    className={classes.textField}
                  />
                </div>
              </>
            )}
            {discountType === 'percent' && (
              <div className={classes.pTextContainer}>
                <p className={classes.pContainer}>{switchData.discount} (%):</p>
                <TextField
                  value={percent}
                  onChange={(e) => updatePercentValue(e.target.value)}
                  variant="outlined"
                  size="small"
                  type="number"
                  // required
                  className={classes.textField}
                />
              </div>
            )}
          </FormControl>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <Button
              onClick={saveHandler}
              variant="contained"
              type="submit"
              color="primary"
              size="small"
              style={{ marginRight: 5 }}>
              {params?.id ? switchData.update : switchData.save}
            </Button>
            <Link href="/dashboard/setting/0">
              <Button variant="contained" color="secondary" size="small">
                {switchData.cancel}
              </Button>
            </Link>
          </div>
        </form>
        <NotificationLoader
          message={
            (addPromoCodeRes?.success && addPromoCodeRes?.msg) || (updatePromocodeRes?.success && updatePromocodeRes?.msg)
          }
          loading={isLoadingAddPromoCode || isLoadingUpdatePromocode}
          error={JSON.stringify(addPromoCodeRes?.errors)}
        />
      </Paper>
    </div>
  );
}
