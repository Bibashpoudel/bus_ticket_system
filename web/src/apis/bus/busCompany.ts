import API from '../api';
import getSession from '../getSession';
import Router from 'next/router';

const session = getSession() || {};

export const addBusCompany = async (body: any) => {
  let res;
  const {
    address,
    amharic,
    bus_legal_name,
    bus_name,
    commission_rate,
    contact_email,
    contact_name,
    english,
    language,
    mobile_phone,
    oromifa,
    telephone,
    company_logo,
    bus_image,
  } = body;
  const formData = new FormData();
  formData.append('address', address);
  formData.append('amharic', JSON.stringify(amharic));
  formData.append('bus_legal_name', bus_legal_name);
  formData.append('bus_name', bus_name);
  formData.append('commission_rate', commission_rate);
  formData.append('contact_email', contact_email);
  formData.append('contact_name', contact_name);
  formData.append('english', JSON.stringify(english));
  formData.append('language', language);
  formData.append('mobile_phone', mobile_phone);
  formData.append('oromifa', JSON.stringify(oromifa));
  formData.append('telephone', telephone);
  formData.append('company_logo', company_logo);
  formData.append('bus_image', bus_image);
  try {
    console.log('Data in bus company add', body);
    res = await API.post('/admin/create/busCompany', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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

export const getBusCompnayList = async (data: any) => {
  let res;
  const session = getSession() || {};
  const [_, language, searchKey, status, page, size] = data.queryKey;
  try {
    res = await API.get(`/admin/list/busCompany?search=${searchKey}&isActive=${status || ''}&page=${page}&size=${size}`, {
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

export const getBusPassangerList = async (data: any) => {
  let res;
  const session = getSession() || {};

  const [_, language, searchKey, status, page, size] = data.queryKey;
  try {
    res = await API.get(`/bus/pasanger/list?search=${searchKey}&isActive=${status || ''}&page=${page}&size=${size}`, {
      headers: {
        Authorization: `bearer ${session.access_token}`,
      },
    });
    console.log("session", res)
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

export const updateBusCompany = async (body: any) => {
  const session = getSession() || {};
  let res;
  console.log('Update bus company', body);
  const {
    _id,
    address,
    amharic,
    bus_legal_name,
    bus_name,
    commission_rate,
    contact_email,
    contact_name,
    english,
    language,
    mobile_phone,
    oromifa,
    telephone,
    company_logo,
    isActive,
    bus_image,
  } = body;
  let booleanIsActive = isActive ? true : false;
  const formData = new FormData();
  // formData.append('id',_id);
  // formData.append('address', address);
  formData.append('amharic', JSON.stringify(amharic));
  // formData.append('bus_legal_name', bus_legal_name);
  // formData.append('bus_name', bus_name);
  formData.append('commission_rate', commission_rate);
  formData.append('contact_email', contact_email);
  // formData.append('contact_name', contact_name);
  formData.append('english', JSON.stringify(english));
  // formData.append('language', language);
  formData.append('mobile_phone', mobile_phone);
  formData.append('oromifa', JSON.stringify(oromifa));
  formData.append('telephone', telephone);
  formData.append('isActive', JSON.stringify(booleanIsActive));
  formData.append('company_logo', company_logo);
  formData.append('bus_image', bus_image);
  try {
    res = await API.patch(`/admin/update/busCompany/${_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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

export const deleteBusCompany = async (body: any) => {
  const session = getSession() || {};
  let res;
  try {
    res = await API.delete(`/admin/delete/busCompany/${body._id}`, {
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

export const getBusCompanyById = async (body: any) => {
  const session = getSession() || {};
  let res;
  const { id } = body;
  try {
    res = await API.get(`/admin/busCompany/${id}`, {
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
      return error.response?.data;
    }
  }
};
