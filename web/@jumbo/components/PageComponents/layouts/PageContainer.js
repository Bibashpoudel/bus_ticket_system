import React from 'react';
import Box from '@material-ui/core/Box';
import { PageBreadcrumbs, PageHeader } from '../index';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  pageFull: {
    width: '100%',
  },
}));

const PageContainer = ({ heading, breadcrumbs, children, className, restProps }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.pageFull, className)} {...restProps}>
      Hello there
    </div>
  );
};

export default PageContainer;
