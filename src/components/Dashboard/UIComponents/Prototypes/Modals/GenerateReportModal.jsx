import React, { useState } from "react";
import UIDialog from "../../Modals/UIDialog";
import UIInput from "../../UIInput";
import UIRadioGroup from "../../UIRadioGroup";
import UIButton from "../../UIButton";
import ProgressModal from "../../Modals/ProgressModal";
import AlertModal from "../../Modals/AlertModal";
const GenerateReportModal = (props) => {
  const exportOptions = [
    { label: "PDF", value: "pdf" },
    { label: "Excel", value: "excel" },
    { label: "CSV", value: "csv" },
  ];
  const [selectExportedOption, setSelectExportedOption] = useState("pdf");
  const [emailReport, setEmailReport] = useState("no");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleSubmit = () => {
    //Show the loading progress modal for 3 seconds and then show the alert modal
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAlert(true);
    }, 3000);
    props.onClose()
  };
  return (
    <div>
      <ProgressModal title="Generating Reports" open={isLoading} />
      <AlertModal
        open={showAlert}
        title="Generated Reports"
        message="Your report has been generated successfully and are ready for download"
        btnText="Close"
        onClick={() => setShowAlert(false)}
      />
      <UIDialog
        title="Generate Report"
        open={props.open}
        onClose={props.onClose}
      >
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="text-black">Property</label>
              <select
                className="form-select"
                id="property"
                onChange={props.onChange}
              >
                <option value="all">All</option>
                <option value="property1">Property 1</option>
                <option value="property2">Property 2</option>
                <option value="property3">Property 3</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <div className="form-group">
                <label htmlFor="report_type" className="test-black">
                  Report Type
                </label>
                <select
                  className="form-select"
                  id="report_type"
                  onChange={props.onChange}
                >
                  <option value="balance_sheet">Balance Sheet</option>
                  <option value="income_statement">Income Statement</option>
                  <option value="cash_flow">Cash Flow</option>
                  <option value="trial_balance">Trial Balance</option>
                  <option value="general_ledger">General Ledger</option>
                </select>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label className="text-black">Start Date</label>
              <UIInput
                type="date"
                className="form-control"
                id="start_date"
                onChange={props.onChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="text-black">End Date</label>
              <UIInput
                type="date"
                className="form-control"
                id="end_date"
                onChange={props.onChange}
              />
            </div>
            <div className="col-md-12 mb-3">
              <label className="text-black">Export To:</label>
              <UIRadioGroup
                name="export_type"
                value={selectExportedOption}
                radioOptions={exportOptions}
                onChange={(e) => {
                  setSelectExportedOption(e.target.value);
                }}
              />
            </div>
            <div className="col-md-12 mb-3">
              <label className="text-black">Email Report?</label>
              <UIRadioGroup
                name="email_report"
                value={emailReport}
                radioOptions={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
                onChange={(e) => {
                  setEmailReport(e.target.value);
                }}
              />
            </div>
          </div>
          <UIButton
            type="button"
            btnText="Generate Report"
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={
              handleSubmit
            }
          />
        </form>
      </UIDialog>
    </div>
  );
};

export default GenerateReportModal;
