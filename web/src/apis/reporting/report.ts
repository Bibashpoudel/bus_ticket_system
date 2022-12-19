import API from '../api';
import getSession from '../getSession';
import Router from 'next/router';

//http://localhost:4001/api/v1/bus/reporting/list?route_id=624d5536026438f59641348f&bus_number=adf&start_date=2022-04-07&end_date=2022-04-08

const session = getSession() || {};

export const getReportingList = async (data: any) => {
  let res;
  const session = getSession() || {};
  const [_, route_id, bus_number, start_date, end_date, bus_company, page, size] = data.queryKey;
  try {
    res = await API.get(
      `/bus/reporting/list?route_id=${(route_id === 'all' ? '' : route_id) || ''}&bus_number=${(bus_number === 'all' ? '' : bus_number) || ''
      }&start_date=${start_date || ''}&end_date=${end_date || ''}&bus_company=${(bus_company === 'all' ? '' : bus_company) || ''
      }&page=${page}&size=${size}`,
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


export const getPassengerReportingList = async (data: any) => {
  let res;
  const session = getSession() || {};
  const [_, route_id, bus_number, start_date, end_date, bus_company, page, size] = data.queryKey;
  try {
    res = await API.get(
      `/admin/booking/group/getList?route_id=${(route_id === 'all' ? '' : route_id) || ''}&bus_number=${(bus_number === 'all' ? '' : bus_number) || ''
      }&start_date=${start_date || ''}&end_date=${end_date || ''}&bus_company=${(bus_company === 'all' ? '' : bus_company) || ''
      }&page=${page}&size=${size}`,
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