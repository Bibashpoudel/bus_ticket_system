import { Box, Button, InputBase, Modal, Paper, Switch, Tab, Tabs } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from 'react-query';
import IntlMessages from '../../../../@jumbo/utils/IntlMessages';
import GrdTable from '../../../components/MDGridTable';
import { deleteSupportCategory, getSupportCategoryList } from '../../../apis/settings/category/category';
import { NotificationLoader } from '../../../../@jumbo/components/ContentLoader';

// Language Switching data========
const switchData = {
  addCategory: <IntlMessages id={'addCategory'} />,
  category: <IntlMessages id={'category'} />,
  action: <IntlMessages id={'action'} />,
  edit: <IntlMessages id={'edit'} />,
  delete: <IntlMessages id={'delete'} />,

  search: <IntlMessages id={'search'} />,

  routes: <IntlMessages id={'routes'} />,
  areYouSureYouWantToDelete: <IntlMessages id={'exitMsg'} />,
  no: <IntlMessages id={'no'} />,
  yes: <IntlMessages id={'delete'} />,
};

interface Data {
  [key: string]: any;
}

interface HeadCell {
  key: string;
  label: any;
}

const headCells: HeadCell[] = [
  { key: 'category', label: <IntlMessages id={'category'} /> },
  { key: 'action', label: <IntlMessages id={'action'} /> },
];

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 15,
    },
  },
  Container: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 15,
  },
  srchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  formControl: {
    minWidth: 300,
    marginLeft: 10,
  },
  btnDsgn: {
    textTransform: 'capitalize',
    background: '#4caf50',
    color: '#ffffff',
    marginRight: 15,
    [theme.breakpoints.down('sm')]: {
      width: '50%',
      marginRight: 5,
    },
  },
  paper: {
    position: 'absolute',
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between',
    width: 400,
    height:'15%',
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    // boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SupportTicketCategory() {
  const classes = useStyles();
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  const [modalStyle] = React.useState(getModalStyle);
  const[open, toggleModal] = useState<any>(false);


  

  const {
    refetch,
    isSuccess: isSuccessGetCategoryList,
    isError: isErrorGetCategoryList,
    error: getCategoryListError,
    isLoading: isLoadingGetCategoryList,
    data: getCategoryDataList,
  } = useQuery(['support-category', pageInfo.page, pageInfo.size], getSupportCategoryList);

  console.log('getCategoryDataList', getCategoryDataList);

  const {
    mutateAsync: mutateAsyncDeleteCategory,
    isSuccess: isSuccessDeleteCategory,
    isError: isErrorDeleteCategory,
    error: errorDeleteCategory,
    isLoading: isLoadingDeleteCategory,
    data: deleteCategoryData,
  } = useMutation(deleteSupportCategory);

  const deleteHandler = (obj: any) => {
    toggleModal(obj);
    // mutateAsyncDeleteCategory(obj);
  };
  const modalCloseHandler = () => {
    toggleModal(null);
  }

  const deleteCategoryHandler = () => {
    mutateAsyncDeleteCategory(open);
  }

  useEffect(() => {
    if (isSuccessDeleteCategory && deleteCategoryData.success) {
      refetch();
      modalCloseHandler();
    }
  }, [isSuccessDeleteCategory]);

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };

  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.srchContainer}>
        <Box className={classes.srchContainer}>
          <Link href="/dashboard/add-category">
            <Button variant="contained" size="small" className={classes.btnDsgn}>
              +{switchData.addCategory}
            </Button>
          </Link>
        </Box>
      </div>
      <GrdTable
        headCells={headCells}
        pageNoHandler={pageNoHandler}
        totalRecordCount={getCategoryDataList?.totaldata}
        loading={isLoadingGetCategoryList}
        rows={
          getCategoryDataList && getCategoryDataList?.data
            ? getCategoryDataList?.data.map((r: any) => {
                return {
                  ...r,
                  category: r?.category,

                  action: [
                    <Link key={r._id} href={`/dashboard/support-category/${r._id}`}>
                      <Button key={1} variant="contained" color="primary" style={{ margin: 5 }}>
                        {switchData.edit}
                      </Button>
                    </Link>,
                    <Button onClick={() => deleteHandler(r)} key={2} variant="contained" color="secondary">
                      {switchData.delete}
                    </Button>,
                  ],
                };
              })
            : []
        }
      />
       <Modal
      keepMounted
        open={open}
        // onClose={modalCloseHandler}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        >
        <div style={modalStyle} className={classes.paper}>
      <h4>{switchData.areYouSureYouWantToDelete}</h4>
    <div style={{width:'100%', display:'flex',justifyContent:"flex-end"}}>
    <Button onClick={deleteCategoryHandler} style={{marginRight:5}} variant='contained' color='primary' size='small'>{switchData.yes}</Button>
     <Button  onClick={modalCloseHandler} variant='contained' color='secondary' size='small'>{switchData.no}</Button>
    </div>
    </div>
      </Modal>
      <NotificationLoader
        message={deleteCategoryData?.msg}
        loading={isLoadingDeleteCategory}
        error={deleteCategoryData?.success && JSON.stringify(deleteCategoryData?.errors)}
      />
    </Paper>
  );
}
