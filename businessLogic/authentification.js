import axios from "axios";
import * as ERRORS from "./errorMessages.js";
import currentWeekNumber from "current-week-number";

let HEROKU_ADDRESSE = "https://smartbins-back.herokuapp.com";

async function authenticate({ email, password }) {
  let response = {
    succeded: false,
    email: email,
    user_id: null,
    user_token: null,
    message: null,
  };
  try {
    let axiosResponse = await axios.post(
      HEROKU_ADDRESSE + "/api/account/login",
      { email: email, password: password }
    );
    response.succeded = axiosResponse.data.succeded;
    if (axiosResponse.data.succeded) {
      response.user_id = axiosResponse.data.data[0].account_id;
      response.user_token = axiosResponse.data.data[0].account_token;
    }
    response.message = axiosResponse.data.message;
  } catch (error) {
    response.message = ERRORS.TECHNICAL_ERROR;
  }

  return response;
}

async function sendEmail(toEmailUser) {
  //envoyer email,
  //si tout bon récupérer le code
  //sinon envoyer null
  let response = {
    succeded: false,
    message: null,
    validation_code: null,
    email_receiver: toEmailUser,
  };
  // console.log(toEmailUser);
  try {
    let axiosResponse = await axios.post(
      HEROKU_ADDRESSE + "/api/utils/generateMailCodeValidatorFor/" + toEmailUser
    );
    // console.log("axios d", axiosResponse.data);
    response.succeded = axiosResponse.data.succeded;
    // console.log("here", response.data);
    if (axiosResponse.data.succeded) {
      response.validation_code = axiosResponse.data.data[0].validation_code;
      response.email_receiver = axiosResponse.data.data[0].email_receiver;
    }
    response.message = axiosResponse.data.message;
  } catch (error) {
    console.log(error);
    response.message = ERRORS.TECHNICAL_ERROR;
  }
  return response;
}

async function checkEmail(toEmailUser) {
  let response = {
    succeded: false,
    message: null,
  };

  try {
    let axiosResponse = await axios.get(
      HEROKU_ADDRESSE + "/api/account/checkEmail/" + toEmailUser
    );
    //true email non attribué et false email déja présent en BDD
    response.succeded = axiosResponse.data.succeded;
    response.message = axiosResponse.data.message;
  } catch (error) {
    console.log(error);
    response.message = ERRORS.TECHNICAL_ERROR;
  }
  return response;
}

async function resetPassword(email, password) {
  let response = {
    succeded: false,
    message: null,
  };
  try {
    let message = {
      is_trusted: "true",
      newPassword: password,
      email: email,
    };
    let axiosResponse = await axios.post(
      HEROKU_ADDRESSE + "/api/account/resetPassword",
      message
    );
    // console.log("réponse axios:", axiosResponse.data);
    response.succeded = axiosResponse.data.succeded;
    response.message = axiosResponse.data.message;
  } catch (error) {
    console.log(error);
    response.message = ERRORS.TECHNICAL_ERROR;
  }
  return response;
}

