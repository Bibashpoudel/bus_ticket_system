import API from '../api';
import getSession from '../getSession';
import Router from 'next/router';

const session = getSession() || {};

export const getFinanceList = async (data: any) => {
  let res;
  const session = getSession() || {};
  const [_, bus_number, start_date, end_date, page, size, company_id, route_id] = data.queryKey;
  try {
    res = await API.get(
      `/admin/busFinancelist?bus_number=${(bus_number === 'all' ? '' : bus_number) || ''}&start_date=${
        start_date || ''
      }&end_date=${end_date || ''}&page=${page}&size=${size}&company_id=${
        (company_id === 'all' ? '' : company_id) || ''
      }&route_id=${(route_id === 'all' ? '' : route_id) || ''}`,
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

//localhost:4001/api/v1/admin/busTransactionlist/624ec77cfb717a4a1da99a53?date=2022-04-09

export const getTransactionList = async (data: any) => {
  let res;
  const session = getSession() || {};
  const [_, bus_id, date, page, size] = data.queryKey;
  try {
    res = await API.get(`/admin/busTransactionlist/${bus_id}?date=${date}&page=${page}&size=${size}`, {
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

export const checkedTransfere = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.post(
      '/admin/busFinanceReport/create',
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
