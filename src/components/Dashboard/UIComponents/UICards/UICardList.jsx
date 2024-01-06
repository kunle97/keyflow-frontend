import React, { useEffect } from "react";
import UICard from "./UICard";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { uiGreen } from "../../../../constants";
import { Stack } from "@mui/material";
import useScreen from "../../../../hooks/useScreen";
const UICardList = (props) => {
  const { screenWidth, breakpoints } = useScreen();

  useEffect(() => {}, [screenWidth]);
  return (
    <UICard
      info={props.info}
      title={props.title}
      cardStyle={props.cardStyle}
      infoStyle={props.infoStyle}
      titleStyle={props.titleStyle}
      dropDownOptions={props.dropDownOptions}
      onDropdownChange={props.onDropdownChange}
    >
      <ul className="list-group">
        {props.items.map((item) => (
          <>
            <li
              className="list-group-item py-3"
              style={{ background: "transparent", border: "none" }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignContent={"center"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <>
                  {screenWidth > breakpoints.lg && (
                    <Avatar sx={{ backgrounfd: uiGreen }}>{item.icon}</Avatar>
                  )}

                  <ListItemText
                    sx={{ color: "black" }}
                    primary={
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "black",
                          overflow: "hidden",
                          display: "-webkit-box",
                          "-webkit-line-clamp": 2, // Show two lines of text
                          "-webkit-box-orient": "vertical",
                          maxHeight: "42px", // Maximum height for two lines of text (adjust as needed)
                          lineHeight: "21px", // Line height for two lines of text
                          textOverflow: "ellipsis", // Show ellipsis for overflowed text
                        }}
                      >
                        {item.primary}
                      </Typography>
                    }
                    secondary={item.secondary}
                  />
                </>
                <p style={props.tertiaryStyles}>{item.tertiary}</p>
              </Stack>
            </li>
            <Divider variant="fullWidth" />
          </>
        ))}
      </ul>
    </UICard>
  );
};

export default UICardList;
