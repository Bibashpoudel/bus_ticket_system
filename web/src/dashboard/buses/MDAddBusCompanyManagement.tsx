import { Box, Button, Paper, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import Router from 'next/router';
import { findNextLanguage } from '../../utils/idnex';
import { addBusCompany, getBusCompanyById, updateBusCompany } from '../../apis/bus/busCompany';
// import { Form, Formik } from 'formik';
// Language Switching data========
const switchData = {
  busLegalName: <IntlMessages id={'buslegalname'} />,
  busName: <IntlMessages id={'busname'} />,
  address: <IntlMessages id={'address'} />,
  contactName: <IntlMessages id={'contactname'} />,
  contactEmail: <IntlMessages id={'contactemail'} />,
  mobilePhone: <IntlMessages id={'mobilephone'} />,
  telephone: <IntlMessages id={'telephone'} />,
  companyLogo: <IntlMessages id={'companylogo'} />,
  commissionRate: <IntlMessages id={'commissionrate'} />,

  selectLanguage: <IntlMessages id={'selectlanguage'} />,
  choose: <IntlMessages id={'choose'} />,
  location: <IntlMessages id={'location'} />,
  save: <IntlMessages id={'save'} />,
  cancel: <IntlMessages id={'cancel'} />,
  update: <IntlMessages id={'update'} />,
  add: <IntlMessages id={'add'} />,

  status: <IntlMessages id={'status'} />,
  role: <IntlMessages id={'role'} />,
  assignBuses: <IntlMessages id={'assignbuses'} />,
  assignPermission: <IntlMessages id={'assignpermission'} />,
  busImage: <IntlMessages id={'busImage'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    width: '100%',
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 20,
      paddingTop: 5,
    },
  },
  addUserContainer: {
    paddingBottom: 50,
    paddingTop: 20,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  addUser: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'unset',
    },
  },
  formControl: {
    marginLeft: 55,
    minWidth: 200,
  },
  roleFormControl: {
    marginLeft: 70,
    minWidth: 200,
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  languageFormControl: {
    marginLeft: 20,
    minWidth: 200,
  },
  pDiv: {
    width: '25%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 5,
    },
  },
  pNumber: {
    width: '32%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 5,
    },
  },
  textBtnContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
}));

const languages = [
  { id: 1, name: 'English', value: 'english' },
  { id: 2, name: 'Amharic', value: 'amharic' },
  { id: 3, name: 'Oromifa', value: 'oromifa' },
];

