import API from '../api';
import Router from 'next/router';
import getSession from '../getSession';

const session = getSession() || {};

export const getProfile = async (data: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.get('/admin/userList', {
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

export const updateProfile = async (body: any) => {
  let res;
  const session = getSession() || {};
  const { _id } = body;
  try {
    res = await API.patch(
      `/user/updateProfile`,
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
