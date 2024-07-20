import React, { useEffect, useState } from "react";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import useScreen from "../../../../hooks/useScreen";
import { useNavigate } from "react-router";
import UITable from "../../UIComponents/UITable/UITable";
import Joyride, {
  STATUS
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import { uiGreen } from "../../../../constants";
import { getOwnerSubscriptionPlanData } from "../../../../api/owners";
import AlertModal from "../../UIComponents/Modals/AlertModal";
const Portfolios = () => {
  const navigate = useNavigate();
  const { screenWidth, breakpoints, isMobile } = useScreen();
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalRedirect, setAlertModalRedirect] = useState(null);
  const portfolio_columns = [
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
  const portfolio_options = {
    onRowClick: (row) => {
      navigate(`/dashboard/owner/portfolios/${row.id}`);
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
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".portfolio-list-section",
      content:
        "This is the list of all your portfolios. A portfolio is a collection of properties.",
      disableBeacon: true,
    },
    {
      target: ".ui-table-more-button:first-of-type",
      content: "Click here to view more options for this portfolio",
    },
    {
      target: ".ui-table-create-button",
      content: "Click here to create a new portfolio",
    },
  ];
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setTourIndex(0);
      setRunTour(false);
    }
  };
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);

  };
  useEffect(() => {
    getOwnerSubscriptionPlanData().then((res) => {

      if (!res.can_use_portfolios) {
        setAlertModalRedirect("/dashboard/owner/");
        setAlertModalTitle("Subscription Plan Mismatch");
        setAlertModalMessage(
          "To access the portfolios feature, you need to upgrade your subscription plan to the Keyflow Owner Standard Plan or higher. "
        );
        setAlertModalOpen(true);
      } else {
        setAlertModalRedirect(null);
        setAlertModalTitle("");
        setAlertModalMessage("");
        setAlertModalOpen(false);
      }
    });
  }, []);
  return (
    <div
      className={`${
        screenWidth > breakpoints.md && "container-fluid"
      } portfolio-list-section`}
    >
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
        open={alertModalOpen}
        setOpen={setAlertModalOpen}
        title={alertModalTitle}
        message={alertModalMessage}
        btnText={"Ok"}
        onClick={() => {
          if (alertModalRedirect) {
            navigate(alertModalRedirect);
          }
          setAlertModalOpen(false);
        }}
      />
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
            navigate(`/dashboard/owner/portfolios/${row.id}`);
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
          columns={portfolio_columns}
          options={portfolio_options}
          showCreate={true}
          createURL="/dashboard/owner/portfolios/create"
          menuOptions={[
            {
              name: "View",
              onClick: (row) => {
                navigate(`/dashboard/owner/portfolios/${row.id}`);
              },
            },
          ]}
        />
      )}
      <UIHelpButton onClick={handleClickStart} />
    </div>
  );
};

export default Portfolios;