async function getDataForCharts(
  user_id,
  user_token,
  starting_date,
  ending_date
) {
  let response = {
    succeded: false,
    message: null,
    user_first_name: null,
    user_last_name: null,
    last_deposits: [],
    data_for_bar_chart: [],
    data_for_pie_chart: [],
    all_deposits: [],
  };
  try {
    let config = {
      headers: {
        Authorization: "Bearer " + user_token,
      },
    };

    let body = {
      id: user_id,
      start_date: starting_date,
      end_date: ending_date,
    };
    // console.log(config);
    // console.log(body);
    let axiosResponse = await axios.post(
      HEROKU_ADDRESSE + "/api/account/consumptions",
      body,
      config
      // body
    );
    console.log("axios response:", axiosResponse.data);
    let queryResult = axiosResponse.data;

    if (queryResult.succeded) {
      response.succeded = true; //temporaire
      let result = queryResult.data[0];
      let account = result.account;
      let allDeposits = result.depositFromStart2End;
      let lastDeposits = result.last_deposit;
      // console.log("last deposit:", lastDeposits);
      // console.log(account);
      //Récupérer les informations du compte
      if (account) {
        response.user_first_name = account.first_name;
        response.user_last_name = account.last_name;
      }
      //Récuprer les informations sur les dernières informations
      if (Object.keys(lastDeposits).length > 0) {
        // console.log("keys:", Object.keys(lastDeposits));
        response.last_deposits = Object.keys(lastDeposits).map((e) => {
          // console.log("ee", lastDeposits[e].bins_id.bintypes_id.name);
          return {
            type_code: e,
            type_name: lastDeposits[e].bins_id.bintypes_id.name,
            depositeDate: lastDeposits[e].deposit_date,
            weight: lastDeposits[e].weight,
          };
        });
        //récupérer les data pour chaque enregistrement dans l'historique
        if (Object.keys(allDeposits).length > 0) {
          // console.log(Object.keys(allDeposits));
          response.all_deposits = Object.keys(allDeposits).map((e) => {
            return {
              type: e,
              deposits: allDeposits[e].map((d) => {
                return {
                  depositDate: d.deposit_date,
                  depositWeight: d.weight,
                };
              }),
            };
          });
        }
        let dataForBarChart = response.all_deposits.map((e) =>
          formatDataForBarChart(e, starting_date, ending_date)
        );
        // console.log(dataForBarChart);
        // let groupedDataForBarChart = groupDataToShow(dataForBarChart);
        // console.log("response:", response.all_deposits);
        let dataForPieChart = response.all_deposits.map((e) => {
          return {
            type: e.type,
            totalWeight: e.deposits.reduce((a, e) => (a += e.depositWeight), 0),
          };
        });
        // console.log("data for pie chart:", dataForPieChart);

        response.data_for_bar_chart = dataForBarChart;
        response.data_for_pie_chart = dataForPieChart;

        // console.log(dataForBarChart);
        // console.log("all deposits:", allDeposits);
        // console.log("return:", response);
      }
      response.message = queryResult.message;
    } else {
      response.message = queryResult.message;
    }
  } catch (error) {
    console.log(error);
    response.message = ERRORS.TECHNICAL_ERROR;
  }
  return response;
}

function groupDataToShow(data) {
  let result = [];
  for (let i = 0; i < data[0].length; i++) {
    result.push(
      data.map((e) => {
        return e[i];
      })
    );
  }
  // console.log("résultat:", result);
  return result;
}

function formatDataForBarChart(datas, starting_date, ending_date) {
  // console.log("starting date:", starting_date);
  // console.log("ending date:", ending_date);
  // définir l'échelle d'agrégation ( au mois, à la semaine, à la journée)
  let xAxisDatas = getXAxisForBarChart(starting_date, ending_date);
  // calcul des agrégats
  let dataToPlot = populateDataForChart(datas, xAxisDatas);
  // console.log("data to plot:", dataToPlot);

  return dataToPlot;
}

function populateDataForChart(data, xAxis) {
  let result = [];
  // console.log(data);
  // console.log(xAxis);
  for (let i = 0; i < xAxis.length; i++) {
    // pour chaque point dans l'axe des X récupérer aggréger les datas
    let record = {
      x: xAxis[i].labelToShow,
      y: 0,
      serie: data.type,
    };
    if (xAxis[i].type === "day") {
      data.deposits.forEach((e) => {
        let dataDate = new Date(e.depositDate);
        let axisDate = new Date(xAxis[i].date);
        // console.log("data:", dataDate.getFullYear());
        // console.log("data axis:", axisDate.getFullYear());
        if (
          dataDate.getFullYear() === axisDate.getFullYear() &&
          dataDate.getDate() === axisDate.getDate() &&
          dataDate.getMonth() === axisDate.getMonth()
        ) {
          record.y += e.depositWeight;
        }
      });
      // console.log(record);
    } else if (xAxis[i].type === "week") {
      data.deposits.forEach((e) => {
        let dataWeek = currentWeekNumber(new Date(e.depositDate));
        // console.log(dataWeek, e.depositDate);
        if (dataWeek === xAxis[i].weekNumber) {
          // console.log(e);
          record.y += e.depositWeight;
        }
      });
      // console.log(record);
    } else if (xAxis[i].type === "month") {
      data.deposits.forEach((e) => {
        let dataDate = new Date(e.depositDate);
        let label =
          (dataDate.getMonth() + 1 < 10
            ? "0" + (dataDate.getMonth() + 1)
            : dataDate.getMonth() + 1) +
          "-" +
          dataDate.getFullYear();
        // console.log("data month label:", label, e);
        if (label === xAxis[i].labelToShow) {
          record.y += e.depositWeight;
        }
      });
      // console.log(record);
    }
    result.push(record);
  }
  return result;
}

