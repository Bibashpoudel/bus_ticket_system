import API from '../api';
import getSession from '../getSession';
import Router from 'next/router';

const session = getSession() || {};

export const uploadReceipt = async (body: any) => {
  let res;
  const session = getSession() || {};
  const { bank_name, receipt, payment_type, reference_number, ticket_id, amount } = body;
  const formData = new FormData();
  formData.append('bank_name', bank_name);
  formData.append('payment_type', payment_type);
  formData.append('reference_number', reference_number);
  formData.append('receipt', receipt);
  formData.append('ticket_id', ticket_id);

  try {
    console.log('Data in bus company add', body);
    res = await API.post('/customer/createPayment/uploadReceipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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

export const getTicketDetails = async (body: any) => {
  const [_, id] = body.queryKey;
  let res;
  const session = getSession() || {};
  try {
    res = await API.get(`/admin/ticket/details/${id}`, {
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

export const updateVerify = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.patch(
      `admin/confirm/booking/${body.id}`,
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

export const declineReciept = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.post(
      `/admin/decline/booking`,
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

