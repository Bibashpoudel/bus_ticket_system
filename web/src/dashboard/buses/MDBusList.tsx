import { Box, Button, InputBase, Modal, Paper } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import Link from 'next/link';
import { useMutation, useQuery } from 'react-query';
import { deleteBus, getBustList } from '../../apis/bus/buses';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useIntl } from 'react-intl';

// Language Switching data========
const data = {
  addBus: <IntlMessages id={'addbus'} />,
  filterRoute: <IntlMessages id={'filterbyroute'} />,
  choose: <IntlMessages id={'choose'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  delete: <IntlMessages id={'delete'} />,
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
  { key: 'name', label: <IntlMessages id={'bus'} /> },
  { key: 'route', label: <IntlMessages id={'route'} /> },
  // { key: 'busType', label: <IntlMessages id={'bustype'} /> },
  { key: 'depAndArrive', label: <IntlMessages id={'departarrive'} /> },
  { key: 'periodOperating', label: <IntlMessages id={'periodoperating'} /> },
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
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  srchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  formControl: {
    minWidth: 300,
    marginLeft: 10,
  },
  addBusBtn: {
    textTransform: 'capitalize',
    background: '#4caf50',
    color: '#ffffff',
    marginRight: 15,
    [theme.breakpoints.down('sm')]: {
      marginRight: 5,
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
    // boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function BustListSection() {
  const classes = useStyles();
  const [language, setLanguage] = React.useState('english');
  const [searchKey, updateSearchKey] = useState('');
  const [userInfo, setUserInfo] = useState({} as any);
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  const { locale } = useIntl();
  const [open, toggleModal] = useState<any>(false);
  const [modalStyle] = React.useState(getModalStyle);

  const {
    data: dataBusList,
    refetch,
    isPreviousData,
    isLoading: isLoadingAllClients,
    isSuccess,
  } = useQuery(['BusList', language, searchKey, pageInfo?.page, pageInfo.size], getBustList);

  const {
    mutateAsync: mutateAsyncDeleteBus,
    isSuccess: isSuccessDeleteBus,
    isError: isErrorDeleteBus,
    error: errorDeleteBus,
    isLoading: isLoadingDeleteBus,
    data: dataDeleteBus,
  } = useMutation(deleteBus);

  const deleteHandler = (obj: any) => {
    // mutateAsyncDeleteBus(obj);
    toggleModal(obj);
  };

  const modalCloseHandler = () => {
    toggleModal(null);
  };

  const deleteBusListHandler = () => {
    mutateAsyncDeleteBus(open);
  };

  useEffect(() => {
    if (isSuccessDeleteBus && dataDeleteBus.success) {
      refetch();
      modalCloseHandler();
    }
  }, [isSuccessDeleteBus]);

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || '';
    if (userData) {
      setUserInfo(JSON.parse(userData)?.user);
    }
  }, []);

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };

  return (
    <div>
      <Paper className={classes.Container}>
        <div className={classes.srchContainer}>
          <Box className={classes.srchContainer}>
            <Link href="/dashboard/add-bus">
              <div>
                <Button variant="contained" size="medium" className={classes.addBusBtn}>
                  {data.addBus}
                </Button>
              </div>
            </Link>
            <div style={{ border: '1px solid ', display: 'flex', alignItems: 'center', height: 35 }}>
              <InputBase
                onChange={(e) => updateSearchKey(e.target.value)}
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                style={{ paddingLeft: 10 }}
              />
              <Search style={{ marginRight: 10 }} />
            </div>
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
                    name:
                      userInfo?.role === 'super-admin' || userInfo?.role === 'admin'
                        ? `${r[locale]?.name}(${r[locale]?.bus_number})`
                        : `${r[locale]?.plate_number}(${r[locale]?.bus_number})`,

                    depAndArrive: `${r.departure} - ${r.arrival}`,

                    periodOperating: `${format(new Date(r.operation_date.from), 'dd/MM/yyyy')} - ${format(
                      new Date(r.operation_date.to),
                      'dd/MM/yyyy',
                    )}`,
                    route: `${r.route_id?.from[locale].location}-${r.route_id?.to[locale].location}`,
                    action: [
                      <Link key={r.id} href={`/dashboard/update-bus/${r._id}`}>
                        <Button key={1} variant="contained" color="primary" style={{ margin: 5 }}>
                          {data.edit}
                        </Button>
                      </Link>,
                      <Button onClick={() => deleteHandler(r)} key={2} variant="contained" color="secondary">
                        {data.delete}
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
            <h4>{data.areYouSureYouWantToDelete}</h4>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={deleteBusListHandler}
                style={{ marginRight: 5 }}
                variant="contained"
                color="primary"
                size="small">
                {data.yes}
              </Button>
              <Button onClick={modalCloseHandler} variant="contained" color="secondary" size="small">
                {data.no}
              </Button>
            </div>
          </div>
        </Modal>
        <NotificationLoader message={dataDeleteBus?.msg} loading={isLoadingDeleteBus} error={''} />
      </Paper>
    </div>
  );
}
