import React, { useEffect, useState } from "react";
import UIButton from "../../../UIComponents/UIButton";
import ConfirmModal from "../../../UIComponents/Modals/ConfirmModal";
import {
  authUser,
  token,
  uiGreen,
  uiRed,
  validationMessageStyle,
} from "../../../../../constants";
import UIPrompt from "../../../UIComponents/UIPrompt";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import {
  deleteStripePaymentMethod,
  listOwnerStripePaymentMethods,
  setOwnerDefaultPaymentMethod,
} from "../../../../../api/payment_methods";
import AddCardIcon from "@mui/icons-material/AddCard";
import { getUserStripeSubscriptions } from "../../../../../api/auth";
import SubscriptionCard from "./SectionRows/Subscriptions/SubscriptionCard";
import UsageCard from "./SectionRows/Usage/UsageCard";
import PaymentMethodsSection from "./SectionRows/PaymentMethods/PaymentMethodsSection";
import UITable from "../../../UIComponents/UITable/UITable";
import UIProgressPrompt from "../../../UIComponents/UIProgressPrompt";
import {
  getOwnerSubscriptionPlanData,
  getOwnerUsageStats,
} from "../../../../../api/owners";
import { getSubscriptionPlanPrices } from "../../../../../api/manage_subscriptions";
import ApartmentIcon from "@mui/icons-material/ApartmentOutlined"; // Rental Units icon
import HomeWorkIcon from "@mui/icons-material/HomeWorkOutlined"; // Rental Properties icon
import PeopleAltIcon from "@mui/icons-material/PeopleAltOutlined"; //Tenants icon
import DescriptionIcon from "@mui/icons-material/DescriptionOutlined"; //LEase Agreements icon
import DocumentScannerIcon from "@mui/icons-material/DocumentScannerOutlined"; //Lease Templates icon
import FileUploadIcon from "@mui/icons-material/FileUploadOutlined"; //File Uploads icon
import SubscriptionSection from "./SectionRows/Subscriptions/SubscriptionSection";

