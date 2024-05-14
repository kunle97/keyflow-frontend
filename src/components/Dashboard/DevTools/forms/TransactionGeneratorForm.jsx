import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  authUser,
  devToolInputStyle,
  uiGreen,
  uiGrey,
  validationMessageStyle,
} from "../../../../constants";
import {
  Box,
  CircularProgress,
  IconButton,
  Slider,
  Stack,
} from "@mui/material";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import CloseIcon from "@mui/icons-material/Close";
import UIButton from "../../UIComponents/UIButton";
import { faker } from "@faker-js/faker";
import { getOwnerTenants } from "../../../../api/owners";
import { getProperties } from "../../../../api/properties";
import { getUnits } from "../../../../api/units";
import { authenticatedInstance } from "../../../../api/api";
import axios from "axios";

const TransactionGeneratorForm = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfItems, setNumberOfItems] = useState(10);
  const [transactionTarget, setTransactionTarget] = useState("property"); //["property", "unit", "portfolio"]
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [amountRange, setAmountRange] = useState([
    faker.finance.amount({ min: 500, max: 10000, precision: 2 }),
    faker.finance.amount({ min: 11000, max: 20000, precision: 2 }),
  ]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const onSubmit = (data) => {
    console.log(data);
    setIsLoading(true);
    const payload = {
      count: parseInt(data.numberOfItems),
      type: data.type,
      user_id: authUser.id,
      start_date: data.startDate,
      end_date: data.endDate,
      transaction_target: data.transactionTarget,
      property: data.property,
      unit: data.unit,
      portfolio: data.portfolio,
      tenant: data.tenant,
      amountRange: amountRange,
    };
    console.log("Payload ", payload);
    // Use Axios or your preferred HTTP client to call the appropriate endpoints in your DRF backend.
    axios
      .post(
        `${process.env.REACT_APP_API_HOSTNAME}/generate/transactions/`,
        payload
      )
      .then((response) => {
        console.log("Response ", response);
        if (response.data.status === 201) {
          alert(`Successfully generated ${data.numberOfItems} transactions`);
          setIsLoading(false);
        }
      });
  };

  /**
   * 
   * Form fields:
       - Transaction type
       - Transaction date/ date range
       - Unit (Random, specific or New)
       - Property (Random, specific or New)
       - Amount -  random, specific, or range ($750 - $1500)
       - Tenant - Random specific or new
   * 
   * */
  useEffect(() => {
    // Fetch data from API
    getOwnerTenants().then((res) => {
      setTenants(res.data);
    });
    getProperties().then((res) => {
      setProperties(res.data);
    });
    authenticatedInstance.get("/units/?is_occupied=True").then((res) => {
      setUnits(res.data);
    });
  }, []);
  return (
    <div>
      <UIDialog
        open={props.open}
        onClose={props.onClose}
        style={{ padding: "10px", width: "500px", background: uiGrey }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginBottom: "5px" }}
        >
          <h3>Transaction Generator </h3>
          <IconButton
            sx={{ color: "black", float: "right" }}
            edge="start"
            color="inherit"
            onClick={props.onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group my-2">
            <label style={{ color: "black", marginBottom: "10px" }}>
              Number of Transactions
            </label>
            <input
              {...register("numberOfItems", {
                required: "This is a required field",
                min: 1,
                max: 1000,
              })}
              className=""
              style={devToolInputStyle}
              label="Number of Items"
              type="number"
              defaultValue={numberOfItems}
              onChange={(e) => setNumberOfItems(e.target.value)}
            />
            <span style={validationMessageStyle}>
              {errors.numberOfItems && errors.numberOfItems.message}
            </span>
          </div>
          <div className="form-group my-2">
            <label style={{ color: "black" }}>Transaction type</label>
            <select
              {...register("type", {
                required: "This is a required field",
                //Validate that the value is not a blank string
                validate: (value) => value !== "",
              })}
              className="form-select "
              style={{ background: "white", color: "black" }}
            >
              <option value="">Choose One</option>
              <option value="random">Random</option>
              <option value="security_deposit">Security Deopsit</option>
              <option value="rent_payment" selected>
                Rent Payment
              </option>
              <option value="late_fee">Late Fee</option>
              <option value="pet_fee">Pet Fee</option>
              <option value="lease_renewal_fee">Lease Renewal Fee</option>
              <option value="lease_cancellation_fee">
                Lease Cancellation Fee
              </option>
              <option value="maintenance_fee">Maintenance Fee</option>
              <option value="vendor_payment">Vendor Payment</option>{" "}
              {/*Expense*/}
            </select>
            <span style={validationMessageStyle}>
              {errors.unitMode && errors.unitMode.message}
            </span>
          </div>
          <div className="form-group my-2">
            <label style={{ color: "black" }}>Transaction Date Range</label>
            <div className="row">
              <div className="col-md-6">
                <h6>Start Date</h6>
                <input
                  type="date"
                  className="form-control"
                  {...register("startDate", {
                    required: "This is a required field",
                    //Validate that the value is not a blank string and is a valid date  before the end date
                    validate: {
                      isDate: (value) => value !== "",
                      isBeforeEndDate: (value) =>
                        value <= watch("endDate") ||
                        "Start Date must be before End Date",
                    },
                  })}
                  defaultValue={"2023-08-01"}
                  style={{ background: "white", color: "black" }}
                />
                <span style={validationMessageStyle}>
                  {errors.startDate && errors.startDate.message}
                </span>
              </div>
              <div className="col-md-6">
                <h6>End Date</h6>
                <input
                  type="date"
                  className="form-control"
                  {...register("endDate", {
                    required: "This is a required field",
                    //Validate that the value is not a blank string and is a valid date  after the start date
                    validate: {
                      isDate: (value) => value !== "",
                      isAfterStartDate: (value) =>
                        value >= watch("startDate") ||
                        "End Date must be after Start Date",
                    },
                  })}
                  defaultValue={"2023-12-31"}
                  style={{
                    background: "white",
                    color: "black",
                    outline: "none",
                  }}
                />
                <span style={validationMessageStyle}>
                  {errors.endDate && errors.endDate.message}
                </span>
              </div>
            </div>
          </div>
          <div className="form-group my-2">
            <label style={{ color: "black" }}>Transaction Target</label>
            <select
              {...register("transactionTarget", {
                required: "This is a required field",
                //Validate that the value is not a blank string
                validate: (value) => value !== "",
              })}
              className="form-select "
              style={{ background: "white", color: "black", outline: "none" }}
              onChange={(e) => setTransactionTarget(e.target.value)}
            >
              <option value="">Choose One</option>
              <option value="property" selected>
                Property
              </option>
              <option value="unit">Unit</option>
              <option value="portfolio">Portfolio</option>
              <option value="tenant">Tenant</option>
            </select>
          </div>
          {transactionTarget === "property" && (
            <div className="form-group my-2">
              <label style={{ color: "black" }}>Property</label>
              <select
                {...register("property", {
                  required: "This is a required field",
                  //Validate that the value is not a blank string
                  validate: (value) => value !== "",
                })}
                className="form-select "
                style={{ background: "white", color: "black" }}
              >
                <option value="">Choose One</option>
                {properties.map((property) => (
                  <option value={property.id}  >{property.name}</option>
                ))}
              </select>
            </div>
          )}
          {transactionTarget === "unit" && (
            <div className="form-group my-2">
              <label style={{ color: "black" }}>Unit</label>
              <select
                {...register("unit", {
                  required: "This is a required field",
                  //Validate that the value is not a blank string
                  validate: (value) => value !== "",
                })}
                className="form-select "
                style={{ background: "white", color: "black" }}
              >
                <option value="">Choose One</option>
                {units.map((unit) => (
                  <option value={unit.id}>{unit.name}</option>
                ))}
              </select>
            </div>
          )}
          {transactionTarget === "portfolio" && (
            <div className="form-group my-2">
              <label style={{ color: "black" }}>Portfolio</label>
              <select
                {...register("portfolio", {
                  required: "This is a required field",
                  //Validate that the value is not a blank string
                  validate: (value) => value !== "",
                })}
                className="form-select "
                style={{ background: "white", color: "black" }}
              >
                <option value="">Choose One</option>
                {portfolios.map((portfolio) => (
                  <option value={portfolio.id}>{portfolio.name}</option>
                ))}
              </select>
            </div>
          )}
          {transactionTarget === "tenant" && (
            <div className="form-group my-2">
              <label style={{ color: "black" }}>Tenant</label>
              <select
                {...register("tenant", {
                  required: "This is a required field",
                  //Validate that the value is not a blank string
                  validate: (value) => value !== "",
                })}
                className="form-select "
                style={{ background: "white", color: "black" }}
              >
                <option value="">Choose One</option>
                {tenants.map((tenant) => (
                  <option value={tenant.id}>
                    {tenant.user.first_name} {tenant.user.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group my-2">
            <label style={{ color: "black" }}>Amount</label>
            <Slider
              value={amountRange}
              onChange={(event, newValue) => setAmountRange(newValue)}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={500}
              max={20000}
              step={100}
            />
          </div>
          {isLoading ? (
            <Box sx={{ display: "flex" }}>
              <Box m={"55px auto"}>
                <CircularProgress sx={{ color: uiGreen }} />
              </Box>
            </Box>
          ) : (
            <UIButton
              variant="contained"
              style={{ width: "100%", marginTop: "10px" }}
              btnText={`Generate Tenants`}
              type="submit"
            />
          )}
        </form>
      </UIDialog>
    </div>
  );
};

export default TransactionGeneratorForm;
