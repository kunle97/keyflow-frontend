import { authenticatedInstance } from "./api";
import { authUser } from "../constants";
//---------TRANSACTION API FUNCTIONS-----------------///
//Create A function to get all transactions for a specific user using the endpoint /users/{authUser.id}/transactions/
export async function getTransactionsByUser() {
    try {
      const res = await authenticatedInstance
        .get(`/users/${authUser.id}/transactions/`)
        .then((res) => {
          return res;
        });
      return res;
    } catch (error) {
      console.log("Get Transactions Error: ", error);
      return error.response;
    }
  }
  
  //Create A function to get all transactions for a specific user using the endpoint /users/{authUser.id}/tenant-transactions/
  export async function getTenantTransactionsByUser() {
    try {
      const res = await authenticatedInstance
        .get(`/users/${authUser.id}/tenant-transactions/`)
        .then((res) => {
          return res;
        });
      return res;
    } catch (error) {
      console.log("Get Transactions Error: ", error);
      return error.response;
    }
  }
  
  //Create a funtion to retrieve a transaction by its id
  export async function getTransactionById(transactionId) {
    try {
      const res = await authenticatedInstance
        .get(`/transactions/${transactionId}/`)
        .then((res) => {
          if (res.status == 200) {
            return { data: res.data };
          }
          return { data: [] };
        });
      return res;
    } catch (error) {
      console.log("Get Transaction Error: ", error);
      return error.response;
    }
  }