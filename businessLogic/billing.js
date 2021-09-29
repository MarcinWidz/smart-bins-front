import axios from "axios";
import * as ERRORS from "./errorMessages.js";

let HEROKU_ADDRESSE = "https://smartbins-back.herokuapp.com";

async function getBill(userToken, userId, idMonth) {
  let result = {
    succeded: false,
    message: ERRORS.TECHNICAL_ERROR,
    data: [],
  };
  console.log("in the route api/account/facture/");
  try {
    let queryAddress = HEROKU_ADDRESSE + "/api/account/facture/" + idMonth;

    let queryConfiguration = {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    };

    let queryBody = {
      id: userId,
    };
    let axiosResponse = await axios.post(
      queryAddress,
      queryBody,
      queryConfiguration
    );
    let realResponse = axiosResponse.data;
    if (realResponse.succeded) {
      let data = realResponse.data[0];
      if (data.facture) {
        // console.log("reponse facture:", data.facture);
        let facture = {
          isCurrentMonth: data.actualMonth,
          billInformations: data.facture,
          month: data.month_number,
          year: data.year_number,
        };
        result.data.push(facture);
        result.succeded = true;
        // console.log("facture enregistrée:", facture);
      } else {
        console.log("pas de factures");
        result.message = realResponse.message ?? ERRORS.NO_BILLS;
      }
    } else {
      result.message = realResponse ?? ERRORS.TECHNICAL_ERROR;
    }
    console.log(realResponse);
  } catch (error) {
    console.log("error while fetching a bill:", error);
    result.message = ERRORS.TECHNICAL_ERROR;
  }
  console.log("bill for month ", idMonth, ":", result);
  return result;
}

async function getNumberOfBills(userToken, userId) {
  let result = {
    succeded: false,
    message: ERRORS.TECHNICAL_ERROR,
    data: [],
  };
  console.log("in the route api/account/facture/");
  try {
    let queryAddress = HEROKU_ADDRESSE + "/api/account/facture/1";

    let queryConfiguration = {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    };

    let queryBody = {
      id: userId,
    };
    let axiosResponse = await axios.post(
      queryAddress,
      queryBody,
      queryConfiguration
    );
    let realResponse = axiosResponse.data;
    if (realResponse.succeded) {
      let data = realResponse.data[0];
      if (data.facture) {
        // console.log("reponse facture:", data.facture);
        result.data.push({ numberOfBills: data.nMonth });
        result.message = realResponse.message;
        result.succeded = true;

        // console.log("facture enregistrée:", facture);
      } else {
        console.log("pas de factures");
        result.message = realResponse.message ?? ERRORS.NO_BILLS;
        result.succeded = true;
        result.data.push({ numberOfBills: 0 });
      }
    } else {
      result.message = realResponse ?? ERRORS.TECHNICAL_ERROR;
    }
    // console.log(realResponse);
  } catch (error) {
    console.log("error while fetching a bill:", error);
    result.message = ERRORS.TECHNICAL_ERROR;
  }
  console.log("number of bills:", result);

  return result;
}

async function getAllBills(userToken, userId) {
  let result = {
    succeded: false,
    message: ERRORS.TECHNICAL_ERROR,
    data: [],
  };
  try {
    let numberOfAvailableBills = await (
      await getNumberOfBills(userToken, userId)
    ).data[0].numberOfBills;
    if (numberOfAvailableBills) {
      for (let idMonth = 1; idMonth <= numberOfAvailableBills; idMonth++) {
        let bill = await getBill(userToken, userId, idMonth);
        if (bill.succeded) {
          result.data.push(bill.data[0]);
          console.log("bill ", idMonth, ":", bill);
        }
      }
      if (result.data.length > 0) {
        result.succeded = true;

        result.message = "Voici vos factures";
      } else {
        result.succeded = false;
        result.message = ERRORS.NO_BILLS;
      }
    } else {
      result.succeded = false;
      result.message = ERRORS.NO_BILLS;
    }
    console.log("number of available bills:", numberOfAvailableBills);
  } catch (error) {
    console.log("error while getting all bills:", error);
    result.succeded = false;
    result.message = ERRORS.TECHNICAL_ERROR;
  }
  console.log("all bills:", result);
  return result;
}

export { getAllBills };

export { getNumberOfBills };

export { getBill };
