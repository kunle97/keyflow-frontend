import { Button, Input, Typography } from "@mui/material";
import React from "react";
import { MenuItem, Select } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { uiGreen } from "../../../../constants";
import { Textarea } from "@mui/joy";
import UIBinaryRadioGroup from "../../UIBinaryRadioGroup";
const CreateLeaseTerm = () => {
  return (
    <div className="container">
      <h2 style={{ color: "white" }}>Create Lease Term</h2>
      <div className="card">
        <div className="card-body" style={{ overflow: "auto" }}>
          <form className="row">
            <div className="form-group col-md-6 mb-4">
              <Typography
                className="mb-2"
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="rent"
              >
                Rent (Dollar Amount)
              </Typography>
              <Input
                type="text"
                className="form-control"
                id="rent"
                placeholder="$"
                name="rent"
              />
            </div>
            <div className="form-group col-md-6 mb-4">
              <Typography
                className="mb-2"
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="rent"
              >
                Term Duration
              </Typography>
              <Select
                // value={age}
                // onChange={handleChange}
                // displayEmpty
                sx={{ width: "100%", color: "white" }}
                name="term"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={6}>6 Months</MenuItem>
                <MenuItem value={12}>12 Months</MenuItem>
                <MenuItem value={13}>13 Months</MenuItem>
                <MenuItem value={24}>24 Months</MenuItem>
                <MenuItem value={36}>36 Months</MenuItem>
              </Select>
            </div>
            <div className="form-group col-md-6 mb-4">
              <Typography
                className="mb-2"
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="lateFee"
              >
                Late Fee
              </Typography>
              <Input
                type="text"
                className="form-control"
                id="lateFee"
                placeholder="$"
                name="late_fee"
              />
            </div>
            <div className="form-group col-md-6 mb-4">
              <Typography
                className="mb-2"
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="rent"
              >
                Security Deposit (Dollar Amount)
              </Typography>
              <Input
                type="text"
                className="form-control"
                id="rent"
                placeholder="$"
              />
            </div>

            <div className="form-group col-md-6 mb-4">
              <UIBinaryRadioGroup
                label="Gas Included?"
                name="gas_included"
                default_value="false"
                radio_one_value="true"
                radio_one_label="Yes"
                radio_two_value="false"
                radio_two_label="No"
              />
            </div>

            <div className="form-group col-md-6 mb-4">
              <UIBinaryRadioGroup
                label="Water Included?"
                name="water_included"
                default_value="false"
                radio_one_value="true"
                radio_one_label="Yes"
                radio_two_value="false"
                radio_two_label="No"
              />
            </div>

            <div className="form-group col-md-6 mb-4">
              <UIBinaryRadioGroup
                label="Electicity Included?"
                name="electricity_included"
                default_value="false"
                radio_one_value="true"
                radio_one_label="Yes"
                radio_two_value="false"
                radio_two_label="No"
              />
            </div>

            <div className="form-group col-md-6 mb-4">
              <UIBinaryRadioGroup
                label="Maintenance/Reparis Included?"
                name="repairs_included"
                default_value="false"
                radio_one_value="true"
                radio_one_label="Yes"
                radio_two_value="false"
                radio_two_label="No"
              />
            </div>
            <div className="form-group col-md-12 mb-4">
              <Typography
                className="mb-2"
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="rent"
              >
                Lease Cancellation Notice Period
              </Typography>
              <Select
                // value={age}
                // onChange={handleChange}
                // displayEmpty
                sx={{ width: "100%", color: "white" }}
                name="term"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={6}>6 Months</MenuItem>
                <MenuItem value={12}>12 Months</MenuItem>
                <MenuItem value={13}>13 Months</MenuItem>
                <MenuItem value={24}>24 Months</MenuItem>
                <MenuItem value={36}>36 Months</MenuItem>
              </Select>
            </div>
            {/* <div className="form-group col-md-12 mb-4">
              <Typography
                className="mb-2"
                sx={{ color: "white", fontSize: "12pt" }}
                htmlFor="rent"
              >
                LeaseDescritpion
              </Typography>
              <Textarea></Textarea>
            </div> */}
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                color: "white",
                background: uiGreen,
              }}
            >
              Save
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLeaseTerm;
