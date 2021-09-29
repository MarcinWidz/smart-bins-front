import React, { useState } from "react";

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";

const villes = ["Fontenay Sous Bois", "Vicennes", "Boulogne-Billancourt"];

import SelectDropdown from "react-native-select-dropdown";
import { Entypo } from "@expo/vector-icons";
import SearchCities from "../../composants/SearchCities";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const City = ({ navigation, setCity, department }) => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 26 }}>Ville:</Text>
      <View>
        <SearchCities setCity={setCity} department={department}></SearchCities>
      </View>

      {/* <TouchableOpacity
        onPress={() => {
          navigation.navigate("Adress");
        }}
        style={styles.btn}
      >
        <Text>Next</Text>
      </TouchableOpacity> */}
    </View>
  );
};
const styles = StyleSheet.create({
  inputs: {
    width: 300,
    height: 50,
    backgroundColor: "white",
    margin: 20,
    borderColor: "#BCE0FD",
    borderWidth: 2,
    borderRadius: 30,
    alignItems: "flex-end",
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: "100%",
  },

  btn: {
    marginLeft: 20,
    width: 300,
    height: 50,
    backgroundColor: "#2799FB",
    borderWidth: 2,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  dropdownBtnStyle: {
    backgroundColor: "#BCE0FD",
    borderRadius: 30,
    width: 0.8 * width,
    margin: 20,
  },
  dropdownRowStyle: {
    backgroundColor: "#BCE0FD",
    borderRadius: 0,
    borderBottomColor: "#C5C5C5",
  },
});

export default City;
