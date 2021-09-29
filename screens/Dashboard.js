import React from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  DismissKeyboard,
} from "react-native";
import { Svg } from "react-native-svg";
import { DataTable } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryPie,
  VictoryLabel,
  VictoryLegend,
  VictoryAxis,
  LineSegment,
  VictoryContainer,
} from "victory-native";
import * as ERRORS from "../businessLogic/errorMessages.js";
import { getDataForCharts } from "../businessLogic/authentification.js";
import * as COLORS from "../composants/Colors.js";
import RoundedButton from "../composants/styledButtons/RoundedButton.js";
/**
 *
 * @todo : gérer le loading des datas
 * @todo : ajuster la taille des colonnes ainsi que la police
 * @todo : ne dois pas pouvoir sélectionner des dates dans le futur
 * @todo : charger avec les 7 derniers jours
 * @todo : fix le selecteur de date ne sélectionne les bonnes valeurs pour le mois
 * @todo : généré automatiquement des couleurs
 * @todo : ajouter un légende
 * @todo : ajouter des valeurs par défaut dans les champs de date
 */

function format(date) {
  return (
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
    "/" +
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    "/" +
    date.getFullYear()
  );
}

function Dashboard() {
  // Keyboard.dismiss;
  const [date, setDate] = React.useState(new Date(Date.now()));
  const [mode, setMode] = React.useState("date");
  const [show, setShow] = React.useState(false);
  const [dateSetter, setDateSetter] = React.useState("");
  const [userFirstName, setUserFirstName] = React.useState("");
  const [lastDeposits, setLastDeposits] = React.useState([]);
  const [datafForPieChart, setDataForPieChart] = React.useState([]);
  const [dataForBarChart, setDataForBarChart] = React.useState([]);

  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(new Date());

  const [errorMessage, setErrorMessage] = React.useState("  ");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");

    if (dateSetter === "from") {
      setFromDate(currentDate);
    } else {
      setToDate(currentDate);
    }
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  async function loadData() {
    try {
      let user_id = await AsyncStorage.getItem("userId");
      let user_token = await AsyncStorage.getItem("userToken");
      // console.log(user_id, user_token);
      let response = await getDataForCharts(
        user_id,
        user_token,
        fromDate,
        toDate
      );
      // console.log(response);
      // console.log(response);
      if (response.succeded) {
        // console.log("succededquery", response);
        setUserFirstName(response.user_first_name);
        setLastDeposits(response.last_deposits);
        // console.log("data for pie:", response.data_for_pie_chart);
        // console.log("datafor bar:", response.data_for_bar_chart);
        setDataForBarChart(response.data_for_bar_chart);
        setDataForPieChart(response.data_for_pie_chart);
      }
    } catch (error) {
      console.log(error);
      /**
       * @todo : à voir comment implémenter l'affichage du message d'erreurs
       */
    }
  }

  React.useEffect(() => {
    let endingDate = new Date();
    let startingDate = new Date(new Date().setDate(new Date().getDate() - 5));
    // console.log(startingDate, "/", endingDate);
    setFromDate(startingDate);
    setToDate(endingDate);
  }, []);

  let [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    async function reloadData() {
      try {
        await loadData();
      } catch (error) {
        console.log("erreur lors du chargement des données");
      }
    }
    reloadData();
  }, [fromDate, toDate]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <View style={styles.mainMarginContainer}>
          {/*  Titre*/}
          <Text style={styles.pageTitle}> Bonjour {userFirstName},</Text>
          {/* Corps de la page */}
          <ScrollView
            style={styles.mainScrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Derniers dépôts en tableau */}
            <View
              style={styles.tableSection}
              onLayout={(event) => {
                setWidth(event.nativeEvent.layout.width);
              }}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: COLORS.AGORIQUE_BLUE,
                  },
                ]}
              >
                Vos derniers dépôts
              </Text>
              <DataTable style={styles.tableStyle}>
                {/* Entête du tableau */}
                <DataTable.Header>
                  <DataTable.Title>Flux</DataTable.Title>
                  <DataTable.Title style={styles.rightTablePositionning}>
                    <Text>Poids en (kg)</Text>
                  </DataTable.Title>
                  <DataTable.Title style={styles.rightTablePositionning}>
                    Date
                  </DataTable.Title>
                </DataTable.Header>
                {/* 1ère ligne du tableau */}
                {lastDeposits.map((e, i) => {
                  return (
                    <DataTable.Row key={i}>
                      <DataTable.Cell>{e.type_code}</DataTable.Cell>
                      <DataTable.Cell
                        numeric
                        style={styles.rightTablePositionning}
                      >
                        {e.weight}
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.rightTablePositionning}>
                        {format(new Date(e.depositeDate))}
                      </DataTable.Cell>
                    </DataTable.Row>
                  );
                })}
              </DataTable>
            </View>
            {/* Graphiques */}

            <View style={styles.chartsContainer}>
              {/* Titre */}
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: COLORS.AGORIQUE_BLUE,
                  },
                ]}
              >
                Historique de vos dépôts (kg)
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingVertical: 10,
                }}
              >
                {/* @todo : ajouter une icone de calendrier */}
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      textDecorationStyle: "solid",
                    }}
                  >
                    Du :
                  </Text>
                  <Text
                    // placeholder="Date de début"
                    onPress={() => {
                      setDate(new Date(Date.now()));
                      setDateSetter("from");
                      setShow(true);
                    }}
                  >
                    {fromDate && format(fromDate)}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      textDecorationStyle: "solid",
                    }}
                  >
                    Au :
                  </Text>
                  <Text
                    placeholder="Date de fin"
                    onPress={() => {
                      setDate(new Date(Date.now()));
                      setDateSetter("to");
                      setShow(true);
                    }}
                  >
                    {toDate && format(toDate)}
                  </Text>
                </View>
              </View>
              {/* section des graphiques */}

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {/* chart bar */}
                <View
                  style={{
                    // borderWidth: 1,
                    height: 300,
                    width: width,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    backgroundColor: "white",
                    shadowColor: COLORS.REGULAR_BLACK,
                    shadowOffset: { height: 5, width: 5 },
                    shadowRadius: 10,
                    shadowOpacity: 0.5,
                  }}
                >
                  <Svg
                    width={width}
                    height={width}
                    // viewBox="0 0 400 400"
                  >
                    <VictoryChart
                      theme={VictoryTheme.material}
                      // height={400}
                      // width={300}
                      // containerComponent={<VictoryContainer responsive={false} />}
                      standalone={false}
                      padding={{ top: 40, bottom: 100, left: 50, right: 50 }}
                    >
                      <VictoryGroup offset={15}>
                        {dataForBarChart.map((group, i) => {
                          // console.log("group:", group);
                          return (
                            <VictoryBar
                              key={i}
                              labelComponent={<VictoryLabel angle={45} />}
                              data={group}
                              x="x"
                              y="y"
                              // alignment={"start"}
                              style={{
                                data: {
                                  fill:
                                    group[0].serie === "OMR"
                                      ? "#2078B4"
                                      : "#A6CEE3",
                                },
                              }}
                              animate={{
                                duration: 2000,
                                onLoad: { duration: 1000 },
                              }}
                            />
                          );
                        })}
                      </VictoryGroup>
                      <VictoryAxis
                        crossAxis
                        key={1}
                        tickLabelComponent={
                          <VictoryLabel angle={-45} textAnchor={"end"} />
                        }
                        animate={{
                          duration: 2000,
                          easing: "bounce",
                        }}
                      />
                      <VictoryAxis
                        key={2}
                        crossAxis
                        dependentAxis
                        animate={{
                          duration: 2000,
                          easing: "bounce",
                        }}
                        tickLabelComponent={<VictoryLabel textAnchor={"end"} />}
                        // axisComponent={<LineSegment style={ } />}
                        style={{
                          axis: {
                            stroke: "white",
                          },
                          ticks: {
                            stroke: "white",
                          },
                        }}
                      />
                    </VictoryChart>
                  </Svg>
                </View>

                <View style={{ width: 20 }}></View>
                {/* Graphe en camembert */}
                <View
                  style={{
                    height: 300,
                    width: width,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    backgroundColor: "white",
                    shadowColor: COLORS.REGULAR_BLACK,
                    shadowOffset: { height: 5, width: 5 },
                    shadowRadius: 10,
                    shadowOpacity: 0.5,
                  }}
                >
                  <Svg width={width} height={width}>
                    <VictoryPie
                      data={datafForPieChart}
                      standalone={false}
                      x={"type"}
                      y={"totalWeight"}
                      innerRadius={100}
                      padAngle={10}
                      style={{
                        data: {
                          fill: ({ datum }) =>
                            datum.type === "OMR" ? "#2078B4" : "#A6CEE3",
                        },
                      }}
                      padding={{ top: 60, bottom: 80 }}
                    />
                  </Svg>
                </View>
              </ScrollView>
            </View>
            <View
              style={{ justifyContent: "center", alignItems: "flex-start" }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: "10%",
                    backgroundColor: "#2078B4",
                    marginRight: 5,
                  }}
                ></View>
                <Text>Ordures Ménagères Résiduelles (OMR)</Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                <View
                  style={{
                    width: "10%",
                    backgroundColor: "#A6CEE3",
                    marginRight: 5,
                  }}
                ></View>
                <Text>Collecte Sélective - Recyclables (CSR)</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      {show && (
        <View>
          {/* message d'erreur en cas de date incohérentes */}
          <Text style={{ color: "red", textAlign: "center" }}>
            {errorMessage}
          </Text>
          {/* Date picker */}
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={show}
            display="default"
            onChange={onChange}
          />
          {/* Bouton pour fermer le date picker */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              height: 50,
              marginBottom: 4,
              paddingHorizontal: 10,
            }}
          >
            <RoundedButton
              label="Valider"
              colored={true}
              onPress={() => {
                if (toDate < fromDate) {
                  setErrorMessage(ERRORS.DATE_INCONSISTENCY);
                } else {
                  // Lancer la récupération de données et leur traitement
                  loadData();
                  setErrorMessage("  ");
                  setShow(false);
                }
              }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  mainMarginContainer: {
    flex: 1,
    marginVertical: "5%",
    marginHorizontal: "3%",
    // backgroundColor: "yellow",
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: "3%",
    // backgroundColor: "pink",
  },
  mainScrollView: {
    flex: 1,
    // backgroundColor: "brown",
  },
  tableSection: {
    height: 200,
    width: "100%",
    // backgroundColor: "orange",
    borderRadius: 20,
    shadowColor: "grey",
    shadowRadius: 1,
    shadowOffset: {
      height: 10,
      width: 10,
    },
    padding: "2%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginVertical: "2%",
    marginHorizontal: "2%",
  },
  tableStyle: {
    // backgroundColor: "red",
    // flex: 1,
  },
  rightTablePositionning: {
    // backgroundColor: "yellow",
    justifyContent: "flex-end",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
  chartsContainer: {
    marginVertical: "10%",
    height: 400,
    // backgroundColor: "pink",
  },
});

export default Dashboard;
