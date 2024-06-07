import { getOwnerPreferences, updateOwnerPreferences } from "../api/owners";
import { getTenantPreferences, updateTenantPreferences } from "../api/tenants";
import { authUser } from "../constants";
import { defaultRentalUnitLeaseTerms } from "../constants/lease_terms";
import { defaultOwnerAccountPreferences } from "../constants/owner_account_preferences";
import { defaultTenantAccountPreferences } from "../constants/tenant_account_preferences";
import { defaultPropertyPreferences } from "../constants/rental_property_preferences";
import { defaultRentalUnitPreferences } from "../constants/rental_unit_preferences";
import { defaultPortfolioPreferences } from "../constants/portfolio_preferences";
import { getUnit, updateUnit } from "../api/units";
import { getProperty, updatePropertyMedia } from "../api/properties";
import { getPortfolio, updatePortfolio } from "../api/portfolios";

// Helper function to get preferences based on account type
const getPreferences = async (accountType) => {
  if (accountType === "owner") {
    return await getOwnerPreferences();
  } else if (accountType === "tenant") {
    return await getTenantPreferences();
  }
  return { preferences: [] };
};

// Helper function to get default preferences based on account type
const getDefaultPreferences = (accountType) => {
  if (accountType === "owner") {
    return defaultOwnerAccountPreferences;
  } else if (accountType === "tenant") {
    return defaultTenantAccountPreferences;
  }
  return [];
};

// Function to sync fields between userPreference and defaultPreference
const syncPreferenceFields = (userPreference, defaultPreference) => {
  const updatedPreference = { ...userPreference };

  // Add any missing keys from defaultPreference to userPreference
  Object.keys(defaultPreference).forEach((key) => {
    if (!updatedPreference.hasOwnProperty(key)) {
      updatedPreference[key] = defaultPreference[key];
    }
  });

  //Remove any extra keys from userPreference that are not in defaultPreference
  Object.keys(updatedPreference).forEach((key) => {
    if (!defaultPreference.hasOwnProperty(key)) {
      delete updatedPreference[key];
    }
  });

  // Update fields in the values array only if it is the inputType or the label
  if (defaultPreference.values) {
    const updatedValues = (userPreference.values || []).map((value) => {
      const defaultValue = defaultPreference.values.find(
        (defaultValue) => defaultValue.name === value.name
      );
      if (defaultValue) {
        return {
          ...value,
          inputType: defaultValue.inputType,
          label: defaultValue.label,
        };
      }
      return value;
    });

    updatedPreference.values = updatedValues;
  }

  // Update the main fields
  return {
    ...updatedPreference,
    type: defaultPreference.type,
    label: defaultPreference.label,
    hidden: defaultPreference.hidden,
    description: defaultPreference.description,
  };
};

// Function to sync user preferences with default preferences
const syncUserPreferences = (userPreferences, defaultPreferences) => {
  // Add any missing preferences from defaultPreferences to userPreferences
  defaultPreferences.forEach((defaultPreference) => {
    if (!userPreferences.some((pref) => pref.name === defaultPreference.name)) {
      userPreferences.push(defaultPreference);
    }
  });

  // Sync each userPreference with its corresponding defaultPreference
  let syncedPreferences = userPreferences.map((userPreference) => {
    const defaultPreference = defaultPreferences.find(
      (pref) => pref.name === userPreference.name
    );
    return defaultPreference
      ? syncPreferenceFields(userPreference, defaultPreference)
      : userPreference;
  });

  // Remove preferences from userPreferences that are not in defaultPreferences
  syncedPreferences = syncedPreferences.filter((userPreference) =>
    defaultPreferences.some(
      (defaultPreference) => defaultPreference.name === userPreference.name
    )
  );

  return syncedPreferences;
};

