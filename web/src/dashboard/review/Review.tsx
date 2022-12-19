import { Box, Button, darken, InputBase, Modal, Paper, Switch, Tab, Tabs } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import Link from 'next/link';
import { format } from 'date-fns';
import { useIntl } from 'react-intl';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { getBusCompnayList, updateBusCompany, deleteBusCompany } from '../../apis/bus/busCompany';
import { useQuery, useMutation } from 'react-query';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import { deleteReview, getReview, updateReviewStatus } from '../../apis/review/review';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

// Language Switching data========
const switchData = {
  addBusCompany: <IntlMessages id={'addbuscompany'} />,
  filterName: <IntlMessages id={'filterbyname'} />,
  choose: <IntlMessages id={'choose'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  delete: <IntlMessages id={'delete'} />,
  routes: <IntlMessages id={'routes'} />,
  all: <IntlMessages id={'all'} />,
  active: <IntlMessages id={'active'} />,
  inactive: <IntlMessages id={'inactive'} />,

  areYouSureYouWantToDelete: <IntlMessages id={'exitMsg'} />,
  no: <IntlMessages id={'no'} />,
  yes: <IntlMessages id={'yes'} />,
};

interface Data {
  [key: string]: any;
}

interface HeadCell {
  key: string;
  label: any;
}

const headCells: HeadCell[] = [
  { key: 'busName', label: <IntlMessages id={'busName'} /> },
  { key: 'userName', label: <IntlMessages id={'user'} /> },
  { key: 'review', label: <IntlMessages id={'review'} /> },
  { key: 'noOfStarRating', label: <IntlMessages id={'noOfStarRating'} /> },
  { key: 'date', label: <IntlMessages id={'date'} /> },
  { key: 'status', label: <IntlMessages id={'status'} /> },
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
  Container: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 15,
  },
  btnSearchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 15,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  srchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 15,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: 10,
      marginBottom: 10,
    },
  },
  formControl: {
    minWidth: 300,
    marginLeft: 10,
  },
  btnDsn: {
    textTransform: 'capitalize',
    background: '#4caf50',
    color: '#ffffff',
    marginRight: 15,
    [theme.breakpoints.down('sm')]: {
      width: '70%',
      marginRight: 5,
    },
  },
  mulBtnContainer: {
    display: 'flex',
    alignItems: 'end',
    width: '30%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContaint: 'unset',
    },
  },
  paper: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 400,
    height: '15%',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
    marginLeft: 70,
  },
}));

export default function Review() {
  const classes = useStyles();
  const [searchKey, updateSearchKey] = useState('');
  const [searchInput, setSearchInput] = useState({} as any);
  const [status, updateStatus] = useState('');
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  const { locale } = useIntl();
  const [open, toggleModal] = useState<any>(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [userInfo, setUserInfo] = useState({} as any);

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  const {
    data: reviewData,
    refetch,
    isPreviousData,
    isLoading: isLoadingAllClients,
    isSuccess,
  } = useQuery(['Review', '', pageInfo?.page, pageInfo.size], getReview);

  const {
    mutateAsync: mutateAsyncUpdateReviewStatus,
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isLoading: isLoadingUpdate,
    data: dataUpdate,
  } = useMutation(updateReviewStatus);

  const updateReviewStatusHandler = (obj: any) => {
    mutateAsyncUpdateReviewStatus({
      ...obj,
      isPublic: !obj.isPublic,
    });
  };

  useEffect(() => {
    if (dataUpdate && dataUpdate?.success) {
      refetch();
    }
  }, [dataUpdate, isSuccessUpdate]);

  const {
    mutateAsync: mutateAsyncDeleteReview,
    isSuccess: isSuccessDeleteReview,
    isError: isErrorDeleteReview,
    error: errorDeleteReview,
    isLoading: isLoadingDeleteReview,
    data: deleteReviewData,
  } = useMutation(deleteReview);

  console.log('DeletedReviewData', deleteReviewData);

  const deleteHandler = (obj: any) => {
    // mutateAsyncDeleteBus(obj);
    toggleModal(obj);
  };

  const modalCloseHandler = () => {
    toggleModal(null);
  };

  const deleteReviewListHandler = () => {
    mutateAsyncDeleteReview(open);
  };

  useEffect(() => {
    if (isSuccessDeleteReview && deleteReviewData.success) {
      refetch();
      modalCloseHandler();
    }
  }, [isSuccessDeleteReview]);

  // useEffect(() => {
  //   if (isSuccessDeleteBus && dataDeleteBus.success) {
  //     refetch();
  //     modalCloseHandler();
  //   }
  // }, [isSuccessDeleteBus]);

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };
  console.log('pageInfo', pageInfo);
  console.log('review', reviewData);

  return (
    <div>
      <Modal
        keepMounted
        open={open}
        // onClose={modalCloseHandler}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div style={modalStyle} className={classes.paper}>
          <h4>{switchData.areYouSureYouWantToDelete}</h4>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={deleteReviewListHandler}
              style={{ marginRight: 5 }}
              variant="contained"
              color="primary"
              size="small">
              {switchData.yes}
            </Button>
            <Button onClick={modalCloseHandler} variant="contained" color="secondary" size="small">
              {switchData.no}
            </Button>
          </div>
        </div>
      </Modal>
      <GrdTable
        headCells={headCells}
        pageNoHandler={pageNoHandler}
        totalRecordCount={reviewData?.totaldata}
        loading={isLoadingAllClients}
        rows={
          reviewData && reviewData.data
            ? reviewData.data.map((r: any) => {
                return {
                  ...r,
                  busName: r?.bus_id?.[locale]?.name,
                  // bus_legal_name: ((userInfo.role === 'super-admin') || (userInfo.role === 'admin'))? `${r[locale]?.bus_legal_name}(${r[locale]?.bus_number})`: `${r[locale]?.plate_number}(${r[locale]?.bus_number})`,
                  bus_name: r.bus_id?.[locale]?.name,
                  userName: `${r?.user_id?.firstname} ${r?.user_id?.lastname}`,
                  review: r?.comment,
                  noOfStarRating: r?.average,
                  // date: format(new Date(r?.data?.created_at), 'yyyy-MM-dd'),
                  date: format(new Date(r?.created_at), 'yyyy-MM-dd'),
                  status: (
                    <Switch
                      checked={r.isPublic}
                      color="primary"
                      onChange={() => updateReviewStatusHandler(r)}
                      name="checkedA"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  ),
                  action: [
                    // <Button onClick={() => deleteHandler(r)} key={1} variant="text"  style={{ margin: 5 }}>
                    //   <DeleteOutlineIcon/>
                    // </Button>

                    <Button onClick={() => deleteHandler(r)} key={2} variant="contained" color="secondary">
                      {switchData.delete}
                    </Button>,
                  ],
                };
              })
            : []
        }
      />

      <NotificationLoader
        message={dataUpdate?.msg || deleteReviewData?.msg}
        loading={isLoadingUpdate || isLoadingDeleteReview}
        error={''}
      />
    </div>
  );
}
