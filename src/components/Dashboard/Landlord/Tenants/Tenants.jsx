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
const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [leaseRenewals, setLeaseRenewals] = useState([]);
  const [leaseCancellations, setLeaseCancellations] = useState([]); // [
  const navigate = useNavigate();
  const columns = [
    {
      name: "uploaded_profile_picture",
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
                src={value ? value.file : defaultUserProfilePicture}
                style={{ height: "50px", margin: "auto" }}
              />
            </div>
          );
        },
      },
    },
    { name: "first_name", label: "First Name" },
    { name: "last_name", label: "Last Name" },
    { name: "email", label: "E-mail" },
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

          <UITable
            title="Tenants"
            endpoint={`/users/${authUser.user_id}/tenants/`}
            searchFields={["first_name", "last_name", "email"]}
            columns={columns}
            options={options}
          />
        </div>

        {/* <div className="col-lg-4">
          <div className="card mb-4" style={{ overflow: "hidden" }}>
            <h6
              className="dropdown-header p-3 text-white"
              style={{ background: uiGreen, borderStyle: "none" }}
            >
              Recent Activity
            </h6>
            <a className="menu-item d-flex align-items-center p-3" href="#">
              <div className="p-1">
                <div className="bg-primary icon-circle">
                  <i className="fas fa-file-alt text-white" />
                </div>
              </div>
              <div>
                <span className="small text-gray-500">December 12, 2019</span>
                <p className="text-dark">John Doe Just paid $2679 for rent</p>
              </div>{" "}
            </a>
            <a className="menu-item d-flex align-items-center p-3" href="#">
              <div className="p-1">
                <div className="bg-success icon-circle">
                  <i className="fas fa-donate text-white" />
                </div>
              </div>
              <div>
                <span className="small text-gray-500">December 7, 2019</span>
                <p className="text-dark">
                  $290.29 has been deposited into your account!
                </p>
              </div>{" "}
            </a>
            <a className="menu-item d-flex align-items-center p-3" href="#">
              <div className="p-1">
                <div className="bg-warning icon-circle">
                  <i className="fas fa-exclamation-triangle text-white" />
                </div>
              </div>
              <div>
                <span className="small text-gray-500">December 2, 2019</span>
                <p className="text-dark">
                  Spending Alert: We've noticed unusually high spending for your
                  account.
                </p>
              </div>{" "}
            </a>
            <a
              className="dropdown-item text-center small text-gray-500 p-2"
              href="#"
            >
              Show All Alerts
            </a>
          </div>
          <div className="card mb-4" style={{ overflow: "hidden" }}>
            <h6
              className="dropdown-header p-3 text-white"
              style={{ background: uiGreen, borderStyle: "none" }}
            >
              Recent Requests
            </h6>
            <a className="menu-item d-flex align-items-center p-3" href="#">
              <div className="p-1">
                <div className="bg-primary icon-circle">
                  <i className="fas fa-file-alt text-white" />
                </div>
              </div>
              <div>
                <span className="small text-gray-500">December 12, 2019</span>
                <p className="text-dark">John Doe Just paid $2679 for rent</p>
              </div>{" "}
            </a>
            <a className="menu-item d-flex align-items-center p-3" href="#">
              <div className="p-1">
                <div className="bg-success icon-circle">
                  <i className="fas fa-donate text-white" />
                </div>
              </div>
              <div>
                <span className="small text-gray-500">December 7, 2019</span>
                <p className="text-dark">
                  $290.29 has been deposited into your account!
                </p>
              </div>{" "}
            </a>
            <a className="menu-item d-flex align-items-center p-3" href="#">
              <div className="p-1">
                <div className="bg-warning icon-circle">
                  <i className="fas fa-exclamation-triangle text-white" />
                </div>
              </div>
              <div>
                <span className="small text-gray-500">December 2, 2019</span>
                <p className="text-dark">
                  Spending Alert: We've noticed unusually high spending for your
                  account.
                </p>
              </div>{" "}
            </a>
            <a
              className="dropdown-item text-center small text-gray-500 p-2"
              href="#"
            >
              Show All Alerts
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Tenants;