function numberOfDaysBetween(starting_date, ending_date) {
  let result = 0;
  const fromMilliToDays = 1000 * 60 * 60 * 24;
  try {
    let startingDay = Math.trunc(starting_date.getTime() / fromMilliToDays);
    let endingDay = Math.trunc(ending_date.getTime() / fromMilliToDays);
    result = endingDay - startingDay >= 0 ? endingDay - startingDay + 1 : 0;
    // console.log(result);
    // console.log("starting date:", starting_date, starting_date.getTime(), startingDay);
    // console.log("ending date:", ending_date, ending_date.getTime(), endingDay);
  } catch (error) {
    console.log(error);
  }
  return result;
}

function getXAxisForBarChart(starting_date, ending_date) {
  let result = [];
  let duration = numberOfDaysBetween(starting_date, ending_date);
  // console.log("duration", duration);
  if (duration > 0) {
    //durée normale => construire l'axe des abcisses
    if (duration <= 7 * 4) {
      //en dessous de quatre semaines, afficher à la journée
      for (let i = 0; i < duration; i++) {
        let newDate = new Date(starting_date);
        newDate.setDate(newDate.getDate() + i);
        result.push({
          type: "day",
          date: newDate,
          year: newDate.getFullYear(),
          month: newDate.getMonth() + 1,
          day: newDate.getDate(),
          labelToShow:
            (newDate.getDate() < 10
              ? "0" + newDate.getDate()
              : newDate.getDate()) +
            "-" +
            (newDate.getMonth() + 1 < 10
              ? "0" + (newDate.getMonth() + 1)
              : newDate.getMonth() + 1) +
            "-" +
            newDate.getFullYear(),
        });
      }
    } else if (duration > 7 * 4 && duration <= 7 * 16) {
      //à partir de la 5ième semaine jusqu'à la 16ième semaine, afficher à la semaine
      let startingWeek = currentWeekNumber(starting_date);
      let endingWeek = currentWeekNumber(ending_date);
      let numberOfweeks = endingWeek - startingWeek + 1;
      // console.log("starting week:", startingWeek);
      // console.log("ending week:", endingWeek);
      for (let i = 0; i < numberOfweeks; i++) {
        result.push({
          type: "week",
          weekNumber: startingWeek + i,
          labelToShow: "Semaine - " + (startingWeek + i),
        });
      }
    } else {
      //à partir de la 17ième semaine, afficher au mois
      let startingYear = starting_date.getFullYear();
      let startingMonth = starting_date.getMonth() + 1;
      let endingYear = ending_date.getFullYear();
      let endingMonth = ending_date.getMonth() + 1;
      if (startingYear < endingYear) {
        //années différentes
        for (let i = 0; i <= 12 - startingMonth; i++) {
          result.push({
            type: "month",
            monthNumber: startingMonth + i,
            labelToShow:
              (startingMonth + i < 10
                ? "0" + (startingMonth + i)
                : startingMonth + i) +
              "-" +
              startingYear,
          });
        }
        for (let i = 1; i <= endingMonth; i++) {
          result.push({
            type: "month",
            monthNumber: i,
            labelToShow: (i < 10 ? "0" + i : i) + "-" + endingYear,
          });
        }
      } else if (startingYear === endingYear) {
        //même année
        let numberOfMonths = endingMonth - startingMonth + 1;
        for (let i = 0; i < numberOfMonths; i++) {
          result.push({
            type: "month",
            monthNumber: startingMonth + i,
            labelToShow:
              (startingMonth + i < 10
                ? "0" + (startingMonth + i)
                : startingMonth + i) +
              "-" +
              startingYear,
          });
        }
      } else {
        //normallement cas ne devant pas se produire endingmonth < startingmonth
      }
    }
  } else {
    //durée <=0 => non sens aucune data à afficher
  }
  // console.log(result);
  return result;
}

