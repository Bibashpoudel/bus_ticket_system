import API from '../api';
import Router from 'next/router';
import getSession from '../getSession';

const session = getSession() || {};
export interface BookingSchema {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  unique_id: string;
  seat_number: number;
  isPaid: boolean;
  status: string;
  bus_id: number;
  id?: string;
  _id?: string;
}

export const addBooking = async (body: any) => {
  let res;
  const session = getSession() || {};
  const { bus_id } = body;
  try {
    res = await API.post(
      `/counter/bus/seatBooking/${bus_id}`,
      {
        ...body,
      },
      {
        headers: {
          Authorization: `bearer ${session.access_token}`,
        },
      },
    );
    return res?.data;
  } catch (error: any) {
    const { data, status } = error?.response || {};
    if (status === 401) {
      setTimeout(() => Router.push('/'), 2000);
      return {
        success: false,
        errors: {
          amharic: 'your session is expired please login again.',
          english: 'your session is expired please login again.',
          oromifa: 'your session is expired please login again.',
        },
      };
    } else {
      return error.response.data;
    }
  }
};

export const getOutOfserviceBuses = async (body: any) => {
  const session = getSession() || {};
  const [_, id, date] = body.queryKey;
  let res;
  try {
    res = await API.get(`/admin/busSchedule/cancelTripList/${id}`, {
      headers: {
        Authorization: `bearer ${session.access_token}`,
      },
    });
    return res?.data;
  } catch (e) {
    return res?.data;
  }
};

export const getBusById = async (body: any) => {
  const session = getSession() || {};
  const [_, id, date] = body.queryKey;
  let res;
  try {
    res = await API.get(`/admin/bus/details/${id}?date=${date}`, {
      headers: {
        Authorization: `bearer ${session.access_token}`,
      },
    });
    return res?.data;
  } catch (e) {
    return res?.data;
  }
};

export const getBookingList = async (data: any) => {
 
  const session = getSession() || {};
  let res;
  const [_, status, to, from, route_id, bus_number, passenger_name, page, size] = data.queryKey;

  try {
    res = await API.get(
      `/admin/booking/group/getList?status=${status || ''}&to=${to || ''}&from=${from || ''}&route_id=${(route_id === 'all' ? '' : route_id) || ''
      }&bus_number=${(bus_number === 'all' ? '' : bus_number) || ''}&passenger_name=${passenger_name || ''
      }&page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `bearer ${session.access_token}`,
        },
      },
    );
    return res?.data;
  } catch (error: any) {
    const { data, status } = error?.response || {};
    if (status === 401) {
      setTimeout(() => Router.push('/'), 2000);
      return {
        success: false,
        errors: {
          amharic: 'your session is expired please login again.',
          english: 'your session is expired please login again.',
          oromifa: 'your session is expired please login again.',
        },
      };
    } else {
      return error.response.data;
    }
  }
};

// newGetLatestBookingList

export const getBookingLatestList = async (data: any) => {
  const session = getSession() || {};
  let res;
  const [_, status, to, from, route_id, bus_number, passenger_name] = data.queryKey;
  try {
    res = await API.get(
      `/admin/booking/group/getList?list_type=sold-out&status=${status || ''}&to=${to || ''}&from=${from || ''}&route_id=${route_id || ''
      }&bus_number=${bus_number || ''}&passenger_name=${passenger_name || ''}`,
      {
        headers: {
          Authorization: `bearer ${session.access_token}`,
        },
      },
    );
    return res?.data;
  } catch (error: any) {
    const { data, status } = error?.response || {};
    if (status === 401) {
      setTimeout(() => Router.push('/'), 2000);
      return {
        success: false,
        errors: {
          amharic: 'your session is expired please login again.',
          english: 'your session is expired please login again.',
          oromifa: 'your session is expired please login again.',
        },
      };
    } else {
      return error.response.data;
    }
  }
};


//===

export const getLatestBookingList = async (data: any) => {
  const session = getSession() || {};
  let res;
  const [_, status, to, from, route_id, bus_number, passenger_name] = data.queryKey;
  try {
    res = await API.get(
      `/admin/booking/getList?list_type=sold-out&status=${status || ''}&to=${to || ''}&from=${from || ''}&route_id=${route_id || ''
      }&bus_number=${bus_number || ''}&passenger_name=${passenger_name || ''}`,
      {
        headers: {
          Authorization: `bearer ${session.access_token}`,
        },
      },
    );
    return res?.data;
  } catch (error: any) {
    const { data, status } = error?.response || {};
    if (status === 401) {
      setTimeout(() => Router.push('/'), 2000);
      return {
        success: false,
        errors: {
          amharic: 'your session is expired please login again.',
          english: 'your session is expired please login again.',
          oromifa: 'your session is expired please login again.',
        },
      };
    } else {
      return error.response.data;
    }
  }
};

export const getBusSchedule = async (data: any) => {
  const session = getSession() || {};
  let res;
  const [_, route_id, date, page, size] = data.queryKey;
  try {
    res = await API.get(
      `/admin/busSchedule/list?route_id=${(route_id === 'all' ? '' : route_id) || ''}&date=${date || ''
      }&page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `bearer ${session.access_token}`,
        },
      },
    );
    return res?.data;
  } catch (error: any) {
    const { data, status } = error?.response || {};
    if (status === 401) {
      setTimeout(() => Router.push('/'), 2000);
      return {
        success: false,
        errors: {
          amharic: 'your session is expired please login again.',
          english: 'your session is expired please login again.',
          oromifa: 'your session is expired please login again.',
        },
      };
    } else {
      return error.response.data;
    }
  }
};
export const cancelBookings = async (body: any) => {
  const session = getSession() || {};
  let res;
  console.log('cancel booking', body);
  try {
    res = await API.post(
      '/cancel/booking',
      {
        ...body,
      },
      {
        headers: {
          Authorization: `bearer ${session.access_token}`,
        },
      },
    );
    return res?.data;
  } catch (error: any) {
    const { data, status } = error?.response || {};
    if (status === 401) {
      setTimeout(() => Router.push('/'), 2000);
      return {
        success: false,
        errors: {
          amharic: 'your session is expired please login again.',
          english: 'your session is expired please login again.',
          oromifa: 'your session is expired please login again.',
        },
      };
    } else {
      return error.response.data;
    }
  }
};

export const cancelBookingOnBackButton = async (body: any) => {
  let res;
  const session = getSession() || {};
  console.log('cancel booking', body);
  try {
    res = await API.delete('/customer/cancel/seatBooking', {
      data: {
        ...body,
      },
      headers: {
        Authorization: `bearer ${session.access_token}`,
      },
    });
    return res?.data;
  } catch (error: any) {
    const { data, status } = error?.response || {};
    if (status === 401) {
      setTimeout(() => Router.push('/'), 2000);
      return {
        success: false,
        errors: {
          amharic: 'your session is expired please login again.',
          english: 'your session is expired please login again.',
          oromifa: 'your session is expired please login again.',
        },
      };
    } else {
      return error.response.data;
    }
  }
};

// http://localhost:4001/api/v1/admin/booking/getList?status=abc&to=2022-03-17T00%3A00%3A00.000&from=2022-07-21&route_id=6231a2c9fc60fa0df005a72c&bus_number=45%20ka%20kd&passenger_name=c
// /admin/busSchedule/list?route_id=6231a2c7fc60fa0df005a728&date=2022-07-22
