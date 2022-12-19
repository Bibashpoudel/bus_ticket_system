import Router from 'next/router';
import API from '../api';
import getSession from '../getSession';

const session = getSession() || {};

export const getReview = async (data: any) => {
  let res;
  const session = getSession() || {};
  const [_, searchKey, status, page, size] = data.queryKey;
  try {
    res = await API.get(`admin/review/getList`, {
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

export const updateReviewStatus = async (body: any) => {
  let res;
  const session = getSession() || {};
  try {
    res = await API.put(
      `admin/review/statusUpdate/${body._id}`,
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

export const deleteReview = async (body:any)=>{
  let res ;
  const session = getSession() || {};
  const {_id} = body;
  try{
    res = await API.delete(`/admin/review/delete/${body._id}`,{
      headers: {
        Authorization: `bearer ${session.access_token}`,
      },
    });
    return res?.data;
  }catch (error: any) {
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
}
