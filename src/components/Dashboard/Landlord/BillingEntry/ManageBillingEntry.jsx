import React from "react";
import UIInput from "../../UIComponents/UIInput";
import UIRadioGroup from "../../UIComponents/UIRadioGroup";

const ManageBillingEntry = () => {
  return (
    <div className="container-fluid">
      <h4 className="">Manage Billing Entry</h4>
      <div className="card">
        <div className="card-body">
          <form>
            <div className="row">
              <div className="col-md-6">
                <UIInput
                  label="Amount"
                  type="number"
                  placeholder="Enter amount"
                  //   description="Enter the amount of the billing entry."
                  inputStyle={{ margin: "10px 0" }}
                  name="amount"
                />
              </div>
              <div className="col-md-6">
                <UIRadioGroup
                  formLabel="Create Transaction?"
                  label="Create Transaction?"
                  name="create_transaction"
                  direction="row"
                  radioOptions={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                />
              </div>
              <div className="col-md-6">
                <label className="text-black" style={{ display: "block" }}>
                  Type
                </label>
                <select
                  className="form-select"
                  name="type"
                  style={{ margin: "10px 0" }}
                >
                  <option selected disabled>
                    Select One
                  </option>
                  <option value="security_deposit">Security Deposit</option>
                  <option value="rent_payment">Rent Payment</option>
                  <option value="late_fee">Late Fee</option>
                  <option value="pet_fee">Pet Fee</option>
                  <option value="lease_renewal_fee">Lease Renewal Fee</option>
                  <option value="lease_cancellation_fee">
                    Lease Cancellation Fee
                  </option>
                  <option value="maintenance_fee">Maintenance Fee</option>
                  <option value="vendor_payment">Vendor Payment</option>
                  <option value="expense">Expense</option>
                  <option value="revenue">Revenue</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="text-black" style={{ display: "block" }}>
                  Status
                </label>
                <select
                  className="form-select"
                  name="type"
                  style={{ margin: "10px 0" }}
                >
                  <option selected disabled>
                    Select One
                  </option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              <div className="col-md-6">
                <UIRadioGroup
                  formLabel="Create Subscription?"
                  label="Create Subscription?"
                  name="create_subscription"
                  direction="row"
                  radioOptions={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                />
              </div>
              <div className="col-md-6">
                <label
                  className="text-black"
                  style={{ display: "block", margin: "10px 0" }}
                >
                  Subscription Interval
                </label>
                <select
                  className="form-select"
                  name="type"
                  style={{ margin: "10px 0" }}
                >
                  <option selected disabled>
                    Select One
                  </option>
                  <option value="day">Daily</option>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
              <div className="col-md-6">
                <UIInput
                  type="date"
                  label="Subscription Start Date"
                  placeholder="Enter start date"
                  inputStyle={{ margin: "10px 0" }}
                  name="start_date"
                />
              </div>
              <div className="col-md-6">
                <UIInput
                  type="date"
                  label="Subscription End Date"
                  placeholder="Enter end date"
                  inputStyle={{ margin: "10px 0" }}
                  name="end_date"
                />
              </div>
              <div className="col-md-12">
                <label className="text-black" style={{ display: "block" }}>
                  Description
                </label>
                <textarea
                  className="form-control"
                  placeholder="Enter description"
                  style={{ margin: "10px 0" }}
                  name="description"
                  rows={5}
                ></textarea>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageBillingEntry;
