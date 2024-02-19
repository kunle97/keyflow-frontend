import React from "react";
import { useEffect } from "react";
import {
  deleteMaintenanceRequest,
  getAllOwnerMaintenanceRequests,
} from "../../../../api/maintenance_requests";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uiGreen, uiGrey2, uiRed } from "../../../../constants";
import TitleCard from "../../UIComponents/TitleCard";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UITable from "../../UIComponents/UITable/UITable";
import UIInfoCard from "../../UIComponents/UICards/UIInfoCard";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import VendorPaymentModel from "../../UIComponents/Prototypes/Modals/VendorPaymentModal";
import UIButton from "../../UIComponents/UIButton";
import { Stack } from "@mui/material";
import useScreen from "../../../../hooks/useScreen";

const LandlordMaintenanceRequests = () => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  //TODO: Display data on what properties/units have the most pending, respolved isues

  //Create a astate for the maintenance requests
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState(0);
  const [pendingIssues, setPendingIssues] = useState(0);
  const [inProgressIssues, setInProgressIssues] = useState(0);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [orderingField, setOrderingField] = useState("created_at");
  const [searchField, setSearchField] = useState("");
  const [limit, setLimit] = useState(10);
  const [nextEndpoint, setNextEndpoint] = useState(null);
  const [previousEndpoint, setPreviousEndpoint] = useState(null);
  const [openVenorPayModal, setOpenVendorPayModal] = useState(false);

  const columns = [
    { name: "description", label: "Issue" },
    { name: "type", label: "Type" },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          if (value === "pending") {
            return <span className="text-warning">Pending</span>;
          } else if (value === "in_progress") {
            return <span className="text-info">In Progress</span>;
          } else if (value === "completed") {
            return <span className="text-success">Completed</span>;
          }
        },
      },
    },
    {
      name: "created_at",
      label: "Date",
      options: {
        customBodyRender: (value) => {
          return <span>{new Date(value).toLocaleDateString()}</span>;
        },
      },
      sort: true,
    },
  ];

  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/maintenance-requests/${rowData}`;
    navigate(navlink);
    console.log(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
    onRowClick: handleRowClick,
    rowHover: true,
    //Create a delete function that will delete the maintenance request only if it is not in progress
    // onRowsDelete: (rowsDeleted, newTableData) => {
    //   console.log(rowsDeleted);
    //   console.log(newTableData);
    //   let idsToDelete = [];
    //   rowsDeleted.data.map((row) => {
    //     //Check if the status is in progress
    //     if (maintenanceRequests[row.dataIndex].status === "in_progress") {
    //       setShowDeleteError(true);
    //       setDeleteErrorMessage(
    //         "One or more of the maintenance requests you have selected are in progress. You cannot delete a maintenance request that is in progress. Please mark it as completed first."
    //       );
    //       return false;
    //     } else {
    //       idsToDelete.push(maintenanceRequests[row.dataIndex].id);
    //     }
    //   });
    //   console.log(idsToDelete);
    //   idsToDelete.map((id) => {
    //     deleteMaintenanceRequest(id).then((res) => {
    //       console.log(res.data);
    //     });
    //   });
    // },
  };

  useEffect(() => {
    //Retrieve the maintenance requests
    getAllOwnerMaintenanceRequests(orderingField, searchField, limit).then(
      (res) => {
        setMaintenanceRequests(res.data.results);
        setResolvedIssues(
          res.data.results.filter((request) => {
            return request.status === "completed";
          }).length
        );
        setPendingIssues(
          res.data.results.filter((request) => {
            return request.status === "pending";
          }).length
        );
        setInProgressIssues(
          res.data.results.filter((request) => {
            return request.status === "in_progress";
          }).length
        );
      }
    );
  }, [orderingField, searchField, limit]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4 mb-4">
          <UIInfoCard
            cardStyle={{ background: "white", color: uiGrey2 }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt", margin: 0 }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt", margin: 0 }}
            info={resolvedIssues}
            title={"Resolved Issues"}
            // icon={<PeopleAltIcon style={{ fontSize: "25pt" }} />}
          />
        </div>
        <div className="col-6 col-md-4 mb-4">
          <UIInfoCard
            cardStyle={{ background: "white", color: uiGrey2 }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt", margin: 0 }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt", margin: 0 }}
            info={inProgressIssues}
            title={"Issues In Progress"}
            // icon={<PeopleAltIcon style={{ fontSize: "25pt" }} />}
          />
        </div>
        <div className="col-6 col-md-4 mb-4">
          <UIInfoCard
            cardStyle={{ background: "white", color: uiGrey2 }}
            infoStyle={{ color: uiGrey2, fontSize: "16pt", margin: 0 }}
            titleStyle={{ color: uiGrey2, fontSize: "12pt", margin: 0 }}
            info={pendingIssues}
            title={"Pending Issues"}
            // icon={<PeopleAltIcon style={{ fontSize: "25pt" }} />}
          />
        </div>
      </div>
      <VendorPaymentModel
        open={openVenorPayModal}
        onClose={() => {
          setOpenVendorPayModal(false);
        }}
      />
      <AlertModal
        open={showDeleteError}
        onClick={() => setShowDeleteError(false)}
        title="Error"
        message={deleteErrorMessage}
        btnText="Close"
      />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        alignItems="center"
      >
        <div>
          <UIButton
            btnText="Pay Vendor"
            onClick={() => setOpenVendorPayModal(true)}
            style={{ width: "100%", marginBottom: "15px" }}
          />
        </div>
      </Stack>
      {isMobile ? (
        <UITableMobile
          data={maintenanceRequests}
          endpoint="/maintenance-requests/"
          createInfo={(row) =>
            `${row.tenant.user["first_name"]} ${row.tenant.user["last_name"]}`
          }
          createTitle={(row) => `${row.description}`}
          createSubtitle={(row) => `${row.status.replace("_", " ")}`}
          onRowClick={(row) => {
            const navlink = `/dashboard/landlord/maintenance-requests/${row.id}`;
            navigate(navlink);
          }}
          titleStyle={{
            maxHeight: "17px",
            maxWidth: "180px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          orderingFields={[
            { field: "created_at", label: "Date Created (Ascending)" },
            { field: "-created_at", label: "Date Created (Descending)" },
            { field: "status", label: "Status (Ascending)" },
            { field: "-status", label: "Status (Descending)" },
          ]}
          showResultLimit={false}
          tableTitle="Maintenance Requests"
          loadingTitle="Maintenance Requests"
          loadingMessage="Loading your maintenance requests..."
        />
      ) : (
        <UITable 
          data={maintenanceRequests}
          columns={columns}
          options={options}
          title="Maintenance Requests"
          searchFields={["description", "status"]}
          onSearch={(value) => {
            setSearchField(value);
          }}
          onOrderingChange={(value) => {
            setOrderingField(value);
          }}
          onResultLimitChange={(value) => {
            setLimit(value);
          }}
          showResultLimit={true}
          loadingTitle="Maintenance Requests"
          loadingMessage="Loading your maintenance requests..."
        />
      )}
    </div>
  );
};

export default LandlordMaintenanceRequests;
