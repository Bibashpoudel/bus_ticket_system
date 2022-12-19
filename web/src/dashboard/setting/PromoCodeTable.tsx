import { Button, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import { format } from 'date-fns';
import Link from 'next/link';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useMutation, useQuery } from 'react-query';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import {  getPromoCodeList, deletePromoCode } from '../../apis/settings/promocode/promo_code';

// Language Switching data========
const switchData = {
  addPromoCode: <IntlMessages id={'addPromoCode'} />,
  update: <IntlMessages id={'update'} />,
  choose: <IntlMessages id={'choose'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  delete: <IntlMessages id={'delete'} />,
  routes: <IntlMessages id={'routes'} />,
  areYouSureYouWantToDelete: <IntlMessages id={'exitMsg'} />,
  no: <IntlMessages id={'no'} />,
  yes: <IntlMessages id={'delete'} />,
};

interface HeadCell {
  key: string;
  label: any;
}

const headCells: HeadCell[] = [
  { key: 'code', label: <IntlMessages id={'discountCode'} /> },
  { key: 'start_date', label: <IntlMessages id={'startDAte'} /> },
  { key: 'end_date', label: <IntlMessages id={'endDate'} /> },
  { key: 'code_type', label: <IntlMessages id={'discountType'} /> },
  { key: 'discount_value', label: <IntlMessages id={'discountValue'} /> },
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
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    [theme.breakpoints.down("sm")]:{
      paddingTop:0,
      paddingLeft:10,
      paddingRight:10,
    }
  },
  srchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 300,
    marginLeft: 10,
  },
  addPromoCodeBtn: {
    textTransform: 'capitalize',
    background: '#4caf50',
    color: '#ffffff',
    // marginRight: 10,
    hover: 'none',
    // marginTop: 10,
    [theme.breakpoints.down('sm')]: {
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
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function PromoCodeTable(props: any) {
  const [userInfo, setUserInfo] = useState({} as any);
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  const classes = useStyles();
  const[open, toggleModal] = useState<any>(false);
  const [modalStyle] = React.useState(getModalStyle);

  

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  const {
    data: promoCodeDataList,
    refetch: refetchPromoCode,
    isPreviousData: isPreviousPromoCode,
    isLoading: isLoadingPromoCode,
    isSuccess: isPromoCodeSuccess,
  } = useQuery(['PromoCodeList',pageInfo?.page, pageInfo.size], getPromoCodeList);

  const {
    mutateAsync: mutateAsyncDeletePromocode,
    isSuccess: isSuccessDeletePromocode,
    isError: isErrorDeletePromocode,
    error: errorDeletePromocode,
    isLoading: isLoadingDeletePromocode,
    data: deletePromocodeRes,
  } = useMutation(deletePromoCode);


  const deleteHandler = (obj: any) => {
    toggleModal(obj);
  };

  const modalCloseHandler = () => {
    toggleModal(null);
  }

  const deletePromoCodeHandler = () => {
    mutateAsyncDeletePromocode(open);
  }

  useEffect(() => {
    if (deletePromocodeRes?.success) {
      refetchPromoCode();
      modalCloseHandler();
    }
  }, [deletePromocodeRes, isSuccessDeletePromocode]);

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };

  return (
    <div className={classes.Container}>
      <Link href="/dashboard/add-promo-code">
        <Button className={classes.addPromoCodeBtn}>+{switchData.addPromoCode}</Button>
      </Link>

      <GrdTable
        headCells={headCells}
        pageNoHandler={pageNoHandler}
        totalRecordCount={promoCodeDataList?.totaldata}
        loading={isLoadingPromoCode}
        rows={
          promoCodeDataList && promoCodeDataList.data
            ? promoCodeDataList.data.map((r: any) => {
                return {
                  ...r,
                  start_date: format(new Date(r.start_date), 'yyyy-MM-dd'),
                  end_date: format(new Date(r.end_date), 'yyyy-MM-dd'),
                  discount_value: r?.code_type === 'percent' ? r?.percent : r.amount?.usd,
                  action: [
                    <Link key={1} href={`/dashboard/update-promocode/${r._id}`}>
                      <Button key={1} variant="contained" color="primary" style={{ margin: 5 }}>
                       {switchData.update}
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
        // loading={isLoadingPromoCode}
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
    <Button onClick={deletePromoCodeHandler} style={{marginRight:5}} variant='contained' color='primary' size='small'>{switchData.yes}</Button>
     <Button  onClick={modalCloseHandler} variant='contained' color='secondary' size='small'>{switchData.no}</Button>
    </div>
    </div>
      </Modal>
      <NotificationLoader
        message={deletePromocodeRes?.success && deletePromocodeRes?.msg}
        loading={isLoadingDeletePromocode}
        error={JSON.stringify(deletePromocodeRes?.errors)}
      />
    </div>
  );
}
