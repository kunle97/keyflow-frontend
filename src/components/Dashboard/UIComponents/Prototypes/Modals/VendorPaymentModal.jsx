import React, { useState } from "react";
import UIDialog from "../../Modals/UIDialog";
import UIRadioGroup from "../../UIRadioGroup";
import UIInput from "../../UIInput";
import UIButton from "../../UIButton";
import { faker } from "@faker-js/faker";
import ProgressModal from "../../Modals/ProgressModal";
import AlertModal from "../../Modals/AlertModal";
const VendorPaymentModel = (props) => {
  const [vendorMode, setVendorMode] = useState("new_vendor");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleSubmit = () => {
    //Show the loading progress modal for 3 seconds and then show the alert modal
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAlert(true);
    }, 3000);
    props.onClose();
  };
  return (
    <div>
      <ProgressModal title="Sending Payment" open={isLoading} />
      <AlertModal
        open={showAlert}
        title="Payment Sent"
        message="Your payment has been sent to the vendor successfully"
        btnText="Close"
        onClick={() => setShowAlert(false)}
      />
      <UIDialog
        id="vendorPaymentModal"
        title="Pay Vendor"
        size="lg"
        showCloseButton={true}
        onClose={props.onClose}
        open={props.open}
        style={{ width: "500px" }}
      >
        <form>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group mb-3">
                <UIRadioGroup
                  label=""
                  name="vendor_mode"
                  value={vendorMode}
                  radioOptions={[
                    { label: "New Vendor", value: "new_vendor" },
                    { label: "Existing Vendor", value: "existing_vendor" },
                  ]}
                  onChange={(e) => {
                    setVendorMode(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                {vendorMode === "new_vendor" ? (
                  <UIInput
                    label="Vendor Email"
                    name="vendor_email"
                    type="email"
                    // value={email}
                    // onChange={(e) => {
                    //   setVendorEmail(e.target.value);
                    // }}
                  />
                ) : (
                  <>
                    <label className="text-black">Vendor</label>
                    <select className="form-select">
                      <option value="">Select Vendor</option>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((vendor) => {
                        return (
                          <option key={vendor} value={vendor}>
                            {faker.company.name()}
                          </option>
                        );
                      })}
                    </select>
                  </>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-3">
                <UIInput
                  label="Amount"
                  name="amount"
                  type="number"
                  // value={amount}
                  // onChange={(e) => {
                  //   setAmount(e.target.value);
                  // }}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group mb-3">
                <label className="text-black">Payment Method</label>
                <select className="form-select">
                  <option value="">Select one</option>
                  {[0, 1, 2].map((method) => {
                    return (
                      <option key={method} value={method}>
                        Visa ending in{" "}
                        {faker.finance
                          .creditCardNumber({ issuer: "visa" })
                          .slice(-4)}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group mb-3">
                <UIInput
                  label="Invoice #"
                  name="invoice"
                  type="text"
                  // value={invoice}
                  // onChange={(e) => {
                  //   setInvoice(e.target.value);
                  // }}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group mb-3">
                <label className="text-black">Notes</label>
                <textarea
                  className="form-control"
                  // value={notes}
                  // onChange={(e) => {
                  //   setNotes(e.target.value);
                  // }}
                  rows={3}
                ></textarea>
              </div>
            </div>
            <div className="col-md-12">
              <UIButton
                btnText="Pay Vendor"
                type="button"
                onClick={handleSubmit}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </form>
      </UIDialog>
    </div>
  );
};

export default VendorPaymentModel;
