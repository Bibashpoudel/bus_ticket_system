import { Box, Button, InputBase, Modal, Paper, Switch, Tab, Tabs } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import Link from 'next/link';
import { useMutation, useQuery } from 'react-query';
import { getRoute, updateRoute, deleteRoute } from '../../apis/bus/route';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useIntl } from 'react-intl';

// Language Switching data========
const switchData = {
  addRoute: <IntlMessages id={'addroute'} />,
  selectLanguage: <IntlMessages id={'selectlanguage'} />,

  filterName: <IntlMessages id={'filterbyname'} />,
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
  { key: 'title', label: <IntlMessages id={'title'} /> },
  { key: 'from', label: <IntlMessages id={'from'} /> },
  { key: 'to', label: <IntlMessages id={'to'} /> },
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
  srchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 15,
    [theme.breakpoints.down('sm')]: {},
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
      width: '40%',
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
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function BustListSection() {
  const classes = useStyles();
  const [routes, updateRoutes] = useState([]);
  const [language, setLanguage] = React.useState('english');
  const [searchKey, setSearchkey] = useState('');
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  const { locale } = useIntl();
  const [open, toggleModal] = useState<any>(false);
  const [modalStyle] = React.useState(getModalStyle);

  //To get data from server=========================================

  const {
    data: Routes,
    refetch,
    isPreviousData,
    isLoading: isGetRouteLoading,
    isSuccess,
  } = useQuery(['Routes', language, searchKey, pageInfo?.page, pageInfo.size], getRoute);
  console.log('routesList',Routes)

  useEffect(() => {
    if (Routes && Routes.data) {
      const routes = Routes.data.map((obj: any) => ({
        ...obj,
        title: `${obj.from?.[language]?.location} - ${obj.to?.[language]?.location}`,
      }));
      updateRoutes(routes);
    }
  }, [Routes, isSuccess]);

  // ==============================================================

  //In case of update of new data in route this helps to show the updated data=========

  const {
    mutateAsync: mutateAsyncUpdateRoute,
    isSuccess: RouteUpdateSuccess,
    isError: isRouteUpdateError,
    error: RouteUpdateError,
    isLoading: RouteUpdateLoading,
    data: updateRouteRes,
  } = useMutation(updateRoute);

  useEffect(() => {
    refetch();
  }, [RouteUpdateSuccess, updateRouteRes]);

  //This is for toggling the status data===================
  const toggleStatusHandler = (obj: any) => {
    mutateAsyncUpdateRoute({
      ...obj,
      from: obj.from._id,
      to: obj.to._id,
      id: obj._id,
      distance: obj?.added_by?.distance,
      isActive: !obj.added_by?.isActive,
    });
  };

  // This is for deleting the data ================
  const {
    mutateAsync: mutateAsyncDeleteLocation,
    isSuccess: locationDeleteSuccess,
    isError: isLocationDeleteError,
    error: locationDeleteError,
    isLoading: locationDeleteLoading,
    data: DeleteLocationRes,
  } = useMutation(deleteRoute);

  const deleteHandler = (obj: any) => {
    // mutateAsyncDeleteLocation(obj);
    toggleModal(obj);
  };

  const modalCloseHandler = () => {
    toggleModal(null);
  };

  const deleteRouteHandler = () => {
    mutateAsyncDeleteLocation(open);
  };

  useEffect(() => {
    if (locationDeleteSuccess && DeleteLocationRes.success) {
      refetch();
      modalCloseHandler();
    }
  }, [locationDeleteSuccess]);

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };

  return (
    <div>
      <div className={classes.srchContainer}>
        <Box className={classes.srchContainer}>
          <Link href="/dashboard/add-route">
            <Button variant="contained" size="small" className={classes.btnDsn}>
              {switchData.addRoute}
            </Button>
          </Link>
          <div style={{ border: '1px solid', display: 'flex', alignItems: 'center' }}>
            <InputBase
              onChange={(e) => setSearchkey(e.target.value)}
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
        totalRecordCount={Routes?.totaldata}
        loading={isGetRouteLoading}
        rows={routes.map((r: any) => {
          return {
            ...r,
            from: r.from[locale]?.location,
            to: r.to[locale]?.location,

            status: (
              <Switch
                checked={r?.added_by?.isActive}
                color="primary"
                onChange={() => toggleStatusHandler(r)}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            ),
            action: [
              <Link key={r._id} href={`/dashboard/update-route/${r._id}`}>
                <Button key={1} variant="contained" color="primary" style={{ margin: 5 }}>
                  {switchData.edit}
                </Button>
              </Link>,

              <Button onClick={() => deleteHandler(r)} key={2} variant="contained" color="secondary">
                {switchData.delete}
              </Button>,
            ],
          };
        })}
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
            <Button onClick={deleteRouteHandler} style={{ marginRight: 5 }} variant="contained" color="primary" size="small">
              {switchData.yes}
            </Button>
            <Button onClick={modalCloseHandler} variant="contained" color="secondary" size="small">
              {switchData.no}
            </Button>
          </div>
        </div>
      </Modal>
      <NotificationLoader
        message={DeleteLocationRes?.msg || updateRouteRes?.msg}
        loading={locationDeleteLoading || RouteUpdateLoading}
        error={''}
      />
    </div>
  );
}
