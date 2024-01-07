import { authenticatedInstance } from "./api";

//Create a function to call the API endpoint /portfolios/ to make a post request to create a portfolio
export async function createPortfolio(data) {
  try {
    const res = await authenticatedInstance
      .post(`/portfolios/`, data)
      .then((res) => {
        const response = res.data;
        console.log("axios create portfolio response ", response);
        return response;
      });
    return { message: "Portfolio created successfully", status: 200, res: res };
  } catch (error) {
    console.log("Create Portfolio Error: ", error);
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
        console.log("axios get portfolio response ", response);
        return response;
      });
    return {
      message: "Portfolio retrieved successfully",
      status: 200,
      data: res,
    };
  } catch (error) {
    console.log("Get Portfolio Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

//Create a function to call the API endpoint /portfolios/ to make a get request to retrieve all portfolios
export async function getPortfolios() {
  try {
    const res = await authenticatedInstance.get(`/portfolios/`).then((res) => {
      console.log(res);
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
    console.log("Get Portfolios Error: ", error);
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
        console.log("axios update portfolio response ", response);
        return response;
      });
    return { message: "Portfolio updated successfully", status: 200, res: res };
  } catch (error) {
    console.log("Update Portfolio Error: ", error);
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
        console.log("axios delete portfolio response ", response);
        return response;
      });
    return { message: "Portfolio deleted successfully", status: 200, res: res };
  } catch (error) {
    console.log("Delete Portfolio Error: ", error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}
