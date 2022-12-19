import API from '../api';
import getSession from '../getSession';
import Router from 'next/router';

const session = getSession() || {};
export interface UserSchema {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  phone: string;
  calling_code?: string;
  image?: string;
  bus_management?: boolean;
  schedule?: boolean;
  booking_management?: boolean;
  finance_management?: boolean;
  reporting?: boolean;
  support?: boolean;
  setting?: boolean;
  id?: string;
  _id?: string;
}

export const addUser = async (body: UserSchema) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.post(
      '/admin/create/signup',
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

export const getUser = async (data: any) => {
  const session = getSession() || {};
  let res;
  const [_, language, searchKey, status, page, size] = data.queryKey;
  try {
    res = await API.get(`/admin/userList?status=${status || ''}&email=${searchKey}&page=${page}&size=${size}`, {
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

export const updateUserManagement = async (body: UserSchema) => {
  const session = getSession() || {};
  let res;
  const { _id } = body;
  try {
    res = await API.patch(
      `/admin/updateProfile/${_id}`,
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

export const updateUserActiveStatus = async (body: any) => {
  const session = getSession() || {};
  let res;
  const { _id } = body;
  delete body._id;
  try {
    res = await API.patch(
      `/user/updateStatus/${_id}`,
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


export const getUserById = async (body: UserSchema) => {
  const session = getSession() || {};
  let res;
  const { id } = body;
  try {
    res = await API.get(`user/profileDetails/${id}`, {
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

export const deleteUserManagement = async (body: UserSchema) => {
  const session = getSession() || {};
  let res;
  try {
    res = await API.delete(`/admin/deleteUser/${body._id}`, {
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
