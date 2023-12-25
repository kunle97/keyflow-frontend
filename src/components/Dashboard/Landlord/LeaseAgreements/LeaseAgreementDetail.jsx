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
const LeaseAgreementDetail = () => {
  const { id } = useParams();
  const [leaseAgreement, setLeaseAgreement] = useState({});
  const [leaseTemplate, setLeaseTemplate] = useState({});
  const [rentalApplication, setRentalApplication] = useState({});
  const [rentalUnit, setRentalUnit] = useState({});
  const [rentalProperty, setRentalProperty] = useState({});
  const [tenant, setTenant] = useState({});
  const [dueDates, setDueDates] = useState([{ title: "", start: new Date() }]);
  const [nextPaymentDate, setNextPaymentDate] = useState(null);

  const getTenantName = () => {
    if (leaseAgreement.tenant) {
      return `${tenant.first_name} ${tenant.last_name}`;
    } else if (rentalApplication) {
      return `${rentalApplication.first_name} ${rentalApplication.last_name}`;
    } else {
      return "N/A";
    }
  };

  const handleDownloadDocument = () => {
    downloadBoldSignDocument(leaseAgreement.document_id).then((res) => {
      console.log("Download document response", res);
      // if (res.status === 200) {
      //   // const blob = new Blob([res.data], { type: "application/pdf" });
      //   // const link = document.createElement("a");
      //   // link.href = window.URL.createObjectURL(blob);
      //   // link.download = "lease_agreement.pdf";
      //   // link.click();
      // }
    });
  };

  useEffect(() => {
    // fetch the lease agreement with the id
    getLeaseAgreementById(id).then((res) => {
      setLeaseAgreement(res.data);
      setLeaseTemplate(res.data.lease_template);
      setRentalApplication(res.data.rental_application);
      setRentalUnit(res.data.rental_unit);
      getProperty(res.data.rental_unit.rental_property).then((res) => {
        console.log("Rental Property:", res);
        setRentalProperty(res);
      });
      setTenant(res.data.tenant);
      //Retrieve next payment date
      if (res.data.tenant) {
        getNextPaymentDate(res.data.tenant.id).then((res) => {
          console.log("nExt pay date data", res);
          setNextPaymentDate(res.data.next_payment_date);
        });
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
    <div>
      <BackButton />
      <div className="row">
        <div className="col-md-4">
          <h3>Lease Details</h3>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div>
                    <h5>Tenant</h5>
                    <p className="text-black">{getTenantName()}</p>
                  </div>
                  <div>
                    <h5>Rental Property</h5>
                    <p className="text-black">
                      {rentalProperty ? rentalProperty.name : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h5>Rental Unit</h5>
                    <p className="text-black">
                      {leaseAgreement.rental_unit ? rentalUnit.name : "N/A"}
                    </p>
                  </div>{" "}
                  <div>
                    <h5>Rent</h5>
                    <p className="text-black">${leaseTemplate.rent}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <h5>Status</h5>
                    <p className="text-black">
                      {leaseAgreement.is_active ? (
                        <span style={{ color: uiGreen }}>Active</span>
                      ) : (
                        <span style={{ color: uiRed }}>Inactive</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <h5>Date Signed</h5>
                    <p className="text-black">
                      {leaseAgreement.start_date ? (
                        new Date(leaseAgreement.start_date).toLocaleDateString()
                      ) : (
                        <span>N/A</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <h5>End Date</h5>
                    <p className="text-black">
                      {leaseAgreement.end_date ? (
                        new Date(leaseAgreement.end_date).toLocaleDateString()
                      ) : (
                        <span>N/A</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <h5>Term</h5>
                    <p className="text-black">{leaseTemplate.term} months</p>
                  </div>
                </div>
              </div>

              <p style={{ color: uiGrey2 }}>
                <strong>Auto Pay Enabled:</strong>{" "}
                {leaseAgreement.is_active ? (
                  <span>
                    {leaseAgreement.auto_pay_is_enabled ? "Yes" : "No"}
                  </span>
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
                <UIButton
                  btnText="Download Document"
                  style={{ width: "100%" }}
                  onClick={handleDownloadDocument}
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <h3 className="mb-3">Payment Schedule</h3>
          <div className="card">
            <div className="card-body">
              <FullCalendar
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
    </div>
  );
};

export default LeaseAgreementDetail;
