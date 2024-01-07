import React from "react";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
import { useNavigate } from "react-router";
const Portfolios = () => {
  const navigate = useNavigate();
  const { screenWidth, breakpoints } = useScreen();

  return (
    <div className={`${screenWidth > breakpoints.md && "container-fluid"}`}>
      <UITableMobile
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
        createURL="/dashboard/landlord/portfolios/create"
        onRowClick={(row) => {
          navigate(`/dashboard/landlord/portfolios/${row.id}`);
        }}
        orderingFields={[
          { field: "name", label: "Name (Ascending)" },
          { field: "-name", label: "Name (Descending)" },
          { field: "description", label: "Description (Ascending)" },
          { field: "-description", label: "Description (Descending)" },
          { field: "created_at", label: "Date Created (Ascending)" },
          { field: "-created_at", label: "Date Created (Descending)" },
        ]}
      />
    </div>
  );
};

export default Portfolios;
