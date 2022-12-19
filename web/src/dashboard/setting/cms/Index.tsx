import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CmsEditor from './CmsEditor';
import FullWidthTabs from '../../../../pages/test';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import ContentLoader from '../../../../@jumbo/components/ContentLoader';
import IntlMessages from '../../../../@jumbo/utils/IntlMessages';

// Language Switching data========
const switchData = {
  language: <IntlMessages id={'language'} />,
  termsAndConditions: <IntlMessages id={'termsAndConditions'} />,
  privacyPolicy: <IntlMessages id={'privacyPolicy'} />,
  aboutUs: <IntlMessages id={'aboutUs'} />,
  contactUs: <IntlMessages id={'contact'} />,
  choose: <IntlMessages id={'choose'} />,
};

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ width: '100%' }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3} width={FullWidthTabs}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  selectLanguageWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
    marginRight: 15,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10,
      marginTop: 15,
    },
  },
  languageFormControl: {
    marginLeft: 15,
    minWidth: '15%',
    [theme.breakpoints.down('sm')]: {
      minWidth: '45%',
    },
  },
  root: {
    flexGrow: 1,
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  privacyContainer: {
    marginBottom: 5,
    fontSize: 12,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  termConditionContainer: {
    fontSize: 12,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  box: {
    padding: 12,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
}));

const languages = [
  { id: 1, name: 'English', value: 'english' },
  { id: 2, name: 'አማርኛ', value: 'amharic' },
  { id: 3, name: 'Afaan Oromoo', value: 'oromifa' },
];

export default function VerticalTabs() {
  const classes = useStyles();
  const [language, setLanguage] = useState('english');
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.selectLanguageWrapper}>
        <p>{switchData.language} :</p>
        <FormControl variant="outlined" size="small" className={classes.languageFormControl}>
          <InputLabel id="demo-simple-select-outlined-label">
            <p>- {switchData.choose} -</p>
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            label="- choose -"
            value={language}
            onChange={(e: any) => setLanguage(e.target.value)}>
            {languages.map((obj: any) => (
              <MenuItem value={obj.value} key={obj.name}>
                {obj.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}>
          <Tab className={classes.privacyContainer} label={switchData.privacyPolicy} {...a11yProps(0)} />
          <Tab className={classes.termConditionContainer} label={switchData.termsAndConditions} {...a11yProps(1)} />
          <Tab className={classes.termConditionContainer} label={switchData.aboutUs} {...a11yProps(2)} />
          <Tab className={classes.termConditionContainer} label={switchData.contactUs} {...a11yProps(3)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <CmsEditor language={language} type="privacy-policy" />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CmsEditor language={language} type="terms-conditions" />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CmsEditor language={language} type="about-us" />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <CmsEditor language={language} type="contact-us" />
        </TabPanel>
      </div>
    </div>
  );
}
