import API from '../api';
import getSession from '../getSession';
import Router from 'next/router';

interface RouteSchema {
  to: string;
  from: string;
  distance: number;
  isActive: boolean;
  language: string;
  _id?: string;
}

const session = getSession() || {};

export const addRoute = async (body: RouteSchema) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.post(
      '/admin/addRoute',
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
      return error.response.data;
    }
  }
};

export const getRoute = async (data: any) => {
  let res;
  const session = getSession() || {};
  const [_, language, searchKey, page, size, company_id] = data.queryKey;
  try {
    res = await API.get(
      `/admin/list/route?search=${searchKey}&page=${page}&size=${size}&company_id=${company_id === 'all' ? '' : company_id}`,
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

export const updateRoute = async (body: any) => {
  let res;
  const session = getSession() || {};
  const { id } = body;
  try {
    res = await API.patch(
      `/admin/updateRoute/${id}`,
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
      return error.response.data;
    }
  }
};

export const deleteRoute = async (body: RouteSchema) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.delete(`/admin/deleteRoute/${body._id}`, {
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

export const getRouteById = async (body: any) => {
  const { id } = body;
  let res;
  const session = getSession() || {};
  try {
    res = await API.get(`/admin/route/details/${id}`, {
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
