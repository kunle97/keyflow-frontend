import React, { useState } from "react";
import StepControl from "./StepControl";
import UITable from "../../../../UIComponents/UITable/UITable";
import UITabs from "../../../../UIComponents/UITabs";
import AlertModal from "../../../../UIComponents/Modals/AlertModal";
import useScreen from "../../../../../../hooks/useScreen";
import UITableMobile from "../../../../UIComponents/UITable/UITableMobile";
const Assign = (props) => {
  const [showAssignError, setShowAssignError] = useState(false);
  const [tabPage, setTabPage] = useState(0);
  const { isMobile } = useScreen();
  const sections = [
    { label: "Units", name: "units" },
    { label: "Properties", name: "properties" },
    { label: "Portfolios", name: "portfolios" },
  ];
  const unit_columns = [
    { name: "name", label: "Name" },
    {
      name: "rental_property_name",
      label: "Rental Property",
    },
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
  const options = {
    isSelectable: true,
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: (rowData, rowMeta) => {
      const navlink = `/dashboard/owner/properties/${rowData}`;
      props.navigate(navlink);
    },
  };

  const portfolio_options = {
    isSelectable: true,
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: (rowData, rowMeta) => {
      const navlink = `/dashboard/owner/portfolios/${rowData}`;
      props.navigate(navlink);
    },
  };

  const handleTabChange = (event, newValue) => {
    props.setSelectedAssignments([]);
    if (newValue === 0) {
      props.setAssignmentMode("unit");
    } else if (newValue === 1) {
      props.setAssignmentMode("property");
    } else if (newValue === 2) {
      props.setAssignmentMode("portfolio");
    }
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
    <div className="assign-to-units-section">
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
        <>
          {isMobile ? (
            <UITableMobile
              testRowIdentifier="rental-unit"
              tableTitle="Units"
              endpoint="/units/"
              infoProperty="name"
              createTitle={(row) =>
                `Occupied: ${row.is_occupied ? `Yes` : "No"} `
              }
              createSubtitle={(row) =>
                `Beds: ${row.beds} | Baths: ${row.baths}`
              }
              checked={props.selectedAssignments}
              setChecked={props.setSelectedAssignments}
              showCreate={false}
              showUpload={false}
              orderingFields={[
                { field: "name", label: "Name (Ascending)" },
                {
                  field: "-name",
                  label: "Name (Descending)",
                },
              ]}
              searchFields={["name", "beds", "baths"]}
              options={options}
            />
          ) : (
            <>
              <UITable
                columns={unit_columns}
                options={options}
                endpoint="/units/"
                title="Units"
                createURL="/dashboard/owner/units/create"
                detailURL="/dashboard/owner/units/"
                showCreate={false}
                checked={props.selectedAssignments}
                setChecked={props.setSelectedAssignments}
                hideShadow={props.hideShadow ? true : false}
              />
            </>
          )}
        </>
      )}
      {tabPage === 1 && (
        <>
          {isMobile ? (
            <UITableMobile
              testRowIdentifier="property"
              tableTitle="Properties"
              endpoint="/properties/"
              infoProperty="name"
              createTitle={(row) => `${row.street}`}
              createSubtitle={(row) => `${row.city}, ${row.state}`}
              checked={props.selectedAssignments}
              setChecked={props.setSelectedAssignments}
              showCreate={false}
              showUpload={false}
              orderingFields={[
                { field: "name", label: "Name (Ascending)" },
                {
                  field: "-name",
                  label: "Name (Descending)",
                },
              ]}
              searchFields={["name", "street", "city", "state"]}
              options={options}
            />
          ) : (
            <UITable
              columns={property_columns}
              options={options}
              endpoint="/properties/"
              title="Properties"
              createURL="/dashboard/owner/properties/create"
              detailURL="/dashboard/owner/properties/"
              showCreate={false}
              checked={props.selectedAssignments}
              setChecked={props.setSelectedAssignments}
              hideShadow={props.hideShadow ? true : false}
            />
          )}
        </>
      )}
      {tabPage === 2 && (
        <>
          {isMobile ? (
            <UITableMobile
              testRowIdentifier="portfolio"
              tableTitle="Portfolios"
              endpoint="/portfolios/"
              createInfo={(row) => {
                return `${row.name}`;
              }}
              createTitle={(row) => {
                return `${row.description}`;
              }}
              createSubtitle={(row) => {
                return ``;
              }}
              showCreate={true}
              createURL="/dashboard/owner/portfolios/create"
              onRowClick={(row) => {
                props.navigate(`/dashboard/owner/portfolios/${row.id}`);
              }}
              orderingFields={[
                { field: "name", label: "Name (Ascending)" },
                { field: "-name", label: "Name (Descending)" },
                { field: "description", label: "Description (Ascending)" },
                { field: "-description", label: "Description (Descending)" },
                { field: "created_at", label: "Date Created (Ascending)" },
                { field: "-created_at", label: "Date Created (Descending)" },
              ]}
              searchFields={["name", "description"]}
              options={portfolio_options}
              checked={props.selectedAssignments}
              setChecked={props.setSelectedAssignments}
            />
          ) : (
            <UITable
              columns={portfolio_columns}
              options={portfolio_options}
              endpoint="/portfolios/"
              title="Portfolios"
              createURL="/dashboard/owner/properties/create"
              detailURL="/dashboard/owner/properties/"
              showCreate={false}
              checked={props.selectedAssignments}
              setChecked={props.setSelectedAssignments}
              hideShadow={props.hideShadow ? true : false}
            />
          )}
        </>
      )}
      {!props.hideStepControl && (
        <StepControl
          skipAllowed={true}
          skipValidation={true}
          step={props.step}
          steps={props.steps}
          handlePreviousStep={props.handlePreviousStep}
          handleNextStep={() => {
            //Set the skip assign step
            props.setSkipAssignStep(false);
            if (isAnySelected()) {
              props.handleNextStep();
            }
          }}
          handleSubmit={() => {
            if (isAnySelected()) {
              props.handleSubmit();
            }
          }}
          handleSkipStep={() => {
            props.setSkipAssignStep(true);
            if (props.skipAssignStep === false) {
              props.setSkipAssignStep(true);

            } else {
              props.handleNextStep();
            }
          }}
        />
      )}
    </div>
  );
};

export default Assign;
