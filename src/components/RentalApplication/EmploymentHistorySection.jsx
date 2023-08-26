import React, { useState } from "react";
import { faker } from "@faker-js/faker";
const EmploymentHistorySection = (props) => {
  const [fakeMode, setFakeMode] = useState(false);

  const [fakeCompanyName, setCompanyName] = useState(faker.company.name());
  const [fakePosition, setPosition] = useState(faker.name.jobTitle());
  const [fakecompanyAddress, setCompanyAddress] = useState(
    faker.address.streetAddress()
  );
  const [fakeStartDate, setStartDate] = useState(
    faker.date.past().toISOString().split("T")[0]
  );
  const [fakeEndDate, setEndDate] = useState(
    faker.date.future().toISOString().split("T")[0]
  );
  const [fakeIncome, setIncome] = useState(faker.finance.amount());
  const [fakeSupervisorName, setSupervisorName] = useState(
    faker.person.fullName()
  );
  const [fakeSupervisorPhone, setSupervisorPhone] = useState(
    faker.phone.number("###-###-####")
  );
  const [fakeSupervisorEmail, setSupervisorEmail] = useState(
    faker.internet.email()
  );

  const {
    companyName,
    position,
    companyAddress,
    income,
    startDate,
    endDate,
    supervisorName,
    supervisorPhone,
    supervisorEmail,
  } = props.employment;

  return (
    <div className="card mb-3">
      <div className="row card-body">
        <div className="col-md-6 mb-4">
          <label className="mb-2">Company Name</label>
          <input
            className="form-control"
            name="companyName"
            value={companyName}
            onChange={props.onPositionChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Company Name"
          />
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">Title/Position</label>
          <input
            className="form-control"
            name="position"
            value={fakeMode ? fakePosition : position}
            onChange={props.onPositionChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Title/Position"
          />
        </div>
        <div className="col-md-12 mb-4">
          <label className="mb-2">Company Address</label>
          <input
            className="form-control"
            name="companyAddress"
            value={fakeMode ? fakecompanyAddress : companyAddress}
            onChange={props.onPositionChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Company Address"
          />
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">Start Date</label>
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={fakeMode ? fakeStartDate : startDate}
            onChange={props.onPositionChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Start Date"
          />
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">End Date</label>
          <input
            type="date"
            className="form-control"
            name="endDate"
            value={fakeMode ? fakeEndDate : endDate}
            onChange={props.onPositionChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="End Date"
          />
        </div>
        <div className="col-md-12 mb-4">
          <label className="mb-2">Income</label>
          <input
            className="form-control"
            name="income"
            value={fakeMode ? fakeIncome : income}
            onChange={props.onPositionChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Income"
          />
        </div>

        <div className="col-md-12 mb-4">
          <label className="mb-2">Supervisor Name</label>
          <input
            className="form-control"
            name="supervisorName"
            value={fakeMode ? fakeSupervisorName : supervisorName}
            onChange={props.onPositionChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Supervisor Name"
          />
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">Supervisor Phone</label>
          <input
            className="form-control"
            name="supervisorPhone"
            value={fakeMode ? fakeSupervisorPhone : supervisorPhone}
            onChange={props.onPositionChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Supervisor Phone"
          />
        </div>
        <div className="col-md-6 mb-4">
          <label className="mb-2">Supervisor Email</label>
          <input
            className="form-control"
            name="supervisorEmail"
            value={fakeMode ? fakeSupervisorEmail : supervisorEmail}
            onChange={props.onPositionChange}
            sx={{ color: "white", width: "100%" }}
            placeholder="Supervisor Email"
          />
        </div>
        <div  >{props.removeBtn}</div>
      </div>
    </div>
  );
};

export default EmploymentHistorySection;
