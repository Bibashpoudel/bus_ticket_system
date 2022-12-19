import globalStyles from '../../../theme/GlobalCss';
import SignIn from '../Common/authComponents/SignIn';
import VerticalDefault from './VerticalLayouts/VerticalDefault';

const AppLayout = ({ children }) => {
  globalStyles();
  return <VerticalDefault children={children} />;
};

export default AppLayout;
