import { Box, Button, InputBase, Modal, Paper } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import Link from 'next/link';
import { getBusTypeList, BusTypeSchema, deleteBusType } from '../../apis/bus/busType';
import { useMutation, useQuery } from 'react-query';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { useIntl } from 'react-intl';

// Language Switching data========
const switchData = {
  addBusType: <IntlMessages id={'addbustype'} />,
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
  { key: 'bus_type', label: <IntlMessages id={'busType'} /> },
  { key: 'noOfLeftSeat', label: <IntlMessages id={'numberofleftseat'} /> },
  { key: 'noOfRightSeat', label: <IntlMessages id={'numberofrightseat'} /> },
  { key: 'noOfCabinSeat', label: <IntlMessages id={'numberofcabinseat'} /> },
  { key: 'noOfLastSeat', label: <IntlMessages id={'numberoflastseat'} /> },
  { key: 'total', label: <IntlMessages id={'total'} /> },
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
      padding: 10,
    },
  },
  srchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  addBtnContainer: {
    textTransform: 'capitalize',
    background: '#4caf50',
    color: '#ffffff',
    marginRight: 15,
    [theme.breakpoints.down('sm')]: {
      marginRight: 5,
      width: '60%',
    },
  },
  formControl: {
    minWidth: 300,
    marginLeft: 10,
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
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });
  const [open, toggleModal] = useState<any>(false);
  const [modalStyle] = React.useState(getModalStyle);
  const { locale } = useIntl();

  const {
    data: busTypesList,
    refetch,
    isPreviousData,
    isLoading: isLoadingAllClients,
    isSuccess,
  } = useQuery(['bustypes', language, searchKey, pageInfo?.page, pageInfo.size], getBusTypeList);

  const {
    mutateAsync: mutateAsyncDeleteBusTypes,
    isSuccess: isSuccessBusType,
    isError: isErrorBusType,
    error: errorBusType,
    isLoading: isLoadingBusType,
    data: dataBusType,
  } = useMutation(deleteBusType);

  const deleteHandler = (obj: any) => {
    // mutateAsyncDeleteBusTypes(obj);
    toggleModal(obj);
  };

  const modalCloseHandler = () => {
    toggleModal(null);
  };

  const deleteBusTypeHandler = () => {
    mutateAsyncDeleteBusTypes(open);
  };

  useEffect(() => {
    if (isSuccessBusType && dataBusType.success) {
      refetch();
      modalCloseHandler();
    }
  }, [isSuccessBusType]);

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };

  return (
    <div style={{}}>
      <Paper className={classes.Container}>
        <div className={classes.srchContainer}>
          <Box className={classes.srchContainer}>
            <Link href="/dashboard/add-bus-type">
              <Button className={classes.addBtnContainer} variant="contained" size="medium">
                +{switchData.addBusType}
              </Button>
            </Link>
            <div style={{ border: '1px solid', display: 'flex', alignItems: 'center', height: 35 }}>
              <InputBase
                onChange={(e) => updateSearchKey(e.target.value)}
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                style={{ paddingLeft: 5 }}
              />
              <Search style={{ marginRight: 5 }} />
            </div>
          </Box>
        </div>
        <GrdTable
          headCells={headCells}
          pageNoHandler={pageNoHandler}
          totalRecordCount={busTypesList?.totaldata}
          loading={isLoadingAllClients}
          rows={
            busTypesList && busTypesList.data
              ? busTypesList.data.map((r: any) => {
                  return {
                    ...r,
                    //@ts-ignore
                    bus_type: r[locale]?.bus_type,
                    noOfLeftSeat: r.bus_type_column_left?.number * r.bus_type_row_left?.number,
                    noOfRightSeat: r.bus_type_column_right.number * r.bus_type_row_right.number,
                    noOfCabinSeat: r.bus_type_cabin?.number || 0,
                    noOfLastSeat: r.bus_type_back?.number || 0,
                    total: r.total_seat,
                    action: [
                      <Link key={r._id} href={`/dashboard/update-bus-type/${r._id}`}>
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
                onClick={deleteBusTypeHandler}
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
        <NotificationLoader message={dataBusType?.msg} loading={isLoadingBusType} error={''} />
      </Paper>
    </div>
  );
}
