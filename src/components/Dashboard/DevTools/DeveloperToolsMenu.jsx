import { useState } from "react";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDial from "@mui/material/SpeedDial";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PropertyGeneratorForm from "./forms/PropertyGeneratorForm";
import UnitGeneratorForm from "./forms/UnitGeneratorForm";

const DeveloperToolsMenu = () => {
  const [open, setOpen] = useState(true);
  const [dataType, setDataType] = useState("properties"); // Default value
  const [name, setName] = useState("");
  const [activeFormComponent, setActiveFormComponent] = useState(<></>);
  const [formProps, setFormProps] = useState({}); // Default value
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const actions = [
    {
      icon: <MapsHomeWorkIcon />,
      name: "Generate Properties",
      dataType: "properties",
      form: <PropertyGeneratorForm {...formProps} />,
    },
    {
      icon: <MeetingRoomIcon />,
      name: "Generate Units",
      dataType: "units",
      form: <UnitGeneratorForm {...formProps} />,
    },
    // Add actions for other data types
  ];

  return (
    <>
      {/* ... */}
      {activeFormComponent}
      <SpeedDial
        ariaLabel="Generate Data"
        sx={{ position: "fixed", bottom: 16, right: 16, flexGrow: 1 }}
        icon={<EngineeringIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              handleOpen();
              setFormProps({
                dataType: action.dataType,
                name: action.name,
                open: open,
                onClose: () => {
                  handleClose();
                },
              });
              setActiveFormComponent(action.form);
              setDataType(action.dataType);
              setName(action.name);
              setActiveFormComponent(action.form);
            }}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default DeveloperToolsMenu;
