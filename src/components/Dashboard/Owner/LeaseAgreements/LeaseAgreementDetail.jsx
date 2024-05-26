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
import { downloadBoldSignDocument } from "../../../../api/boldsign";
import BackButton from "../../UIComponents/BackButton";
import SensorsIcon from "@mui/icons-material/Sensors";
import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PaymentsIcon from "@mui/icons-material/Payments";
import DrawIcon from "@mui/icons-material/Draw";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import useScreen from "../../../../hooks/useScreen";
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride";
import UIHelpButton from "../../UIComponents/UIHelpButton";
import UIPageHeader from "../../UIComponents/UIPageHeader";
import { abbreviateRentFrequency } from "../../../../helpers/utils";
const LeaseAgreementDetail = () => {
  const { id } = useParams();
  const [leaseAgreement, setLeaseAgreement] = useState({});
  const [leaseTemplate, setLeaseTemplate] = useState({});
  const [rentalApplication, setRentalApplication] = useState({});
  const [rentalUnit, setRentalUnit] = useState({});
  const [leaseTerms, setLeaseTerms] = useState({});
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
    console.log(runTour);
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

  const handleDownloadDocument = () => {
    downloadBoldSignDocument(leaseAgreement.document_id)
      .then((res) => {
        console.log("Download document response", res);
        // if (res.status === 200) {
        //   // const blob = new Blob([res.data], { type: "application/pdf" });
        //   // const link = document.createElement("a");
        //   // link.href = window.URL.createObjectURL(blob);
        //   // link.download = "lease_agreement.pdf";
        //   // link.click();
        // }
      })
      .catch((error) => {
        console.error("Error downloading document", error);
      });
  };

  useEffect(() => {
    // fetch the lease agreement with the id
    getLeaseAgreementById(id).then((res) => {
      setLeaseAgreement(res.data);
      setLeaseTemplate(res.data.lease_template);
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
        // getNextPaymentDate(res.data.tenant.id).then((res) => {
        //   console.log("nExt pay date data", res);
        //   setNextPaymentDate(res.data.next_payment_date);
        // });
        getPaymentDates(res.data.tenant.id).then((res) => {
          if (res.status === 200) {
            const payment_dates = res.data.payment_dates;
            console.log("Payment dates ", payment_dates);
            const due_dates = payment_dates.map((date) => {
              return { title: "Rent Due", start: new Date(date.payment_date) };
            });
            setDueDates(due_dates);
          }
        });
      }
    });
  }, []);
  return (
    <div className="container-fluid">
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
      />
      <BackButton />
      <div className="row">
        <div className="col-md-4 lease-agreement-details">
          <div className="row">
            <div className="col-6 col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <PeopleAltIcon sx={iconStyles} />
                  <h5>Tenant</h5>
                  <p className="text-black">{getTenantName()}</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <HomeIcon sx={iconStyles} />
                  <h5>Property</h5>
                  <p className="text-black">
                    {leaseAgreement.rental_unit
                      ? rentalUnit.rental_property_name
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <MeetingRoomIcon sx={iconStyles} />
                  <h5>Rental Unit</h5>
                  <p className="text-black">
                    {leaseAgreement.rental_unit ? rentalUnit.name : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <PaymentsIcon sx={iconStyles} />
                  <h5>Rent</h5>
                  <p className="text-black">
                    ${rent}/{abbreviateRentFrequency(rentFrequency)}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="card mb-3">
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
              </div>
            </div>

            <div className="col-6 col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <DrawIcon sx={iconStyles} />
                  <h5>Sign Date</h5>
                  <p className="text-black">
                    {leaseAgreement.start_date ? (
                      new Date(leaseAgreement.start_date).toLocaleDateString()
                    ) : (
                      <span>N/A</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-6">
              <div className="card mb-3">
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
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="card">
                <div className="card-body">
                  <AccessTimeIcon sx={iconStyles} />
                  <h5>Term</h5>
                  <span className="text-black">
                    {" "}
                    {term + " " + rentFrequency}(s)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p style={{ color: uiGrey2 }}>
            <strong>Auto Pay Enabled:</strong>{" "}
            {leaseAgreement.is_active ? (
              <span>{leaseAgreement.auto_pay_is_enabled ? "Yes" : "No"}</span>
            ) : (
              "N/A"
            )}
          </p>
          <p style={{ color: uiGrey2 }}>
            {dateDiffForHumans(new Date(nextPaymentDate)) <= 5 && (
              <ReportIcon sx={{ color: "red" }} />
            )}{" "}
            <strong>Rent due </strong>
            {leaseAgreement.is_active
              ? dateDiffForHumans(new Date(nextPaymentDate))
              : "N/A"}
          </p>
          {leaseAgreement.document_id !== "" && (
            <div className="download-document-button">
              <UIButton
                btnText="Download Document"
                style={{ width: "100%", marginBottom: "25px" }}
                onClick={handleDownloadDocument}
              />
            </div>
          )}
        </div>
        <div className="col-md-8 lease-agreement-calendar">
          <div className="card">
            <div className="card-body">
              <FullCalendar
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
  );
};

export default LeaseAgreementDetail;
