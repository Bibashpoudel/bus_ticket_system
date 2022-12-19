import { Box, Button, InputBase, Modal, Paper, Switch, Tab, Tabs } from '@material-ui/core';
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
  { key: 'bus_name', label: <IntlMessages id={'busname'} /> },
  { key: 'contact_name', label: <IntlMessages id={'contactname'} /> },
  { key: 'contact_email', label: <IntlMessages id={'contactemail'} /> },
  { key: 'registered', label: <IntlMessages id={'registered'} /> },
  { key: 'commission_rate', label: <IntlMessages id={'commissionrate'} /> },
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
  },
}));

export default function MDBusCompanyManagement() {
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
    data: dataBusList,
    refetch,
    isPreviousData,
    isLoading: isLoadingAllClients,
    isSuccess,
  } = useQuery(['BuscompanyList', '', searchKey, status, pageInfo?.page, pageInfo.size], getBusCompnayList);
  console.log('busList', dataBusList);

  const {
    mutateAsync: mutateAsyncUpdateBusCompany,
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isLoading: isLoadingUpdate,
    data: dataUpdate,
  } = useMutation(updateBusCompany);

  const editHandler = (obj: any) => {
    mutateAsyncUpdateBusCompany({
      ...obj,
      isActive: !obj.isActive,
      contact_email: obj.user_id?.email,
      mobile_phone: obj?.user_id?.phone,
      company_logo: obj.user_id?.image,
    });
  };

  useEffect(() => {
    if (dataUpdate && dataUpdate.success) {
      refetch();
    }
  }, [isSuccessUpdate, dataUpdate]);

  const {
    mutateAsync: mutateAsyncDeleteBusCompany,
    isSuccess: isSuccessDeleteBusCompany,
    isError: isErrorDeleteBusCompany,
    error: errorDeleteBusCompany,
    isLoading: isLoadingDeleteBusCompany,
    data: dataDeleteBusCompany,
  } = useMutation(deleteBusCompany);

  const deleteHandler = (obj: any) => {
    toggleModal(obj);
    // mutateAsyncDeleteBusCompany(obj);
  };

  const modalCloseHandler = () => {
    toggleModal(null);
  };

  const deleteBusCompanyHandler = () => {
    mutateAsyncDeleteBusCompany(open);
  };

  useEffect(() => {
    if (isSuccessDeleteBusCompany && dataDeleteBusCompany.success) {
      refetch();
      modalCloseHandler();
    }
  }, [isSuccessDeleteBusCompany]);

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };
  console.log('pageInfo', pageInfo);

  return (
    <div>
      <div className={classes.btnSearchContainer}>
        <Box className={classes.srchContainer}>
          <Link href="/dashboard/add-bus-company">
            <Button variant="contained" size="small" className={classes.btnDsn}>
              {switchData.addBusCompany}
            </Button>
          </Link>
          <div style={{ border: '1px solid', display: 'flex', alignItems: 'center' }}>
            <InputBase
              onChange={(e) => updateSearchKey(e.target.value)}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              style={{ paddingLeft: 10 }}
            />
            <Search style={{ marginRight: 10 }} />
          </div>
        </Box>

        <Box className={classes.mulBtnContainer}>
          <Button
            onClick={() => updateStatus('')}
            size="small"
            variant={!status ? 'contained' : 'outlined'}
            color="primary"
            style={{ height: 25, textTransform: 'capitalize', marginRight: 10 }}>
            {switchData.all}
          </Button>
          <Button
            onClick={() => updateStatus('true')}
            variant={status === 'true' ? 'contained' : 'outlined'}
            size="small"
            color="primary"
            style={{ height: 25, textTransform: 'capitalize', marginRight: 10 }}>
            {switchData.active}
          </Button>
          <Button
            onClick={() => updateStatus('false')}
            variant={status === 'false' ? 'contained' : 'outlined'}
            size="small"
            color="primary"
            style={{ height: 25, textTransform: 'capitalize', marginRight: 10 }}>
            {switchData.inactive}
          </Button>
        </Box>
      </div>
      <GrdTable
        headCells={headCells}
        pageNoHandler={pageNoHandler}
        totalRecordCount={dataBusList?.totaldata}
        loading={isLoadingAllClients}
        rows={
          dataBusList && dataBusList.data
            ? dataBusList.data.map((r: any) => {
                return {
                  ...r,
                  bus_legal_name: r[locale]?.bus_legal_name,
                  // bus_legal_name: ((userInfo.role === 'super-admin') || (userInfo.role === 'admin'))? `${r[locale]?.bus_legal_name}(${r[locale]?.bus_number})`: `${r[locale]?.plate_number}(${r[locale]?.bus_number})`,
                  bus_name: r[locale]?.bus_name,
                  contact_name: r[locale]?.contact_name,
                  contact_email: r.user_id?.email,
                  registered: format(new Date(r.created_at), 'yyyy-MM-dd'),
                  status: (
                    <Switch
                      checked={r.isActive}
                      color="primary"
                      onChange={() => editHandler(r)}
                      name="checkedA"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  ),
                  action: [
                    <Link key={r.id} href={`/dashboard/add-bus-company/${r._id}`}>
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
        aria-describedby="simple-modal-description">
        <div style={modalStyle} className={classes.paper}>
          <h4>{switchData.areYouSureYouWantToDelete}</h4>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={deleteBusCompanyHandler}
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

      {/* <Modal
        keepMounted
        open={open}
        onClose={modalCloseHandler}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <div>
        <span> are you sure want to delete?</span>
        <Button onClick={deleteBusCompanyHandler}>yes</Button>
        </div>
        </Modal> */}
      <NotificationLoader
        message={dataDeleteBusCompany?.msg}
        loading={isLoadingDeleteBusCompany || isLoadingUpdate}
        error={''}
      />
    </div>
  );
}
