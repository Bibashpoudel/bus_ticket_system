import { Box, Button, InputBase, Modal, Paper, Switch, Tab, Tabs } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import Link from 'next/link';
import { useMutation, useQuery } from 'react-query';
import { deleteLocation, getLocation, updateLocation } from '../../apis/bus/location';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useIntl } from 'react-intl';

// Language Switching data========
const switchData = {
  addLocation: <IntlMessages id={'addlocation'} />,
  selectLanguage: <IntlMessages id={'selectlanguage'} />,
  choose: <IntlMessages id={'choose'} />,
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
  { key: 'location', label: <IntlMessages id={'location'} /> },
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
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 0,
    },
  },
  srchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    // marginTop: 15,
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 400,
    height: '15%',
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function BustListSection() {
  const classes = useStyles();
  const [language, setLanguage] = React.useState('english');
  const [searchKey, updateSearchKey] = useState('');
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  const { locale } = useIntl();
  const [open, toggleModal] = useState<any>(false);
  const [modalStyle] = React.useState(getModalStyle);

  const {
    data: locations,
    refetch,
    isPreviousData,
    isLoading: getLocationLoading,
    isSuccess,
  } = useQuery(['locations', language, searchKey, pageInfo?.page, pageInfo.size], getLocation);

  const {
    mutateAsync: mutateAsyncUpdateLocation,
    isSuccess: locationUpdateSuccess,
    isError: isLocationUpdateError,
    error: locationUpdateError,
    isLoading: locationUpdateLoading,
    data: updateLocationRes,
  } = useMutation(updateLocation);

  useEffect(() => {
    refetch();
  }, [locationUpdateSuccess, updateLocationRes]);

  const toggleStatusHandler = (obj: any) => {
    mutateAsyncUpdateLocation({ ...obj, isActive: !obj.isActive });
  };

  const {
    mutateAsync: mutateAsyncDeleteLocation,
    isSuccess: locationDeleteSuccess,
    isError: isLocationDeleteError,
    error: locationDeleteError,
    isLoading: locationDeleteLoading,
    data: DeleteLocationRes,
  } = useMutation(deleteLocation);

  const deleteHandler = (obj: any) => {
    toggleModal(obj);
  };

  const modalCloseHandler = () => {
    toggleModal(null);
  };

  const deleteLocationHandler = () => {
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
      <Paper className={classes.Container}>
        <div className={classes.srchContainer}>
          <Box className={classes.srchContainer}>
            <Link href="/dashboard/add-location">
              <Button variant="contained" size="small" className={classes.btnDsgn}>
                +{switchData.addLocation}
              </Button>
            </Link>
            <div style={{ border: '1px solid', display: 'flex', alignItems: 'center' }}>
              <InputBase
                onChange={(e) => updateSearchKey(e.target.value)}
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                style={{ paddingLeft: 10 }}
              />
              <Search
                onClick={() => console.log('search button clicked', searchKey)}
                style={{ marginRight: 10, cursor: 'pointer' }}
              />
            </div>
          </Box>
        </div>
        <GrdTable
          headCells={headCells}
          pageNoHandler={pageNoHandler}
          totalRecordCount={locations?.totaldata}
          loading={getLocationLoading}
          rows={
            (locations &&
              locations?.data?.map((r: any) => {
                return {
                  ...r,
                  location: r[locale]?.location,
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
                    <Link key={r._id} href={`/dashboard/update-location/${r._id}`}>
                      <Button key={1} variant="contained" color="primary" style={{ margin: 5 }}>
                        {switchData.edit}
                      </Button>
                    </Link>,
                    <Button onClick={() => deleteHandler(r)} key={2} variant="contained" color="secondary">
                      {switchData.delete}
                    </Button>,
                  ],
                };
              })) ||
            []
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
                onClick={deleteLocationHandler}
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
          message={DeleteLocationRes?.msg || updateLocationRes?.msg}
          loading={locationDeleteLoading || locationUpdateLoading}
          error={DeleteLocationRes?.success && JSON.stringify(DeleteLocationRes?.errors)}
        />
      </Paper>
    </div>
  );
}
