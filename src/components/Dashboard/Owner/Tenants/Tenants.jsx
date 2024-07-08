import React, { useEffect, useState } from "react";
import { getOwnerTenants } from "../../../../api/owners";
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
import AlertModal from "../../UIComponents/Modals/AlertModal";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
const Tenants = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [tenants, setTenants] = useState([]);
  const [leaseRenewals, setLeaseRenewals] = useState([]);
  const [leaseCancellations, setLeaseCancellations] = useState([]); // [
  const navigate = useNavigate();
  const { isMobile } = useScreen();
  const columns = [
    {
      name: "user",
      label: "First Name",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          if (value.first_name) {
            return value.first_name;
          } else {
            return "N/A";
          }
        },
        orderingField: "user__first_name",
      },
    },
    {
      name: "user",
      label: "Last Name",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          if (value.last_name) {
            return value.last_name;
          } else {
            return value.last_name;
          }
        },
        orderingField: "user__last_name",
      },
    },
    {
      name: "user",
      label: "E-mail",
      options: {
        isObject: true,
        customBodyRender: (value) => {
          if (value.email) {
            return value.email;
          } else {
            return "N/A";
          }
        },
        orderingField: "user__email",
      },
    },
  ];
  const handleRowClick = (rowData, rowMeta) => {
    const navlink = `/dashboard/owner/tenants/${rowData}/`;
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
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".tenants-list-section",
      content: "This is the list of all your tenants.",
      disableBeacon: true,
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content: "Click here to view more options for this tenant",
    },
  ];
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setTourIndex(0);
      setRunTour(false);
    }
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);
    console.log(runTour);
  };

  useEffect(() => {
    try {
      getOwnerTenants().then((res) => {
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
    } catch (err) {
      console.error(err);
      setAlertMessage(
        "An error occurred while retrieving tenants. Please try again later."
      );
      setAlertTitle("Error");
      setShowAlert(true);
    }
  }, []);
  return (
    <div className="container">
      <Joyride
        run={runTour}
        index={tourIndex}
        steps={tourSteps}
        callback={handleJoyrideCallback}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: uiGreen,
          },
        }}
        locale={{
          back: "Back",
          close: "Close",
          last: "Finish",
          next: "Next",
          skip: "Skip",
        }}
      />
      <AlertModal
        open={showAlert}
        onClick={() => setShowAlert(false)}
        title={alertTitle}
        message={alertMessage}
        btnText="Okay"
      />
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
                const navlink = `/dashboard/owner/tenants/${row.id}`;
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
              searchFields={["first_name", "last_name", "email"]}
            />
          ) : (
            <div
              className="tenants-list-section"
            >
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
                      const navlink = `/dashboard/owner/tenants/${row.id}`;
                      navigate(navlink);
                    },
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default Tenants;
