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
