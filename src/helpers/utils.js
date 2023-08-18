import DashboardContainer from "../components/Dashboard/DashboardContainer";

//Create a fucntion to surround a component with the DashboardContainer
export function withDashboardContainer(Component) {
    return (
      <DashboardContainer>
        {Component}
      </DashboardContainer>
    );
}
