import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DropDownForm from '../dashboard/booking-management/DropDownForm';

export default function PopoverPopupState(props: any) {
  return (
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <div>
          <Button variant="outlined" size="medium" {...bindTrigger(popupState)}>
            <ExpandMore />
          </Button>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}>
            <Box>
              <Typography>
                <DropDownForm {...props} />
              </Typography>
            </Box>
          </Popover>
        </div>
      )}
    </PopupState>
  );
}
