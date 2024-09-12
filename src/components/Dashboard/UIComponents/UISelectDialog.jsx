import React, { useState, useEffect } from "react";
import UIDialog from "./Modals/UIDialog";

const UISelectDialog = (props) => {
  const [rentalUnitModalOpen, setRentalPropertyModalOpen] = useState(false);
  const [rentalUnitSearchQuery, setRentalUnitSearchQuery] = useState("");
  const [selectedRentalProperties, setSelectedRentalProperties] = useState([]);
  const [allUserRentalProperties, setAllUserRentalProperties] = useState([]);

  return (
    <div>
      <UIDialog
        dataTestId={"add-properties-dialog"}
        open={rentalUnitModalOpen}
        title="Select Rental Properties"
        onClose={() => setRentalPropertyModalOpen(false)}
        style={{ width: "500px" }}
      >
        {/* Create a search input using ui input */}
        <UIInput
          onChange={(e) => {
            setRentalUnitSearchQuery(e.target.value);
            handleSearchRentalProperties();
          }}
          type="text"
          placeholder="Search rental properties"
          inputStyle={{ margin: "10px 0" }}
          name="rental_property_search"
        />
        {/* Create a list of rental properties */}
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
          {allUserRentalProperties.map((property, index) => {
            return (
              <ListItem key={index} alignItems="flex-start" onClick={() => {}}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent={"space-between"}
                  alignContent={"center"}
                  alignItems={"center"}
                  sx={{ width: "100%" }}
                >
                  <UICheckbox
                    dataTestId={`rental-property-${index}-checkbox`}
                    onChange={(e) => {
                      let checked = e.target.checked;
                      handleSelectRentalProperty(property, checked);
                    }}
                    checked={selectedRentalProperties.find(
                      (prop) => prop.id === property.id
                    )}
                  />
                  <ListItemText primary={property.name} />
                </Stack>
              </ListItem>
            );
          })}
        </List>
        <Stack
          direction="row"
          spacing={2}
          justifyContent={"space-between"}
          alignContent={"center"}
          alignItems={"center"}
          sx={{ width: "100%" }}
        >
          {rentalPropertyPreviousPage && (
            <ButtonBase onClick={handlePreviousPageRentalUnitClick}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={0}
              >
                <IconButton style={{ color: uiGreen }}>
                  <ArrowBackOutlined />
                </IconButton>
                <span style={{ color: uiGreen }}>Prev</span>
              </Stack>
            </ButtonBase>
          )}
          <span></span>
          {rentalPropertyNextPage && (
            <ButtonBase onClick={handleNextPageRentalUnitClick}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={0}
              >
                <span style={{ color: uiGreen }}>Next</span>
                <IconButton style={{ color: uiGreen }}>
                  <ArrowForwardIcon />
                </IconButton>
              </Stack>
            </ButtonBase>
          )}
        </Stack>
        <UIButton
          dataTestId="add-properties-dialog-save-button"
          btnText="Save"
          onClick={() => {
            let selectedProperties = JSON.stringify(
              selectedRentalProperties.map((property) => property.id)
            );

            setIsLoading(true);
            try {
              let payload = {
                properties: selectedProperties,
                portfolio: id,
              };

              updatePortfolioProperties(payload)
                .then((res) => {
                  if (res.status !== 200) {
                    throw new Error("Error updating properties in portfolio");
                  }
                  setProperties(selectedRentalProperties);
                  setRentalPropertyModalOpen(false);
                  setAlertTitle("Success");
                  setAlertMessage(
                    "Properties updated in portfolio successfully"
                  );
                  setAlertOpen(true);
                  setIsLoading(false);
                })
                .catch((error) => {
                  console.error("Error updating properties:", error);
                  setAlertTitle("Error");
                  setAlertMessage("Error updating properties in portfolio");
                  setAlertOpen(true);
                  setIsLoading(false);
                });
            } catch (e) {
              setAlertTitle("Error");
              setAlertMessage(
                "There was an error adding the properties to the portfolio. Please try again."
              );
              setAlertOpen(true);
            } finally {
              setIsLoading(false);
            }
          }}
        />
      </UIDialog>
    </div>
  );
};

export default UISelectDialog;
