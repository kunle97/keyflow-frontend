import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLeaseAgreementById } from "../../../../api/lease_agreements";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  dateDiffForHumans,
  uiGreen,
  uiGrey2,
  uiRed,
} from "../../../../constants";
import UIButton from "../../UIComponents/UIButton";
import ReportIcon from "@mui/icons-material/Report";
import { getProperty } from "../../../../api/properties";
import {
  getNextPaymentDate,
  getPaymentDates,
} from "../../../../api/manage_subscriptions";
import SensorsIcon from "@mui/icons-material/Sensors";
import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PaymentsIcon from "@mui/icons-material/Payments";
import DrawIcon from "@mui/icons-material/Draw";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import useScreen from "../../../../hooks/useScreen";
import Joyride, { STATUS } from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import UIPageHeader from "../../UIComponents/UIPageHeader";
import { abbreviateRentFrequency } from "../../../../helpers/utils";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import { updateTenantAutoRenewStatus } from "../../../../api/tenants";
import { authenticatedInstance } from "../../../../api/api";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import UIDetailCard from "../../UIComponents/UICards/UIDetailCard";
const LeaseAgreementDetail = () => {
  const { id } = useParams();
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isPreparingDownload, setIsPreparingDownload] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [leaseAgreement, setLeaseAgreement] = useState({});
  const [autoRenewalEnabled, setAutoRenewalEnabled] = useState(false);
  const [rentalApplication, setRentalApplication] = useState({});
  const [rentalUnit, setRentalUnit] = useState({});
  const [rent, setRent] = useState(0);
  const [rentFrequency, setRentFrequency] = useState("");
  const [term, setTerm] = useState("");
  const [rentalProperty, setRentalProperty] = useState({});
  const [tenant, setTenant] = useState({});
  const [dueDates, setDueDates] = useState([{ title: "", start: new Date() }]);
  const [nextPaymentDate, setNextPaymentDate] = useState(null);
  const { isMobile } = useScreen();
  const [runTour, setRunTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const tourSteps = [
    {
      target: ".lease-agreement-details",
      content:
        "This is the lease agreement details section. It contains all the details of the lease agreement.",
      disableBeacon: true,
      placement: "right",
    },
    {
      target: ".lease-agreement-calendar",
      content:
        "This is the lease agreement calendar section. It shows the rent due dates for the tenant.",
      placement: "left",
    },
    {
      target: ".download-document-button",
      content:
        "You can download the lease agreement document by clicking the download button.",
      placement: "top",
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
  };

  const iconStyles = { color: uiGreen, fontSize: "24pt", marginBottom: "5px" };

  const getTenantName = () => {
    if (leaseAgreement.tenant) {
      return `${tenant.user.first_name} ${tenant.user.last_name}`;
    } else if (rentalApplication) {
      return `${rentalApplication.first_name} ${rentalApplication.last_name}`;
    } else {
      return "N/A";
    }
  };

  const changeAutoRenewal = (event) => {
    setAutoRenewalEnabled(event.target.checked);
    //Use the updateLEaseAgreement function to update the lease agreement with the new auto renewal status
    updateTenantAutoRenewStatus({
      auto_renew_lease_is_enabled: event.target.checked,
      tenant_id: leaseAgreement.tenant.id,
    })
      .then((res) => {
        if (res.status === 200) {
        } else {
          setAlertTitle("Error");
          setAlertMessage(
            "An error occurred while updating the lease agreement's auto renewal status"
          );
          setAlertModalOpen(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setAlertTitle("Error");
        setAlertMessage(
          "An error occurred while updating the lease agreement's auto renewal status"
        );
        setAlertModalOpen(true);
      });
  };
  const handleDownloadDocument = async () => {
    setIsPreparingDownload(true);
    try {
      const response = await authenticatedInstance.post(
        "/boldsign/download-document/",
        { document_id: leaseAgreement.document_id },
        { responseType: "blob" } // This is important to handle binary data
      );

      if (response.status !== 200) {
        throw new Error("Error downloading document");
      }

      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", "lease_agreement.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error:", error);
      setAlertTitle("Error");
      setAlertMessage(
        "An error occurred while downloading the lease agreement document. Please try again."
      );
      setAlertModalOpen(true);
      return;
    } finally {
      setIsPreparingDownload(false);
    }
  };

  useEffect(() => {
    setIsLoadingPage(true);
    // fetch the lease agreement with the id
    getLeaseAgreementById(id)
      .then((res) => {
        setLeaseAgreement(res.data);
        setRentalApplication(res.data.rental_application);
        setRentalUnit(res.data.rental_unit);
        setRent(
          JSON.parse(res.data.rental_unit.lease_terms).find(
            (term) => term.name === "rent"
          ).value
        );
        setRentFrequency(
          JSON.parse(res.data.rental_unit.lease_terms).find(
            (term) => term.name === "rent_frequency"
          ).value
        );
        setTerm(
          JSON.parse(res.data.rental_unit.lease_terms).find(
            (term) => term.name === "term"
          ).value
        );
        getProperty(res.data.rental_unit.rental_property).then((res) => {
          setRentalProperty(res);
        });
        setTenant(res.data.tenant);
        //Retrieve next payment date
        if (res.data.tenant) {
          setAutoRenewalEnabled(res.data.tenant.auto_renew_lease_is_enabled);
          getNextPaymentDate(res.data.tenant.user.id).then((res) => {
            setNextPaymentDate(res.data.next_payment_date);
          });
          getPaymentDates(res.data.tenant.user.id).then((res) => {
            if (res.status === 200) {
              const payment_dates = res.data.payment_dates;
              const due_dates = payment_dates.map((date) => {
                return {
                  title: "Rent Due",
                  start: new Date(date.payment_date),
                };
              });
              setDueDates(due_dates);
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching lease agreement", error);
        setAlertTitle("Error");
        setAlertMessage(
          "An error occurred while fetching lease agreement details. Please try again."
        );
        setAlertModalOpen(true);
      })
      .finally(() => {
        setIsLoadingPage(false);
      });
  }, []);
  return (
    <>
      {isLoadingPage ? (
        <UIProgressPrompt />
      ) : (
        <div className="container-fluid">
          <AlertModal
            open={alertModalOpen}
            title={alertTitle}
            message={alertMessage}
            btnText="Okay"
            onClick={() => setAlertModalOpen(false)}
          />
          <ProgressModal
            open={isPreparingDownload}
            title="Preparing download..."
          />
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
          <UIPageHeader
            title={getTenantName() + "'s Lease Agreement"}
            subtitle={`Started: ${new Date(
              leaseAgreement.start_date
            ).toLocaleDateString()} Ends: ${new Date(
              leaseAgreement.end_date
            ).toLocaleDateString()}`}
            backButtonPosition="bottom"
            backButtonURL="/dashboard/owner/lease-agreements"
          />
          {/* <Stack
            direction="row"
            spacing={2}
            alignContent={"center"}
            alignItems={"center"}
            sx={{ marginBottom: "14px" }}
          >
            <span className="text-black">Enable Auto Renewal </span>
            <UISwitch
              value={autoRenewalEnabled}
              onChange={changeAutoRenewal}
            />
          </Stack> */}
          <div className="row">
            <div className="col-md-4 lease-agreement-details">
              <div className="row">
                <div className="col-6 col-md-6">
                  {/* <div className="card mb-3">
                    <div className="card-body">
                      <PeopleAltIcon sx={iconStyles} />
                      <h5>Tenant</h5>
                      <p className="text-black">{getTenantName()}</p>
                    </div>
                  </div> */}
                  <UIDetailCard
                    style={{ marginBottom: "15px" }}
                    dataTestId="tenant-detail-card"
                    muiIcon={<PeopleAltIcon sx={iconStyles} />}
                    title="Tenant"
                    info={getTenantName()}
                  />
                </div>
                <div className="col-6 col-md-6">
                  {/* <div className="card mb-3">
                    <div className="card-body">
                      <HomeIcon sx={iconStyles} />
                      <h5>Property</h5>
                      <p className="text-black">
                        {leaseAgreement.rental_unit
                          ? rentalUnit.rental_property_name
                          : "N/A"}
                      </p>
                    </div>
                  </div> */}
                  <UIDetailCard
                    style={{ marginBottom: "15px" }}
                    dataTestId="property-detail-card"
                    muiIcon={<HomeIcon sx={iconStyles} />}
                    title="Property"
                    info={
                      leaseAgreement.rental_unit
                        ? rentalUnit.rental_property_name
                        : "N/A"
                    }
                  />
                </div>
                <div className="col-6 col-md-6">
                  {/* <div className="card mb-3">
                    <div className="card-body">
                      <MeetingRoomIcon sx={iconStyles} />
                      <h5>Rental Unit</h5>
                      <p className="text-black">
                        {leaseAgreement.rental_unit ? rentalUnit.name : "N/A"}
                      </p>
                    </div>
                  </div> */}
                  <UIDetailCard
                    style={{ marginBottom: "15px" }}
                    dataTestId="unit-detail-card"
                    muiIcon={<MeetingRoomIcon sx={iconStyles} />}
                    title="Rental Unit"
                    info={leaseAgreement.rental_unit ? rentalUnit.name : "N/A"}
                  />
                </div>
                <div className="col-6 col-md-6">
                  {/* <div className="card mb-3">
                    <div className="card-body">
                      <PaymentsIcon sx={iconStyles} />
                      <h5>Rent</h5>
                      <p className="text-black">
                        ${rent}/{abbreviateRentFrequency(rentFrequency)}
                      </p>
                    </div>
                  </div> */}
                  <UIDetailCard
                    style={{ marginBottom: "15px" }}
                    dataTestId="rent-detail-card"
                    muiIcon={<PaymentsIcon sx={iconStyles} />}
                    title="Rent"
                    info={`$${rent}/${abbreviateRentFrequency(rentFrequency)}`}
                  />
                </div>
                <div className="col-6 col-md-6">
                  {/* <div className="card mb-3">
                    <div className="card-body">
                      <SensorsIcon sx={iconStyles} />
                      <h5>Status</h5>
                      <p className="text-black">
                        {leaseAgreement.is_active ? (
                          <span style={{ color: uiGreen }}>Active</span>
                        ) : (
                          <span style={{ color: uiRed }}>Inactive</span>
                        )}
                      </p>
                    </div>
                  </div> */}
                  <UIDetailCard
                    style={{ marginBottom: "15px" }}
                    dataTestId="status-detail-card"
                    muiIcon={<SensorsIcon sx={iconStyles} />}
                    title="Status"
                    info={
                      leaseAgreement.is_active ? (
                        <span style={{ color: uiGreen }}>Active</span>
                      ) : (
                        <span style={{ color: uiRed }}>Inactive</span>
                      )
                    }
                  />
                </div>

                <div className="col-6 col-md-6">
                  {/* <div className="card mb-3">
                    <div className="card-body">
                      <DrawIcon sx={iconStyles} />
                      <h5>Sign Date</h5>
                      <p className="text-black">
                        {leaseAgreement.start_date ? (
                          new Date(
                            leaseAgreement.start_date
                          ).toLocaleDateString()
                        ) : (
                          <span>N/A</span>
                        )}
                      </p>
                    </div>
                  </div> */}
                  <UIDetailCard
                    style={{ marginBottom: "15px" }}
                    dataTestId="sign-date-detail-card"
                    muiIcon={<DrawIcon sx={iconStyles} />}
                    title="Sign Date"
                    info={
                      leaseAgreement.start_date ? (
                        new Date(leaseAgreement.start_date).toLocaleDateString()
                      ) : (
                        <span>N/A</span>
                      )
                    }
                  />
                </div>

                <div className="col-6 col-md-6">
                  {/* <div className="card mb-3">
                    <div className="card-body">
                      <CalendarMonthIcon sx={iconStyles} />
                      <h5>End Date</h5>
                      <p className="text-black">
                        {leaseAgreement.end_date ? (
                          new Date(leaseAgreement.end_date).toLocaleDateString()
                        ) : (
                          <span>N/A</span>
                        )}
                      </p>
                    </div>
                  </div> */}
                  <UIDetailCard
                    style={{ marginBottom: "15px" }}
                    dataTestId="lease-end-detail-card"
                    muiIcon={<CalendarMonthIcon sx={iconStyles} />}
                    title="End Date"
                    info={
                      leaseAgreement.end_date ? (
                        new Date(leaseAgreement.end_date).toLocaleDateString()
                      ) : (
                        <span>N/A</span>
                      )
                    }
                  />
                </div>
                <div className="col-6 col-md-6">
                  {/* <div className="card">
                    <div className="card-body">
                      <AccessTimeIcon sx={iconStyles} />
                      <h5>Term</h5>
                      <span className="text-black">
                        {" "}
                        {term + " " + rentFrequency}(s)
                      </span>
                    </div>
                  </div> */}

                  <UIDetailCard
                    style={{ marginBottom: "15px" }}
                    dataTestId="lease-term-detail-card"
                    muiIcon={<AccessTimeIcon sx={iconStyles} />}
                    title="Term"
                    info={term + " " + rentFrequency + "(s)"}
                  />
                </div>
              </div>

              <p style={{ color: uiGrey2 }}>
                <strong data-testId="auto-pay-enabled-label">
                  Auto Pay Enabled:
                </strong>{" "}
                {leaseAgreement.is_active ? (
                  <span data-testId="auto-pay-enabled-value" >
                    {leaseAgreement.auto_pay_is_enabled ? "Yes" : "No"}
                  </span>
                ) : (
                  <span data-testId="auto-pay-enabled-value" >"N/A"</span>
                )}
              </p>
              <p style={{ color: uiGrey2 }}>
                {dateDiffForHumans(new Date(nextPaymentDate)) <= 5 && (
                  <ReportIcon sx={{ color: "red" }} />
                )}{" "}
                <strong data-testId="rent-due-label">Rent due </strong>
                <span data-testId="rent-due-value">
                  {leaseAgreement.is_active
                    ? dateDiffForHumans(new Date(nextPaymentDate))
                    : "N/A"}
                </span>
              </p>
              {leaseAgreement.document_id !== "" && (
                <div className="download-document-button-container">
                  <UIButton
                    dataTestId="download-document-button"
                    btnText="Download Document"
                    style={{ width: "100%", marginBottom: "25px" }}
                    onClick={handleDownloadDocument}
                  />
                </div>
              )}
            </div>
            <div className="col-md-8 lease-agreement-calendar">
              <div className="card" data-testid="lease-agreement-calendar-card">
                <div className="card-body">
                  <FullCalendar
                    data-testid="lease-agreement-calendar"
                    height={isMobile ? "500px" : "600px"}
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    events={dueDates}
                    // eventContent={renderEventContent}
                  />
                </div>
              </div>
            </div>
          </div>
          <UIHelpButton onClick={handleClickStart} />
        </div>
      )}
    </>
  );
};

export default LeaseAgreementDetail;
