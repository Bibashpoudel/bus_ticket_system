import Router from 'next/router';
import API from '../api';
import getSession from '../getSession';

const session = getSession() || {};

export const authenticateUser = async (body: any) => {
  let res;
  try {
    res = await API.post(
      '/user/login',
      {
        email: body.email,
        password: body.password,
      },
      {
        headers: {
          Authorization: `bearer ${session.access_token}`,
        },
      },
    );
    return res?.data;
  } catch (error: any) {
    return error.response?.data;
  }
};

export const registerUser = async ({ email, password }: any) => {
  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/users/register`, {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        Authorization: `bearer ${session.access_token}`,
      },
    });
    const result = res.json();
    return result;
  } catch (error: any) {
    return error.response.data;
  }
};

export const logout = async () => {
  let res;
  try {
    res = await API.post(
      '/user/logout',
      {},
      {
        headers: {
          Authorization: `bearer ${session.access_token}`,
        },
      },
    );
    return res?.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const forgotPassword = async (body: any) => {
  let res;
  try {
    res = await API.post(
      '/user/forgotPassword/verifyEmail',
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
      return error?.response?.data;
    }
  }
};

export const resetPassword = async (body: any) => {
  let res;
  try {
    res = await API.patch(
      '/user/forgotPassword/newPassword',
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
    return error.response.data;
  }
};

export const verifyOtp = async (body: any) => {
  let res;
  try {
    res = await API.post(
      '/user/validateOtp',
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
    return error.response.data;
  }
};

export const changePassword = async (body: any) => {
  let res;
  try {
    res = await API.patch(
      '/user/updatePassword',
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
    return error.response.data;
  }
};
