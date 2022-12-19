import API from '../api';
import getSession from '../getSession';
import Router from 'next/router';

interface BusesSchema {
  _id?: string;
  name: string;
  bus_number: string;
  plate_number: string;
  route_id: string;
  departure: string;
  arrival: string;
  id?: string;
  class_type: string;
  language: string;
  price: {
    usd: number;
    birr: number;
  };
  operation_date: {
    from: Date;
    to: Date;
  };
  recurring: {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };
}

export const addBus = async (body: BusesSchema) => {
  let res;
  const session = getSession() || {};
  console.log("add new Bus", body)
  try {
    res = await API.post(
      '/admin/busDetails/create',
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

export const getBustList = async (data: any) => {
  // const session = getSession() || {};
  const session = getSession() || {};
  let res;
  const [_, language, searchKey, page, size, company_id, route_id] = data.queryKey;
  try {
    res = await API.get(
      `/admin/list/bus?search=${searchKey}&page=${page}&size=${size}&company_id=${(company_id === 'all' ? '' : company_id) || ''
      }&route_id=${(route_id === 'all' ? '' : route_id) || ''}`,
      {
        headers: {
          Authorization: `bearer ${session.access_token}`,
        },
      },
    );
    console.log('GET BUS LIST RES', res);
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

export const updateBusList = async (body: BusesSchema) => {
  let res;
  const session = getSession() || {};
  const { _id } = body;
  try {
    res = await API.patch(
      `/admin/updateBus/${_id}`,
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

export const deleteBus = async (body: BusesSchema) => {
  const session = getSession() || {};
  let res;
  try {
    res = await API.delete(`/admin/deleteBus/${body._id}`, {
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

export const getBustListById = async (body: any) => {
  const session = getSession() || {};
  let res;
  const { id } = body;
  try {
    res = await API.get(`/admin/bus/details/${id}/`, {
      headers: {
        Authorization: `bearer ${session.access_token}`,
      },
    });
    return res?.data;
  } catch (e) {
    return res?.data;
  }
};

export const getBusBookingDetails = async (body: any) => {
  const session = getSession() || {};
  let res;
  const { id, date, page, size } = body;
  console.log('Pageee', page, 'size', size);
  try {
    res = await API.get(`/admin/bus/details/${id}?date=${date}&page=${page}&size=${size}`, {
      headers: {
        Authorization: `bearer ${session.access_token}`,
      },
    });
    return res?.data;
  } catch (e) {
    return res?.data;
  }
};

export const cancelTrip = async (body: any) => {
  const session = getSession() || {};
  let res;
  try {
    res = await API.post(
      '/admin/busSchedule/cancelTrip',
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

export const deleteOutOfService = async (body: any) => {
  const session = getSession() || {};
  let res;
  try {
    res = await API.delete(`/admin/busSchedule/delete/${body._id}`, {
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
