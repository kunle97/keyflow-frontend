import { getOwnerPreferences, updateOwnerPreferences } from "../api/owners";
import { getTenantPreferences, updateTenantPreferences } from "../api/tenants";
import { authUser } from "../constants";
import { defaultLandlordAccountPreferences } from "../constants/landlord_account_preferences";
import { defaultTenantAccountPreferences } from "../constants/tenant_account_preferences";
import { defaultPropertyPreferences } from "../constants/rental_property_preferences";
import { defaultRentalUnitPreferences } from "../constants/rental_unit_preferences";
import { defaultPortfolioPreferences } from "../constants/portfolio_preferences";
import { defaultStaffAccountPrivileges } from "../constants/staff_privileges";
import { getUnit, updateUnit } from "../api/units";
import { getProperty, updatePropertyMedia } from "../api/properties";
import { getPortfolio, updatePortfolio } from "../api/portfolios";
import { updateStaffPrivileges } from "../api/staff";
import { getLandlordStaffMember } from "../api/landlords";

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
export const syncRentalUnitPreferences = (unit_id) => {
  let resourcePreferences = [];

  //Retrieve the rental unit preferences from the database using the getUnit function.
  getUnit(unit_id).then((response) => {
    resourcePreferences = JSON.parse(response.preferences);

    // Check if the resource preferences have the same preferences as the default preferences by matching the name key of each preference.
    defaultRentalUnitPreferences.forEach((defaultPreference) => {
      if (
        !resourcePreferences.some(
          (resourcePreference) =>
            resourcePreference.name === defaultPreference.name
        )
      ) {
        resourcePreferences.push(defaultPreference);
      }
    });
    //Remove the preferences from the resource preferences that are not in the default preferences.
    resourcePreferences = resourcePreferences.filter((resourcePreference) =>
      defaultRentalUnitPreferences.some(
        (defaultPreference) =>
          defaultPreference.name === resourcePreference.name
      )
    );

    console.log("Syncing Rental Unit Preferences...", resourcePreferences);

    // Update the rental unit's preferences in the database with the resource preferences using the updateUnit function.
    updateUnit(unit_id, {
      preferences: JSON.stringify(resourcePreferences),
    }).then((response) => {
      console.log(response);
    });
  });
};

export const syncPropertyPreferences = (property_id) => {
  let resourcePreferences = [];

  //Retrieve the property preferences from the database using the getProperty function.
  getProperty(property_id).then((response) => {
    resourcePreferences = JSON.parse(response.data.preferences);

    // Check if the resource preferences have the same preferences as the default preferences by matching the name key of each preference.
    defaultPropertyPreferences.forEach((defaultPreference) => {
      if (
        !resourcePreferences.some(
          (resourcePreference) =>
            resourcePreference.name === defaultPreference.name
        )
      ) {
        resourcePreferences.push(defaultPreference);
      }
    });
    //Remove the preferences from the resource preferences that are not in the default preferences.
    resourcePreferences = resourcePreferences.filter((resourcePreference) =>
      defaultPropertyPreferences.some(
        (defaultPreference) =>
          defaultPreference.name === resourcePreference.name
      )
    );

    console.log("Syncing Property Preferences...", resourcePreferences);

    // Update the property's preferences in the database with the resource preferences using the updatePropertyMedia function.
    updatePropertyMedia(property_id, {
      preferences: JSON.stringify(resourcePreferences),
    }).then((response) => {
      console.log(response);
    });
  });
};
export const syncPortfolioPreferences = (portfolio_id) => {
  let resourcePreferences = [];

  //Retrieve the portfolio preferences from the database using the getPortfolio function.
  getPortfolio(portfolio_id).then((response) => {
    resourcePreferences = JSON.parse(response.data.preferences);

    // Check if the resource preferences have the same preferences as the default preferences by matching the name key of each preference.
    defaultPortfolioPreferences.forEach((defaultPreference) => {
      if (
        !resourcePreferences.some(
          (resourcePreference) =>
            resourcePreference.name === defaultPreference.name
        )
      ) {
        resourcePreferences.push(defaultPreference);
      }
    });
    //Remove the preferences from the resource preferences that are not in the default preferences.
    resourcePreferences = resourcePreferences.filter((resourcePreference) =>
      defaultPortfolioPreferences.some(
        (defaultPreference) =>
          defaultPreference.name === resourcePreference.name
      )
    );

    console.log("Syncing Portfolio Preferences...", resourcePreferences);

    // Update the portfolio's preferences in the database with the resource preferences using the updatePortfolio function.
    updatePortfolio(portfolio_id, {
      preferences: JSON.stringify(resourcePreferences),
    }).then((response) => {
      console.log(response);
    });
  });
};

export const syncStaffAccountPrivileges = (staff_id) => {
  let staffAccountPrivileges = [];

  getLandlordStaffMember(staff_id).then((res) => {
    staffAccountPrivileges = JSON.parse(res.data.privileges);
    // Check if the current user preferences have the same preferences as the default preferences by matching the name key of each preference.
    // If the key exists, do nothing. If the current user preferences do not have a preference that is in the default preferences, add the preference to the current user preferences.
    defaultStaffAccountPrivileges.forEach((defaultPrivilege) => {
      if (
        !staffAccountPrivileges.some(
          (staffPrivilege) => staffPrivilege.name === defaultPrivilege.name
        )
      ) {
        staffAccountPrivileges.push(defaultPrivilege);
      }
    });
  
    // Remove the privileges from the staff account privileges that are not in the default privileges.
    staffAccountPrivileges = staffAccountPrivileges.filter((staffPrivilege) =>
      defaultStaffAccountPrivileges.some(
        (defaultPrivilege) => defaultPrivilege.name === staffPrivilege.name
      )
    );
  
    console.log("Syncing Staff Account Privileges...", staffAccountPrivileges);
  
    // Update the staff member's account privileges in the database with the staff account privileges using the updateStaffAccountPrivileges function.
    updateStaffPrivileges({
      staff_id: staff_id,
      privileges: JSON.stringify(staffAccountPrivileges),
    }).then((response) => {
      console.log(response);
    });

  });
};