async function getUserInformations(userId, userToken) {
  let response = {
    succeded: false,
    message: null,
    email: null,
    firstName: null,
    lastName: null,
    tokens: [],
    address: {},
  };
  try {
    let config = {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    };

    let dateQuery = new Date(Date.now());
    let body = {
      id: userId,
      start_date: dateQuery.toString(),
      end_date: dateQuery.toString(),
    };
    let axiosResponse = await axios.post(
      HEROKU_ADDRESSE + "/api/account/consumptions",
      body,
      config
    );
    let data = axiosResponse.data;
    // console.log("response:", data);
    if (data.succeded) {
      let account = data.data[0].account;
      // console.log("my data:", account);
      response.succeded = data.succeded;
      response.message = data.message;
      response.firstName = account.first_name;
      response.lastName = account.last_name;
      response.email = account.email;
      response.address = {
        id: account.addresses_id._id,
        cityName: account.addresses_id.city_name,
        houseNumber: account.addresses_id.house_number,
        postCode: account.addresses_id.post_code,
        streetName: account.addresses_id.street_name,
      };
      response.tokens = account.tokens_ids.map((e) => {
        return { id: e._id, code: e.code };
      });
    } else {
      response.succeded = false;
      response.message = ERRORS.TECHNICAL_ERROR;
    }
  } catch (error) {
    console.log("an error:", error);
    response.succeded = false;
    response.message = ERRORS.TECHNICAL_ERROR;
  }
  // console.log("reponse finale:", response);
  return response;
}

async function setName(user_id, user_token, first_name, last_name) {
  let response = {};
  try {
  } catch (error) {
    console.log(error);
  }
}

async function getRegions(regionToSearch) {
  let finalResponse = {
    succeded: false,
    message: null,
    data: [],
  };
  //
  try {
    const axiosResponse = await axios.get(
      `https://smartbins-back.herokuapp.com/api/utils/searchRegions/${regionToSearch}`
    );
    let realResponse = axiosResponse.data;
    // console.log("real regions response:", realResponse);
    if (realResponse.succeded) {
      finalResponse.message = realResponse.message;
      finalResponse.data = realResponse.data;
      finalResponse.succeded = true;
    } else {
      finalResponse.message = realResponse.message;
    }
  } catch (error) {
    console.log("error while getting regions: ", error);
    finalResponse.message = ERRORS.TECHNICAL_ERROR;
  }
  // console.log("real regions response:", finalResponse);
  return finalResponse;
}

async function getCities(region, cityToSearch) {
  let finalResponse = {
    succeded: false,
    message: null,
    data: [],
  };
  //
  try {
    const axiosResponse = await axios.get(
      `http://smartbins-back.herokuapp.com/api/utils/searchMunicipality/${region}/${cityToSearch}`
    );
    let realResponse = axiosResponse.data;
    // console.log("real cities response:", realResponse);
    if (realResponse.succeded) {
      finalResponse.message = realResponse.message;
      finalResponse.data = realResponse.data;
      finalResponse.succeded = true;
    } else {
      finalResponse.message = realResponse.message;
    }
  } catch (error) {
    // console.log("error while getting regions: ", error);
    finalResponse.message = ERRORS.TECHNICAL_ERROR;
  }
  // console.log("final cities response:", finalResponse);
  return finalResponse;
}

async function getAdresses(region, city, addressToSearch) {
  let finalResponse = {
    succeded: false,
    message: null,
    data: [],
  };
  //
  try {
    const axiosResponse = await axios.get(
      `http://smartbins-back.herokuapp.com/api/utils/searchAddress/${region}/${city}/${addressToSearch}`
    );
    let realResponse = axiosResponse.data;
    // console.log("real cities response:", realResponse);
    if (realResponse.succeded) {
      finalResponse.message = realResponse.message;
      finalResponse.data = realResponse.data;
      finalResponse.succeded = true;
    } else {
      finalResponse.message = realResponse.message;
    }
  } catch (error) {
    // console.log("error while getting regions: ", error);
    finalResponse.message = ERRORS.TECHNICAL_ERROR;
  }
  // console.log("final cities response:", finalResponse);
  return finalResponse;
}

