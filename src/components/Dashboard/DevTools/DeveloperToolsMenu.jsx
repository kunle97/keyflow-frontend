import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';import { useState } from "react";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDial from "@mui/material/SpeedDial";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PropertyGeneratorForm from "./forms/PropertyGeneratorForm";
import UnitGeneratorForm from "./forms/UnitGeneratorForm";
import TenantGeneratorForm from "./forms/TenantGeneratorForm";
import { uiGreen } from "../../../constants";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import HandymanIcon from "@mui/icons-material/Handyman";
import DescriptionIcon from "@mui/icons-material/Description";
import MessageIcon from "@mui/icons-material/Message";
import LeaseTemplateGeneratorForm from "./forms/LeaseTemplateGeneratorForm";
import RentalApplicationGeneratorForm from "./forms/RentalApplicationGeneratorForm";
import MessageGeneratorForm from "./forms/MessageGeneratorForm";
import MaintenanceRequestGeneratorForm from "./forms/MaintenanceRequestGeneratorForm";
import LeaseRenewalRequestGeneratorForm from "./forms/LeaseRenewalRequestGeneratorForm";
import LeaseCancellationRequestGeneratorForm from "./forms/LeaseCancellationRequestGeneratorForm";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TransactionGeneratorForm from "./forms/TransactionGeneratorForm";
import UploadFileIcon from '@mui/icons-material/UploadFile';
const DeveloperToolsMenu = () => {
  const [open, setOpen] = useState(true);
  const [resourceType, setDataType] = useState("properties"); // Default value
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
      resourceType: "properties",
      form: <PropertyGeneratorForm {...formProps} />,
    },
    {
      icon: <MeetingRoomIcon />,
      name: "Generate Units",
      resourceType: "units",
      form: <UnitGeneratorForm {...formProps} />,
    },
    {
      icon: <PeopleAltIcon />,
      name: "Generate Tenants",
      resourceType: "tenants",
      form: <TenantGeneratorForm {...formProps} />,
    },
    {
      icon: <CopyAllIcon />,
      name: "Generate Lease Templates",
      resourceType: "lease-templates",
      form: <LeaseTemplateGeneratorForm {...formProps} />,
    },
    {
      icon: <DescriptionIcon />,
      name: "Generate Rental Applications",
      resourceType: "rental-applications",
      form: <RentalApplicationGeneratorForm {...formProps} />,
    },
    {
      icon: <MessageIcon />,
      name: "Generate Messages",
      resourceType: "messages",
      form: <MessageGeneratorForm {...formProps} />,
    },
    {
      icon: <HandymanIcon />,
      name: "Generate Maintenance Requests",
      resourceType: "maintenance-requests",
      form: <MaintenanceRequestGeneratorForm {...formProps} />,
    },
    {
      icon: <AssignmentLateIcon />,
      name: "Generate Lease Cancellation Requests",
      resourceType: "lease-cancellation-requests",
      form: <LeaseCancellationRequestGeneratorForm {...formProps} />,
    },
    {
      icon: <UploadFileIcon />,
      name: "Generate Lease Renewal Requests",
      resourceType: "lease-renewal-requests",
      form: <LeaseRenewalRequestGeneratorForm {...formProps} />,
    },
    {
      icon: <AttachMoneyIcon />,
      name: "Generate Transactions",
      resourceType: "transactions",
      form: <TransactionGeneratorForm {...formProps} />,
    }

    // Add actions for other data types
  ];

  return (
    <>
      {/* ... */}
      {activeFormComponent}
      <SpeedDial
        ariaLabel="Generate Data"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          flexGrow: 1,
        }}
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
                resourceType: action.resourceType,
                name: action.name,
                open: open,
                onClose: () => {
                  handleClose();
                },
              });
              setActiveFormComponent(action.form);
              setDataType(action.resourceType);
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
