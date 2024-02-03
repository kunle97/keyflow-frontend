import React, { useEffect, useState } from "react";
import UIInput from "../../UIComponents/UIInput";
import UIRadioGroup from "../../UIComponents/UIRadioGroup";
import { useNavigate, useParams } from "react-router";
import {
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import UIButton from "../../UIComponents/UIButton";
import { authUser, uiGreen, uiGrey2 } from "../../../../constants";
import { authenticatedInstance } from "../../../../api/api";
import {
  getBillingEntry,
  updateBillingEntry,
  deleteBillingEntry,
} from "../../../../api/billing-entries";
import DeleteButton from "../../UIComponents/DeleteButton";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import { removeUnderscoresAndCapitalize } from "../../../../helpers/utils";
const ManageBillingEntry = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [confirmModelOpen, setConfirmModelOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  const labelStyles = {
    fontSize: "14px",
    fontWeight: "bold",
    color: "black",
    display: "block",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingText("Updating billing entry...");
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    updateBillingEntry(id, formData)
      .then((res) => {
        console.log("Create biling entrry res ", res);
        if (res.id) {
          console.log("Update entry updated successfully");
          setAlertTitle("Success");
          setAlertMessage("Billing entry updated successfully");
        } else {
          console.error("Update billing entry error ", res);
          setAlertTitle("Error");
          let message = res.data.message ? res.data.message : "";
          setAlertMessage(
            `There was an error updating the billing entry. ${message}`
          );
        }
      })
      .catch((err) => {
        console.error("Update billing entry error ", err);
        setAlertTitle("Error");
        setAlertMessage("There was an error updating the billing entry.");
      })
      .finally(() => {
        console.log("Updated billing entry finally");
        setAlertOpen(true);
        setIsLoading(false);
      });
  };

  const handleDelete = () => {
    setIsLoading(true);
    setLoadingText("Deleting billing entry...");
    deleteBillingEntry(id)
      .then((res) => {
        console.log("Delete billing entry res ", res);
        if (res.status === 204) {
          navigate("/dashboard/landlord/billing-entries");
        } else {
          setAlertTitle("Error");
          setAlertMessage("There was an error deleting the billing entry.");
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        console.error("Delete billing entry error ", err);
        setAlertTitle("Error");
        setAlertMessage("There was an error deleting the billing entry.");
        setAlertOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    setLoadingText("Fetching billing entry...");
    getBillingEntry(id)
      .then((res) => {
        console.log("Get billing entry res ", res);
        if (res) {
          setFormData(res.data);
          setSelectedTenant(res.data.tenant);
        }
      })
      .catch((err) => {
        console.error("Get billing entry error ", err);
        setAlertTitle("Error");
        setAlertMessage("There was an error fetching the billing entry.");
        setAlertOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <div className="container-fluid">
      <ProgressModal open={isLoading} title={loadingText} />
      <AlertModal
        open={alertOpen}
        title={alertTitle}
        message={alertMessage}
        btnText={"Ok"}
        onClick={() => {
          setAlertOpen(false);
        }}
      />
      <ConfirmModal
        open={confirmModelOpen}
        title={confirmTitle}
        message={confirmMessage}
        cancelBtnText="Cancel"
        confirmBtnText="Confirm"
        handleConfirm={(e) => {
          confirmAction(e);
          setConfirmAction(null);
          setConfirmModelOpen(false);
        }}
        handleCancel={() => {
          setConfirmModelOpen(false);
        }}
      />

      <h4 className="">Manage Billing Entry</h4>
      {formData && (
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={{ ...labelStyles }}>Amount</label>
                  <span className="text-black">
                    ${formData ? formData.amount : ""}
                  </span>
                </div>
                {formData.due_date !== null && (
                  <div className="col-md-6 mb-3">
                    <label className="text-black" style={{ ...labelStyles }}>
                      Due Date
                    </label>
                    <span className="text-black">
                      {formData.due_date
                        ? new Date(formData.due_date).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                )}
                <div className="col-md-6 mb-3">
                  <label className="text-black" style={{ ...labelStyles }}>
                    Type
                  </label>
                  <span className="text-black">
                    {formData.type ? removeUnderscoresAndCapitalize(formData.type) : ""}
                  </span>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-black" style={{ ...labelStyles }}>
                    Status
                  </label>
                  <select
                    onChange={(e) => {
                      setIsLoading(true);
                      // Check if status is being changed to paid
                      if (e.target.value === "paid") {
                        setConfirmTitle("Mark as Paid");
                        setConfirmMessage(
                          "Are you sure you want to mark this billing entry as paid? The invoice will be marked as paid and finalized. This action cannot be undone."
                        );
                        setConfirmModelOpen(true);
                        setConfirmAction(() => () => {
                          handleChange(e);
                        });
                        handleChange(e);
                      }
                      //Check if status is being changed from paid to unpaid
                      else if (e.target.value === "unpaid") {
                        setAlertTitle("Cannot Mark as Unpaid");
                        setAlertMessage(
                          "This billing entry has already been marked as paid. It cannot be marked as unpaid."
                        );
                        setAlertOpen(true);
                      }
                      console.log(formData);
                      setIsLoading(false);
                    }}
                    className="form-select"
                    name="status"
                    style={{ margin: "10px 0" }}
                    value={formData ? formData.status : ""}
                  >
                    <option value={null} selected disabled>
                      Select One
                    </option>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                {selectedTenant && (
                  <div className="col-md-6 mb-3">
                    <label className="text-black" style={{ ...labelStyles }}>
                      Tenant
                    </label>
                    <span className="text-black">
                      {selectedTenant.user.first_name}{" "}
                      {selectedTenant.user.last_name}
                    </span>
                  </div>
                )}
                <div className="col-md-12">
                  <label className="text-black" style={{ ...labelStyles }}>
                    Description
                  </label>
                  <textarea
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter description"
                    style={{ margin: "10px 0" }}
                    name="description"
                    rows={5}
                    defaultValue={formData ? formData.description : ""}
                  ></textarea>
                </div>
              </div>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                style={{ margin: "20px 0" }}
              >
                <DeleteButton
                  style={{ float: "left" }}
                  onClick={() => {
                    setConfirmTitle("Delete Billing Entry");
                    setConfirmMessage(
                      "Are you sure you want to delete this billing entry? The invoice will be voided and the billing entry will be deleted. This action cannot be undone."
                    );
                    setConfirmAction(() => handleDelete);
                    setConfirmModelOpen(true);
                  }}
                  btnText="Delete Billing Entry"
                />
                <UIButton
                  type="submit"
                  className="btn btn-primary"
                  btnText="Update Billing Entry"
                  style={{ float: "right" }}
                />
              </Stack>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBillingEntry;
