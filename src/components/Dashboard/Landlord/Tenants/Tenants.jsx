import React, { useEffect, useState } from "react";
import { getLandlordTenants } from "../../../../api/landlords";
import { useNavigate } from "react-router-dom";
import TitleCard from "../../UIComponents/TitleCard";
import { authUser, uiGreen, uiGrey2 } from "../../../../constants";
import UITable from "../../UIComponents/UITable/UITable";
import { defaultUserProfilePicture } from "../../../../constants";
import UIInfoCard from "../../UIComponents/UICards/UIInfoCard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { getAllLeaseRenewalRequests } from "../../../../api/lease_renewal_requests";
import { getAllLeaseCancellationRequests } from "../../../../api/lease_cancellation_requests";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [leaseRenewals, setLeaseRenewals] = useState([]);
  const [leaseCancellations, setLeaseCancellations] = useState([]); // [
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const columns = [
    {
      name: "user",
      label: "",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          return (
            <div
              style={{
                overflow: "hidden",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
              }}
            >
              <img
                src={
                  value.user_profile_picture
                    ? value.user_profile_picture.file
                    : defaultUserProfilePicture
                }
                style={{ height: "50px", margin: "auto" }}
              />
            </div>
          );
        },
      },
    },
    {
      name: "user",
      label: "First Name",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          return value.first_name;
        },
      },
    },
    {
      name: "user",
      label: "Last Name",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          return value.last_name;
        },
      },
    },
    {
      name: "user",
      label: "E-mail",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          return value.email;
        },
      },
    },
  ];
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/tenants/${rowData}/`;
    navigate(navlink);
  };
  const options = {
    filter: true,
    sort: true,
    onRowClick: handleRowClick,
    sortOrder: {
      name: "created_at",
      direction: "desc",
    },
  };
  useEffect(() => {
    getLandlordTenants().then((res) => {
      console.log(res);
      setTenants(res.data);
      console.log(tenants);
    });
    getAllLeaseRenewalRequests().then((res) => {
      console.log(res);
      setLeaseRenewals(res.data);
      console.log(leaseRenewals);
    });
    getAllLeaseCancellationRequests().then((res) => {
      console.log(res);
      setLeaseCancellations(res.data);
      console.log(leaseCancellations);
    });
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-12 ">
          <div className="row">
            <div className="col-md-4 mb-4">
              <UIInfoCard
                cardStyle={{ background: "white", color: uiGrey2 }}
                infoStyle={{ color: uiGrey2, fontSize: "16pt", margin: 0 }}
                titleStyle={{ color: uiGrey2, fontSize: "12pt", margin: 0 }}
                info={tenants.length}
                title={"Total Occupied Tenants"}
                icon={<PeopleAltIcon style={{ fontSize: "25pt" }} />}
              />
            </div>
            <div className="col-md-4 mb-4">
              <UIInfoCard
                cardStyle={{ background: "white", color: uiGrey2 }}
                infoStyle={{ color: uiGrey2, fontSize: "16pt", margin: 0 }}
                titleStyle={{ color: uiGrey2, fontSize: "12pt", margin: 0 }}
                title={"Pending Lease Cancellations"}
                info={
                  leaseCancellations.filter(
                    (leaseCancellation) =>
                      leaseCancellation.status === "pending"
                  ).length
                }
                icon={<PeopleAltIcon style={{ fontSize: "25pt" }} />}
              />
            </div>
            <div className="col-md-4 mb-4">
              <UIInfoCard
                cardStyle={{ background: "white", color: uiGrey2 }}
                infoStyle={{ color: uiGrey2, fontSize: "16pt", margin: 0 }}
                titleStyle={{ color: uiGrey2, fontSize: "12pt", margin: 0 }}
                title={"Pending Lease Renewals"}
                info={
                  leaseRenewals.filter(
                    (leaseRenewal) => leaseRenewal.status === "pending"
                  ).length
                }
                icon={<PeopleAltIcon style={{ fontSize: "25pt" }} />}
              />
            </div>
          </div>

          {isMobile ? (
            <UITableMobile
              tableTitle="Tenants"
              endpoint={`/tenants/`}
              onRowClick={(row) => {
                const navlink = `/dashboard/landlord/tenants/${row.id}`;
                navigate(navlink);
              }}
              createInfo={(row) =>
                `${row.user.first_name} ${row.user.last_name}`
              }
              createSubtitle={(row) => `${row.user.email}`}
              createTitle={(row) => `${row.user.email}`}
              orderingFields={[
                { field: "created_at", label: "Date Created" },
                { field: "-created_at", label: "Date Created (Descending)" },
              ]}
              loadingTitle="Loading Tenants..."
              loadingMessage="Please wait while we load all the tenants."
            />
          ) : (
            <UITable
              title="Tenants"
              endpoint={`/tenants/`}
              searchFields={["first_name", "last_name", "email"]}
              columns={columns}
              options={options}
              menuOptions={[
                {
                  name: "Manage",
                  onClick: (row) => {
                    const navlink = `/dashboard/landlord/tenants/${row.id}`;
                    navigate(navlink);
                  },
                },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tenants;
