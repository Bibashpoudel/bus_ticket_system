import { Box, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import MDSeat from '../../components/MDSeat';
import { GiSteeringWheel } from 'react-icons/gi';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  seatWrap: {
    width: '80%',
    margin: 0,
    borderRadius: 30,
    overflow: 'hidden',
    border: '1px dashed black',
    padding: 10,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: 20,
      marginLeft:1
    },
  },
  cabinDriverSeatDsn: {
    height: '20%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 50,
    padding: 20,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
      padding: 10,
    },
  },

  cabinSeatContainer: {
    width: '60%',
    display: 'flex',
    padding: 10,
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      padding: 0,
      width: '70%',
    },
  },
  leftRightSeat: {
    height: '60%',
    minHeight: 400,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems:'flex-end',
    [theme.breakpoints.down('sm')]: {
      minHeight: 280,
    },
  },
  leftSeatContainer: {
    width: '45%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    // background:'yellow',
    paddingLeft:10,
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },
  rightSeatContainer: {
    width: '45%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    alignItems: 'end',
    // background:'blue',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },
}));

const findSeatStatus = (bookingsDetails: any, seatInfo: any, selectedSeat: any[]): { type: string; seat: string } => {
  const { position, seatNumber } = seatInfo;
  const seat = '/images/seats/seat.png';
  const reserved = '/images/seats/reserved.png';
  const selected = '/images/seats/selected.png';
  const sold = '/images/seats/sold.png';

  const selectBookInfo = selectedSeat?.find((book: any) => book.position === position && book.seat_number === seatNumber);
  if (selectBookInfo) {
    return { type: 'selected', seat: selected };
  }
  const seatBookInfo = bookingsDetails?.find((book: any) => book.position === position && book.seat_number === seatNumber);
  if (seatBookInfo) {
    const { status } = seatBookInfo;
    switch (status) {
      case 'sold-out':
        return { type: 'sold-out', seat: sold };
      case 'reserved':
        return { type: 'reserved', seat: reserved };
      default:
        return { type: 'available', seat: seat };
    }
  }
  return { type: 'available', seat: seat };
};

