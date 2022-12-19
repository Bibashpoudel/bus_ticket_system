import { Avatar, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import { getReply, getSupportDetails } from '../../apis/support/support';
import Editor from './Editor';

// Language Switching data========
const switchData = {
  basicTicketInformation: <IntlMessages id={'basicTicketInformation'} />,
  save: <IntlMessages id={'save'} />,
  email: <IntlMessages id={'email'} />,
  phone: <IntlMessages id={'phone'} />,
  createdAt: <IntlMessages id={'createdAt'} />,
  status: <IntlMessages id={'status'} />,
  postedOn: <IntlMessages id={'postedOn'} />,
  ticket: <IntlMessages id={'ticket'} />,
  type: <IntlMessages id={'type'} />,
  title: <IntlMessages id={'title'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    minHeight: 500,
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 15,
    },
  },
  typographyContainer: {
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    background: '#e3f2fd',
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  pcontainer: {
    width: '30%',
    marginBottom: 5,
    [theme.breakpoints.down('sm')]: {
      width: '32%',
    },
  },
  box: {
    width: '40%',
    padding: 10,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10,
      width: '100%',
    },
  },
  avatarContainer: {
    paddingRight: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 5,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      paddingRight: 0,
    },
  },
  lowerAvatarContainer: {
    paddingRight: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    marginBottom: 5,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      paddingRight: 0,
    },
  },
  ticketNumContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '96%',
    background: '#90caf9',
    paddingLeft: 10,
    marginBottom: 10,
    minHeight: 70,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexDirection: 'column',
      alignItems: 'unset',
    },
  },
  pInAvtar: {
    width: '35%',

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 5,
    },
  },
  avatarSpan: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 5,
    },
  },
  avatarLowerSpan: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: 5,
      marginRight: 5,
    },
  },
  descriptionContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '94%',
    paddingLeft: 10,
    marginLeft: 20,
    borderRadius: 10,
    marginTop: 10,
    minHeight: 50,
    [theme.breakpoints.down('sm')]: {
      marginBotton: 10,
    },
  },
  replyContainer: {
    display: 'flex',
    width: '94%',
    paddingLeft: 10,
    marginLeft: 20,
    borderRadius: 5,
    marginTop: 10,
    minHeight: 50,
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginBotton: 10,
    },
  },
  avatar: {
    height: 40,
    width: 40,
    background: 'purple',
    [theme.breakpoints.down('sm')]: {
      height: 25,
      width: 25,
    },
  },
}));

export default function TicketDetails(props: any) {
  const { params } = props;
  const [ticket_id] = params.ids;
  const [userInfo, setUserInfo] = useState({} as any);
  const classes = useStyles();

  const getUserList = () => {
    setUserInfo({ ...getReplyData });
  };

  useEffect(() => {
    getUserList();
  }, []);

  const {
    refetch,
    isSuccess: isSuccessGetSupporDetailstById,
    isError: isErrorGetSupportDetails,
    error: getSupportDetailsError,
    isLoading: isLoadingGetSupportDetails,
    data: getSupportDetailsData,
  } = useQuery(['ticket-details', ticket_id], getSupportDetails);

  const {
    refetch: refetchReply,
    isSuccess: isSuccessGetReply,
    isError: isErrorGetReply,
    error: getReplyError,
    isLoading: isLoadingGetReply,
    data: getReplyData,
  } = useQuery(['Get-Reply', ticket_id], getReply);

  // console.log('getSupportDetailsData', getSupportDetailsData);

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <Typography gutterBottom variant="h3" className={classes.typographyContainer}>
          {switchData.basicTicketInformation}
        </Typography>
        <div className={classes.infoContainer}>
          <div className={classes.box}>
            <div style={{ display: 'flex' }}>
              <p className={classes.pcontainer}>{switchData.title} :</p>
              <span>{getSupportDetailsData?.data?.title}</span>
            </div>
            <div style={{ display: 'flex' }}>
              <p className={classes.pcontainer}>{switchData.type} :</p>
              <span>{getSupportDetailsData?.data?.category?.category}</span>
            </div>
            <div style={{ display: 'flex' }}>
              <p className={classes.pcontainer}>{switchData.status} :</p>
              <span>{getSupportDetailsData?.data?.status}</span>
            </div>
            <div style={{ display: 'flex' }}>
              <p className={classes.pcontainer}>{switchData.createdAt} :</p>
              <span>
                {getSupportDetailsData?.data?.created_at &&
                  format(new Date(getSupportDetailsData?.data?.created_at), 'yyyy-MM-dd')}
              </span>
            </div>
          </div>
           
          <div className={classes.box}>
          {(getSupportDetailsData?.data?.added_by?.email)?
            <div style={{ display: 'flex' }}>
              <p className={classes.pcontainer}>{switchData.email} :</p>
              <span>{getSupportDetailsData?.data?.added_by?.email}</span>
            </div>:''}
            {(getSupportDetailsData?.data?.added_by?.email)?
            <div style={{ display: 'flex' }}>
              <p className={classes.pcontainer}>{switchData.phone} :</p>
              <span>{getSupportDetailsData?.data?.added_by?.phone}</span>
            </div> :""}
          </div>
         
         
        </div>
        <div style={{ border: '1px solid', padding: 10, marginBottom: 20 }}>
          <div className={classes.avatarContainer}>
            <div className={classes.ticketNumContainer}>
              <p className={classes.pInAvtar}>
                {getSupportDetailsData?.data?.added_by?.firstname} {getSupportDetailsData?.data?.added_by?.lastname}{' '}
                {switchData.postedOn} {getSupportDetailsData?.data?.created_at}{' '}
              </p>
              <p>
                {switchData.ticket} :{getSupportDetailsData?.data?._id}
              </p>
            </div>
            <span className={classes.avatarSpan}>
              <Avatar className={classes.avatar}>
                {`${getSupportDetailsData?.data?.added_by?.firstname?.trim().split('')?.[0]}${
                  getSupportDetailsData?.data?.added_by?.lastname
                    ? getSupportDetailsData?.data?.added_by?.lastname.trim().split('')?.[0]
                    : ''
                }`}
              </Avatar>
            </span>
          </div>
          <Paper className={classes.descriptionContainer}>
            <p>{getSupportDetailsData?.data?.description}</p>
          </Paper>
        </div>

        {/* lowerReply */}
        {getReplyData?.data
          ?.slice()
          .reverse()
          .map((reply: any) => (
            <div key={reply._id}>
              <div style={{ border: '1px solid ', marginBottom: 10, padding: 10 }}>
                <div className={classes.lowerAvatarContainer}>
                  <div className={classes.ticketNumContainer}>
                    <p className={classes.pInAvtar}>
                      {reply?.added_by?.firstname} {reply?.added_by?.lastname} {switchData.postedOn}
                      {format(new Date(reply?.created_at), 'yyyy-MM-dd')}
                    </p>
                    <p>
                      {switchData.ticket} : {reply?._id}
                    </p>
                  </div>
                  <span className={classes.avatarLowerSpan}>
                    <Avatar className={classes.avatar}>
                      {' '}
                      {`${reply?.added_by?.firstname?.trim()?.split('')?.[0]}${
                        reply?.added_by?.lastname ? reply?.added_by?.lastname.trim().split('')?.[0] : ''
                      }`}
                    </Avatar>
                  </span>
                </div>
                <Paper className={classes.replyContainer}>
                  <p style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: reply?.comment }}></p>
                </Paper>
              </div>
            </div>
          ))}

        <div>
          <Editor supportTicketId={ticket_id} refetchReply={refetchReply} />
        </div>
      </Paper>
    </div>
  );
}
