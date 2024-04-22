import { getOwnerPreferences, updateOwnerPreferences } from "../api/owners";
import { getTenantPreferences, updateTenantPreferences } from "../api/tenants";
import { authUser } from "../constants";
import { defaultLandlordAccountPreferences } from "../constants/landlord_account_preferences";
import { defaultTenantAccountPreferences } from "../constants/tenant_account_preferences";
export const syncPreferences = async () => {
  let currentUserPreferences = [];

  if (authUser.account_type === "owner") {
    getOwnerPreferences().then((response) => {
      currentUserPreferences = response.preferences;

      // Check if the current user preferences have the same preferences as the default preferences by matching the name key of each preference.
      // If the key exists, do nothing. If the current user preferences do not have a preference that is in the default preferences, add the preference to the current user preferences.
      defaultLandlordAccountPreferences.forEach((defaultPreference) => {
        if (
          !currentUserPreferences.some(
            (userPreference) => userPreference.name === defaultPreference.name
          )
        ) {
          currentUserPreferences.push(defaultPreference);
        }
      });

      // Remove the preferences from the current user preferences that are not in the default preferences.
      currentUserPreferences = currentUserPreferences.filter((userPreference) =>
        defaultLandlordAccountPreferences.some(
          (defaultPreference) => defaultPreference.name === userPreference.name
        )
      );

      console.log("Syncing Preferences...", currentUserPreferences);

      // Update the user's preferences in the database with the current user preferences using the updateOwnerPreferences function.
      updateOwnerPreferences({ preferences: currentUserPreferences }).then(
        (response) => {
          console.log(response);
        }
      );
    });
  } else if (authUser.account_type === "tenant") {
    getTenantPreferences().then((response) => {
      currentUserPreferences = response.preferences;

      // Check if the current user preferences have the same preferences as the default preferences by matching the name key of each preference.
      // If the key exists, do nothing. If the current user preferences do not have a preference that is in the default preferences, add the preference to the current user preferences.
      defaultTenantAccountPreferences.forEach((defaultPreference) => {
        if (
          !currentUserPreferences.some(
            (userPreference) => userPreference.name === defaultPreference.name
          )
        ) {
          currentUserPreferences.push(defaultPreference);
        }
      });
      // Remove the preferences from the current user preferences that are not in the default preferences.
      currentUserPreferences = currentUserPreferences.filter((userPreference) =>
        defaultTenantAccountPreferences.some(
          (defaultPreference) => defaultPreference.name === userPreference.name
        )
      );

      console.log("Syncing Preferences...", currentUserPreferences);

        // Update the user's preferences in the database with the current user preferences using the updateTenantPreferences function.
        updateTenantPreferences({ preferences: currentUserPreferences }).then(
            (response) => {
                console.log(response);
            }
        );
    });
  }
};
