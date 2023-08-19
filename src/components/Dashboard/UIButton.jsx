import React from 'react'
import { Button} from "@mui/material";
import { Link } from 'react-router-dom';
 const UIButton = (props) => {
    return (
        <Link to={props.to}>
          <Button
            style={{
              margin: "25px",
              backgroundColor: "#3aaf5c",
            }}
            variant="contained"
          >
            {props.btnText}
          </Button>
        </Link>
      );
}

export default UIButton