export default function MBBusSeatlayout(props: any) {
  const classes = useStyles();
  const { formValue, seatClickHandler, bookingDetails, selectedSeat } = props;
  const {
    bus_type_column_left: leftSeatColumn,
    bus_type_row_left: leftSeatRow,
    bus_type_column_right: rightSeatColumn,
    bus_type_row_right: rightSeatRow,
    bus_type_back: lastSeatRow,
    bus_type_cabin: cabinSeatRow,
  } = formValue;

  const leftSeatCols: any = [];
  const leftSeatRows: any = [];
  const rightSeatCols: any = [];
  const rightSeatRows: any = [];
  const lastSeatRows: any = [];
  const cabinSeatRows: any = [];
  if (leftSeatColumn?.number) {
    for (let i = 0; i < parseInt(leftSeatColumn?.number, 10); i++) {
      leftSeatCols.push(i + 1);
    }
  }

  if (leftSeatRow?.number) {
    for (let i = 0; i < parseInt(leftSeatRow?.number, 10); i++) {
      leftSeatRows.push(i * parseInt(leftSeatColumn?.number, 10));
    }
  }

  if (rightSeatColumn?.number) {
    for (let i = 0; i < parseInt(rightSeatColumn?.number, 10); i++) {
      rightSeatCols.push(i + 1);
    }
  }

  if (rightSeatRow?.number) {
    for (let i = 0; i < parseInt(rightSeatRow?.number, 10); i++) {
      rightSeatRows.push(i * parseInt(rightSeatColumn?.number, 10));
    }
  }
  if (lastSeatRow?.number) {
    for (let i = 0; i < parseInt(lastSeatRow?.number, 10); i++) {
      lastSeatRows.push(i + 1);
    }
  }

  if (cabinSeatRow?.number) {
    for (let i = 0; i < parseInt(cabinSeatRow?.number, 10); i++) {
      cabinSeatRows.push(i + 1);
    }
  }

  // console.log('rightseat row', rightSeatRows, rightSeatCols);
  return (
    <Box className={classes.container}>
      <Box className={classes.seatWrap}>
        <Box
          className={classes.cabinDriverSeatDsn}
          style={{
            flexDirection: formValue.driver_seat_position === 'LEFT' ? 'row-reverse' : 'row',
          }}>
          <Box className={classes.cabinSeatContainer}>
            {cabinSeatRows.map((n: any, position: number) => {
              const { seat, type } =
                bookingDetails && selectedSeat
                  ? findSeatStatus(bookingDetails, { position: 'cabin', seatNumber: position + 1 }, selectedSeat)
                  : { type: '', seat: '' };
              return (
                <Box
                  key={n}
                  onClick={() =>
                    type === 'available' || type === 'selected'
                      ? seatClickHandler('cabin', undefined, cabinSeatRow._id, position + 1)
                      : console.error('Seat not available')
                  }
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 2,
                    cursor: 'pointer',
                  }}>
                  <MDSeat name={`C${n}`} type={bookingDetails && selectedSeat && seat} />
                </Box>
              );
            })}
          </Box>
          <>
            <Box
              style={{
                width: '20%',

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <GiSteeringWheel size={40} color="black" />
            </Box>
          </>
        </Box>
        <Box className={classes.leftRightSeat} style={{background:''}}>
          <Box className={classes.leftSeatContainer}>
            {leftSeatRows.map((sr: any, position: number) => {
              return (
                <Box key={sr} style={{ display: 'flex' }}>
                  {leftSeatCols.map((sc: any, idxr: number) => {
                    const { seat, type } =
                      bookingDetails && selectedSeat
                        ? findSeatStatus(bookingDetails, { position: 'left', seatNumber: sc + sr }, selectedSeat)
                        : { type: '', seat: '' };
                    return (
                      <Box
                        key={sc}
                        onClick={() =>
                          type === 'available' || type === 'selected'
                            ? seatClickHandler('left', leftSeatColumn._id, leftSeatRow._id, sc + sr)
                            : console.error('Seat not available')
                        }
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}>
                        <MDSeat name={`A${sc + sr}`} type={bookingDetails && selectedSeat && seat} />
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
          <Box className={classes.rightSeatContainer}>
            {rightSeatRows.map((sr: any) => {
              return (
                <Box key={sr} style={{ display: 'flex' }}>
                  {rightSeatCols.map((sc: any) => {
                    const { seat, type } =
                      bookingDetails && selectedSeat
                        ? findSeatStatus(bookingDetails, { position: 'right', seatNumber: sc + sr }, selectedSeat)
                        : { type: '', seat: '' };
                    return (
                      <Box
                        key={sc}
                        onClick={() =>
                          type === 'available' || type === 'selected'
                            ? seatClickHandler('right', rightSeatColumn._id, rightSeatRow._id, sc + sr)
                            : console.error('Seat not available')
                        }
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}>
                        <MDSeat name={`B${sc + sr}`} type={bookingDetails && selectedSeat && seat} />
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        </Box>
        {/* <Divider/> */}
        <Box style={{ height: '20%', width: '100%', display: 'flex', alignItems: 'flex-end', marginTop:5 }}>
          <Box
            style={{ width: '100%', display: 'flex', alignItems: 'flex-end', background:'', justifyContent: 'space-between', padding: 10 }}>
            {lastSeatRows.map((n: any, position: number) => {
              const { seat, type } =
                bookingDetails && selectedSeat
                  ? findSeatStatus(bookingDetails, { position: 'back', seatNumber: n }, selectedSeat)
                  : { type: '', seat: '' };
              return (
                <Box
                  onClick={() =>
                    type === 'available' || type === 'selected'
                      ? seatClickHandler('back', undefined, lastSeatRow._id, position + 1)
                      : console.error('Seat not available')
                  }
                  key={n}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                  <MDSeat name={`L${n}`} type={bookingDetails && selectedSeat && seat} />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
