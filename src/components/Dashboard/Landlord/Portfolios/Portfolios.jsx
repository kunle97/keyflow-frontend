import React from "react";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
import { useNavigate } from "react-router";
import UITable from "../../UIComponents/UITable/UITable";
const Portfolios = () => {
  const navigate = useNavigate();
  const { screenWidth, breakpoints, isMobile } = useScreen();
  const columns = [
    {
      name: "name",
      label: "Name",
      flex: 1,
    },
    {
      name: "description",
      label: "Description",
      flex: 1,
    },
    {
      name: "created_at",
      label: "Date Created",
      options: {
        customBodyRender: (value) => {
          return new Date(value).toLocaleDateString();
        },
      },
    },
  ];
  const options = {
    onRowClick: (row) => {
      navigate(`/dashboard/landlord/portfolios/${row.id}`);
    },
    orderingFields: [
      { field: "name", label: "Name (Ascending)" },
      { field: "-name", label: "Name (Descending)" },
      { field: "description", label: "Description (Ascending)" },
      { field: "-description", label: "Description (Descending)" },
      { field: "created_at", label: "Date Created (Ascending)" },
      { field: "-created_at", label: "Date Created (Descending)" },
    ],
  };
  return (
    <div className={`${screenWidth > breakpoints.md && "container-fluid"}`}>
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
      ) : (
        <UITable
          testRowIdentifier="portfolio"
          title="Portfolios"
          endpoint="/portfolios/"
          columns={columns}
          options={options}
          showCreate={true}
          createURL="/dashboard/landlord/portfolios/create"
          menuOptions={[
            {
              name: "View",
              onClick: (row) => {
                navigate(`/dashboard/landlord/portfolios/${row.id}`);
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default Portfolios;
