import { Box, Button, InputBase, Modal, Paper, Switch, Tab, Tabs, Typography } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import Link from 'next/link';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { getUser } from '../../apis/user';
import { useQuery, useMutation } from 'react-query';
import PopOverComponent from '../../components/PopOverComponent';
import { cancelBookingOnBackButton, cancelBookings, getBookingList } from '../../apis/booking/booking';
import { format, isSameHour } from 'date-fns';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import { useIntl } from 'react-intl';
import ReactToPrint from 'react-to-print';
import MengedgnaTicket from '../../components/MengedgnaTicket';

// Language Switching data========
const switchData = {
  addBooking: <IntlMessages id={'addbooking'} />,
  filterName: <IntlMessages id={'filterbyname'} />,
  choose: <IntlMessages id={'choose'} />,
  search: <IntlMessages id={'search'} />,
  edit: <IntlMessages id={'edit'} />,
  cancel: <IntlMessages id={'cancel'} />,
  routes: <IntlMessages id={'routes'} />,
  all: <IntlMessages id={'all'} />,
  confirmed: <IntlMessages id={'confirmed'} />,
  pending: <IntlMessages id={'pending'} />,
  verify: <IntlMessages id={'verify'} />,
  details: <IntlMessages id={'details'} />,
  yes: <IntlMessages id={'yes'} />,
  no: <IntlMessages id={'no'} />,
  exitTicketMsg: <IntlMessages id={'exitTicketMsg'} />,
  ticketNo: <IntlMessages id={'ticketNo'} />,
};

interface Data {
  [key: string]: any;
}

interface HeadCell {
  key: string;
  label: any;
}

const headCells: HeadCell[] = [
  { key: 'Bus Name', label: <IntlMessages id={'Bus Name'} /> },
  { key: 'from', label: <IntlMessages id={'from'} /> },
  { key: 'to', label: <IntlMessages id={'to'} /> },
  { key: 'busPlateNo', label: <IntlMessages id={'Bus Plate Number'} /> },
  { key: 'seat', label: <IntlMessages id={'seat'} /> },
  { key: 'departure', label: <IntlMessages id={'departure'} /> },
  { key: 'departureTime', label: <IntlMessages id={'departureTime'} /> },
  { key: 'Ticket Price', label: <IntlMessages id={'Ticket Price'} /> },
  { key: 'status', label: <IntlMessages id={'status'} /> },
  { key: 'action', label: <IntlMessages id={'action'} /> },
];

export default function TicketTable() {
  const { locale } = useIntl();
  const [userInfo, setUserInfo] = useState({} as any);

  const [formatedBookingList, updateBookingList] = useState([]);

  return (
    <div>
      <GrdTable
        headCells={headCells}
        // pageNoHandler={pageNoHandler}
        // totalRecordCount={bookingList?.totaldata}
        // loading={isLoadingAllClients}
        rows={
          formatedBookingList
            ? formatedBookingList.map((r: any) => {
                const {
                  firstname,
                  lastname,
                  isPaid,
                  created_at,
                  bus_id,
                  seatNumbers,
                  added_by,
                  date,
                  payment_id,
                  booking_id,
                  isReserved,
                } = r;
                console.log('RECORD', r, payment_id);
                const { from, to } = bus_id?.route_id || {};
                const seatName = booking_id.reduce((t: string, s: any) => {
                  t = `${t}${s.seatName},`;
                  return t;
                }, '');
                const isVerified = (r?.ticketed_by === 'admin' || r?.ticketed_by === 'online') && isReserved;
                return {
                  ...r,
                  name: `${firstname} ${lastname}`,
                  status: isPaid ? 'Confirmed' : 'Pending',
                  date_time: `${date} ${bus_id?.departure}`,
                  bus:
                    userInfo.role === 'super-admin' || userInfo.role === 'admin'
                      ? `${r?.bus_id?.[locale]?.name}(${r?.bus_id?.[locale]?.bus_number})`
                      : `${r?.bus_id?.[locale]?.plate_number}(${r?.bus_id?.[locale]?.bus_number})`,
                  // bus: bus_id?.[locale]?.bus_number,
                  route: `${from?.[locale]?.location} - ${to?.[locale]?.location}`,
                  numberOfSeat: `${booking_id.length} (${seatName.slice(0, -1)})`,
                  ticket: r?.ticketed_by,
                  action: [
                    isVerified ? (
                      <Link href={`/verify-receipt/${r._id}`}>
                        <Button
                          key={2}
                          variant="contained"
                          color="primary"
                          disabled={userInfo.role === 'super-admin' || userInfo.role === 'admin' ? false : true}>
                          {switchData.verify}
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Button
                          // onClick={() => openModalForCancelConfirmation(r)}
                          key={2}
                          disabled={isPaid}
                          variant="contained"
                          style={{ margin: 5 }}
                          color="secondary">
                          {switchData.cancel}
                        </Button>

                        <a href={`/ticket-details/${r._id}`} target="#">
                          <Button size="medium" variant="contained" color="primary">
                            {switchData.details}
                          </Button>
                        </a>

                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`https://www.mengedegna.com/ticket-details/${r._id}?lang=${locale}`}>
                          <Button size="medium" variant="contained" color="primary">
                            {switchData.details}
                          </Button>
                        </a>
                      </>
                    ),
                  ],
                };
              })
            : []
        }
        // loading={isLoadingAllClients}
      />
      {/* <NotificationLoader
        message={cancelBookResponse?.success && 'Ticket cancel successfully'}
        loading={isLoadingcancelBooking || isLoadingcancelBookingOnBackButton}
        error={JSON.stringify(cancelBookResponse?.errors)}
      />  */}
    </div>
  );
}
