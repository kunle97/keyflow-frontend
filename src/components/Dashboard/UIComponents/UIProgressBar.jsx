import * as React from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { uiGreen } from '../../../constants';

const UIProgressBar = (props) => {
  const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: uiGreen,
    },
  }));
  return (
    <CustomLinearProgress
      variant="determinate"
      value={props.value}
      style={{ height: "10px" }}
    />
  );
};

export default UIProgressBar;
