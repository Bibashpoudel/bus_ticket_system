import API from '../../api';
import getSession from '../../getSession';
import Router from 'next/router';

export const addPromocode = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.post(
      '/admin/discount/discountCode',
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

export const updatePromocode = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.patch(
      `/promoCode/updateDetails/${body._id}`,
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

export const getPromoCodeList = async (data: any) => {
  let res;
  const session = getSession() || {};
  const [_, page, size] = data.queryKey;
  try {
    res = await API.get(`/company/promoCode/getList?page=${page}&size=${size}`, {
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

export const deletePromoCode = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.delete(`/promoCode/deleteDetails/${body._id}`, {
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

export const getPromoCodeDetails = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.get(`/promoCode/details/${body.id}`, {
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
      return error?.response?.data;
    }
  }
};
