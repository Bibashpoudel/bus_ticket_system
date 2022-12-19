import API from '../api';
import getSession from '../getSession';
import Router from 'next/router'

interface LocationSchema {
  _id?: string;
  location: string;
  isActive?: boolean;
  language?: string;
}

const session = getSession() || {};

export const addLocation = async (body: LocationSchema) => {
  console.log('BODY', body);
  let res;
  const session = getSession() || {};
  try {
    res = await API.post(
      '/admin/addLocation',
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

export const getLocation = async (data: any) => {
  const [_, language, searchKey, page, size] = data.queryKey;
  let res;
  const session = getSession() || {};
  try {
    res = await API.get(`/admin/list/location?language=${language}&location=${searchKey}&page=${page}&size=${size}`, {
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

export const updateLocation = async (body: LocationSchema) => {
  let res;
  const session = getSession() || {};
  const { _id } = body;
  try {
    res = await API.patch(
      `/admin/updateLocation/${_id}`,
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

// /admin/deleteLocation/:location_id

export const deleteLocation = async (body: LocationSchema) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.delete(`/admin/deleteLocation/${body._id}`, {
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

export const getLocationById = async (body: any) => {
  const { id } = body;
  let res;
  const session = getSession() || {};
  try {
    res = await API.get(`/admin/location/details/${id}`, {
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
