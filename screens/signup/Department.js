import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";

import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome5 } from "@expo/vector-icons";
import SearchDepartments from "../../composants/SearchDepartments";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Departement = ({ navigation, setDepartment }) => {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 26 }}>Departement:</Text>
        <SearchDepartments setDepartment={setDepartment}></SearchDepartments>
      </View>
      <TouchableOpacity></TouchableOpacity>
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
    width: 300,
    height: 50,
    backgroundColor: "#2799FB",
    borderWidth: 2,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    margin: 30,
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

export default Departement;
