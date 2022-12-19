import { Button, makeStyles, Paper } from '@material-ui/core';
import Link from 'next/link';
import React, {  useState } from 'react';
import {  useQuery } from 'react-query';
import { NotificationLoader } from '../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';
import {  getSupportList } from '../../apis/support/support';
import SupportTable from './SupportTable';

// Language Switching data========
const switchData = {
  openTicket: <IntlMessages id={'openTicket'} />,
  filterName: <IntlMessages id={'filterbyname'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: 15,
    },
  },
  btnDesign: {
    background: '#4caf50',
    color: '#fff',
  },
}));

export default function MDSupport() {
  const classes = useStyles();
  const [pageInfo, updatePageInfo] = useState({ page: 1, size: 10 });

  

  const {
    refetch,
    isSuccess: isSuccessGetSupportList,
    isError: isErrorSupportList,
    error: supportListError,
    isLoading: isLoadingSupportList,
    data: supportListData,
  } = useQuery(['Support-List',pageInfo?.page, pageInfo.size], getSupportList);

  const pageNoHandler = (type: string, value: any) => {
    if (type === 'page') {
      updatePageInfo({ ...pageInfo, [type]: value + 1 });
    } else {
      updatePageInfo({ ...pageInfo, [type]: value });
    }
  };
  console.log('page and size',pageInfo)

  return (
    <div>
      <Paper className={classes.paperContainer}>
        <Link href="/dashboard/open-ticket">
          <Button className={classes.btnDesign} variant="contained">
            + {switchData.openTicket}
          </Button>
        </Link>
        <SupportTable data={supportListData} pageHandle={pageNoHandler} loader={isLoadingSupportList} />
        <NotificationLoader message={''} loading={isLoadingSupportList} error={JSON.stringify(supportListData?.errors)} />
      </Paper>
    </div>
  );
}
