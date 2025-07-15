import { authenticatedInstance } from "./api";

//Create a function to call the API endpoint /portfolios/ to make a post request to create a portfolio
export async function createPortfolio(data) {
  try {
    const res = await authenticatedInstance
      .post(`/portfolios/`, data)
      .then((res) => {
        const response = res.data;

        return response;
      });
    return { message: "Portfolio created successfully", status: 200, data: res };
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to call the api endpoint /portfolios/${id} to make a get request to retrieve one specific portfolio
export async function getPortfolio(id) {
  try {
    const res = await authenticatedInstance
      .get(`/portfolios/${id}/`)
      .then((res) => {
        const response = res.data;

        return response;
      });
    return {
      message: "Portfolio retrieved successfully",
      status: 200,
      data: res,
    };
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to call the API endpoint /portfolios/ to make a get request to retrieve all portfolios
export async function getPortfolios() {
  try {
    const res = await authenticatedInstance.get(`/portfolios/`).then((res) => {
      if (res.status == 200 && res.data.length == 0) {
        return { data: [] };
      }
      return {
        message: "Portfolio retrieved successfully",
        status: 200,
        data: res.data,
      };
    });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to call the API endpoint /portfolios/ to make a patch request to update a portfolio
export async function updatePortfolio(id, data) {
  try {
    const res = await authenticatedInstance
      .patch(`/portfolios/${id}/`, data)
      .then((res) => {
        const response = res.data;

        return response;
      });
    return { message: "Portfolio updated successfully", status: 200, res: res };
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create function to update a portfolio preferences with patch method using the api endpoint /portfolios/{id}/update-preferences
export async function updatePortfolioPreferences(id, data) {
  try {
    const res = await authenticatedInstance
      .patch(`/portfolios/${id}/update-preferences/`, data)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}
//Create a function to call the API endpoint /portfolios/ to make a delete request to delete a portfolio
export async function deletePortfolio(id) {
  try {
    const res = await authenticatedInstance
      .delete(`/portfolios/${id}/`)
      .then((res) => {
        const response = res.data;

        return response;
      });
    return { message: "Portfolio deleted successfully", status: 200, res: res };
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}
//Create a function that removes a lease template from a portfolio using the api endpoint /portfolios/{id}/remove-lease-template
export async function removePortfolioLeaseTemplate(id) {
  try {
    const res = await authenticatedInstance
      .patch(`/portfolios/${id}/remove-lease-template/`)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function that validates a portfolio name using the api endpoint /portfolios/validate-name
export async function validatePortfolioName(data) {
  try {
    const res = await authenticatedInstance
      .post(`/portfolios/validate-name/`, data)
      .then((res) => {

        return res.data;
      });
    return res;
  } catch (error) {

    return error.response ? error.response.data : { error: "Network Error" };
  }
}