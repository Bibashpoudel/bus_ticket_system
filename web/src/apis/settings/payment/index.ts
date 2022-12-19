import API from '../../api';
import getSession from '../../getSession';
import Router from 'next/router';

export const savePaymentSetting = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.patch(
      '/admin/add/paymentCredentials',
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

// this is for create the paymen Method setting

export const savePymentMethodSetting = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.post(
      '/admin/add/company/paymentCredentials',
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

export const getPaymentSettingList = async (data: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.get('/paymentCredentials/getList', {
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

export const getAdminPaymentSettingDetails = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.get(`/paymentCredentials/getList`, {
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


export const getPaymentSettingDetails = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.get(`/paymentCredentials/details/${body._id}`, {
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

export const updatePaymentSettings = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.patch(
      `/paymentCredentials/updateDetails/${body._id}`,
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

export const deletePayment = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.delete(`/paymentCredentials/delete/${body.id}`, {
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

export const getBusCompanyPaymentDetails = async (data: any) => {
  let res;
  const session = getSession() || {};
  const [_, id] = data.queryKey;
  try {
    res = await API.get(`/paymentCredentials/details/company/${id}`, {
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
