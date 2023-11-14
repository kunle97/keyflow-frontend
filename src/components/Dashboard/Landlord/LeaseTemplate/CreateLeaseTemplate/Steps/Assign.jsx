import React, { useEffect, useState } from "react";
import StepControl from "./StepControl";
import UITable from "../../../../UIComponents/UITable/UITable";
import UITabs from "../../../../UIComponents/UITabs";
import { getProperty } from "../../../../../../api/properties";
import AlertModal from "../../../../UIComponents/Modals/AlertModal";
const Assign = (props) => {
  const [checked, setChecked] = useState(props.selectedAssignments);
  const [showAssignError, setShowAssignError] = useState(false);
  const [tabPage, setTabPage] = useState(0);
  const sections = [
    { label: "Units", name: "units" },
    { label: "Properties", name: "properties" },
    { label: "Portfolios", name: "portfolios" },
  ];
  const unit_columns = [
    {
      name: "rental_property",
      label: "Rental Property",
      // options: {
      //   customBodyRender: async (value) => {
      //     try {
      //       console.log("Fetching data for", value);
      //       const res = await getProperty(value);
      //       console.log("Response:", res);

      //       if (res) {
      //         return <span>{res.name}</span>;
      //       } else {
      //         return <span>No data available</span>;
      //       }
      //     } catch (error) {
      //       console.error("Error fetching data:", error);
      //       return <span>Error: Unable to fetch data</span>;
      //     }
      //   },
      // },
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
    { name: "id", label: "ID", options: { display: false } },
    { name: "name", label: "Property Name" },
    { name: "street", label: "Street Address" },
    { name: "city", label: "City" },
    { name: "state", label: "State" },
  ];
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
  };
  const handleTabChange = (event, newValue) => {
    setTabPage(newValue);
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

  return (
    <div>
      <AlertModal
        open={showAssignError}
        handleClose={() => setShowAssignError(false)}
        title=""
        message="Please select at least one unit property or portfolio to assign the lease agreement to. You may skip this step if you wish to assign the lease agreement later."
        onClick={() => {
          setShowAssignError(false);
        }}
        btnText="Okay"
      />
      <UITabs
        value={tabPage}
        handleChange={handleTabChange}
        tabs={sections}
        variant="scrollable"
        scrollButtons="auto"
        style={{ marginBottom: "2rem" }}
      />
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

      <StepControl
        skipAllowed={true}
        step={props.step}
        steps={props.steps}
        handlePreviousStep={props.handlePreviousStep}
        handleNextStep={() => {
          if (isAnySelected()) {
            //Remove this step from skipped steps
            let newSkippedSteps = [...props.skippedSteps];
            newSkippedSteps.splice(newSkippedSteps.indexOf(props.step), 1);
            props.setSkippedSteps(newSkippedSteps);
            props.handleNextStep();
          }
        }}
        handleSkipStep={() => {
          props.setSkippedSteps([...props.skippedSteps, props.step]);
          props.handleNextStep();
        }}
        handleSubmit={() => {
          if (isAnySelected()) {
            props.handleSubmit();
          }
        }}
      />
    </div>
  );
};

export default Assign;