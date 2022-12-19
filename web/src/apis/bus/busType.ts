import API from '../api';
import getSession from '../getSession';
import Router from 'next/router';

export interface BusTypeSchema {
  _id?: string;
  bus_type: string;
  driver_seat_position: string;
  id?: string;
  bus_type_column_left: {
    number: number;
    name: string;
  };
  bus_type_row_left: {
    number: number;
    name: string;
  };
  bus_type_column_right: {
    number: number;
    name: string;
  };
  bus_type_row_right: {
    number: number;
    name: string;
  };
  bus_type_back: {
    number: number;
    name: string;
  };
  bus_type_cabin: {
    number: number;
    name: string;
  };
  language: string;
}

export interface Response {
  data: [BusTypeSchema] | BusTypeSchema;
  msg: string;
  page?: number;
  size?: number;
  success: boolean;
  totalData?: number;
}

const session = getSession() || {};

export const addBusType = async (body: BusTypeSchema) => {
  let res;
  console.log('add bustpe data', body);
  const session = getSession() || {};
  try {
    res = await API.post(
      '/admin/busType/create',
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
    const { data, status } = error?.response || {}
    if (status === 401) {
     setTimeout(() => Router.push('/'),2000)
      return { success: false, errors: {amharic: "your session is expired please login again.",
      english: "your session is expired please login again.",
      oromifa: "your session is expired please login again."} 
    }} else {
      return error.response.data;
    }
  }
};

export const getBusTypeList = async (data: any) => {
  let res;
  const [_, language, searchKey, page, size] = data.queryKey;
  const session = getSession() || {};
  try {
    res = await API.get(`/admin/list/busType?language=${language}&search=${searchKey}&page=${page}&size=${size}`, {
      headers: {
        Authorization: `bearer ${session.access_token}`,
      },
    });
    const busData: Response = res.data;
    return busData;
  } catch (error: any) {
    const { data, status } = error?.response || {}
    if (status === 401) {
     setTimeout(() => Router.push('/'),2000)
      return { success: false, errors: {amharic: "your session is expired please login again.",
      english: "your session is expired please login again.",
      oromifa: "your session is expired please login again."} 
    }} else {
      return error.response.data;
    }
  }
};

export const updateBusType = async (body: BusTypeSchema) => {
  let res;
  const { _id } = body;
  const session = getSession() || {};
  try {
    res = await API.patch(
      `/admin/updateBusType/${_id}`,
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
    const { data, status } = error?.response || {}
    if (status === 401) {
     setTimeout(() => Router.push('/'),2000)
      return { success: false, errors: {amharic: "your session is expired please login again.",
      english: "your session is expired please login again.",
      oromifa: "your session is expired please login again."} 
    }} else {
      return error.response.data;
    }
  }
};

export const deleteBusType = async (body: BusTypeSchema) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.delete(`/admin/deleteBusType/${body._id}`, {
      headers: {
        Authorization: `bearer ${session.access_token}`,
      },
    });
    return res?.data;
  } catch (error: any) {
    const { data, status } = error?.response || {}
    if (status === 401) {
     setTimeout(() => Router.push('/'),2000)
      return { success: false, errors: {amharic: "your session is expired please login again.",
      english: "your session is expired please login again.",
      oromifa: "your session is expired please login again."} 
    }} else {
      return error.response.data;
    }
  }
};

export const getBustypeById = async (body: BusTypeSchema) => {
  let res;
  const session = getSession() || {};
  const { id } = body;
  try {
    res = await API.get(`/admin/busType/details/${id}`, {
      headers: {
        Authorization: `bearer ${session.access_token}`,
      },
    });
    return res?.data;
  } catch (error: any) {
    const { data, status } = error?.response || {}
    if (status === 401) {
     setTimeout(() => Router.push('/'),2000)
      return { success: false, errors: {amharic: "your session is expired please login again.",
      english: "your session is expired please login again.",
      oromifa: "your session is expired please login again."} 
    }} else {
      return error.response.data;
    }
  }
};
