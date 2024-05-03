import React, { useState } from "react";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import { uiGreen } from "../../constants";
import UIButton from "../Dashboard/UIComponents/UIButton";
const DashboardTour = (props) => {
  const [runTour, setRunTour] = useState(true);
  const [tourIndex, setTourIndex] = useState(0);
  const [tourSteps, setTourSteps] = useState([
    {
      target: "body",
      content: (
        <>
          <h4>Welcome to your dashboard</h4>
          <p>
            This is the the Keyflow owner dashboard. here you can view and
            manage your properties, units, tenants and more. Let's go over the
            basics!
          </p>
        </>
      ),
    },
    {
      target: ".navbar.topbar",
      content:
        "This is the navigation bar. You will be using this frequently to navigate to different sections of the dashboard.",
    },
    {
      target: "[data-testid='nav-menu-button'] ",
      content:
        "Click here to access the navigation menu. You can access all the sections of the dashboard from here.",
      spotlightClicks: true,
      disableBeacon: false,
      disableOverlayClose: true,
      placement: "right",
      styles: {
        options: {
          zIndex: 10000,
        },
      },
    },
    // {
    //   target: '[data-testid="sidebar-desktop"]',
    //   content:
    //     "This is the sidebar. You can access all the sections of the dashboard from here.",
    // },
    {
      target: ".topbar-brand",
      content:
        "This is the Keyflow logo. Click here to return to the dashboard home page at any time.",
    },
    {
      target: '[data-testid="search-bar-desktop"]',
      content:
        "Use the search bar to search for properties, units, tenants,maintenance requests and any other resources. You can simply type in the search bar or click the search icon to bring up the search dialog.",
    },
    {
      target: ".notification-topbar-icon",
      content:
        "Click here to view your notifications. You will receive notifications for tenant activity, lease renewal requests, lease cancellation requests, maintenance requests, and more. You can turn some notifications on or off in your account settings.",
    },
    {
      target: ".messages-topbar-icon",
      content:
        "Click here to view your messages. You can send and receive messages from your tenants.",
    },
    {
      target: ".my-account-topbar-dropdown",
      content: "Click here to view your account settings, and to log out.",
    },
  ]);
  const handleClickStart = (event) => {
    event.preventDefault();
    setRunTour(true);
  };

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setTourIndex(0);
      setRunTour(false);
    }
  };

  return (
    <div>
      <UIButton btnText="Start Tour" onClick={handleClickStart} />
      <Joyride
        callback={handleJoyrideCallback}
        run={runTour}
        index={tourIndex}
        steps={tourSteps}
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
    </div>
  );
};

export default DashboardTour;
