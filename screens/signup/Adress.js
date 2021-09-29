import React, { useState } from "react";

import {
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

import SearchAdress from "../../composants/SearchAdress";
import SelectDropdown from "react-native-select-dropdown";
import { Entypo } from "@expo/vector-icons";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Adress = ({ navigation, setAdress, adress, department, city }) => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 26 }}>Adresse:</Text>
      <SearchAdress
        setAdress={setAdress}
        city={city}
        adress={adress}
        department={department}
      ></SearchAdress>
      {/* <TouchableOpacity
        onPress={() => {
          navigation.navigate("Badges");
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
});

export default Adress;
