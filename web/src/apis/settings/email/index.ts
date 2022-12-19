import API from '../../api';
import getSession from '../../getSession';
import Router from 'next/router';

export const saveEmailsettings = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.post(
      '/admin/create/emailCredentials',
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

// /emailCredentials/getList

export const getEmailSettingsList = async (data: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.get('/emailCredentials/getList', {
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

//  /emailCredentials/updateDetails/:emailSetting_id

export const updateEmailsettings = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.patch(
      `/emailCredentials/updateDetails/${body._id}`,
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
