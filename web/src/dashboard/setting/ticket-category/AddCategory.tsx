import { Box, Button, Paper, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { NotificationLoader } from '../../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../../@jumbo/utils/IntlMessages';
import {
  addSupportCategory,
  getSupportCategoryDetails,
  updateSupportCategory,
} from '../../../apis/settings/category/category';

// Language Switching data========
const switchData = {
  category: <IntlMessages id={'category'} />,
  choose: <IntlMessages id={'choose'} />,
  location: <IntlMessages id={'location'} />,
  save: <IntlMessages id={'save'} />,
  cancel: <IntlMessages id={'cancel'} />,
  update: <IntlMessages id={'update'} />,
  add: <IntlMessages id={'add'} />,
  addCategory: <IntlMessages id={'addCategory'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 15,
    },
  },
  categoryContainer: {
    paddingBottom: 50,
    paddingRight: '30px',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: 20,
      paddingTop: 0,
      paddingRight: 0,
    },
  },
  categoryWrapper: {
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
  headerContainer: {
    width: '100%',
    // marginBottom:20,
  },
}));

export default function AddCategory(props: any) {
  const { params } = props;
  const classes = useStyles();
  const [formValue, updateFormValue] = useState({} as any);

  const inputFormHandler = (key: string, value: any) => {
    updateFormValue({ ...formValue, [key]: value });
  };

  const {
    mutateAsync: mutateAsyncAddCategory,
    isSuccess: isSuccessAddCategory,
    isError: isErrorAddCategory,
    isLoading: isLoadingAddCategory,
    data: addCategoryData,
  } = useMutation(addSupportCategory);

  const {
    mutateAsync: mutateAsyncUpdateCategory,
    isSuccess: isSuccessUpdateCategory,
    isError: isErrorUpdateCategory,
    error: errorUpdateCategory,
    isLoading: isLoadingUpdateCategory,
    data: updateCategoryData,
  } = useMutation(updateSupportCategory);

  const saveHandler = () => {
    if (formValue?._id) {
      mutateAsyncUpdateCategory(formValue);
    } else {
      mutateAsyncAddCategory(formValue);
    }
  };
  // Re-directing after success==
  useEffect(() => {
    if (updateCategoryData?.success || addCategoryData?.success) {
      Router.push(`/dashboard/setting/${3}`);
    }
  }, [isSuccessUpdateCategory, isSuccessAddCategory]);

  //getDatabyId==

  const {
    mutateAsync: mutateAsyncGetSupportDetails,
    isSuccess: isSuccessGetSupportCategory,
    isError: isErrorGetSupportCategory,
    error: errorGetSupportCategory,
    isLoading: isLoadingGetSupportCategory,
    data: getSupportCategoryData,
  } = useMutation(getSupportCategoryDetails);

  useEffect(() => {
    if (params && params?.id) {
      mutateAsyncGetSupportDetails(params);
    }
  }, []);

  useEffect(() => {
    if (getSupportCategoryData && getSupportCategoryData.success) {
      updateFormValue(getSupportCategoryData.data);
    }
  }, [isSuccessGetSupportCategory, getSupportCategoryData]);

  return (
    <div>
      <Paper square className={classes.paperContainer}>
        <div className={classes.headerContainer}>
          <Typography variant="h2">{switchData.addCategory}</Typography>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <Box className={classes.categoryContainer}>
            <div className={classes.categoryWrapper}>
              <Box className={classes.txtBtnContainer}>
                <div style={{ display: 'flex', margin: 5, alignItems: 'center', width: '100%' }}>
                  <p style={{ width: '30%' }}>{switchData.category}:</p>
                  <TextField
                    onChange={(e) => inputFormHandler('category', e.target.value)}
                    type="text"
                    required
                    value={formValue?.category}
                    size="small"
                    variant="outlined"
                    placeholder="Enter Category Name"
                  />
                </div>
              </Box>
            </div>
            <div className={classes.btnContainer}>
              <Button
                onClick={saveHandler}
                variant="contained"
                type="submit"
                style={{ background: '#4caf50', color: '#ffffff', marginRight: 5 }}>
                {params && params.id ? switchData.update : switchData.save}
              </Button>
              <Link href="/dashboard/setting/3">
                <Button variant="contained" color="secondary">
                  {switchData.cancel}
                </Button>
              </Link>
            </div>
          </Box>
        </form>
        <NotificationLoader
          message={updateCategoryData?.msg || addCategoryData?.msg}
          loading={isLoadingUpdateCategory || isLoadingAddCategory}
          error={JSON.stringify(addCategoryData?.errors) || JSON.stringify(updateCategoryData?.errors)}
        />
      </Paper>
    </div>
  );
}
