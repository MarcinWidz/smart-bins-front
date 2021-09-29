import React from "react";
import { Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Card, Title, Content } from "react-native-paper";
import {
  getBill,
  getNumberOfBills,
  getAllBills,
} from "../businessLogic/billing.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ERRORS from "../businessLogic/errorMessages";

/**
 * @todo: Voir avec Lionel, le month number n'est pas bon
 */

function Invoices(props) {
  let [bills, setBills] = React.useState([]);
  let [isLoading, setIsLoading] = React.useState(true);

  console.log(props);

  async function loadBAllBills() {
    let userToken = await AsyncStorage.getItem("userToken");
    let userId = await AsyncStorage.getItem("userId");
    console.log("in the screen, user token/id:", userToken, "/", userId);
    let aBill = await getAllBills(userToken, userId);
    console.log(aBill);
  }
  React.useEffect(() => {
    async function loadBAllBills() {
      let userToken = await AsyncStorage.getItem("userToken");
      let userId = await AsyncStorage.getItem("userId");
      setIsLoading(true);
      // console.log("in the screen, user token/id:", userToken, "/", userId);
      try {
        let allBills = await getAllBills(userToken, userId);
        setBills(allBills);
      } catch (error) {
        console.log("Error while fetching bills in the InvoicesScreen:", error);
        setBills({
          succeded: false,
          message: ERRORS.TECHNICAL_ERROR,
          data: [],
        });
      }
      setIsLoading(false);
    }
    loadBAllBills();
  }, []);
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.mainContrainer}>
        {isLoading ? null : !bills.succeded ? (
          <Text>{bills.message}</Text>
        ) : (
          <>
            {bills.data.map((e) => {
              return (
                <Card
                  key={e.month + "-" + e.year}
                  style={styles.cardStyle}
                  mode="elevated"
                  elevation={5}
                >
                  <Card.Title
                    title={
                      "Facture du : " +
                      (e.month < 10 ? "0" + e.month : e.month) +
                      "-" +
                      e.year
                    }
                    subtitle={
                      "CSR: " +
                      e.billInformations.CSR.toFixed(2) +
                      " kg,   OMR: " +
                      e.billInformations.OMR.toFixed(2) +
                      " kg."
                    }
                    right={() => (
                      <Title style={{ marginRight: 10, color: "#2699FB" }}>
                        {e.billInformations.total.toFixed(2) + " €"}
                      </Title>
                    )}
                  ></Card.Title>
                </Card>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "white",
    flex: 1,
  },
  mainContrainer: {
    flex: 1,
    paddingVertical: "5%",
    paddingHorizontal: "2%",
    // backgroundColor: "blue",
  },
  cardStyle: {
    marginVertical: 10,
  },
});

export default Invoices;