// Main function to sync preferences based on account type
export const syncPreferences = async () => {
  const accountType = authUser.account_type; // Get the current user's account type
  const response = await getPreferences(accountType); // Get the current user's preferences
  let currentUserPreferences = response.preferences;

  const defaultPreferences = getDefaultPreferences(accountType); // Get the default preferences for the account type
  currentUserPreferences = syncUserPreferences(
    currentUserPreferences,
    defaultPreferences
  ); // Sync the current user's preferences with the default preferences

  console.log("Syncing Preferences...", currentUserPreferences); // Log the synced preferences

  // Update the user's preferences in the database based on account type
  if (accountType === "owner") {
    const response = await updateOwnerPreferences({
      preferences: currentUserPreferences,
    });
    console.log(response);
  } else if (accountType === "tenant") {
    const response = await updateTenantPreferences({
      preferences: currentUserPreferences,
    });
    console.log(response);
  }
};

///----------END OF SYNC PREFERENCES FUNCTION-----------------////

export const syncRentalUnitPreferences = (unit_id) => {
  let resourcePreferences = [];

  // Retrieve the rental unit preferences from the database using the getUnit function.
  getUnit(unit_id).then((response) => {
    resourcePreferences = JSON.parse(response.preferences);

    // Add missing preferences from defaultRentalUnitPreferences
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

    // Remove preferences from resourcePreferences that are not in defaultRentalUnitPreferences
    resourcePreferences = resourcePreferences.filter((resourcePreference) =>
      defaultRentalUnitPreferences.some(
        (defaultPreference) =>
          defaultPreference.name === resourcePreference.name
      )
    );

    // Update preferences with the default preferences' properties
    resourcePreferences = resourcePreferences.map((resourcePreference) => {
      const defaultPreference = defaultRentalUnitPreferences.find(
        (defaultPreference) =>
          defaultPreference.name === resourcePreference.name
      );

      if (defaultPreference) {
        // Add or update keys with the default preference's properties
        Object.keys(defaultPreference).forEach((key) => {
          if (!resourcePreference.hasOwnProperty(key)) {
            resourcePreference[key] = defaultPreference[key];
          }
        });
        //Remove any extra keys from resourcePreference that are not in defaultPreference
        Object.keys(resourcePreference).forEach((key) => {
          if (!defaultPreference.hasOwnProperty(key)) {
            delete resourcePreference[key];
          }
        });

        // Ensure the main fields are updated
        return {
          ...resourcePreference,
          description: defaultPreference.description,
          type: defaultPreference.type,
          inputType: defaultPreference.inputType,
          label: defaultPreference.label,
        };
      }

      return resourcePreference;
    });

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

  // Retrieve the property preferences from the database using the getProperty function.
  getProperty(property_id).then((response) => {
    resourcePreferences = JSON.parse(response.data.preferences);

    // Add missing preferences from defaultPropertyPreferences
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

    // Remove preferences from resourcePreferences that are not in defaultPropertyPreferences
    resourcePreferences = resourcePreferences.filter((resourcePreference) =>
      defaultPropertyPreferences.some(
        (defaultPreference) =>
          defaultPreference.name === resourcePreference.name
      )
    );

    // Update preferences with the default preferences' properties
    resourcePreferences = resourcePreferences.map((resourcePreference) => {
      const defaultPreference = defaultPropertyPreferences.find(
        (defaultPreference) =>
          defaultPreference.name === resourcePreference.name
      );

      if (defaultPreference) {
        // Add or update keys with the default preference's properties
        Object.keys(defaultPreference).forEach((key) => {
          if (!resourcePreference.hasOwnProperty(key)) {
            resourcePreference[key] = defaultPreference[key];
          }
        });
        //Remove keys that are not found in the default preference
        Object.keys(resourcePreference).forEach((key) => {
          if (!defaultPreference.hasOwnProperty(key)) {
            delete resourcePreference[key];
          }
        });
        
        // Ensure the main fields are updated
        return {
          ...resourcePreference,
          description: defaultPreference.description,
          type: defaultPreference.type,
          inputType: defaultPreference.inputType,
          label: defaultPreference.label,
        };
      }

      return resourcePreference;
    });

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

  // Retrieve the portfolio preferences from the database using the getPortfolio function.
  getPortfolio(portfolio_id).then((response) => {
    resourcePreferences = JSON.parse(response.data.preferences);

    // Add missing preferences from defaultPortfolioPreferences
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

    // Remove preferences from resourcePreferences that are not in defaultPortfolioPreferences
    resourcePreferences = resourcePreferences.filter((resourcePreference) =>
      defaultPortfolioPreferences.some(
        (defaultPreference) =>
          defaultPreference.name === resourcePreference.name
      )
    );

    // Update preferences with the default preferences' properties
    resourcePreferences = resourcePreferences.map((resourcePreference) => {
      const defaultPreference = defaultPortfolioPreferences.find(
        (defaultPreference) =>
          defaultPreference.name === resourcePreference.name
      );

      if (defaultPreference) {
        // Add or update keys with the default preference's properties
        Object.keys(defaultPreference).forEach((key) => {
          if (!resourcePreference.hasOwnProperty(key)) {
            resourcePreference[key] = defaultPreference[key];
          }
        });

        // Remove keys that are not in the default preference
        Object.keys(resourcePreference).forEach((key) => {
          if (!defaultPreference.hasOwnProperty(key)) {
            delete resourcePreference[key];
          }
        });

        // Ensure the main fields are updated
        return {
          ...resourcePreference,
          description: defaultPreference.description,
          type: defaultPreference.type,
          inputType: defaultPreference.inputType,
          label: defaultPreference.label,
        };
      }

      return resourcePreference;
    });

    console.log("Syncing Portfolio Preferences...", resourcePreferences);

    // Update the portfolio's preferences in the database with the resource preferences using the updatePortfolio function.
    updatePortfolio(portfolio_id, {
      preferences: JSON.stringify(resourcePreferences),
    }).then((response) => {
      console.log(response);
    });
  });
};

export const syncRentalUnitLeaseTerms = (unit_id) => {
  let resourceLeaseTerms = [];

  getUnit(unit_id).then((response) => {
    resourceLeaseTerms = JSON.parse(response.lease_terms);

    defaultRentalUnitLeaseTerms.forEach((defaultLeaseTerm) => {
      if (
        !resourceLeaseTerms.some(
          (resourceLeaseTerm) =>
            resourceLeaseTerm.name === defaultLeaseTerm.name
        )
      ) {
        resourceLeaseTerms.push(defaultLeaseTerm);
      }
    });

    resourceLeaseTerms = resourceLeaseTerms.filter((resourceLeaseTerm) =>
      defaultRentalUnitLeaseTerms.some(
        (defaultLeaseTerm) => defaultLeaseTerm.name === resourceLeaseTerm.name
      )
    );

    resourceLeaseTerms = resourceLeaseTerms.map((resourceLeaseTerm) => {
      const defaultLeaseTerm = defaultRentalUnitLeaseTerms.find(
        (defaultLeaseTerm) => defaultLeaseTerm.name === resourceLeaseTerm.name
      );

      if (defaultLeaseTerm) {
        Object.keys(defaultLeaseTerm).forEach((key) => {
          if (!resourceLeaseTerm.hasOwnProperty(key)) {
            resourceLeaseTerm[key] = defaultLeaseTerm[key];
          }
        });

        Object.keys(resourceLeaseTerm).forEach((key) => {
          if (!defaultLeaseTerm.hasOwnProperty(key)) {
            delete resourceLeaseTerm[key];
          }
        });

        return {
          ...resourceLeaseTerm,
          description: defaultLeaseTerm.description,
          type: defaultLeaseTerm.type,
          inputType: defaultLeaseTerm.inputType,
          label: defaultLeaseTerm.label,
        };
      }

      return resourceLeaseTerm;
    });

    console.log("Syncing Rental Unit Lease Terms...", resourceLeaseTerms);

    updateUnit(unit_id, {
      lease_terms: JSON.stringify(resourceLeaseTerms),
    }).then((response) => {
      console.log(response);
    });
  }
  );
}