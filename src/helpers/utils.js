
import DashboardContainer from "../components/Dashboard/DashboardContainer";

//Create a fucntion to surround a component with the DashboardContainer
export function withDashboardContainer(Component) {
  return <DashboardContainer>{Component}</DashboardContainer>;
}

//Convert "string boolean" to actual boolean
export function stringToBoolean(string) {
  switch (string.toLowerCase().trim()) {
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
      return Boolean(string);
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
      tenant.first_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      tenant.last_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchValue.toLowerCase())
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
  if (tenant.id === maintenance_request.tenant) {
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
  const filenameWithExtension = url.substring(url.lastIndexOf('/') + 1);

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

