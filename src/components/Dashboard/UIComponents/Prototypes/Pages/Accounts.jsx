import React, { useState } from "react";
import GenerateReportModal from "../Modals/GenerateReportModal";
import UIButton from "../../UIButton";
import {
  ButtonBase,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import UICheckbox from "../../UICheckbox";
import { uiGreen } from "../../../../../constants";
import { MoreVert } from "@mui/icons-material";
import ProgressModal from "../../Modals/ProgressModal";
import AlertModal from "../../Modals/AlertModal";
const Accounts = () => {
  const [generateReportModalOpen, setGenerateReportModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [accounts, setAccounts] = useState([
    {
      name: "Account 1",
      type: "Asset",
      balance: "1000",
      parentAccount: "Parent Account 1",
      menuOpen: false,
      menuOptions: [
        {
          name: "Edit",

        },
        {
          name: "Delete",

        },
      ],
    },
    {
      name: "Account 2",
      type: "Liability",
      balance: "2000",
      parentAccount: "Parent Account 2",
      menuOpen: false,
      menuOptions: [
        {
          name: "Edit",

        },
        {
          name: "Delete",

        },
      ],
    },
    {
      name: "Account 3",
      type: "Equity",
      balance: "3000",
      parentAccount: "Parent Account 3",
      menuOpen: false,
      menuOptions: [
        {
          name: "Edit",

        },
        {
          name: "Delete",

        },
      ],
    },
    {
      name: "Account 4",
      type: "Income",
      balance: "4000",
      parentAccount: "Parent Account 4",
      menuOpen: false,
      menuOptions: [
        {
          name: "Edit",

        },
        {
          name: "Delete",

        },
      ],
    },
    {
      name: "Account 5",
      type: "Expense",
      balance: "5000",
      parentAccount: "Parent Account 5",
      menuOpen: false,
      menuOptions: [
        {
          name: "Edit",

        },
        {
          name: "Delete",

        },
      ],
    },
  ]);

  const [tableColumns, setTableColumns] = useState([
    {
      name: "Name",
      sortable: true,
      sortDirection: "asc",
    },
    {
      name: "Type",
      sortable: true,
      sortDirection: "asc",
    },
    {
      name: "Balance",
      sortable: true,
      sortDirection: "asc",
    },
    {
      name: "Parent Account",
      sortable: true,
      sortDirection: "asc",
    },
  ]);

  const handleMenuClick = (event, index) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    const newAccounts = [...accounts];
    newAccounts[index].menuOpen = !newAccounts[index].menuOpen;
    setAccounts(newAccounts);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  return (
    <div className="container">
      <GenerateReportModal
        open={generateReportModalOpen}
        onClose={() => setGenerateReportModalOpen(false)}
      />

      <Stack
        direction="row"
        spacing={2}
        justifyContent={"flex-end"}
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <UIButton
          btnText="Generate Reports"
          onClick={() => setGenerateReportModalOpen(true)}
        />
        {/* <div className="">
          <label className="text-black">Start Date</label>
          <input type="date" className="form-control" id="start_date" />
        </div>
        <div className="">
          <label className="text-black">End Date</label>
          <input type="date" className="form-control" id="end_date" />
        </div> */}
      </Stack>{" "}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <h3> Accounts</h3>
        <span></span>
        <Stack direction="row" spacing={2}>
          <div className="">
            <input
              type="text"
              id="search"
              style={{
                background: "white !important",
                borderRadius: "5px",
                border: "none",
                padding: "5px 10px",
                outline: "none",
                fontSize: "10pt",
                display: "block",
              }}
              placeholder="Search"
            />
          </div>
          <div className="">
            <select
              className="form-select"
              id="property"
              style={{ background: "white", fontSize: "10pt" }}
            >
              <option value="">Select Property</option>
              <option value="all">All</option>
              <option value="property1">Property 1</option>
              <option value="property2">Property 2</option>
              <option value="property3">Property 3</option>
            </select>
          </div>
          <div className="">
            <div className="form-group">
              <select
                className="form-select"
                id="report_type"
                style={{ background: "white", fontSize: "10pt" }}
              >
                <option value="">Report Type</option>
                <option value="balance_sheet">Balance Sheet</option>
                <option value="income_statement">Income Statement</option>
                <option value="cash_flow">Cash Flow</option>
                <option value="trial_balance">Trial Balance</option>
                <option value="general_ledger">General Ledger</option>
              </select>
            </div>
          </div>
          <UIButton invertedColors={true} btnText="Add Account" size="small" />
          <UIButton
            invertedColors={true}
            btnText="Add Transaction"
            size="small"
          />
        </Stack>
      </Stack>
      <table className="styled-table">
        <thead>
          <tr>
            {" "}
            <th className="checkbox-cell">
              <UICheckbox />
            </th>
            {tableColumns.map((column, index) => (
              <th key={index}>
                <ButtonBase sx={{ padding: 0 }}>
                  {column.name} <SwapVertIcon sx={{ color: uiGreen }} />
                </ButtonBase>
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={index}>
              <td colSpan={1}>
                <UICheckbox />
              </td>
              <td>
                <span className="inner-table-data">{account.name}</span>{" "}
              </td>
              <td>
                <span className="inner-table-data">{account.type}</span>
              </td>
              <td>
                <span className="inner-table-data">{account.balance}</span>
              </td>
              <td>
                <span className="inner-table-data">
                  {account.parentAccount}
                </span>
              </td>
              <td>
                <IconButton onClick={(event) => handleMenuClick(event, index)}>
                  <MoreVert />
                </IconButton>
                <Popper
                  open={account.menuOpen}
                  anchorEl={anchorEl}
                  placement="bottom-start"
                  transition
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom-start"
                            ? "right top"
                            : "right top",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleCloseMenu}>
                          <MenuList>
                            {account.menuOptions.map((option, index) => (
                              <MenuItem
                                key={index}
                                onClick={option.action}
                                id="menu-list-grow"
                                onKeyDown={handleCloseMenu}
                              >
                                <Typography>{option.name}</Typography>
                              </MenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Accounts;
