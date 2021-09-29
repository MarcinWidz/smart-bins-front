import { TextInput, Text, List, Button } from "react-native-paper";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as React from "react";
import AutocompleteInput from "./AutocompleteInput";
import {
  getCities,
  getRegions,
  getAdresses,
} from "../businessLogic/authentification.js";
import * as ERRORS from "../businessLogic/errorMessages.js";

/**
 * @todo : envoyer la requête de persistance des données
 */

function AddressModal({ setIsAddressEditable, updateAddress }) {
  let [selectedRegion, setSelectedRegion] = React.useState({});
  let [selectedCity, setSelectedCity] = React.useState({});
  let [selectedAddress, setSelectedAddress] = React.useState({});
  async function regionsToArray(region) {
    let result = [];
    try {
      let response = await getRegions(region);
      if (response.succeded) {
        result = response.data.map((e) => {
          return {
            id: e.code,
            raw_object: e,
            labelToShow: e.name + " (" + e.code + ")",
          };
        });
      } else {
        result.push({
          id: "00",
          raw_object: {},
          labelToShow: response.message,
        });
      }
    } catch (error) {
      result.push({
        id: "00",
        raw_object: {},
        labelToShow: ERRORS.TECHNICAL_ERROR,
      });
    }
    // console.log("departement de la liste:", result);
    return result;
  }

  async function citiesToArray(city) {
    let result = [];
    // console.log(selectedRegion, city);
    try {
      let response = await getCities(selectedRegion.id, city);
      // console.log("my response:", response);
      if (response.succeded) {
        result = response.data.map((e) => {
          return {
            id: e.id,
            raw_object: e,
            labelToShow: e.name + " (" + e.postal_code + ")",
          };
        });
      } else {
        result.push({
          id: "00",
          raw_object: {},
          labelToShow: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      result.push({
        id: "00",
        raw_object: {},
        labelToShow: ERRORS.TECHNICAL_ERROR,
      });
    }
    // console.log("myresults:", result);
    return result;
  }

  async function adressesToArray(address) {
    let result = [];
    try {
      let response = await getAdresses(
        selectedRegion.id,
        selectedCity.raw_object.postal_code,
        address
      );
      // console.log("my response:", response);
      if (response.succeded) {
        result = response.data.map((e) => {
          return {
            id: e._id,
            raw_object: e,
            labelToShow: e.house_number + " " + e.street_name,
          };
        });
      } else {
        result.push({
          id: "00",
          raw_object: {},
          labelToShow: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      result.push({
        id: "00",
        raw_object: {},
        labelToShow: ERRORS.TECHNICAL_ERROR,
      });
    }
    // console.log("my final result", result);
    return result;
  }

  return (
    <Modal>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View style={styles.mainContainer}>
            <Text style={styles.pageTitle}>Veuillez modifier l'adresse</Text>
            <View
              style={styles.searchBarContainer}
              onPress={() => {
                setSelectedRegion({});
                setSelectedCity({});
                setSelectedAddress({});
              }}
            >
              <AutocompleteInput
                queryFunction={regionsToArray}
                setSelectedItem={setSelectedRegion}
                errorMessage={"Veuillez selectionner un département"}
                placeholder={"Département"}
              />
              {/* <Text>{selectedRegion.id}</Text> */}
              <>
                {selectedRegion.id ? (
                  <View
                    style={{ zIndex: -200 }}
                    onPress={() => {
                      setSelectedCity({});
                      setSelectedAddress({});
                    }}
                  >
                    <AutocompleteInput
                      queryFunction={citiesToArray}
                      setSelectedItem={setSelectedCity}
                      errorMessage={"Veuillez selectionner une ville"}
                      placeholder={"Ville"}
                    />
                  </View>
                ) : null}
              </>

              {/* <Text>{selectedCity.id}</Text> */}
              <>
                {selectedCity.id ? (
                  <View
                    style={{ zIndex: -400 }}
                    onPress={() => {
                      setSelectedAddress({});
                    }}
                  >
                    <AutocompleteInput
                      queryFunction={adressesToArray}
                      setSelectedItem={setSelectedAddress}
                      errorMessage={"Veuillez selectionner une adresse"}
                      placeholder={"Adresse"}
                    />
                  </View>
                ) : null}
              </>
            </View>
            {/* <Text>{selectAddress.id}</Text> */}
            <View>
              <Button
                mode="contained"
                onPress={async () => {
                  console.log("im here");
                  await updateAddress({
                    id: selectedAddress.raw_object._id,
                    cityName: selectedCity.raw_object.name,
                    houseNumber: selectedAddress.raw_object.house_number,
                    postCode: selectedCity.raw_object.postal_code,
                    streetName: selectedAddress.raw_object.street_name,
                  });
                  setSelectedRegion({});
                  setSelectedCity({});
                  setSelectedAddress({});
                  setIsAddressEditable(false);
                }}
                style={{
                  zIndex: -700,
                  backgroundColor:
                    selectedAddress.id && selectedCity.id && selectedRegion.id
                      ? "#2699FB"
                      : "lightgrey",
                  marginBottom: 20,
                }}
                disabled={
                  selectedAddress.id && selectedCity.id && selectedRegion.id
                    ? false
                    : true
                }
              >
                Valider
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  console.log(selectedRegion, selectedCity, selectedAddress);
                  setSelectedAddress({});
                  setSelectedCity({});
                  setSelectedRegion({});
                  setIsAddressEditable(false);
                }}
                style={{ zIndex: -700, borderColor: "#2699FB" }}
              >
                <Text style={{ color: "#2699FB" }}>Annuler</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
    flex: 1,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: "3%",
    // backgroundColor: "pink",
  },
  mainContainer: {
    // backgroundColor: "yellow",
    flex: 1,
    margin: 25,
    justifyContent: "space-between",
  },
  searchBarContainer: {
    height: 300,
    // backgroundColor: "blue",
  },
});

export default AddressModal;
