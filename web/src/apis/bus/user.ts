import API from '../api';
import getSession from '../getSession';
import Router from 'next/router';

interface UserSchema {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  phone: number;
  status: boolean;
}

const session = getSession() || {};

export const addBusType = async (body: UserSchema) => {
  let res;
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
