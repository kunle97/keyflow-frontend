import React, { useEffect, useState } from "react";
import {
  getLeaseTemplatesByUser,
  getLeaseTemplateById,
} from "../../../../api/lease_templates";
import { deleteUnit, getUnit, updateUnit } from "../../../../api/units";
import { getUserStripeSubscriptions } from "../../../../api/auth";
import { Link, useParams } from "react-router-dom";
import BackButton from "../../UIComponents/BackButton";
import {
  Alert,
  Button,
  ClickAwayListener,
  Divider,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  MenuList,
  Modal,
  Paper,
  Popper,
  Stack,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { authUser, token, uiGreen, uiRed } from "../../../../constants";
import { uiGrey2 } from "../../../../constants";
import { modalStyle } from "../../../../constants";
import { CloseOutlined, Description } from "@mui/icons-material";
import { set, useForm } from "react-hook-form";
import { validationMessageStyle } from "../../../../constants";
import DeleteButton from "../../UIComponents/DeleteButton";
import ConfirmModal from "../../UIComponents/Modals/ConfirmModal";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../UIComponents/Modals/AlertModal";
import UIButton from "../../UIComponents/UIButton";
import UITabs from "../../UIComponents/UITabs";
import FileManagerView from "../../UIComponents/FileManagerView";
import {
  authenticatedInstance,
  authenticatedMediaInstance,
} from "../../../../api/api";
import EditIcon from "@mui/icons-material/Edit";
import {
  deleteFile,
  retrieveFilesBySubfolder,
  uploadFile,
} from "../../../../api/file_uploads";
import UIPrompt from "../../UIComponents/UIPrompt";
import useScreen from "../../../../hooks/useScreen";
import UIProgressPrompt from "../../UIComponents/UIProgressPrompt";
import { getLandlordTenant } from "../../../../api/landlords";
import UIDialog from "../../UIComponents/Modals/UIDialog";
import HomeIcon from "@mui/icons-material/Home";
import HotelIcon from "@mui/icons-material/Hotel";
import BathtubIcon from "@mui/icons-material/Bathtub";
import UITableMobile from "../../UIComponents/UITable/UITableMobile";
import TenantInviteForm from "../Tenants/TenantInviteForm";
import UIPreferenceRow from "../../UIComponents/UIPreferenceRow";
import UIDropzone from "../../UIComponents/Modals/UploadDialog/UIDropzone";
import {
  createBoldSignEmbeddedTemplateEditLink,
  createBoldSignEmbeddedTemplateLink,
} from "../../../../api/boldsign";
import {
  handleChangeLeaseTemplate,
  isValidFileExtension,
  isValidFileName,
} from "../../../../helpers/utils";
import UIRadioGroup from "../../UIComponents/UIRadioGroup";
import ProgressModal from "../../UIComponents/Modals/ProgressModal";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TaskIcon from "@mui/icons-material/Task";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import DescriptionIcon from "@mui/icons-material/Description";
import UnitLeaseTerms from "./UnitLeaseTerms/UnitLeaseTerms";
import { defaultRentalUnitLeaseTerms } from "../../../../constants/lease_terms";
import RentPriceSuggestionModal from "../../UIComponents/Prototypes/Modals/RentPriceSuggestionModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ListUnitModal from "../../UIComponents/Prototypes/Modals/ListUnitModal";
import UITable from "../../UIComponents/UITable/UITable";

const ManageUnit = () => {
  const iconStyles = {
    color: uiGreen,
    fontSize: "3rem",
  };
  //Create a state for the form data
  const { isMobile } = useScreen();
  const [unit, setUnit] = useState({});

  const [tenant, setTenant] = useState({});
  const [editLink, setEditLink] = useState(null);
  const [signedLeaseViewLink, setSignedLeaseViewLink] = useState(null);
  const [createLink, setCreateLink] = useState(null);
  const [leaseDocumentMode, setLeaseDocumentMode] = useState("blank_lease");
  const [unitLeaseTerms, setUnitLeaseTerms] = useState(null);
  const [blankLeaseDocumentFile, setBlankLeaseDocumentFile] = useState([]);
  const [signedLeaseDocumentFile, setSignedLeaseDocumentFile] = useState([]);
  const [additionalCharges, setAdditionalCharges] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { unit_id, property_id } = useParams();
  const [isOccupied, setIsOccupied] = useState(true);
  const [leaseTemplates, setLeaseTemplates] = useState([]);
  const [currentLeaseTemplate, setCurrentLeaseTemplate] = useState(null);
  const [showLeaseTemplateSelector, setShowLeaseTemplateSelector] =
    useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState({
    items: { data: [{ plan: { product: "" } }] },
  });
  const [tabPage, setTabPage] = useState(0);
  const [unitMedia, setunitMedia] = useState([]);
  const [unitMediaCount, setunitMediaCount] = useState(0);
  const [rentalApplications, setRentalApplications] = useState([]);
  const [tenantInviteDialogOpen, setTenantInviteDialogOpen] = useState(false);
  const [renderIframe, setRenderIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [isLoadingIframe, setIsLoadingIframe] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [templateId, setTemplateId] = useState(null);
  const [progressModalTitle, setProgressModalTitle] = useState("");
  const [chargesValid, setChargesValid] = useState(true);
  const anchorRef = React.useRef(null);
  const [open, setOpen] = useState(false);
  const [openRentalUnitSuggestionModal, setOpenRentalUnitSuggestionModal] =
    useState(false);
  const [
    showDeleteSignedDocumentConfirmModal,
    setShowDeleteSignedDocumentConfirmModal,
  ] = useState(false);
  const [showLeaseTemplateChangeWarning, setShowLeaseTemplateChangeWarning] =
    useState(false);
  const [showDeleteTemplateConfirmModal, setShowDeleteTemplateConfirmModal] =
    useState(false);
  const [addLeaseAgreementDialogIsOpen, setAddLeaseAgreementDialogIsOpen] =
    useState(false);
  const [viewRentalApplicationModalOpen, setViewRentalApplicationModalOpen] =
    useState(false);
  const [showListUnitModal, setShowListUnitModal] = useState(false);

  const tabs = [
    { label: "Details", name: "details", dataTestId: "unit-details-tab" },
    {
      label: "Additional Charges",
      name: "additional_charges",
      dataTestId: "unit-additional-charges-tab",
    },
    {
      label: "Lease Document",
      name: "lease_document",
      dataTestId: "unit-lease-document-tab",
    },
    {
      label: "Lease Template",
      name: "lease_templates",
      dataTestId: "unit-lease-template-tab",
    },
    {
      label: `Files (${unitMediaCount})`,
      name: "files",
      dataTestId: "unit-media-tab",
    },
    {
      label: "Rental Applications",
      name: "rental_applications",
      dataTestId: "unit-rental-applications-tab",
    },
  ];
  const handleChangeTabPage = (event, newValue) => {
    setTabPage(newValue);
  };
  const navigate = useNavigate();
  const {
    register,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: unit.name,
      beds: unit.beds,
      baths: unit.baths,
    },
  });

  const rental_application_table_columns = [
    {
      label: "First Name",
      name: "first_name",
    },
    {
      label: "Last Name",
      name: "last_name",
    },
    {
      label: "Email",
      name: "email",
    },
    {
      label: "Status",
      name: "is_approved",
      options: {
        customBodyrender: (value) => {
          return value ? "Approved" : "Pending";
        },
      },
    },
  ];

  const rental_application_table_options = {
    isSelectable: false,
    onRowClick: (row) => {
      console.log(row);
    },
  };

  // Dropdown
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const retrieveSubscriptionPlan = async () => {
    const res = await getUserStripeSubscriptions(authUser.id, token).then(
      (res) => {
        setCurrentSubscriptionPlan(res.subscriptions);
      }
    );
    return res;
  };

  //Create a function to handle the form submission to update unit information
  const onSubmitUnitBasicInfoUpdate = async (data) => {
    //Remove the rental_property from the data object
    delete data.rental_property;
    await updateUnit(unit_id, data).then((res) => {
      console.log(res);
      if (res.status == 200) {
        setAlertMessage("Unit updated successfully");
        setAlertTitle("Success");
        setAlertOpen(true);
        setEditDialogOpen(false);
        navigate(0);
      } else {
        setAlertMessage("There was an error updating the unit");
        setAlertTitle("Error");
        setAlertOpen(true);
        setEditDialogOpen(false);
      }
    });
  };

  //Lease Document functions
  const handleTemplateEditUpdate = (event) => {
    if (event.origin !== "https://app.boldsign.com") {
      return;
    }

    switch (event.data.status) {
      case "OnDraftSavedSuccess":
        // handle draft success
        setAlertOpen(false);
        break;
      case "onDraftFailed":
        // handle draft failure
        setAlertTitle("Error");
        setAlertMessage(
          "There was an error saving your lease agreement lease agreement  draft."
        );
        setAlertOpen(true);
        break;
      case "onCreateSuccess": // THIS is the funciton that is calle when template is created
        //Insert logic to update the unit with the template id
        setAlertTitle("Success");
        setAlertMessage("Lease Agreement Template Created Successfully");
        setAlertOpen(true);

        break;
      case "onCreateFailed":
        // handle create failure
        setAlertTitle("Error");
        setAlertMessage(
          "There was an error creating your lease agreement template."
        );
        setAlertOpen(true);
        break;
      case "onTemplateEditingCompleted":
        // handle edit success
        break;
      case "onTemplateEditingFailed":
        // handle edit failure
        setAlertTitle("Error");
        setAlertMessage(
          "There was an error editing your lease agreement template."
        );
        setAlertOpen(true);
        break;
      default:
        // Display error message
        setAlertTitle("Error");
        setAlertMessage(
          "There was an error processing your document. Please refresh the page and try again."
        );
        setAlertOpen(true);
        break;
    }
  };

  const retrieveEditLink = async (template_id) => {
    setIsLoading(true);
    setProgressModalTitle("Retrieving Lease Document...");
    console.log("Tempalte ID:", unit.template_id);
    createBoldSignEmbeddedTemplateEditLink({
      template_id: template_id,
    })
      .then((res) => {
        console.log(res);
        setEditLink(res.url);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDropBlankLeaseDocument = async (acceptedFiles) => {
    let validFiles = true;
    setIsLoadingIframe(true);
    acceptedFiles.forEach((file) => {
      if (!isValidFileName(file.name)) {
        setAlertTitle("File Upload Error");
        setAlertMessage(
          "One or more of the file names is invalid. File name can only contain numbers, letters, underscores, and dashes. No special characters or spaces."
        );
        setAlertOpen(true);
        validFiles = false;
        return;
      } else if (!isValidFileExtension(file.name, [".pdf", ".docx", ".doc"])) {
        setAlertTitle("File Upload Error");
        setAlertMessage(
          "One or more of the file types is invalid. Accepted file types: " +
            [".pdf", ".docx", ".doc"].join(", ")
        );
        setAlertOpen(true);
        validFiles = false;
        return;
      }
    });
    if (validFiles) {
      console.log("dropzone file", acceptedFiles[0]);
      let accepted_file = acceptedFiles[0];
      const payload = {
        file: acceptedFiles[0],
        template_title: accepted_file.name + " Lease Agreement",
        template_description: accepted_file.name,
        document_title: accepted_file.name,
        document_description: accepted_file.type,
        landlord_name: authUser.first_name + " " + authUser.last_name,
        landlord_email: authUser.email,
      };
      //Call the createBoldSignEmbeddedTemplateLink API
      await createBoldSignEmbeddedTemplateLink(payload).then((res) => {
        console.log(res);
        if (res.status === 201) {
          setCreateLink(res.url);
          setRenderIframe(true);
          setTemplateId(res.template_id);
          updateUnit(unit_id, { template_id: res.template_id }).then((res) => {
            console.log(res);
          });
          console.log(iframeUrl);
          setIsLoadingIframe(false);
        }
      });
    }
  };

  //Sigend Leasae Coument Functions
  const handleUploadSignedLeaseDocumentSubmit = async (e) => {
    e.preventDefault();
    setAddLeaseAgreementDialogIsOpen(false);
    setIsLoading(true);
    if (!signedLeaseDocumentFile) {
      console.error("No file selected");
      return;
    }

    let signed_lease_document_metadata = {
      lease_start_date: e.target.elements.lease_start_date.value,
      lease_end_date: e.target.elements.lease_end_date.value,
      date_signed: e.target.elements.date_signed.value,
    };

    const payload = {
      file: signedLeaseDocumentFile[0],
      user: authUser.id,
      subfolder:
        "properties/" +
        property_id +
        "/units/" +
        unit_id +
        "/signed_lease_documents/",
    };
    uploadFile(payload).then((res) => {
      console.log(res);
      setIsLoading(false);
      if (res.status === 201) {
        console.log(res);
        let file_id = res.data.id;
        let file = res.data;
        authenticatedMediaInstance
          .patch(`/units/${unit_id}/`, {
            signed_lease_document_file: res.data.id,
            signed_lease_document_metadata: JSON.stringify(
              signed_lease_document_metadata
            ),
          })
          .then((res) => {
            if (res.status === 200) {
              console.log("unit updated");
            } else {
              setAlertOpen(true);
              setAlertTitle("Error");
              setAlertMessage("Something went wrong");
              return;
            }
          });
        setAlertTitle("Update Lease Terms");
        setAlertMessage(
          <>
            <p>
              The current lease terms for this may not be updated to match the
              the terms on the document. It is recommended that you update the
              unit's lease terms now.
            </p>
            <div className="row">
              {unitLeaseTerms.map((preference) => {
                return (
                  <div className="col-md-6">
                    <h6>
                      <strong>{preference.label}</strong>
                    </h6>
                    <p>{preference.value}</p>
                  </div>
                );
              })}
            </div>
          </>
        );
        setAlertOpen(true);
      } else {
        setAlertTitle("File Upload Error");
        setAlertMessage("Something went wrong");
        setAlertOpen(true);
        return;
      }
    });
  };
  const onDropSignedLeaseDocument = async (acceptedFiles) => {
    let validFiles = true;
    setIsLoadingIframe(true);
    acceptedFiles.forEach((file) => {
      if (!isValidFileName(file.name)) {
        setAlertTitle("File Upload Error");
        setAlertMessage(
          "One or more of the file names is invalid. File name can only contain numbers, letters, underscores, and dashes. No special characters or spaces."
        );
        setAlertOpen(true);
        validFiles = false;
        return;
      } else if (!isValidFileExtension(file.name, [".pdf", ".docx", ".doc"])) {
        setAlertTitle("File Upload Error");
        setAlertMessage(
          "One or more of the file types is invalid. Accepted file types: " +
            [".pdf", ".docx", ".doc"].join(", ")
        );
        setAlertOpen(true);
        validFiles = false;
        return;
      }
    });
    if (!validFiles) {
      return;
    }

    // Process valid files
    const updatedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setSignedLeaseDocumentFile(updatedFiles);
  };
  const handleDeleteSignedLeaseDocument = () => {
    let file_id = unit.signed_lease_document_file.id;
    let file_key = unit.signed_lease_document_file.file_key;
    console.log("Fole data", file_id, file_key);
    authenticatedMediaInstance
      .patch(`/units/${unit_id}/`, {
        signed_lease_document_file: null,
        signed_lease_document_metadata: null,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log("unit updated");
          deleteFile({ id: file_id, file_key })
            .then((res) => {
              if (res.status === 200) {
                setShowDeleteSignedDocumentConfirmModal(false);
                setAlertOpen(true);
                setAlertTitle("Success");
                setAlertMessage("Signed lease document deleted successfully");
              }
            })
            .catch((err) => {
              setShowDeleteSignedDocumentConfirmModal(false);
              setAlertOpen(true);
              setAlertTitle("Error");
              setAlertMessage("Something went wrong");
              console.error("error deleting file from s3", err);
            });
        }
      })
      .catch((err) => {
        setShowDeleteSignedDocumentConfirmModal(false);
        setAlertOpen(true);
        setAlertTitle("Error");
        setAlertMessage("Something went wrong");
        console.error("Error updating unit", err);
      });
  };

  //Additional Charges functions
  const addCharge = () => {
    setAdditionalCharges((prevCharges) => [
      ...prevCharges,
      {
        name: "",
        amount: "",
        frequency: "",
      },
    ]);
  };
  const removeCharge = (index) => {
    if (additionalCharges.length === 1) return;
    let newCharges = [...additionalCharges];
    newCharges.splice(index, 1);
    setAdditionalCharges(newCharges);
  };
  const saveAdditionalCharges = async () => {
    console.log("Saving additional charges");
    //Check if additional charges all have the same frequency
    const frequencies = additionalCharges.map((charge) => charge.frequency);
    const allFrequenciesEqual = frequencies.every(
      (freq, index) => freq === frequencies[0]
    );
    if (!allFrequenciesEqual) {
      // Handle case where frequencies are not all the same
      console.log("Additional charges have different frequencies");
      // Perform actions or show an error message to the user
      // You can return early, show an error message, or prevent form submission
      setIsLoading(false);
      setAlertMessage("All additional charges must have the same frequency");
      setAlertTitle("Error creating lease term");
      setAlertOpen(true);
      return; // Example: return or show an error message
    }

    //Check if additional charges have the same frequency as the rent frequency
    const rentFrequency = unitLeaseTerms.find(
      (preference) => preference.name === "rent_frequency"
    ).value;
    const chargesMatchRentFrequency = additionalCharges.every(
      (charge) => charge.frequency === rentFrequency
    );
    if (!chargesMatchRentFrequency) {
      // Handle case where frequencies don't match rent frequency
      setIsLoading(false);
      setAlertMessage(
        "Additional charges must have the same frequency as the rent frequency"
      );
      setAlertTitle("Error creating lease term");
      setAlertOpen(true);
      return; // Example: return or show an error message
    }

    let additionalChargesString = JSON.stringify(additionalCharges);
    await updateUnit(unit_id, {
      additional_charges: additionalChargesString,
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setAlertOpen(true);
          setAlertTitle("Success");
          setAlertMessage("Additional charges updated successfully");
        } else {
          setAlertOpen(true);
          setAlertTitle("Error");
          setAlertMessage("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Create a function to handle the deletion of a unit
  const handleDeleteUnit = () => {
    //Check if unit is occupied
    if (isOccupied) {
      //Show an error message in the alert modal
      setShowDeleteAlert(false);
      setShowDeleteError(true);
      setDeleteErrorMessage(
        "This unit is occupied. Please remove the tenant before deleting this unit."
      );
      return false;
    } else {
      let payload = {
        unit_id: unit_id,
        rental_property: property_id,
        product_id: currentSubscriptionPlan.plan.product,
        subscription_id: currentSubscriptionPlan.id,
      };
      //Delete the unit with the api
      deleteUnit(payload).then((res) => {
        console.log(res);
      });
      //Redirect to the property page
      navigate(`/dashboard/landlord/properties/${property_id}`);
    }
  };

  const createLeaseTemplateButton = (
    <Link to="/dashboard/landlord/lease-templates/create">
      {" "}
      <Button
        sx={{
          textTransform: "none",
          background: uiGreen,
          color: "white",
        }}
      >
        Create Lease Template
      </Button>
    </Link>
  );

  //Create a function that handles the change of the unit lease_terms. WHen a change is made the function should stringify the lease_terms and update the unit's  with the api
  const handleChangeUnitLeaseTerms = (event, preference_name) => {
    //If unitLeaseTerms is null update the unit's lease_term to be defaultRentalUnitLEaseTerms using updateUnit
    if (!unitLeaseTerms) {
      updateUnit(unit_id, {
        lease_terms: JSON.stringify(defaultRentalUnitLeaseTerms),
      });
      setUnitLeaseTerms(defaultRentalUnitLeaseTerms);
    }

    //Find the preference that was changed
    const preference = unitLeaseTerms.find(
      (preference) => preference.name === preference_name
    );
    //Update the value of the preference
    if (preference.inputType === "switch") {
      console.log(event);
      // For switches, directly access event.target.checked
      preference.value = event;
    } else {
      // For other input types, use event.target.value
      preference.value = event.target.value;
    }
    //Update the unit lease_terms state
    setUnitLeaseTerms(unitLeaseTerms);
    //Update the unit lease_terms with the api
    updateUnit(unit_id, { lease_terms: JSON.stringify(unitLeaseTerms) });
  };

  // Function to handle the change for any switch
  const handlePreferenceSwitchChange = (preference_name) => (event) => {
    const newValue = event.target.checked;

    setUnitLeaseTerms((prevLeaseTerms) => {
      const updatedLeaseTerms = prevLeaseTerms.map((preference) =>
        preference.name === preference_name
          ? { ...preference, value: newValue }
          : preference
      );

      // Update the unit lease_terms with the API
      updateUnit(unit_id, { lease_terms: JSON.stringify(updatedLeaseTerms) });

      return updatedLeaseTerms;
    });
  };

  const handleChangeLeaseDocumentMode = (event) => {
    setLeaseDocumentMode(event.target.value); // Update selected unit
  };

  useEffect(() => {
    setIsLoadingPage(true);
    try {
      //Retrieve Unit Information
      getUnit(unit_id).then((res) => {
        setUnit(res);
        setUnitLeaseTerms(JSON.parse(res.lease_terms));
        setAdditionalCharges(JSON.parse(res.additional_charges));
        if (res.signed_lease_document_file) {
          setSignedLeaseViewLink(res.signed_lease_document_file.file);
        }
        if (res.template_id) {
          retrieveEditLink(res.template_id);
        }
        console.log("lease_terms", JSON.parse(res.lease_terms));
        if (res.is_occupied) {
          getLandlordTenant(res.tenant).then((tenant_res) => {
            console.log("Tenant", tenant_res.data);
            setTenant(tenant_res.data);
          });
        }
        const preloadedData = {
          name: res.name,
          beds: res.beds,
          baths: res.baths,
          rental_property: property_id,
        };
        // Set the preloaded data in the form using setValue
        Object.keys(preloadedData).forEach((key) => {
          setValue(key, preloadedData[key]);
        });
        setIsOccupied(res.is_occupied);

        if (res.lease_template) {
          getLeaseTemplateById(res.lease_template).then((res) => {
            console.log("Lease Template", res);
            setCurrentLeaseTemplate(res);
          });
        }
      });
      //retrieve lease terms that the user has created
      getLeaseTemplatesByUser().then((res) => {
        setLeaseTemplates(res.data);
      });
      retrieveSubscriptionPlan();
      retrieveFilesBySubfolder(
        `properties/${property_id}/units/${unit_id}`,
        authUser.id
      )
        .then((res) => {
          setunitMedia(res.data);
          setunitMediaCount(res.data.length);
        })
        .catch((err) => {
          console.log(err);
        });
      authenticatedInstance
        .get(`/units/${unit_id}/rental-applications/`)
        .then((res) => {
          console.log("Untius Rental APps", res);
          setRentalApplications(res.data);
        });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingPage(false);
      setIsLoading(false);
    }
    window.addEventListener("message", handleTemplateEditUpdate);
    return () => {
      window.removeEventListener("message", handleTemplateEditUpdate);
    };
  }, []);
  return (
    <>
      {isLoadingPage || isLoading ? (
        <UIProgressPrompt
          dataTestId="loading-unit-ui-progress-prompt"
          title="Loading Unit"
          message="Please wait while we load the unit information for you."
        />
      ) : (
        <div className="container">
          <ProgressModal
            title={progressModalTitle ? progressModalTitle : "Loading..."}
            open={isLoading}
          />
          <UIDialog
            dataTestId="edit-unit-dialog"
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            title="Edit Unit"
          >
            <div className=" ">
              <div className="mb-3">
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmitUnitBasicInfoUpdate)}>
                    <div className="row mb-3">
                      <div className="col-md-12 mb-3">
                        <label
                          data-testid="edit-unit-name-label"
                          className="form-label text-black"
                          htmlFor="name"
                        >
                          <strong>Unit #/Name</strong>
                        </label>
                        <input
                          data-testid="edit-unit-name-input"
                          {...register("name", {
                            required: "This is a required field",
                          })}
                          // defaultValue={unit.name}
                          className="form-control text-black"
                          type="text"
                          id="name"
                          placeholder="5B"
                          style={{
                            borderStyle: "none",
                            color: "rgb(255,255,255)",
                          }}
                        />
                        <span style={validationMessageStyle}>
                          {errors.name && errors.name.message}
                        </span>
                      </div>
                      <div className="col-md-12">
                        <div>
                          <label
                            data-testid="edit-unit-beds-label"
                            className="form-label text-black"
                          >
                            <strong>Beds</strong>
                          </label>
                          <input
                            data-testid="edit-unit-beds-input"
                            {...register("beds", {
                              required: "This is a required field",
                            })}
                            className="form-control text-black"
                            type="number"
                            style={{
                              borderStyle: "none",
                              color: "rgb(255,255,255)",
                            }}
                            defaultValue={unit.beds}
                            min="0"
                            step="1"
                          />
                          <span style={validationMessageStyle}>
                            {errors.beds && errors.beds.message}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div>
                          <label
                            data-testid="edit-unit-baths-label"
                            className="form-label text-black"
                          >
                            <strong>Baths</strong>
                          </label>
                          <input
                            data-testid="edit-unit-baths-input"
                            {...register("baths", {
                              required: "This is a required field",
                            })}
                            className="form-control text-black "
                            type="number"
                            style={{
                              borderStyle: "none",
                              color: "rgb(255,255,255)",
                            }}
                            defaultValue={unit.baths}
                            min="0"
                            step="1"
                          />
                          <span style={validationMessageStyle}>
                            {errors.baths && errors.baths.message}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-end my-3">
                      <button
                        className="btn btn-primary ui-btn"
                        type="submit"
                        data-testid="edit-unit-submit-button"
                      >
                        Update Unit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <>
                <AlertModal
                  dataTestId={"delete-unit-alert-modal"}
                  open={showDeleteError}
                  setOpen={setShowDeleteError}
                  title={"Error"}
                  message={deleteErrorMessage}
                  btnText={"Ok"}
                  onClick={() => setShowDeleteError(false)}
                />
                <DeleteButton
                  dataTestId={"delete-unit-button"}
                  style={{
                    background: uiRed,
                    textTransform: "none",
                    float: "right",
                  }}
                  variant="contained"
                  btnText="Delete Unit"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setShowDeleteAlert(true);
                  }}
                />
                <ConfirmModal
                  open={showDeleteAlert}
                  title="Delete Unit"
                  message="Are you sure you want to delete this unit?"
                  confirmBtnText="Delete"
                  cancelBtnText="Cancel"
                  confirmBtnStyle={{
                    backgroundColor: uiRed,
                    color: "white",
                  }}
                  cancelBtnStyle={{
                    backgroundColor: uiGreen,
                    color: "white",
                  }}
                  handleCancel={() => {
                    setShowDeleteAlert(false);
                  }}
                  handleConfirm={handleDeleteUnit}
                />
              </>
            </div>
          </UIDialog>
          <AlertModal
            open={alertOpen}
            title={alertTitle}
            message={alertMessage}
            btnText="Okay"
            onClick={() => {
              setAlertOpen(false);
              navigate(0);
            }}
          />
          <ConfirmModal
            open={showDeleteSignedDocumentConfirmModal}
            title="Delete Signed Lease"
            message="Are you sure you want to delete this signed lease document?"
            confirmBtnText="Delete"
            cancelBtnText="Cancel"
            confirmBtnStyle={{
              backgroundColor: uiRed,
              color: "white",
            }}
            cancelBtnStyle={{
              backgroundColor: uiGreen,
              color: "white",
            }}
            handleCancel={() => {
              setShowDeleteSignedDocumentConfirmModal(false);
            }}
            handleConfirm={handleDeleteSignedLeaseDocument}
          />
          <ConfirmModal
            open={showDeleteTemplateConfirmModal}
            title="Delete Template Document"
            message="Are you sure you want to delete this template document?"
            confirmBtnText="Delete"
            cancelBtnText="Cancel"
            confirmBtnStyle={{
              backgroundColor: uiRed,
              color: "white",
            }}
            cancelBtnStyle={{
              backgroundColor: uiGreen,
              color: "white",
            }}
            handleCancel={() => {
              setShowDeleteTemplateConfirmModal(false);
            }}
            handleConfirm={() => {
              console.log("Template ID update");
              //update the unit to set the tempalate_id field to null
              updateUnit(unit_id, {
                template_id: null,
              }).then((res) => {
                if (res.status === 200) {
                  console.log("unit updated");
                  setShowDeleteTemplateConfirmModal(false);
                  setAlertOpen(true);
                  setAlertTitle("Success");
                  setAlertMessage("Template document deleted successfully");
                  // navigate(0);
                } else {
                  setAlertOpen(true);
                  setAlertTitle("Error");
                  setAlertMessage("Something went wrong");
                  return;
                }
              });
            }}
          />
          <AlertModal
            dataTestId={"delete-unit-alert-modal"}
            open={showDeleteError}
            setOpen={setShowDeleteError}
            title={"Error"}
            message={deleteErrorMessage}
            btnText={"Ok"}
            onClick={() => setShowDeleteError(false)}
          />
          <ConfirmModal
            dataTestId={"delete-unit-confirm-modal"}
            open={showDeleteAlert}
            title="Delete Unit"
            message="Are you sure you want to delete this unit?"
            confirmBtnText="Delete"
            cancelBtnText="Cancel"
            confirmBtnStyle={{
              backgroundColor: uiRed,
              color: "white",
            }}
            cancelBtnStyle={{
              backgroundColor: uiGreen,
              color: "white",
            }}
            handleCancel={() => {
              setShowDeleteAlert(false);
            }}
            handleConfirm={handleDeleteUnit}
          />
          <ConfirmModal
            open={showLeaseTemplateChangeWarning}
            title="Change Lease Template"
            message="Are you sure you want to change the lease template for this unit? This will delete the current signed and unsigned lease document file."
            confirmBtnText="Change"
            cancelBtnText="Cancel"
            confirmBtnStyle={{
              backgroundColor: uiRed,
              color: "white",
            }}
            cancelBtnStyle={{
              backgroundColor: uiGreen,
              color: "white",
            }}
            handleCancel={() => {
              setShowLeaseTemplateChangeWarning(false);
            }}
            handleConfirm={() => {
              handleChangeLeaseTemplate(
                leaseTemplates,
                currentLeaseTemplate.id,
                unitLeaseTerms,
                unit_id,
                unit.signed_lease_document_file.id
              );
              setShowLeaseTemplateChangeWarning(false);
              setShowLeaseTemplateSelector(false);
            }}
          />
          <RentPriceSuggestionModal
            open={openRentalUnitSuggestionModal}
            onClose={() => setOpenRentalUnitSuggestionModal(false)}
          />
          <UIDialog
            open={viewRentalApplicationModalOpen}
            onClose={() => setViewRentalApplicationModalOpen(false)}
            title="Rental Application Link"
            style={{ width: "100%" }}
          >
            {/* Rental Application Link   */}
            <div className="row">
              <div className="col-md-12">
                <input
                  data-testid="rental-application-link-input"
                  className="form-control"
                  value={`${process.env.REACT_APP_HOSTNAME}/rental-application/${unit_id}/${authUser.id}/`}
                />
                <a
                  href={`${process.env.REACT_APP_HOSTNAME}/rental-application/${unit_id}/${authUser.id}/`}
                  target="_blank"
                >
                  <Button
                    data-testid="rental-application-link-preview-button"
                    style={{
                      background: uiGreen,
                      color: "white",
                      textTransform: "none",
                      marginTop: "1rem",
                      width: "100%",
                    }}
                  >
                    Preview
                  </Button>
                </a>
              </div>
            </div>
          </UIDialog>
          <ListUnitModal
            open={showListUnitModal}
            onClose={() => setShowListUnitModal(false)}
          />
          {unitMedia && unitMedia.length > 0 && (
            <div
              data-testid="unit-media-header-container"
              style={{
                width: "100%",
                height: isMobile ? "200px" : "320px",
                //Vertical center the image
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                marginBottom: "10px",
              }}
              className="card"
            >
              <img
                data-testid="unit-media-header-image"
                src={unitMedia[0].file}
                style={{
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            alignContent={{ xs: "center", sm: "flex-start" }}
          >
            <div>
              <h4
                data-testId="unit-name"
                style={{ marginBottom: "0px", fontSize: "17pt" }}
              >
                Unit {unit?.name}
              </h4>
              <span className="text-black" data-testId="unit-tenant">
                {isOccupied ? (
                  <>
                    <Link to={`/dashboard/landlord/tenants/${tenant?.id}`}>
                      {"Tenant: " +
                        tenant?.user?.first_name +
                        " " +
                        tenant?.user?.last_name}
                    </Link>
                  </>
                ) : (
                  <>
                    <UIDialog
                      dataTestId="invite-tenant-dialog"
                      open={tenantInviteDialogOpen}
                      onClose={() => setTenantInviteDialogOpen(false)}
                      title="Invite Tenant"
                    >
                      <TenantInviteForm
                        rental_unit_id={unit_id}
                        templateId={unit.template_id ? unit.template_id : null}
                        signedLeaseDocumentFileId={
                          unit.signed_lease_document_file
                            ? unit.signed_lease_document_file.id
                            : null
                        }
                        setTenantInviteDialogOpen={setTenantInviteDialogOpen}
                      />
                    </UIDialog>
                    <span className="text-black">Vacant</span>
                    <Button
                      style={{
                        marginLeft: "10px",
                        color: uiGreen,
                        textTransform: "none",
                      }}
                      onClick={() => {
                        if (
                          unit.template_id ||
                          unit.signed_lease_document_file
                        ) {
                          setTenantInviteDialogOpen(true);
                        } else {
                          setAlertMessage(
                            "Please upload a lease document or set a lease template for this unit before inviting a tenant"
                          );
                          setAlertTitle("Add Lease Document");
                          setAlertOpen(true);
                        }
                      }}
                    >
                      Invite Tenant
                    </Button>
                  </>
                )}
              </span>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={3}
              >
                <div>
                  <HotelIcon
                    sx={{
                      fontSize: "18pt",
                      color: uiGreen,
                      marginBottom: "10px",
                      marginRight: "5px",
                    }}
                  />
                  <span
                    data-testid="unit-details-beds"
                    className="text-black"
                    style={{
                      fontSize: isMobile ? "12pt" : "15pt",
                    }}
                  >
                    {unit.beds}
                  </span>
                </div>
                <div>
                  <BathtubIcon
                    sx={{
                      marginRight: "5px",
                      fontSize: "18pt",
                      color: uiGreen,
                      marginBottom: "10px",
                    }}
                  />
                  <span
                    data-testid="unit-details-baths"
                    className="text-black"
                    style={{
                      fontSize: isMobile ? "12pt" : "15pt",
                    }}
                  >
                    {unit.baths}
                  </span>
                </div>
              </Stack>
            </div>
            <IconButton
              ref={anchorRef}
              id="composition-button"
              aria-controls={open ? "composition-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              <MoreVertIcon />
            </IconButton>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
              sx={{
                zIndex: "1",
              }}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "right top" : "right top",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem
                          onClick={() => {
                            setEditDialogOpen(true);
                          }}
                        >
                          Edit Rental Unit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setOpenRentalUnitSuggestionModal(true);
                          }}
                        >
                          Optimize Rental Unit
                        </MenuItem>
                        {!isOccupied && (
                          <MenuItem
                            onClick={() => {
                              setShowListUnitModal(true);
                            }}
                          >
                            List Unit...
                          </MenuItem>
                        )}
                        {!isOccupied && (
                          <MenuItem
                            onClick={() => {
                              setViewRentalApplicationModalOpen(true);
                            }}
                          >
                            View Rental Application
                          </MenuItem>
                        )}
                        <MenuItem
                          onClick={() => {
                            setShowDeleteAlert(true);
                          }}
                        >
                          Delete Rental Unit
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Stack>

          <UITabs
            tabs={tabs}
            value={tabPage}
            handleChange={handleChangeTabPage}
            variant="scrollable"
            style={{ margin: "1rem 0" }}
          />
          <div className="row mb-3">
            {tabPage === 0 && (
              <>
                <div>
                  <UIDialog
                    title="Upload A Lease Agreement"
                    open={addLeaseAgreementDialogIsOpen}
                    style={{ width: "1200px" }}
                    onClose={() => {
                      setAddLeaseAgreementDialogIsOpen(false);
                    }}
                    maxWidth={createLink ? "xl" : null}
                  >
                    <>
                      {createLink ? (
                        <div className="">
                          <iframe
                            src={createLink}
                            height={isMobile ? "500px" : "1200px"}
                            width="100%"
                          />
                        </div>
                      ) : (
                        <>
                          <UIRadioGroup
                            style={{
                              marginBottom: "20px",
                            }}
                            radioOptions={[
                              {
                                value: "existing_lease",
                                label: "Upload Signed Lease Agreement",
                              },
                              {
                                value: "blank_lease",
                                label: "Upload Unsigned Lease Agreement",
                              },
                            ]}
                            value={leaseDocumentMode}
                            onChange={handleChangeLeaseDocumentMode}
                            direction="row"
                          />
                          {leaseDocumentMode === "blank_lease" ? (
                            <div className="">
                              <div className="card-body">
                                <UIDropzone
                                  onDrop={onDropBlankLeaseDocument}
                                  acceptedFileTypes={[".pdf,.docx"]}
                                  files={blankLeaseDocumentFile}
                                  setFiles={setBlankLeaseDocumentFile}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="">
                              <div className="card-body">
                                <form
                                  onSubmit={
                                    handleUploadSignedLeaseDocumentSubmit
                                  }
                                  encType="multipart/form-data"
                                >
                                  <div className="row">
                                    <div className="col-md-12">
                                      <label className="text-black mb-2">
                                        <strong>
                                          Upload Signed Lease Agreement
                                        </strong>
                                      </label>
                                      <UIDropzone
                                        dropzoneStyles={{ height: "190px" }}
                                        onDrop={onDropSignedLeaseDocument}
                                        acceptedFileTypes={[".pdf,.docx"]}
                                        files={signedLeaseDocumentFile}
                                        setFiles={setSignedLeaseDocumentFile}
                                      />
                                    </div>
                                    <div className="col-md-6">
                                      <div
                                        className="form-group"
                                        style={{ width: "100%" }}
                                      >
                                        <label className="text-black mb-2">
                                          <strong>Lease Start Date</strong>
                                        </label>
                                        <input
                                          type="date"
                                          className="form-control"
                                          name="lease_start_date"
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div
                                        className="form-group"
                                        style={{ width: "100%" }}
                                      >
                                        <label className="text-black mb-2">
                                          <strong>Lease End Date</strong>
                                        </label>
                                        <input
                                          type="date"
                                          className="form-control"
                                          name="lease_end_date"
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-12">
                                      <div
                                        className="form-group"
                                        style={{ width: "100%" }}
                                      >
                                        <label className="text-black my-2">
                                          <strong>Date Signed </strong>
                                        </label>
                                        <input
                                          type="date"
                                          className="form-control"
                                          name="date_signed"
                                          required
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <UIButton
                                    btnText="Submit File"
                                    type="submit"
                                    style={{ marginTop: "20px", width: "100%" }}
                                  />
                                </form>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  </UIDialog>
                  <Stack direction="row" justifyContent="flex-end">
                    {!unit.signed_lease_document_file && !unit.template_id && (
                      <UIButton
                        btnText="Add Lease Agreement Document"
                        onClick={() => {
                          setAddLeaseAgreementDialogIsOpen(true);
                        }}
                      />
                    )}
                    {/* {unit.signed_lease_document_file && (
                      <div>
                        <UIButton
                          btnText="View Document"
                          onClick={() => {
                            window.open(signedLeaseViewLink);
                          }}
                        />
                        <DeleteButton
                          btnText="Delete Document"
                          onClick={() => {
                            setShowDeleteSignedDocumentConfirmModal(true);
                          }}
                        />
                      </div>
                    )} */}
                    {unit.template_id && (
                      <select
                        className="form-select"
                        style={{
                          width: "250px",
                        }}
                        onChange={(e) => {
                          let lease_template_id = parseInt(e.target.value);
                          //Check if the unit has a signed lease document property or a template_id property
                          if (
                            unit.signed_lease_document_file ||
                            unit.template_id
                          ) {
                            console.log("Leasde AGreement Docuemtn set");
                            setCurrentLeaseTemplate(
                              leaseTemplates.find(
                                (term) => term.id === lease_template_id
                              )
                            );
                            setShowLeaseTemplateChangeWarning(true);
                          } else {
                            console.log("Leasde AGreement Docuemtn not set");
                            const res = handleChangeLeaseTemplate(
                              leaseTemplates,
                              lease_template_id,
                              unitLeaseTerms,
                              unit_id,
                              unit.signed_lease_document_file.id
                            );
                            setCurrentLeaseTemplate(
                              leaseTemplates.find(
                                (term) => term.id === lease_template_id
                              )
                            );
                            setShowLeaseTemplateSelector(false);
                          }
                        }}
                      >
                        <option>Select A Lease Template</option>
                        {leaseTemplates &&
                          leaseTemplates.map((template) => {
                            let option_label = `${template.term} ${template.rent_frequency} Lease @ ${template.rent}/${template.rent_frequency}`;
                            return (
                              <option value={template.id}>
                                {option_label}
                              </option>
                            );
                          })}
                      </select>
                    )}
                  </Stack>

                  <UnitLeaseTerms
                    tenant={tenant}
                    unit={unit}
                    unitLeaseTerms={unitLeaseTerms}
                    handleChangeUnitLeaseTerms={handleChangeUnitLeaseTerms}
                    handlePreferenceSwitchChange={handlePreferenceSwitchChange}
                  />
                </div>
              </>
            )}
            {tabPage === 1 && (
              <>
                <AlertModal
                  dataTestId={"additional-charges-alert-modal"}
                  open={alertOpen}
                  title={alertTitle}
                  message={alertMessage}
                  btnText={"Ok"}
                  onClick={() => {
                    setAlertOpen(false);
                  }}
                />
                {additionalCharges.length > 0 ? (
                  <div className="card">
                    <div className="card-body">
                      {additionalCharges.map((charge, index) => (
                        <div key={index} className="row mt-3">
                          <div className="col-md-3">
                            <label
                              className="form-label text-black"
                              htmlFor="street"
                            >
                              <strong>Charge</strong>
                            </label>
                            <input
                              {...register(`additionalChargeName_${index}`, {
                                required: {
                                  value: true,
                                  message: "Charge name is required",
                                },
                              })}
                              type="text"
                              value={charge.name}
                              onChange={(e) => {
                                trigger(`additionalChargeName_${index}`);
                                let newCharges = [...additionalCharges];
                                newCharges[index].name = e.target.value;
                                setAdditionalCharges(newCharges);
                              }}
                              className="form-control"
                            />
                            <span style={validationMessageStyle}>
                              {errors[`additionalChargeName_${index}`] &&
                                errors[`additionalChargeName_${index}`]
                                  ?.message}
                            </span>
                          </div>
                          <div className="col-md-3">
                            <label
                              className="form-label text-black"
                              htmlFor="street"
                            >
                              <strong>Amount</strong>
                            </label>
                            <input
                              {...register(`additionalChargeAmount_${index}`, {
                                required: {
                                  value: true,
                                  message: "Charge amount is required",
                                },
                              })}
                              type="number"
                              min="0"
                              value={charge.amount}
                              onChange={(e) => {
                                trigger(`additionalChargeAmount_${index}`);
                                let newCharges = [...additionalCharges];
                                newCharges[index].amount = e.target.value;
                                setAdditionalCharges(newCharges);
                              }}
                              className="form-control"
                            />
                            <span style={validationMessageStyle}>
                              {errors[`additionalChargeAmount_${index}`] &&
                                errors[`additionalChargeAmount_${index}`]
                                  ?.message}
                            </span>
                          </div>
                          <div className="col-md-3">
                            <label
                              className="form-label text-black"
                              htmlFor="street"
                            >
                              <strong>Frequency</strong>
                            </label>
                            <select
                              {...register(
                                `additionalChargeFrequency_${index}`,
                                {
                                  required: {
                                    value: true,
                                    message: "Charge frequency is required",
                                  },
                                }
                              )}
                              onChange={(e) => {
                                trigger(`additionalChargeFrequency_${index}`);
                                let newCharges = [...additionalCharges];
                                newCharges[index].frequency = e.target.value;
                                setAdditionalCharges(newCharges);
                              }}
                              value={charge.frequency}
                              className="form-control"
                            >
                              <option value="">Select Frequency</option>
                              <option value="day">Daily</option>
                              <option value="week">Weekly</option>
                              <option value="month">Monthly</option>
                              <option value="year">Yearly</option>
                            </select>
                            <span style={validationMessageStyle}>
                              {errors[`additionalChargeFrequency_${index}`] &&
                                errors[`additionalChargeFrequency_${index}`]
                                  ?.message}
                            </span>
                          </div>
                          {charge.index !== 0 && (
                            <div className="col-md-3">
                              <UIButton
                                onClick={() => removeCharge(index)}
                                btnText="Remove"
                                variant="text"
                                style={{
                                  marginTop: "30px",
                                  color: uiRed,
                                  backgroundColor: "transparent",
                                  display: "block",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <UIButton
                          onClick={() => {
                            //TODO: Trigger validation
                            trigger([
                              `additionalChargeName_${
                                additionalCharges.length - 1
                              }`,
                              `additionalChargeAmount_${
                                additionalCharges.length - 1
                              }`,
                              `additionalChargeFrequency_${
                                additionalCharges.length - 1
                              }`,
                            ]);
                            if (
                              (errors[
                                `additionalChargeName_${
                                  additionalCharges.length - 1
                                }`
                              ] ||
                                errors[
                                  `additionalChargeAmount_${
                                    additionalCharges.length - 1
                                  }`
                                ] ||
                                errors[
                                  `additionalChargeFrequency_${
                                    additionalCharges.length - 1
                                  }`
                                ]) &&
                              !chargesValid
                            ) {
                              setChargesValid(false);
                              return;
                            } else {
                              addCharge();
                            }
                          }}
                          btnText="Add Charge"
                          style={{
                            marginTop: "20px",
                            display: "block",
                            boxShadow: "none",
                          }}
                        />
                        <UIButton
                          btnText="Update Charges"
                          onClick={saveAdditionalCharges}
                          style={{ marginTop: "20px", float: "right" }}
                        />
                      </Stack>
                    </div>
                  </div>
                ) : (
                  <>
                    <UIPrompt
                      icon={<AttachMoneyIcon style={iconStyles} />}
                      title="No Additional Charges"
                      message="You have not added any additional charges to this unit. Click the button below to add additional charges."
                      body={
                        <UIButton
                          onClick={addCharge}
                          btnText="Add Additional Charges"
                          variant="text"
                          style={{
                            marginTop: "30px",
                            color: uiGreen,
                            backgroundColor: "transparent",
                            display: "block",
                          }}
                        />
                      }
                    />
                  </>
                )}
              </>
            )}
            {tabPage === 2 && (
              <div>
                {unit.template_id && (
                  <div>
                    <Stack direction="row" justifyContent="flex-end">
                      <DeleteButton
                        btnText="Delete Template Document"
                        onClick={() => {
                          setShowDeleteTemplateConfirmModal(true);
                        }}
                        style={{
                          marginBottom: "15px",
                        }}
                      />
                    </Stack>
                    <div className="card" style={{ overflow: "hidden" }}>
                      <iframe
                        src={editLink}
                        height={isMobile ? "500px" : "1200px"}
                        width="100%"
                      />
                    </div>
                  </div>
                )}
                {unit.signed_lease_document_file && (
                  <div>
                    <UIPrompt
                      icon={<TaskIcon style={iconStyles} />}
                      title="Manage Signed Lease Agreement"
                      message="Use the buttons below to view, download or delete the signed lease agreement."
                      body={
                        <Stack
                          direction={"row"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          spacing={2}
                          sx={{ margin: "10px 0" }}
                        >
                          <UIButton
                            onClick={() => {
                              window.open(signedLeaseViewLink, "_blank");
                            }}
                            btnText="View/Download Document"
                            style={{ marginTop: "20px", width: "320px" }}
                          />
                          <DeleteButton
                            style={{
                              width: "320px",
                            }}
                            btnText="Delete Document"
                            onClick={() => {
                              setShowDeleteSignedDocumentConfirmModal(true);
                            }}
                          />
                        </Stack>
                      }
                    />
                  </div>
                )}
                {!unit.template_id && !unit.signed_lease_document_file && (
                  <div>
                    <AlertModal
                      open={alertOpen}
                      title={alertTitle}
                      message={alertMessage}
                      btnText="Okay"
                      onClick={() => {
                        setAlertOpen(false);
                      }}
                    />
                    {createLink ? (
                      <div className="card">
                        <iframe
                          src={createLink}
                          height={isMobile ? "500px" : "1200px"}
                          width="100%"
                        />
                      </div>
                    ) : (
                      <>
                        <UIRadioGroup
                          style={{
                            marginBottom: "20px",
                          }}
                          radioOptions={[
                            {
                              value: "existing_lease",
                              label: "Upload Signed Lease Agreement",
                            },
                            {
                              value: "blank_lease",
                              label: "Upload Unsigned Lease Agreement",
                            },
                          ]}
                          value={leaseDocumentMode}
                          onChange={handleChangeLeaseDocumentMode}
                          direction="row"
                        />
                        {leaseDocumentMode === "blank_lease" ? (
                          <div className="card">
                            <div className="card-body">
                              <UIDropzone
                                onDrop={onDropBlankLeaseDocument}
                                acceptedFileTypes={[".pdf,.docx"]}
                                files={blankLeaseDocumentFile}
                                setFiles={setBlankLeaseDocumentFile}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="card">
                            <div className="card-body">
                              <form
                                onSubmit={handleUploadSignedLeaseDocumentSubmit}
                                encType="multipart/form-data"
                              >
                                <div className="row">
                                  <div className="col-md-12">
                                    {" "}
                                    <label className="text-black mb-2">
                                      <strong>
                                        Upload Signed Lease Agreement
                                      </strong>
                                    </label>
                                    <UIDropzone
                                      dropzoneStyles={{ height: "190px" }}
                                      onDrop={onDropSignedLeaseDocument}
                                      acceptedFileTypes={[".pdf,.docx"]}
                                      files={signedLeaseDocumentFile}
                                      setFiles={setSignedLeaseDocumentFile}
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <div
                                      className="form-group"
                                      style={{ width: "100%" }}
                                    >
                                      <label className="text-black mb-2">
                                        <strong>Lease Start Date</strong>
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        name="lease_start_date"
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div
                                      className="form-group"
                                      style={{ width: "100%" }}
                                    >
                                      <label className="text-black mb-2">
                                        <strong>Lease End Date</strong>
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        name="lease_end_date"
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-12">
                                    <div
                                      className="form-group"
                                      style={{ width: "100%" }}
                                    >
                                      <label className="text-black my-2">
                                        <strong>Date Signed </strong>
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        name="date_signed"
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>

                                <UIButton
                                  btnText="Submit File"
                                  type="submit"
                                  style={{ marginTop: "20px", width: "100%" }}
                                />
                              </form>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            {tabPage === 3 && (
              <>
                <div className="py-3" style={{ overflow: "auto" }}>
                  <div style={{ float: "right" }}>
                    {createLeaseTemplateButton}
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-body">
                    <div className="mb-3">
                      <div>
                        <Modal
                          data-testid="lease-template-selector-modal"
                          open={showLeaseTemplateSelector}
                        >
                          <div
                            className="card"
                            style={{
                              ...modalStyle,
                              width: isMobile ? "90%" : "450px",
                            }}
                          >
                            <IconButton
                              onClick={() =>
                                setShowLeaseTemplateSelector(false)
                              }
                              sx={{
                                width: "50px",
                                height: "50px",
                                color: uiGrey2,
                                padding: "0",
                              }}
                            >
                              <CloseOutlined />
                            </IconButton>
                            <List
                              sx={{
                                width: "100%",
                                maxWidth: "100%",
                                maxHeight: 500,
                                overflow: "auto",
                                color: uiGrey2,
                                bgcolor: "white",
                              }}
                            >
                              {leaseTemplates.map((leaseTemplate, index) => {
                                if (leaseTemplates.length == 0) {
                                  return (
                                    <>
                                      <ListItem alignItems="flex-start">
                                        <ListItemText
                                          primary={`No lease templates found`}
                                        />
                                      </ListItem>
                                    </>
                                  );
                                } else {
                                  return (
                                    <>
                                      <ListItem alignItems="flex-start">
                                        <ListItemText
                                          primary={`${leaseTemplate.term} Month Lease @ $${leaseTemplate.rent}/mo`}
                                          secondary={
                                            <div>
                                              <h6 style={{ fontSize: "10pt" }}>
                                                Security Deposit: ${" "}
                                                {leaseTemplate.security_deposit}{" "}
                                                | Late Fee: $
                                                {leaseTemplate.late_fee} | Grace
                                                Period:{" "}
                                                {leaseTemplate.grace_period ===
                                                0 ? (
                                                  "None"
                                                ) : (
                                                  <>{`${leaseTemplate.grace_period} Month(s)`}</>
                                                )}
                                              </h6>
                                              <div style={{ overflow: "auto" }}>
                                                <div
                                                  style={{
                                                    color: uiGrey2,
                                                    float: "left",
                                                  }}
                                                >
                                                  <p className="m-0">
                                                    Gas{" "}
                                                    {leaseTemplate.gas_included
                                                      ? "included"
                                                      : "not included"}
                                                  </p>
                                                  <p className="m-0">
                                                    Electric{" "}
                                                    {leaseTemplate.electric_included
                                                      ? "included"
                                                      : "not included"}
                                                  </p>
                                                  <p className="m-0">
                                                    Water{" "}
                                                    {leaseTemplate.water_included
                                                      ? "included"
                                                      : "not included"}
                                                  </p>
                                                </div>
                                                <Button
                                                  data-testid={`select-lease-template-button-${index}`}
                                                  onClick={() => {
                                                    let document_id = "";
                                                    if (
                                                      unit.signed_lease_document_file
                                                    ) {
                                                      document_id =
                                                        unit
                                                          .signed_lease_document_file
                                                          .id;
                                                    } else {
                                                      document_id = null;
                                                    }
                                                    //Check if the unit 1 has a signed lease document property or a template_id property
                                                    if (
                                                      unit.signed_lease_document_file ||
                                                      unit.template_id
                                                    ) {
                                                      setCurrentLeaseTemplate(
                                                        leaseTemplates.find(
                                                          (term) =>
                                                            term.id ===
                                                            leaseTemplate.id
                                                        )
                                                      );
                                                      setShowLeaseTemplateChangeWarning(
                                                        true
                                                      );
                                                    } else {
                                                      setCurrentLeaseTemplate(
                                                        leaseTemplates.find(
                                                          (term) =>
                                                            term.id ===
                                                            leaseTemplate.id
                                                        )
                                                      );
                                                      const res =
                                                        handleChangeLeaseTemplate(
                                                          leaseTemplates,
                                                          leaseTemplate.id,
                                                          unitLeaseTerms,
                                                          unit_id,
                                                          document_id
                                                        );
                                                      setShowLeaseTemplateSelector(
                                                        false
                                                      );
                                                    }
                                                  }}
                                                  sx={{
                                                    background: uiGreen,
                                                    color: "white",
                                                    textTransform: "none",
                                                    float: "right",
                                                    marginTop: "10px",
                                                  }}
                                                  variant="container"
                                                  className="ui-btn"
                                                >
                                                  Select
                                                </Button>
                                              </div>
                                            </div>
                                          }
                                        />
                                      </ListItem>
                                      <Divider component="li" />
                                    </>
                                  );
                                }
                              })}
                            </List>
                          </div>
                        </Modal>
                      </div>
                    </div>
                    <div className="row">
                      {currentLeaseTemplate ? (
                        <>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Rent</h6>${currentLeaseTemplate.rent}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Term</h6>
                            {currentLeaseTemplate.term} Months
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Late Fee</h6>
                            {`$${currentLeaseTemplate.late_fee}`}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Security Deposit</h6>
                            {`$${currentLeaseTemplate.security_deposit}`}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Gas Included?</h6>
                            {`${
                              currentLeaseTemplate.gas_included ? "Yes" : "No"
                            }`}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Electric Included?</h6>
                            {`${
                              currentLeaseTemplate.electric_included
                                ? "Yes"
                                : "No"
                            }`}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Water Included?</h6>
                            {`${
                              currentLeaseTemplate.water_included ? "Yes" : "No"
                            }`}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Lease Cancellation Fee</h6>
                            {`$${currentLeaseTemplate.lease_cancellation_fee}`}
                          </div>
                          <div className="col-md-4 mb-4">
                            <h6>Lease Cancellation Notice period</h6>
                            {`${currentLeaseTemplate.lease_cancellation_notice_period} Month(s)`}
                          </div>
                          <div className="col-md-4 mb-4 text-black">
                            <h6>Grace period</h6>
                            {currentLeaseTemplate.grace_period === 0 ? (
                              "None"
                            ) : (
                              <>{`${currentLeaseTemplate.grace_period} Month(s)`}</>
                            )}
                          </div>
                          {!isOccupied && (
                            <UIButton
                              sx={{
                                textTransform: "none",
                                background: uiGreen,
                                color: "white",
                                marginTop: "1rem",
                              }}
                              onClick={() => setShowLeaseTemplateSelector(true)}
                              btnText="Assign Lease Template"
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <UIPrompt
                            icon={
                              <IntegrationInstructionsIcon style={iconStyles} />
                            }
                            title="No Lease Template Assigned"
                            message="You have not assigned a lease template to this unit. Click the button below to assign a lease template."
                            hideBoxShadow={true}
                            body={
                              <>
                                {!isOccupied && (
                                  <UIButton
                                    sx={{
                                      textTransform: "none",
                                      background: uiGreen,
                                      color: "white",
                                      marginTop: "1rem",
                                    }}
                                    onClick={() =>
                                      setShowLeaseTemplateSelector(true)
                                    }
                                    btnText="Assign Lease Template"
                                  />
                                )}
                              </>
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {tabPage === 4 && (
              <>
                <div className="col-md-12">
                  <FileManagerView
                    files={unitMedia}
                    subfolder={`properties/${property_id}/units/${unit_id}`}
                    acceptedFileTypes={[".png", ".jpg", ".jpeg"]}
                  />
                </div>
              </>
            )}
            {tabPage === 5 && (
              <div>
                {isOccupied ? (
                  <UIPrompt
                    icon={<DescriptionIcon style={iconStyles} />}
                    title="Rental Applications Unavailable"
                    message="Rental Applications cannot be submitted to an occupied unit"
                  />
                ) : (
                  <>
                    {isMobile ? (
                      <UITableMobile
                        testRowIdentifier={"unit-rental-application-row"}
                        data={rentalApplications}
                        tableTitle={"Rental Applications"}
                        // endpoint={`/units/${unit_id}/rental-applications/`}
                        createInfo={(row) =>
                          `${row.first_name} ${row.last_name}`
                        }
                        createTitle={(row) => `${row.unit.name}`}
                        createSubtitle={(row) =>
                          `${row.is_approved ? "Approved" : "Pending"}`
                        }
                        onRowClick={(row) => {
                          const navlink = `/dashboard/landlord/rental-applications/${row.id}`;
                          navigate(navlink);
                        }}
                      />
                    ) : (
                      <UITable
                        title="Rental Applications"
                        columns={rental_application_table_columns}
                        options={rental_application_table_options}
                        data={rentalApplications}
                        menuOptions={[
                          {
                            name: "View",
                            onClick: (rowData) => {
                              const navlink = `/dashboard/landlord/rental-applications/${rowData.id}`;
                              navigate(navlink);
                            },
                          },
                        ]}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ManageUnit;
