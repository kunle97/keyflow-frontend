import React from 'react'
import { Button} from "@mui/material";
import { Link } from 'react-router-dom';
import { uiGreen } from '../../constants';
 const UIButton = (props) => {
    return (
        <Link to={props.to}>
          <Button
          
            style={{
              margin: "25px",
              backgroundColor: uiGreen,
            }}
            variant="contained"
          >
            {props.btnText}
          </Button>
        </Link>
      );
}

export default UIButton