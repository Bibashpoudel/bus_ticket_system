import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import IntlMessages from '../../../@jumbo/utils/IntlMessages';

// Language Switching data========
const switchData = {
  basicTicketInformation: <IntlMessages id={'basicTicketInformation'} />,
  category: <IntlMessages id={'category'} />,
  choose: <IntlMessages id={'choose'} />,
  priority: <IntlMessages id={'priority'} />,
  description: <IntlMessages id={'description'} />,
  uploadImages: <IntlMessages id={'uploadImages'} />,
  cancel: <IntlMessages id={'cancel'} />,
  save: <IntlMessages id={'save'} />,
};

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    minHeight: 500,
    padding: 30,
  },
  pContainer: {
    fontWeight: 'bold',
  },
}));

export default function BasicTicketInformation() {
  const classes = useStyles();
  return (
    <div style={{ marginTop: 40 }}>
      <Paper className={classes.paperContainer}>
        <Typography gutterBottom variant="h3" className={classes.pContainer}>
        {switchData.basicTicketInformation}
        </Typography>
      </Paper>
    </div>
  );
}
