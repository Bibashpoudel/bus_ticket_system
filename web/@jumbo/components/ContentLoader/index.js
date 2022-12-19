import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { Slide } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { fetchError } from '../../../redux/actions';
import PageLoader from '../PageComponents/PageLoader';
import { useIntl } from 'react-intl';

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

// eslint-disable-next-line react/prop-types
export const NotificationLoader = ({ loading, error, message: messageProps }) => {
  console.log('NOTIFICATION', error);
  const { locale } = useIntl();
  const message = messageProps ? messageProps[locale] : '';
  const [errorLocal, setError] = useState('');
  const [messageLocal, setMessage] = useState('');

  useEffect(() => {
    if (error || message) {
      if (typeof error === 'string') {
        if (error.indexOf('{') !== -1) {
          console.log(JSON.parse(error));
          const obj = JSON.parse(error);
          const allKeys = Object.keys(obj);
          const allValues = Object.values(obj);
          let formatedArray = '';
          if (obj[locale]) {
            formatedArray = <span>{`${allValues[0]}`}</span>;
          } else {
            formatedArray = allKeys.map((k, idx) => {
              return <span key={idx}>{`${k}: ${allValues[idx][locale] || allValues[idx]}`}</span>;
            });
          }

          setError(formatedArray);
        } else {
          setError(error);
        }
      }
      setMessage(message);
      setTimeout(() => {
        setError('');
        setMessage('');
      }, 5000);
    }
  }, [error, message]);

  return (
    <React.Fragment>
      {loading && <PageLoader />}
      {
        <Snackbar
          open={Boolean(errorLocal)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          TransitionComponent={SlideTransition}>
          <Alert variant="filled" severity="error">
            <div style={{ display: 'flex', flexDirection: 'column' }}>{errorLocal}</div>
          </Alert>
        </Snackbar>
      }
      {
        <Snackbar
          open={Boolean(messageLocal)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          TransitionComponent={SlideTransition}>
          <Alert variant="filled" severity="success">
            {messageLocal}
          </Alert>
        </Snackbar>
      }
    </React.Fragment>
  );
};

const ContentLoader = () => {
  const { error, loading, message } = useSelector(({ common }) => common);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error || message) {
      setTimeout(() => {
        console.log('Dispatch called');
        dispatch(fetchError(''));
      }, 5000);
    }
  }, [dispatch, error, message]);

  return (
    <React.Fragment>
      {loading && <PageLoader />}
      {
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          TransitionComponent={SlideTransition}>
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        </Snackbar>
      }
      {
        <Snackbar
          open={Boolean(message)}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          TransitionComponent={SlideTransition}>
          <Alert variant="filled" severity="success">
            {message}
          </Alert>
        </Snackbar>
      }
    </React.Fragment>
  );
};

export default ContentLoader;
