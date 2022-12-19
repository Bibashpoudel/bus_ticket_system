import { Box, Button, InputBase, Paper, Switch, Tab, Tabs } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import GrdTable from '../../components/MDGridTable';
import { format } from 'date-fns';
import Link from 'next/link';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';

// Language Switching data========
const switchData = {
  view: <IntlMessages id={'view'} />,
};

interface Data {
  [key: string]: any;
}

interface HeadCell {
  key: string;
  label: any;
}

const headCells: HeadCell[] = [
  { key: '_id', label: <IntlMessages id={'ticketId'} /> },
  { key: 'title', label: <IntlMessages id={'title'} /> },
  { key: 'category', label: <IntlMessages id={'type'} /> },
  { key: 'priority', label: <IntlMessages id={'priority'} /> },
  { key: 'status', label: <IntlMessages id={'status'} /> },
  { key: 'created_at', label: <IntlMessages id={'created'} /> },
  { key: 'action', label: <IntlMessages id={'action'} /> },
];

export default function SupportTable(props: any) {
  const { data, pageHandle, loader } = props;

  return (
    <div>
      <GrdTable
        headCells={headCells}
        pageNoHandler={pageHandle}
        totalRecordCount={data?.totaldata}
        loading={loader}
        rows={
          data?.data
            ? data.data.map((r: any) => {
                return {
                  ...r,
                  category: r?.category?.category,

                  created_at: `${format(new Date(r.created_at), 'yyyy-MM-dd')} ${new Date(
                    r.created_at,
                  ).getHours()}:${new Date(r.created_at).getMinutes()}`,

                  action: [
                    <Link href={`/dashboard/ticket-details/${r._id}`} key={r._id}>
                    
                      <Button key={1} variant="contained" size='small' color="primary" style={{  cursor: 'pointer' }}>
                        {switchData.view}
                      </Button>
                    
                    </Link>,
                  ],
                };
              })
            : []
        }
      />
    </div>
  );
}
