import React, { useEffect, useState } from "react";
import { getLandlordTenants } from "../../../../api/api";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import TitleCard from "../../UIComponents/TitleCard";
import { authUser, uiGreen } from "../../../../constants";
import UITable from "../../UIComponents/UITable/UITable";
const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const navigate = useNavigate();
  const columns = [
    { name: "id", label: "ID", options: { display: false } },
    { name: "first_name", label: "First Name" },
    { name: "last_name", label: "Last Name" },
    { name: "email", label: "E-mail" },
  ];
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/landlord/tenants/${rowData[0]}/`;
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
  }, []);

  return (
    <div className="container">
      <h3 className="text-white mb-4">Tenants</h3>
      <div className="row">
        <div className="col-sm-12 col-md-8 col-lg-8">
          <div className="row">
            <div className="col-md-4 mb-4">
              <TitleCard
                backgroundColor={uiGreen}
                title="Total Tenants"
                value={tenants.length}
              />
            </div>
            <div className="col-md-4 mb-4">
              <TitleCard
                backgroundColor={uiGreen}
                title="Total Requests"
                value={523}
              />
            </div>
            <div className="col-md-4 mb-4">
              <TitleCard
                backgroundColor={uiGreen}
                title="Lease Renewals"
                value={58}
              />
            </div>
          </div>
{/* 
          <MUIDataTable
            title={"Tenants"}
            data={tenants}
            columns={columns}
            options={options}
          /> */}
          <UITable
            title="Tenants"
            endpoint={`/users/${authUser.id}/tenants/`}
            searchFields={["first_name", "last_name", "email"]}
            columns={columns}
            options={options}
          />
        </div>

        <div className="col-lg-4">
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
                <p className="text-white">John Doe Just paid $2679 for rent</p>
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
                <p className="text-white">
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
                <p className="text-white">
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
                <p className="text-white">John Doe Just paid $2679 for rent</p>
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
                <p className="text-white">
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
                <p className="text-white">
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
        </div>
      </div>
    </div>
  );
};

export default Tenants;