export default function MDAddBusCompanyManagement(props: any) {
  const { params } = props;
  const classes = useStyles();
  const [formValue, updateFormValue] = useState({ language: 'english' } as any);
  const [legalNameLanguage, updateLegalNameLaguage] = useState({ language: 'english' } as any);
  const [legalName, updateLegalName] = useState([] as any);
  const [busNameLanguage, updatebusNameLaguage] = useState({ language: 'english' } as any);
  const [busName, updateBusName] = useState([] as any);
  const [addressLanguage, updateAddressLaguage] = useState({ language: 'english' } as any);
  const [address, updateAddress] = useState([] as any);
  const [contactNameLanguage, updateContactNameLaguage] = useState({ language: 'english' } as any);
  const [contactName, updateContactName] = useState([] as any);
  const [errorLoading, setErrorLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<any>('')

  const addLegalNameClickHandler = () => {
    if (legalName.length === 1) {
      updateLegalName([
        ...legalName,
        { [legalNameLanguage.language]: { bus_legal_name: formValue.bus_legal_name } },
        { [`${findNextLanguage(legalNameLanguage.language)}`]: { bus_legal_name: ' ' } },
      ]);
      updateLegalNameLaguage({ language: findNextLanguage(legalNameLanguage.language) });
      updateFormValue({ ...formValue, bus_legal_name: '' });
    } else {
      updateLegalName([...legalName, { [legalNameLanguage.language]: { bus_legal_name: formValue.bus_legal_name } }]);
      updateLegalNameLaguage({ language: findNextLanguage(legalNameLanguage.language) });
      updateFormValue({ ...formValue, bus_legal_name: '' });
    }
  };

  const updateExistingLegalName = (key: string, value: any) => {
    updateLegalName(legalName.map((obj: any) => (obj[key] ? { [key]: { bus_legal_name: value } } : obj)));
  };

  const addBusNameClickHandler = async () => {
    if (busName.length === 1) {
      updateBusName([
        ...busName,
        { [busNameLanguage.language]: { bus_name: formValue.bus_name } },
        { [`${findNextLanguage(busNameLanguage.language)}`]: { bus_name: ' ' } },
      ]);
      updatebusNameLaguage({ language: findNextLanguage(busNameLanguage.language) });
      // updateFormValue({...formValue, bus_name: ''})
    } else {
      updateBusName([...busName, { [busNameLanguage.language]: { bus_name: formValue.bus_name } }]);
      updatebusNameLaguage({ language: findNextLanguage(busNameLanguage.language) });
      updateFormValue({ ...formValue, bus_name: '' });
    }
  };

  const updateExistingBusName = (key: string, value: any) => {
    updateBusName(busName.map((obj: any) => (obj[key] ? { [key]: { bus_name: value } } : obj)));
  };

  const addAddressClickHandler = () => {
    if (address.length === 1) {
      updateAddress([
        ...address,
        { [addressLanguage.language]: { address: formValue.address } },
        { [`${findNextLanguage(addressLanguage.language)}`]: { address: ' ' } },
      ]);
      updateAddressLaguage({ language: findNextLanguage(addressLanguage.language) });
      updateFormValue({ ...formValue, address: '' });
    } else {
      updateAddress([...address, { [addressLanguage.language]: { address: formValue.address } }]);
      updateAddressLaguage({ language: findNextLanguage(addressLanguage.language) });
      updateFormValue({ ...formValue, address: '' });
    }
  };

  const updateExistingaddress = (key: string, value: any) => {
    updateAddress(address.map((obj: any) => (obj[key] ? { [key]: { address: value } } : obj)));
  };

  const addContactNameClickHandler = () => {
    if (contactName.length === 1) {
      updateContactName([
        ...contactName,
        { [contactNameLanguage.language]: { contact_name: formValue.contact_name } },
        { [`${findNextLanguage(contactNameLanguage.language)}`]: { contact_name: ' ' } },
      ]);
      updateContactNameLaguage({ language: findNextLanguage(contactNameLanguage.language) });
      updateFormValue({ ...formValue, contact_name: '' });
    } else {
      updateContactName([...contactName, { [contactNameLanguage.language]: { contact_name: formValue.contact_name } }]);
      updateContactNameLaguage({ language: findNextLanguage(contactNameLanguage.language) });
      updateFormValue({ ...formValue, contact_name: '' });
    }
  };

  const updateExistingContactName = (key: string, value: any) => {
    updateContactName(contactName.map((obj: any) => (obj[key] ? { [key]: { contact_name: value } } : obj)));
  };

  const formInputHandler = (key: string, value: any) => {
    updateFormValue({ ...formValue, [key]: value });
  };

  const { mutateAsync: mutateAsyncAddLocation, isSuccess, isError, error, isLoading, data } = useMutation(addBusCompany);

  const {
    mutateAsync: mutateAsyncUpdateBusList,
    isSuccess: isSuccessUpdateBusList,
    isError: isErrorUpdateBusList,
    error: errorUpdateBusList,
    isLoading: isLoadingUpdateBusList,
    data: dataUpdateBusList,
  } = useMutation(updateBusCompany);

  const addBusHandler = (e: any) => {
    if (params && params.id) {
      const payloadUp = languages.map((obj: any) => ({
        [obj.value]: {
          bus_legal_name: legalName.find((b: any) => b[obj.value])?.[obj.value]?.bus_legal_name || formValue.bus_legal_name,
          bus_name: busName.find((b: any) => b[obj.value])?.[obj.value]?.bus_name || formValue.bus_name,
          contact_name: contactName.find((b: any) => b[obj.value])?.[obj.value]?.contact_name || formValue.contact_name,
          address: address.find((b: any) => b[obj.value])?.[obj.value]?.address || formValue.address,
        },
      }));

      // console.log('payload', payload);

      const payloadUpFinal = payloadUp.reduce((t: any, n: any) => {
        t[Object.keys(n)[0]] = Object.values(n)[0];
        return t;
      }, {});


      mutateAsyncUpdateBusList({
        ...formValue,
        ...payloadUpFinal,
        company_logo: formValue.company_logo || formValue?.user_id?.image,
        bus_image: formValue.bus_image || formValue?.user_id?.bus_image,
      });

    } else {

      if (formValue.company_logo !== undefined && formValue.bus_image !== undefined && formValue.bus_legal_name !== undefined && formValue.bus_name !== undefined && formValue.contact_name !== undefined && formValue.address !== undefined && formValue.commission_rate !== undefined && formValue.contact_email !== undefined && formValue.mobile_phone !== undefined && formValue.telephone !== undefined) {

        // e.preventDefault();

        const payload = languages.map((obj: any) => ({
          [obj.value]: {
            bus_legal_name: legalName.find((b: any) => b[obj.value])?.[obj.value]?.bus_legal_name || formValue.bus_legal_name,
            bus_name: busName.find((b: any) => b[obj.value])?.[obj.value]?.bus_name || formValue.bus_name,
            contact_name: contactName.find((b: any) => b[obj.value])?.[obj.value]?.contact_name || formValue.contact_name,
            address: address.find((b: any) => b[obj.value])?.[obj.value]?.address || formValue.address,
          },
        }));

        // console.log('payload', payload);

        const payloadFinal = payload.reduce((t: any, n: any) => {
          t[Object.keys(n)[0]] = Object.values(n)[0];
          return t;
        }, {});

        if (params && params.id) {
          mutateAsyncUpdateBusList({
            ...formValue,
            ...payloadFinal,
            company_logo: formValue.company_logo || formValue?.user_id?.image,
            bus_image: formValue.bus_image || formValue?.user_id?.bus_image,
          });
        } else {
          mutateAsyncAddLocation({
            ...formValue,
            ...payloadFinal,
          });
        }
      } else {
        let imageError = {}
        if (formValue.bus_name === undefined) {
          imageError = { ...imageError, "bus_name": "This field is required" }
        }
        if (formValue.bus_legal_name === undefined) {
          imageError = { ...imageError, "bus_legal_name": "This field is required" }
        }
        if (formValue.address === undefined) {
          imageError = { ...imageError, "address": "This field is required" }
        }
        if (formValue.contact_name === undefined) {
          imageError = { ...imageError, "contact_name": "This field is required" }
        }
        if (formValue.contact_email === undefined) {
          imageError = { ...imageError, "contact_email": "This field is required" }
        }
        if (formValue.mobile_phone === undefined) {
          imageError = { ...imageError, "mobile_phone": "This field is required" }
        }
        if (formValue.telephone === undefined) {
          imageError = { ...imageError, "telephone": "This field is required" }
        }

        if (formValue.company_logo === undefined) {
          imageError = { ...imageError, "company_logo": "This field is required" }
        }
        if (formValue.bus_image === undefined) {
          imageError = { ...imageError, "bus_image": "This field is required" }
        }

        if (formValue.commission_rate === undefined) {
          imageError = { ...imageError, "commission_rate": "This field is required" }
        }

        setErrorLoading(true)
        setTimeout(() => {
          setErrorLoading(false)
        }, 1000)

        setErrorMsg(imageError)

      }
    }
  };

  useEffect(() => {
    if (data?.success || dataUpdateBusList?.success) {
      setTimeout(() => {
        Router.push('/dashboard/bus-company-management');
      }, 200);
    }
  }, [isSuccessUpdateBusList, isSuccess]);

  //API CALL FOR GET DATA BY ID====================
  const {
    mutateAsync: mutateAsyncGetBusListById,
    isSuccess: isSuccessGetBusCompanyList,
    isError: isErrorGetBusCompanyList,
    error: errorGetBusCompanyList,
    isLoading: isLoadingGetBusCompanyList,
    data: dataGetBusCompanyList,
  } = useMutation(getBusCompanyById);

  // console.log('detils', dataGetBusCompanyList);

  useEffect(() => {
    if (dataGetBusCompanyList && dataGetBusCompanyList.success) {
      const { amharic, oromifa, english } = dataGetBusCompanyList.data;
      const legalNameArr = languages.map((obj: any) => ({
        [obj.value]: { bus_legal_name: dataGetBusCompanyList.data[obj.value].bus_legal_name },
      }));
      updateLegalName(legalNameArr);
      const busNmaeArr = languages.map((obj: any) => ({
        [obj.value]: { bus_name: dataGetBusCompanyList.data[obj.value].bus_name },
      }));
      updateBusName(busNmaeArr);

      const busaddressArr = languages.map((obj: any) => ({
        [obj.value]: { address: dataGetBusCompanyList.data[obj.value].address },
      }));
      updateAddress(busaddressArr);

      const contactNameArray = languages.map((obj: any) => ({
        [obj.value]: { contact_name: dataGetBusCompanyList.data[obj.value].contact_name },
      }));
      updateContactName(contactNameArray);

      updateFormValue({
        ...formValue,
        ...dataGetBusCompanyList.data,
        contact_email: dataGetBusCompanyList.data?.user_id?.email,
        mobile_phone: dataGetBusCompanyList.data?.user_id?.phone,
      });
    }
  }, [isSuccessGetBusCompanyList, dataGetBusCompanyList]);

  useEffect(() => {
    if (params && params.id) {
      mutateAsyncGetBusListById(params);
    }
  }, []);

  // console.log('form value in bus company', formValue);

  return (
    <div>
      <Paper square className={classes.paperContainer}>
        <form onSubmit={(e) => e.preventDefault()}>
          <Box className={classes.addUserContainer}>
            <div className={classes.addUser}>
              <p className={classes.pDiv}>{switchData.busLegalName} * :</p>
              {legalName.map((obj: object, idx: number) => (
                <TextField
                  key={idx}
                  onChange={(e) => updateExistingLegalName(Object.keys(obj)[0], e.target.value)}
                  type="text"
                  label={`[${`${Object.keys(obj)[0]}`.trim().slice(0, 2).toUpperCase()}]`}
                  value={Object.values(obj)[0]?.bus_legal_name}
                  focused
                  style={{ margin: 5 }}
                  size="small"
                  variant="outlined"
                  placeholder="Enter legal name.."
                />
              ))}
              {legalName.length <= 2 && (
                <div className={classes.textBtnContainer}>
                  <TextField
                    type="text"
                    size="small"
                    placeholder="Enter Bus Legal Name"
                    onChange={(e) => formInputHandler('bus_legal_name', e.target.value)}
                    label={`[${`${legalNameLanguage.language}`.trim().slice(0, 2).toUpperCase()}]`}
                    value={formValue.bus_legal_name}
                    variant="outlined"
                  />
                  <Button
                    onClick={addLegalNameClickHandler}
                    variant="contained"
                    size="small"
                    style={{ background: '#4caf50', color: '#ffffff', marginLeft: 10 }}>
                    {switchData.add}
                  </Button>
                </div>
              )}
            </div>

            <div className={classes.addUser}>
              <p className={classes.pDiv}>{switchData.busName}* :</p>
              {busName.map((obj: object, idx: number) => (
                <TextField
                  key={idx}
                  onChange={(e) => updateExistingBusName(Object.keys(obj)[0], e.target.value)}
                  type="text"

                  label={`[${`${Object.keys(obj)[0]}`.trim().slice(0, 2).toUpperCase()}]`}
                  value={Object.values(obj)[0]?.bus_name}
                  focused
                  style={{ margin: 5 }}
                  size="small"
                  variant="outlined"
                  placeholder="Enter Bus Name.."
                />
              ))}
              {busName.length <= 2 && (
                <div className={classes.textBtnContainer}>
                  <TextField
                    type="text"
                    size="small"
                    placeholder="Enter Bus Name..."
                    defaultValue={''}
                    onChange={(e) => formInputHandler('bus_name', e.target.value)}
                    label={`[${`${busNameLanguage.language}`.trim().slice(0, 2).toUpperCase()}]`}
                    value={formValue.bus_name}
                    variant="outlined"
                  />
                  <Button
                    onClick={addBusNameClickHandler}
                    variant="contained"
                    size="small"
                    style={{ background: '#4caf50', color: '#ffffff', marginLeft: 10 }}>
                    {switchData.add}
                  </Button>
                </div>
              )}
            </div>

            <div className={classes.addUser}>
              <p className={classes.pDiv}>{switchData.address}* :</p>
              {address.map((obj: object, idx: number) => (
                <TextField
                  key={idx}
                  onChange={(e) => updateExistingaddress(Object.keys(obj)[0], e.target.value)}
                  type="text"

                  label={`[${`${Object.keys(obj)[0]}`.trim().slice(0, 2).toUpperCase()}]`}
                  value={Object.values(obj)[0]?.address}
                  focused
                  style={{ margin: 5 }}
                  size="small"
                  variant="outlined"
                  placeholder="Enter address.."
                />
              ))}
              {address.length <= 2 && (
                <div className={classes.textBtnContainer}>
                  <TextField
                    type="text"
                    size="small"
                    placeholder="Enter address"
                    onChange={(e) => formInputHandler('address', e.target.value)}

                    label={`[${`${addressLanguage.language}`.trim().slice(0, 2).toUpperCase()}]`}
                    value={formValue.address}
                    variant="outlined"
                  />
                  <Button
                    onClick={addAddressClickHandler}
                    variant="contained"
                    size="small"
                    style={{ background: '#4caf50', color: '#ffffff', marginLeft: 10 }}>
                    {switchData.add}
                  </Button>
                </div>
              )}
            </div>

            <div className={classes.addUser}>
              <p className={classes.pDiv}>{switchData.contactName}* :</p>
              {contactName.map((obj: object, idx: number) => (
                <TextField
                  key={idx}
                  onChange={(e) => updateExistingContactName(Object.keys(obj)[0], e.target.value)}
                  type="text"

                  label={`[${`${Object.keys(obj)[0]}`.trim().slice(0, 2).toUpperCase()}]`}
                  value={Object.values(obj)[0]?.contact_name}
                  focused
                  style={{ margin: 5 }}
                  size="small"
                  variant="outlined"
                  placeholder="Enter address.."
                />
              ))}
              {contactName.length <= 2 && (
                <div className={classes.textBtnContainer}>
                  <TextField
                    type="text"
                    size="small"
                    placeholder="Enter Contact name"
                    onChange={(e) => formInputHandler('contact_name', e.target.value)}
                    label={`[${`${contactNameLanguage.language}`.trim().slice(0, 2).toUpperCase()}]`}
                    value={formValue.contact_name}
                    variant="outlined"
                  />
                  <Button
                    onClick={addContactNameClickHandler}
                    variant="contained"
                    size="small"
                    style={{ background: '#4caf50', color: '#ffffff', marginLeft: 10 }}>
                    {switchData.add}
                  </Button>
                </div>
              )}
            </div>

            <div className={classes.addUser}>
              <p className={classes.pDiv}>{switchData.contactEmail}* :</p>
              <TextField
                type="email"
                size="small"
                variant="standard"
                required
                placeholder="Enter Your Email"
                value={formValue.contact_email}
                onChange={(e) => formInputHandler('contact_email', e.target.value)}
                style={{ width: 300 }}
              />
            </div>
            <div className={classes.addUser}>
              <p className={classes.pNumber}>{switchData.mobilePhone}* :</p>
              <PhoneInput
                country={'et'}
                masks={{ et: '.. ... ....' }}
                value={formValue.mobile_phone}
                onChange={(e) => formInputHandler('mobile_phone', e)}
              />
            </div>
            <div className={classes.addUser}>
              <p className={classes.pNumber}>{switchData.telephone}* :</p>
              <PhoneInput masks={{ et: '.. ... ....' }} country={'et'} value={formValue.telephone} onChange={(e) => formInputHandler('telephone', e)} />
            </div>
            <div className={classes.addUser}>
              <p className={classes.pDiv}>{switchData.busImage}* :</p>
              <div>
                <Box>
                  <Box sx={{ borderBottom: '1px solid #949494', width: '100%', display: 'flex', alignItems: 'center', padding: 3 }} >
                    <label htmlFor="upload-photo">
                      <input
                        style={{ display: 'none' }}
                        id="upload-photo"
                        name="upload-photo"
                        type="file"
                        onChange={(e: any) => formInputHandler('company_logo', e.target.files[0])}
                      />

                      <Button variant="contained" component="span" style={{ margin: 0, padding: 3 }} >
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="body2" style={{ paddingLeft: 10, paddingRight: 10 }} >{formValue?.company_logo !== undefined && formValue.company_logo.name.substring(0, 30)} </Typography>
                  </Box>
                  <Typography variant="caption" >Supported file jpg, png & file size 25mb </Typography>
                </Box>
              </div>


              {/* <TextField
                type="file"
                size="small"
                variant="standard"
                title='Choose Upload File'
                onChange={(e: any) => formInputHandler('company_logo', e.target.files[0])}
              /> */}
              {formValue?.user_id?.image && (
                <img src={`https://mengedegna.com/api/v1/${formValue?.user_id?.image}`} style={{ height: 100, width: 100 }} />
              )}
            </div>
            <div className={classes.addUser}>
              <p className={classes.pDiv}>{switchData.companyLogo}* :</p>
              <div>
                <Box >
                  <Box style={{ borderBottom: '1px solid #949494', width: '100%', display: 'flex', alignItems: 'center', padding: 3 }} >
                    <label htmlFor="upload-bus-photo">
                      <input
                        style={{ display: 'none' }}
                        id="upload-bus-photo"
                        name="upload-bus-photo"
                        type="file"
                        onChange={(e: any) => formInputHandler('bus_image', e.target.files[0])}
                      />

                      <Button variant="contained" component="span" style={{ margin: 0, padding: 3 }} >
                        Choose File
                      </Button>
                    </label>
                    <Typography variant="body2" style={{ paddingLeft: 10, paddingRight: 10 }} >{formValue?.bus_image !== undefined && formValue.bus_image.name.substring(0, 30)} </Typography>

                  </Box>
                  <Typography variant="caption" >Supported file jpg, png & file size 25mb </Typography>

                </Box>

                {/* <TextField
                  type="file"
                  size="small"
                  style={{ display: 'none' }}
                  variant="standard"
                  onChange={(e: any) => formInputHandler('bus_image', e.target.files[0])}
                /> */}
              </div>
              {formValue?.user_id?.image && (
                <img
                  src={`https://mengedegna.com/api/v1/${formValue?.user_id?.bus_image}`}
                  style={{ height: 100, width: 100 }}
                />
              )}
            </div>
            <div className={classes.addUser}>
              <p className={classes.pDiv}>{switchData.commissionRate}(%)* :</p>
              <TextField
                type="number"
                size="small"
                variant="standard"
                required
                InputProps={{
                  inputProps: { min: 1 },
                }}
                inputProps={{
                  pattern: '[0-9]*',
                }}
                placeholder=""
                value={formValue.commission_rate}
                onChange={(e) => formInputHandler('commission_rate', e.target.value)}
              />
            </div>

            <div className={classes.btnContainer}>
              <Button
                onClick={addBusHandler}
                variant="contained"
                type="submit"
                style={{ background: '#4caf50', color: '#ffffff', marginRight: 5 }}>
                {switchData.save}
              </Button>
              <Link href="/dashboard/bus-company-management">
                <Button variant="contained" color="secondary">
                  {switchData.cancel}
                </Button>
              </Link>
            </div>
          </Box>
        </form>

        <NotificationLoader
          message={(dataUpdateBusList?.success && dataUpdateBusList?.msg) || (data?.success && data?.msg)}
          loading={isLoadingUpdateBusList || isLoading || isLoadingGetBusCompanyList || errorLoading}
          error={JSON.stringify(data?.errors) || JSON.stringify(dataUpdateBusList?.errors) || errorLoading && JSON.stringify(errorMsg)}
        />
        {/* <NotificationLoader
          message={}
          loading={}
          error={ JSON.stringify(errorMsg)}
        /> */}
      </Paper>
    </div>
  );
}
