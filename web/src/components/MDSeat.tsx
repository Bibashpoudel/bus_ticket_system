import { makeStyles } from '@material-ui/core/styles';
import Image from 'next/image';
const useStyles = makeStyles((theme) => ({
  imgDesign: {
    height: 60,
    width: 60,
    display: 'flex',
    transformOrigin: 'center',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: 35,
      width: 40,
    },
  },
}));

export default function MDSeat(props: { name?: string; type?: string }) {
  const classes = useStyles();
  const { name, type } = props;
  return (
    <div className={classes.imgDesign}>
      <img alt="seat" width={'100%'} height={'100%'} src={type || '/images/seats/seat.png'} />
      <div style={{ position: 'absolute', top: '25%', left: '40%', fontSize: 10, color: 'black' }}>{name}</div>
    </div>
  );
}
