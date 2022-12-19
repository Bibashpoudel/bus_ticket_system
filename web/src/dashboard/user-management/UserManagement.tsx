import { Box, Button, InputBase, Modal, Paper, Switch, Tab, Tabs } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import Link from 'next/link';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { deleteUserManagement, getUser, updateUserManagement,updateUserActiveStatus } from '../../apis/user';
import { useMutation, useQuery } from 'react-query';
import { format } from 'date-fns';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';

// Language Switching data========
const switchData = {
  addUser: <IntlMessages id={'adduser'} />,
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

interface HeadCell {
  key: string;
  label: any;
}

const headCells: HeadCell[] = [
  { key: 'fullName', label: <IntlMessages id={'tablename'} /> },
  { key: 'email', label: <IntlMessages id={'email'} /> },
  { key: 'registered', label: <IntlMessages id={'registered'} /> },
  { key: 'role', label: <IntlMessages id={'role'} /> },
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
  srchButtonContainer: {
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
  },
  addBtn: {
    textTransform: 'capitalize',
    background: '#4caf50',
    color: '#ffffff',
    marginRight: 15,
    [theme.breakpoints.down('sm')]: {
      width: '30%',
      marginRight: 10,
    },
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 300,
    marginLeft: 10,
  },
  btnContainer: {
    display: 'flex',
    alignItems: 'end',
    width: '30%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'unset',
      marginTop: 10,
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
    // border: '2px solid #000',
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function BustListSection() {
  const classes = useStyles();
  const [language, setLanguage] = React.useState('english');
  const [searchKey, updateSearchKey] = useState('');
  const [status, updateStatus] = useState<any>();
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  const [open, toggleModal] = useState<any>(false);
  const [modalStyle] = React.useState(getModalStyle);

  const updateSearchInput = (key: string, value: any) => {
    updateSearchKey(value);
  };

  // getUser API ===============
  const {
    data: dataUserManagement,
    refetch,
    isPreviousData,
    isLoading: isLoadingAllClients,
    isSuccess,
  } = useQuery(['UserManagement', language, searchKey, status, pageInfo?.page, pageInfo.size], getUser);
console.log('firstname and lastname',dataUserManagement);
  const {
    mutateAsync: mutateAsyncUpdateUserManagement,
    isSuccess: isSuccessUpdateUserManagement,
    isError: isErrorUpdateUserManagement,
    error: errorUpdateUserManagement,
    isLoading: isLoadingUpdateUserManagement,
    data: updateUserManagementData,
  } = useMutation(updateUserActiveStatus);

  useEffect(() => {
    refetch();
  }, [isSuccessUpdateUserManagement, updateUserManagementData]);

  const toggleStatusHandler = (obj: any) => {
    console.log('toggle status handler', obj);

    mutateAsyncUpdateUserManagement({ _id: obj._id, isActive: !obj.isActive });
  };
 
  // api for delete===

  const {
    mutateAsync: mutateAsyncDeleteUserManagement,
    isSuccess: isSuccessDeleteUserManagement,
    isError: isErrorDeleteUsermanagement,
    error: errorDeleteUserManagement,
    isLoading: isLoadingDeleteUserManagement,
    data: deleteUserManagementData,
  } = useMutation(deleteUserManagement);

  const deleteHandler = (obj: any) => {
    toggleModal(obj);
  };

  const modalCloseHandler = () => {
    toggleModal(null);
  };

  const deleteUserManagementHandler = () => {
    mutateAsyncDeleteUserManagement(open);
  };

  useEffect(() => {
    if (isSuccessDeleteUserManagement && deleteUserManagementData.success) {
      refetch();
      modalCloseHandler();
    }
  }, [isSuccessDeleteUserManagement]);

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };

  return (
    <div>
      <div className={classes.srchButtonContainer}>
        <Box className={classes.srchContainer}>
          <Link href="/dashboard/add-user">
            <Button variant="contained" size="small" className={classes.addBtn}>
              +{switchData.addUser}
            </Button>
          </Link>
          <div style={{ border: '1px solid', display: 'flex', alignItems: 'center' }}>
            <InputBase
              onChange={(e) => updateSearchInput('search', e.target.value)}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              style={{ paddingLeft: 10 }}
            />
            <Search style={{ marginRight: 10 }} />
          </div>
        </Box>
        <Box className={classes.btnContainer}>
          <Button
            onClick={() => updateStatus('')}
            size="small"
            variant={!status ? 'contained' : 'outlined'}
            color="primary"
            style={{ height: 25, textTransform: 'capitalize' }}>
            {switchData.all}
          </Button>
          <Button
            onClick={() => updateStatus('true')}
            variant={status === 'true' ? 'contained' : 'outlined'}
            size="small"
            color="primary"
            style={{ height: 25, textTransform: 'capitalize', marginLeft: 10, marginRight: 10 }}>
            {switchData.active}
          </Button>
          <Button
            onClick={() => updateStatus('false')}
            variant={status === 'false' ? 'contained' : 'outlined'}
            size="small"
            color="primary"
            style={{ height: 25, textTransform: 'capitalize' }}>
            {switchData.inactive}
          </Button>
        </Box>
      </div>
      <GrdTable
        headCells={headCells}
        pageNoHandler={pageNoHandler}
        totalRecordCount={dataUserManagement?.totaldata}
        loading={isLoadingAllClients}
        rows={
          dataUserManagement && dataUserManagement.data
            ? dataUserManagement.data.map((r: any) => {
                return {
                  ...r,
                  fullName:`${r.firstname} ${r.lastname}`,
                  registered: format(new Date(r.created_at), 'yyyy-MM-dd'),
                  status: (
                    <Switch
                      checked={r.isActive}
                      color="primary"
                      onChange={() => toggleStatusHandler(r)}
                      name="checkedA"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  ),
                  action: [
                    <Link key={r.id} href={`/dashboard/update-user-management/${r._id}`}>
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
              onClick={deleteUserManagementHandler}
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
      <NotificationLoader
        message={deleteUserManagementData?.msg || updateUserManagementData?.msg}
        loading={isLoadingDeleteUserManagement || isLoadingUpdateUserManagement}
        error={deleteUserManagementData?.success && JSON.stringify(deleteUserManagementData?.errors)}
      />
    </div>
  );
}