const BillingSubscriptionsSection = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [usageStats, setUsageStats] = useState({});
  const [ownerSubscriptionPlanData, setOwnerSubscriptionPlanData] = useState(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseTitle, setResponseTitle] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState(null);
  const billing_history_columns = [
    { label: "Invoice ID", name: "id" },
    { label: "Amount", name: "amount" },
    { label: "Date", name: "timestamp" },
    { label: "Status", name: "status" },
  ];
  const billing_history_options = {
    isSelectable: false,
    onRowClick: (row) => {
      let navlink = "/";
      navlink = `/dashboard/owner/billing/invoice/${row.id}`;
      navigate(navlink);
    },
  };
  useEffect(() => {
    setIsLoading(true);
    try {
      getSubscriptionPlanPrices()
        .then((res) => {
          console.log("Subscription Plans: ", res.products);
          setPlans(res.products);
        })
        .catch((error) => {
          console.log("Error getting subscription plans: ", error);
          setResponseTitle("Error");
          setResponseMessage("Error getting subscription plans");
          setShowResponseModal(true);
        });
      getUserStripeSubscriptions(authUser.id, token).then((res) => {
        console.log("Current Subscription Plan: ", res.subscriptions);
        setCurrentSubscriptionPlan(res.subscriptions);
      });
      getOwnerUsageStats().then((res) => {
        console.log("Usage Stats: ", res);
        setUsageStats(res);
      });
      getOwnerSubscriptionPlanData().then((res) => {
        console.log("Subscription Plan Data: ", res);
        setOwnerSubscriptionPlanData(res);
      });
      console.log("Owner Subscription Plan Data: ", currentSubscriptionPlan);
    } catch (error) {
      console.error("Error getting subscription plans:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <UIProgressPrompt
          title="Loading Subscription Information..."
          message="Please wait while we load your subscription information."
        />
      ) : (
        <div>
          <div className="billing-section mb-4">
            <div className="billing-section-heading mb-4">
              <h4>Manage Subscription</h4>
              <span className="text-muted">Update your current billing</span>
            </div>
            <SubscriptionSection />
          </div>
          <div className="billing-section mb-4">
            <div className="billing-section-heading mb-4">
              <h4>Usage</h4>
              <span className="text-muted">Update your current billing</span>

              <div className="row">
                <div className="col-md-4 col-sm-12 mb-3 py-3 ">
                  <UsageCard
                    usageTitle="Rental Properties"
                    usageCount={usageStats.rental_properties}
                    usageTotal={
                      ownerSubscriptionPlanData?.plan_data
                        ?.max_rental_properties
                    }
                    isUnlimited={
                      ownerSubscriptionPlanData?.plan_data
                        ?.max_rental_properties >= 99999
                        ? true
                        : false
                    }
                    icon={
                      <HomeWorkIcon sx={{ fontSize: "30pt", color: uiGreen }} />
                    }
                  />
                </div>
                <div className="col-md-4 col-sm-12 mb-3 py-3 ">
                  <UsageCard
                    usageTitle="Rental Units"
                    usageCount={usageStats.rental_units}
                    usageTotal={
                      ownerSubscriptionPlanData?.plan_data?.max_rental_units
                    }
                    isUnlimited={
                      ownerSubscriptionPlanData?.plan_data?.max_rental_units >=
                      99999
                        ? true
                        : false
                    }
                    icon={
                      <ApartmentIcon
                        sx={{ fontSize: "30pt", color: uiGreen }}
                      />
                    }
                  />
                </div>
                <div className="col-md-4 col-sm-12 mb-3 py-3 ">
                  <UsageCard
                    usageTitle="Tenants"
                    usageCount={usageStats.tenants}
                    usageTotal={
                      ownerSubscriptionPlanData?.plan_data?.max_rental_units
                    }
                    isUnlimited={
                      ownerSubscriptionPlanData?.plan_data?.max_tenants >= 99999
                        ? true
                        : false
                    }
                    icon={
                      <PeopleAltIcon
                        sx={{ fontSize: "30pt", color: uiGreen }}
                      />
                    }
                  />
                </div>
                <div className="col-md-4 col-sm-12 mb-3 py-3 ">
                  <UsageCard
                    usageTitle="Lease Agreements"
                    usageCount={usageStats.lease_agreements}
                    usageTotal={
                      ownerSubscriptionPlanData?.plan_data?.max_lease_agreements
                    }
                    isUnlimited={
                      ownerSubscriptionPlanData?.plan_data
                        ?.max_lease_agreements >= 99999
                        ? true
                        : false
                    }
                    icon={
                      <DescriptionIcon
                        sx={{ fontSize: "30pt", color: uiGreen }}
                      />
                    }
                  />
                </div>
                <div className="col-md-4 col-sm-12 mb-3 py-3 ">
                  <UsageCard
                    usageTitle="Lease Templates"
                    usageCount={usageStats.lease_templates}
                    usageTotal={
                      ownerSubscriptionPlanData?.plan_data?.max_lease_templates
                    }
                    isUnlimited={
                      ownerSubscriptionPlanData?.plan_data
                        ?.max_lease_templates >= 99999
                        ? true
                        : false
                    }
                    icon={
                      <DocumentScannerIcon
                        sx={{ fontSize: "30pt", color: uiGreen }}
                      />
                    }
                  />
                </div>
                <div className="col-md-4 col-sm-12 mb-3 py-3 ">
                  <UsageCard
                    usageTitle="File Uploads"
                    usageCount={usageStats.file_uploads}
                    usageTotal={
                      ownerSubscriptionPlanData?.plan_data?.max_file_uploads
                    }
                    isUnlimited={
                      ownerSubscriptionPlanData?.plan_data?.max_file_uploads >=
                      99999
                        ? true
                        : false
                    }
                    usageDescription="Total Rentals Description"
                    icon={
                      <FileUploadIcon
                        sx={{ fontSize: "30pt", color: uiGreen }}
                      />
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="billing-section mb-4">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{
                mb: 2,
              }}
            >
              <div className="billing-section-heading mb-4">
                <h4>Payment Methods</h4>
                <span className="text-muted">Manage your payment methods</span>
              </div>
              <div className="mb-3" style={{ overflow: "auto" }}>
                <UIButton
                  style={{ float: "right" }}
                  onClick={() => {
                    // setOpenAddPaymentMethodModal(true);
                  }}
                  btnText="Add New"
                />
              </div>
            </Stack>
            <PaymentMethodsSection />
          </div>

          {/* <div className="billing-section mb-4">
            <div className="billing-section-heading mb-4">
              <h4>Billing History</h4>
              <span className="text-muted">
                View and download your billing invoice
              </span>
            </div>

            <UITable
              columns={billing_history_columns}
              data={[
                {
                  id: "INV-1234",
                  amount: "$9.99",
                  timestamp: "2021-10-10",
                  status: "Paid",
                },
              ]}
              options={billing_history_options}
            />
          </div> */}
        </div>
      )}
    </>
  );
};

export default BillingSubscriptionsSection;