async function updateName(userToken, userId, firstName, lastName) {
  let result = [];
  try {
    let config = {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    };

    let body = {
      id: userId,
      newFirstName: firstName,
      newLastName: lastName,
    };
    let axiosResponse = await axios.post(
      HEROKU_ADDRESSE + "/api/account/modify/",
      body,
      config
    );
    console.log("axios response:", axiosResponse.data);
  } catch (error) {
    console.log("an error:", error);
  }

  return result;
}

async function updateEmail(userToken, userId, email) {
  let result = [];
  try {
    let config = {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    };

    let body = {
      id: userId,
      newEmail: email,
    };
    let axiosResponse = await axios.post(
      HEROKU_ADDRESSE + "/api/account/modify/",
      body,
      config
    );
    console.log("axios response:", axiosResponse.data);
  } catch (error) {
    console.log("an error:", error);
  }

  return result;
}

async function updatePassword(userToken, userId, password) {
  let result = [
    {
      succeded: false,
      message: null,
      data: [],
    },
  ];
  try {
    let config = {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    };

    let body = {
      id: userId,
      newPassword: password,
    };
    let axiosResponse = await axios.post(
      HEROKU_ADDRESSE + "/api/account/modify/",
      body,
      config
    );
    console.log(axiosResponse.data);
    let realResponse = axiosResponse.data;
    if (realResponse.succeded) {
      result[0].message = realResponse.message;
      result[0].succeded = realResponse.succeded;
      result[0].data = [{ newToken: realResponse.data[0].account.token }];
    } else {
      result[0].message = realResponse.message;
    }
  } catch (error) {
    console.log("didn't save new password:", error);
    result[0].message = ERRORS.TECHNICAL_ERROR;
  }
  return result;
}

async function updateAddress(userToken, userId, addressId) {
  let result = [];
  try {
    let config = {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    };

    let body = {
      id: userId,
      newId_addresses_id: addressId,
    };
    let axiosResponse = await axios.post(
      HEROKU_ADDRESSE + "/api/account/modify/",
      body,
      config
    );
    console.log("axios response:", axiosResponse.data);
  } catch (error) {
    console.log("an error:", error);
  }

  return result;
}

async function checkToken(codeToken) {
  let result = {
    succeded: false,
    message: null,
    data: [],
  };
  try {
    let axiosResponse = await axios.get(
      HEROKU_ADDRESSE + "/api/utils/searchToken/" + codeToken
    );
    // console.log("reponse axios:", axiosResponse.data);
    let realResponse = axiosResponse.data;
    if (realResponse.succeded) {
      result.message = realResponse.message;
      result.data = [{ code: codeToken, id: realResponse.data[0].tokenId }];
      result.succeded = true;
    } else {
      result.message = realResponse.message;
    }
  } catch (error) {
    console.log("error while checking a token:", error);
    result.message = ERRORS.TECHNICAL_ERROR;
  }

  console.log("token check result 1:", result);

  return result;
}

async function updateTokens(userToken, userId, tokensIds) {
  try {
    let config = {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    };

    let body = {
      id: userId,
      newTokens_ids: tokensIds,
    };
    // console.log(config, body);
    let axiosResponse = await axios.post(
      HEROKU_ADDRESSE + "/api/account/modify/",
      body,
      config
    );
    // console.log("serveur response:", axiosResponse.data);
  } catch (error) {
    console.log(error);
  }
}

export { updateTokens };

export { checkToken };

export { updateAddress };

export { updatePassword };
export { updateEmail };
export { updateName };
export { getAdresses };

export { getCities };
export { getRegions };
export { getUserInformations };

//Faire le traitement des dates
export { getDataForCharts };

export { authenticate };
export { sendEmail };
export { checkEmail };
export { resetPassword };
