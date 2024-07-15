import {
  authenticatedMediaInstance,
  unauthenticatedInstance,
} from "../api/api";
import { updateUnit } from "../api/units";
import DashboardContainer from "../components/Dashboard/DashboardContainer";

//Create a fucntion to surround a component with the DashboardContainer
export function withDashboardContainer(Component) {
  return <DashboardContainer>{Component}</DashboardContainer>;
}

//Convert "string boolean" to actual boolean
export function stringToBoolean(value) {
  //Check if value is a string
  if (typeof value !== "string") {
    return value;
  }

  switch (value.toLowerCase().trim()) {
    case "true":
    case "yes":
    case "1":
      return true;
    case "false":
    case "no":
    case "0":
    case null:
      return false;
    default:
      return Boolean(value);
  }
}

export function makeId(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
//Create a filter function to filter the tenants based on the search value
export const filterTenants = (tenants, searchValue) => {
  return tenants.filter((tenant) => {
    return (
      tenant.user?.first_name
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      tenant.user?.last_name
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      tenant.user?.email?.toLowerCase().includes(searchValue.toLowerCase())
    );
  });
};
//Create a filter function for dashboard pages based on the search value
export const filterDashboardPages = (dashboardPages, searchValue) => {
  return dashboardPages.filter((page) => {
    if (page.isSearchable === true) {
      return page.label.toLowerCase().includes(searchValue.toLowerCase());
    }
  });
};

//Check if each array of units matches an array of properties
export const checkIfUnitMatchesProperty = (unit, property) => {
  if (unit.rental_property === property.id) {
    return true;
  } else {
    return false;
  }
};
//Check if tenant matches a maintenance request
export const checkIfTenantMatchesMaintenanceRequest = (
  tenant,
  maintenance_request
) => {
  if (tenant.id === maintenance_request.tenant.id) {
    return true;
  } else {
    return false;
  }
};

//Create a function to convert maintenance request statuses in_progress, completed, and pending to In Progress, Completed, and Pending
export const convertMaintenanceRequestStatus = (status) => {
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "pending":
      return "Pending";
    default:
      return status;
  }
};

export function extractFileNameAndExtension(url) {
  // Extract the part of the URL after the last '/'
  const filenameWithExtension = url.substring(url.lastIndexOf("/") + 1);

  // Use regex to separate the file name and extension
  const match = filenameWithExtension.match(/([^/?#]+)(\.[^./?#]+)($|\?)/);

  if (match && match.length >= 3) {
    const fileName = match[1]; // Extracted file name
    const extension = match[2]; // Extracted extension
    return { fileName, extension };
  } else {
    return null; // Return null if no match found
  }
}

export function removeTFromDate(date) {
  return date.toISOString().split("T")[0];
}

export const generateSimilarColor = (baseColor) => {
  // Assuming baseColor is in RGB format like uiGreen
  const [r, g, b] = baseColor.match(/\d+/g).map(Number);

  // You can adjust these values for slight variations
  const variation = 20; // Change this value for variation in color
  const randomR = Math.min(
    255,
    Math.max(0, r + Math.floor(Math.random() * variation))
  );
  const randomG = Math.min(
    255,
    Math.max(0, g + Math.floor(Math.random() * variation))
  );
  const randomB = Math.min(
    255,
    Math.max(0, b + Math.floor(Math.random() * variation))
  );

  return `rgb(${randomR}, ${randomG}, ${randomB})`;
};
export const generateVariedColors = (baseColor, numberOfColors) => {
  const [r, g, b] = baseColor.match(/\w\w/g).map((x) => parseInt(x, 16));

  const colors = [];
  const hueIncrement = 360 / numberOfColors;
  const lightnessIncrement = 20;

  for (let i = 0; i < numberOfColors; i++) {
    const hue = (i * hueIncrement) % 360;
    const lightness = 50 - (i * lightnessIncrement) / numberOfColors;

    // Convert HSL to RGB
    const hslToRgb = (h, s, l) => {
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let r = 0,
        g = 0,
        b = 0;

      if (h >= 0 && h < 60) {
        r = c;
        g = x;
      } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
      } else if (h >= 120 && h < 180) {
        g = c;
        b = x;
      } else if (h >= 180 && h < 240) {
        g = x;
        b = c;
      } else if (h >= 240 && h < 300) {
        r = x;
        b = c;
      } else if (h >= 300 && h < 360) {
        r = c;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return `rgb(${r}, ${g}, ${b})`;
    };

    const rgbColor = hslToRgb(hue, 1, lightness / 100);
    colors.push(rgbColor);
  }

  return colors;
};

export const removeUnderscoresAndCapitalize = (value) => {
  //remove the underscore from the value and capitalize the first letter of each word
  let newValue = value
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
  return newValue;
};

//Create a function to lowercase each word in a string and replace spaces with underscores
export const addUnderscoresAndLowercase = (value) => {
  //replace spaces with underscores and lowercase each word
  let newValue = value
    .toLowerCase()
    .replace(/\s/g, "_")
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toLowerCase()));
  return newValue;
};

//Create a function to check if file name is valid. It is only valid if it contains numbers, letters, underscores, and dashes. No special characters
export const isValidFileName = (file_name) => {
  console.log("File Name:", file_name); // Log the file name
  const regex = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)?$/;
  const isValid = regex.test(file_name);
  console.log("isValid name", isValid);
  return isValid;
};

