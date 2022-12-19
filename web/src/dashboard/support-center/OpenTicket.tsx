import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { getSupportCategoryList } from '../../apis/settings/category/category';
import { addSupportTicket, updateSupport } from '../../apis/support/support';

// Language Switching data========
const switchData = {
  title: <IntlMessages id={'title'} />,
  category: <IntlMessages id={'category'} />,
  choose: <IntlMessages id={'choose'} />,
  priority: <IntlMessages id={'priority'} />,
  description: <IntlMessages id={'description'} />,
  uploadImages: <IntlMessages id={'uploadImages'} />,
  cancel: <IntlMessages id={'cancel'} />,
  save: <IntlMessages id={'save'} />,
  addTicket: <IntlMessages id={'addTicket'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      padding: 20,
    },
  },
  pTextContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  pContainer: {
    // marginTop: 15,
    width: '15%',
    [theme.breakpoints.down('sm')]: {
      width: '40%',
    },
  },
  languageFormControl: {
    // marginLeft: 15,
    minWidth: '16%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '60%',
    },
  },
  textArea: {
    padding: 10,
    width: '30%',
    [theme.breakpoints.down('sm')]: {
      width: '60%',
    },
  },
  textField: {
    width: '19%',
    [theme.breakpoints.down('sm')]: {
      width: '60%',
    },
  },
  titleTextArea: {
    [theme.breakpoints.down('sm')]: {
      width: '60%',
    },
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      marginTop: 10,
    },
  },

  headerContainer: {
    width: '100%',
    marginBottom: 20,
  },
}));

const priority = [
  { id: 1, name: 'high', value: 'high' },
  { id: 2, name: 'medium', value: 'medium' },
  { id: 2, name: 'low', value: 'low' },
];

export default function OpenTicket() {
  const classes = useStyles();
  const [formValue, setFormValue] = useState({} as any);
  const updateFormValueHandler = (key: string, value: any) => {
    setFormValue({ ...formValue, [key]: value });
  };
  console.log('formvalue==', formValue);

  const {
    refetch,
    isSuccess: isSuccessGetCategoryList,
    isError: isErrorGetCategoryList,
    error: getCategoryListError,
    isLoading: isLoadingGetCategoryList,
    data: getCategoryDataList,
  } = useQuery(['support-category'], getSupportCategoryList);

  console.log('supportCategoryList', getCategoryDataList);

  const {
    mutateAsync: mutateAsyncAddSupport,
    isSuccess: isSuccessAddSupport,
    isError: isErrorAddSupport,
    error: addSupportError,
    isLoading: isLoadingAddSupport,
    data: addSupportData,
  } = useMutation(addSupportTicket);
  console.log('Add-Suport', addSupportData);

  const {
    mutateAsync: mutateAsyncUpdateSupport,
    isSuccess: isSuccessUpdteSupport,
    isError: isErrorUpdateSupport,
    error: updateSupportError,
    isLoading: isLoadingUpdateSupport,
    data: updateSupportData,
  } = useMutation(updateSupport);

  const saveHandler = () => {
    if (formValue._id) {
      mutateAsyncUpdateSupport(formValue);
    } else {
      mutateAsyncAddSupport(formValue);
    }
  };

  // Re-directing after success==
  useEffect(() => {
    if (updateSupportData?.success || addSupportData?.success) {
      setTimeout(() => {
        Router.push('/dashboard/support-center');
      }, 200);
    }
  }, [isSuccessUpdteSupport, isSuccessAddSupport]);

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <div className={classes.headerContainer}>
          <Typography gutterBottom variant="h2">
            
            {switchData.addTicket}
          </Typography>
        </div>
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <div className={classes.pTextContainer}>
            <p className={classes.pContainer}>{switchData.title} :</p>
            <TextField
              type="text"
              size="small"
              required
              className={classes.titleTextArea}
              key={1}
              variant="outlined"
              value={formValue?.title}
              onChange={(e) => updateFormValueHandler('title', e.target.value)}
            />
          </div>
          <div className={classes.pTextContainer}>
            <p className={classes.pContainer}>{switchData.category} :</p>
            <FormControl variant="outlined" size="small" className={classes.languageFormControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                <p>- {switchData.choose} -</p>
              </InputLabel>

              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                label="- choose -"
                value={formValue?.category}
                onChange={(e) => updateFormValueHandler('category', e.target.value)}>
                {getCategoryDataList?.data?.map((obj: any) => (
                  <MenuItem value={obj._id} key={obj._id}>
                    {obj.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={classes.pTextContainer}>
            <p className={classes.pContainer}>{switchData.priority} :</p>
            <FormControl variant="outlined" size="small" className={classes.languageFormControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                <p>- {switchData.choose} -</p>
              </InputLabel>

              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                label="- choose -"
                value={formValue.priority}
                onChange={(e) => updateFormValueHandler('priority', e.target.value)}>
                {priority.map((obj: any) => (
                  <MenuItem value={obj.value} key={obj.name}>
                    {obj.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={classes.pTextContainer}>
            <p className={classes.pContainer}>{switchData.description} :</p>

            <TextareaAutosize
              className={classes.textArea}
              minRows={4}
              value={formValue?.description}
              required
              onChange={(e) => updateFormValueHandler('description', e.target.value)}
            />
          </div>
          {/* <div className={classes.pTextContainer}>
            <p className={classes.pContainer}>{switchData.uploadImages} :</p>
            <TextField
              type="file"
              size="small"
              variant="outlined"
              required
              className={classes.textField}
              value={formValue?.upload_image}
              onChange={(e) => updateFormValueHandler('upload_image', e.target.value)}
            />
          </div> */}

          <div className={classes.btnContainer}>
            <Button variant="contained" type="submit" color="primary" onClick={saveHandler} style={{ marginRight: 5 }}>
              {switchData.save}
            </Button>
            <Link href="/dashboard/support-center">
              <Button variant="contained" color="secondary" style={{ marginRight: 5 }}>
                {switchData.cancel}
              </Button>
            </Link>
          </div>
        </form>
        <NotificationLoader
          message={
            (addSupportData?.success && addSupportData?.msg) || (updateSupportData?.success && updateSupportData?.msg)
          }
          loading={isLoadingAddSupport || isLoadingUpdateSupport}
          error={JSON.stringify(addSupportData?.errors) || JSON.stringify(updateSupportData?.errors)}
        />
      </Paper>
    </div>
  );
}
