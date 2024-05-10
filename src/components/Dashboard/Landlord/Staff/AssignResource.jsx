import React, { useState } from "react";
import UITable from "../../UIComponents/UITable/UITable";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITabs from "../../UIComponents/UITabs";
import UIButton from "../../UIComponents/UIButton";
import { updateStaffRentalAssignments } from "../../../../api/staff";
const AssignResource = (props) => {
  const [showAssignError, setShowAssignError] = useState(false);

  const [alertOpen, setAlertOpen] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [tabPage, setTabPage] = useState(props.selectedResourceType);
  const sections = [
    { label: "Units", name: "units" },
    { label: "Properties", name: "properties" },
    { label: "Portfolios", name: "portfolios" },
  ];
  const unit_columns = [
    {
      name: "rental_property_name",
      label: "Rental Property",
    },
    { name: "name", label: "Name" },
    { name: "beds", label: "Beds" },
    { name: "baths", label: "Baths" },
    {
      name: "is_occupied",
      label: "Occupied",
      options: {
        customBodyRender: (value) => {
          if (value === true) {
            return <span>Yes</span>;
          } else {
            return <span>No</span>;
          }
        },
      },
    },
    {
      name: "created_at",
      label: "Created At",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];
  const property_columns = [
    { name: "name", label: "Property Name" },
    { name: "street", label: "Street Address" },
    { name: "city", label: "City" },
    { name: "state", label: "State" },
  ];

  const portfolio_columns = [
    { name: "name", label: "Portfolio Name" },
    { name: "description", label: "Description" },
    {
      name: "created_at",
      label: "Created At",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
    },
  ];

  const portfolio_options = {
    isSelectable: true,
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: (rowData, rowMeta) => {
      const navlink = `/dashboard/landlord/portfolios/${rowData}`;
      props.navigate(navlink);
    },
  };

  const handleTabChange = (event, newValue) => {
    setTabPage(newValue);
  };

  //Create a function that changees the tabsPage state beased on the value of the select element
  const handleSelectChange = (e) => {
    setTabPage(parseInt(e.target.value, 10));
    if (parseInt(e.target.value, 10) === 0) {
      props.setSelectedResourceType("units");
    } else if (parseInt(e.target.value, 10) === 1) {
      props.setSelectedResourceType("properties");
    } else if (parseInt(e.target.value, 10) === 2) {
      props.setSelectedResourceType("portfolios");
    }
    props.setSelectedAssignments([]);
  };

  const handleSave = () => {
    console.log(props.selectedResourceType);
    const selectedItems = props.selectedAssignments.filter(
      (item) => item.selected
    );
    console.log(selectedItems);

    let selectedItemIds = selectedItems.map((item) => item.id);
    console.log(selectedItemIds);

    const payload = {
      staff_id: props.staffId,
      selectedResourceIds: selectedItemIds,
      selectedResourceType: props.selectedResourceType,
    };
    console.log(payload);
    updateStaffRentalAssignments(payload).then((res) => {
      console.log(res);
      if (res.status === 200) {
        // props.setStaffRentalAssignments(res.data);
        // setAlertOpen(true);
        // setAlertTitle("Success");
        // setAlertMessage("Assignments saved successfully");
        console.log("Assignments saved successfully");
      } else {
        setAlertOpen(true);
        setAlertTitle("Error");
        setAlertMessage("An error occured while saving assignments");
      }
    });
  };

  const isAnySelected = () => {
    //Check if all objects in  selectedAssignments has a property selected of false. If so prompt user with showAssignError
    let allSelected = props.selectedAssignments.every(
      (assignment) => assignment.selected === false
    );
    if (allSelected) {
      setShowAssignError(true);
      return false;
    }
    return true;
  };

  const options = {
    isSelectable: true,
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: (rowData, rowMeta) => {
      const navlink = `/dashboard/landlord/properties/${rowData}`;
      props.navigate(navlink);
    },
    onRowSelect: () => {
      handleSave();
    },
  };
  return (
    <div className="assign-to-units-section">
      <AlertModal
        open={alertOpen}
        handleClose={() => setAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
        onClick={() => setAlertOpen(false)}
        btnText="Okay"
      />
      <div>
        <select
          className="resource-filter-select"
          onChange={handleSelectChange}
          style={{
            background: "#FFFFFF !important",
            padding: "15px",
            border: "none",
            borderRadius: "10px 15px",
            width: "100%",
            boxShadow:
              "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
          }}
          value={tabPage}
        >
          <option value="">Select Resource</option>
          <option value={0}>Units</option>
          <option value={1}>Properties</option>
          <option value={2}>Portfolios</option>
        </select>
      </div>
      {tabPage === 0 && (
        <UITable
          columns={unit_columns}
          options={options}
          endpoint="/units/"
          title="Units"
          createURL="/dashboard/landlord/units/create"
          detailURL="/dashboard/landlord/units/"
          showCreate={false}
          checked={props.selectedAssignments}
          setChecked={props.setSelectedAssignments}
        />
      )}
      {tabPage === 1 && (
        <UITable
          columns={property_columns}
          options={options}
          endpoint="/properties/"
          title="Properties"
          createURL="/dashboard/landlord/properties/create"
          detailURL="/dashboard/landlord/properties/"
          showCreate={false}
          checked={props.selectedAssignments}
          setChecked={props.setSelectedAssignments}
        />
      )}
      {tabPage === 2 && (
        <UITable
          columns={portfolio_columns}
          options={portfolio_options}
          endpoint="/portfolios/"
          title="Portfolios"
          createURL="/dashboard/landlord/properties/create"
          detailURL="/dashboard/landlord/properties/"
          showCreate={false}
          checked={props.selectedAssignments}
          setChecked={props.setSelectedAssignments}
        />
      )}
    </div>
  );
};

export default AssignResource;