//Create a function that checks the props.acceptedFileTypes array to see if the file extension is valid
export const isValidFileExtension = (file_name, acceptedFileTypes) => {
  console.log("File Name:", file_name); // Log the file name
  const file_extension = file_name.split(".").pop();
  console.log("File Extension:", file_extension); // Log the file extension
  const isValid = acceptedFileTypes.includes("." + file_extension);
  console.log("isValid extension", isValid);
  return isValid;
};

//Change LEase terms for a unit using a lease template
export const handleChangeLeaseTemplate = (
  leaseTemplates,
  lease_template_id,
  unit_lease_terms,
  unit_id
) => {
  let changeResponse = false;
  try {
    // set Current Lease Term
    let leaseTemplate = leaseTemplates.find(
      (term) => term.id === lease_template_id
    );

    // Set the unit leaseTerms to match the lease template
    const updatedUnitLeaseTerms = unit_lease_terms.map((leaseTerm) => {
      const leaseTermName = leaseTerm.name;

      // Check if the leaseTermName exists in both objects
      if (leaseTermName in leaseTemplate) {
        // Update the value from leaseTemplate
        leaseTerm.value = leaseTemplate[leaseTermName];
      }

      return leaseTerm;
    });

    // Update the unit with the new lease term with the API
    authenticatedMediaInstance
      .patch(`/units/${unit_id}/`, {
        lease_template: lease_template_id,
        lease_terms: JSON.stringify(updatedUnitLeaseTerms),
        template_id: leaseTemplate.template_id,
        signed_lease_document_file: null,
        signed_lease_document_metadata: null,
        additional_charges: leaseTemplate.additional_charges,
      })
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
          changeResponse = true;
          return changeResponse;
        }
      })
      .catch((error) => {
        console.log(error);
        changeResponse = false;
        return changeResponse;
      });
  } catch (err) {
    console.log("An error occured trying to change the lease template", err);
    changeResponse = false;
    return changeResponse;
  }
};
//Create a function that takes in an object of strings and a regex patern and returs if each string in the object matches the regex pattern
export const regexCheck = (strings, patterns) => {
  let matches = true;
  let i = 0;
  let errors = [];
  for (let key in strings) {
    if (!patterns[i].test(strings[key])) {
      matches = false;
      errors.push(key);
    }
    i++;
  }
  return { matches, errors };
};

// utils.js
export const isTokenExpired = () => {
  if (
    !localStorage.getItem("accessTokenExpirationDate") ||
    !localStorage.getItem("accessToken")
  ) {
    return true;
  }

  const expirationDate = localStorage.getItem("accessTokenExpirationDate");
  const currentDate = new Date();
  const expirationDateObject = new Date(expirationDate);

  return currentDate > expirationDateObject;
};

export const clearLocalStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("accessTokenExpirationDate");
  localStorage.removeItem("authUser");
  localStorage.removeItem("stripe_onoboarding_link");
  localStorage.removeItem("subscriptionPlan");
  localStorage.removeItem("ownerData");
  localStorage.removeItem("tenantData");
};

export const validateToken = async () => {
  let isValid = false;
  try {
    const res = await unauthenticatedInstance.post("/auth/validate-token/", {
      token: localStorage.getItem("accessToken"),
    });
    console.log(res);
    isValid = res.data.isValid;
    return res;
  } catch (error) {
    console.error("Validate Token Error: ", error);
    return error.response;
  }
};

//Create a function taht abbrieveiates rent frequescies for example "monthly" to "mo" and "yearly" to "yr" etc
export const abbreviateRentFrequency = (frequency) => {
  switch (frequency) {
    case "monthly":
    case "month":
      return "mo";
    case "yearly":
    case "year":
      return "yr";
    case "weekly":
    case "week":
      return "wk";
    case "daily":
    case "day":
      return "dy"; // Adjusted for abbreviation consistency
    default:
      return frequency;
  }
};

//A function to warn the user before leaving/refreshing the page
export const preventPageReload = (e) => {
  const handleBeforeUnload = (event) => {
    const message =
      "Are you sure you want to leave? You may lose unsaved changes.";
    event.returnValue = message; // Standard way of setting a warning message
    return message; // Some browsers may use this
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
};

export const formatDateToMMDDYYYY = (date) => {
  return new Date(date).toLocaleDateString("en-US");
};

export const isValidStripePaymentMethod = (paymentMethod) => {
  // Check if the payment method is a card
  if (paymentMethod.type !== "card") {
    return false;
  }

  const { card } = paymentMethod;
  const { exp_month, exp_year, checks, three_d_secure_usage } = card;

  // Check if the card is expired
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-based

  if (
    exp_year < currentYear ||
    (exp_year === currentYear && exp_month < currentMonth)
  ) {
    return false;
  }

  // Check if CVC is checked
  if (checks.cvc_check !== "pass") {
    return false;
  }

  // Check if 3D Secure is supported
  if (!three_d_secure_usage.supported) {
    return false;
  }

  return true;
};
