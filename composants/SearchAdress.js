import React, { useState, useRef, useCallback, Feather } from "react";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { useNavigation } from "@react-navigation/core";

import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function SearchAdress({ setAdress, department, city, adress }) {
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownController = useRef(null);
  const searchRef = useRef(null);
  const navigation = useNavigation();

  const getSuggestions = useCallback(async (q) => {
    try {
      if (q.length === 0) {
        setSuggestionsList(null);
        return;
      }
      setLoading(true);
      const response = await axios.get(
        `http://smartbins-back.herokuapp.com/api/utils/searchAddress/${department}/${city}/${q}`
      );
      // const items = await response.json();
      let suggestions = [];

      if (response.data.succeded) {
        suggestions = response.data.data.map((item, index) => ({
          id: item._id,
          name: item.street_name,
          number: item.house_number,
        }));
      } else {
        suggestions.push(response.data.message);
      }
      setSuggestionsList(suggestions);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
    // else {
    //   suggestions.push(response.data.message);
    // }
    // const suggestions = response.data.map((item) => ({
    //   id: item.id,
    //   title: item.title,
    // }));
  }, []);

  return (
    <View
      style={{
        justifyContent: "center",
      }}
    >
      <AutocompleteDropdown
        ref={searchRef}
        controller={(controller) => {
          dropdownController.current = controller;
        }}
        dataSet={suggestionsList}
        onChangeText={getSuggestions}
        // onChangeText={(text) => {
        //   setSelectedItem;
        //   setDepartment(selectedItem);
        // }}
        onSelectItem={(item) => {
          item && setSelectedItem(item);
        }}
        debounce={600}
        suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
        // onClear={onClearPress}
        onSubmit={(e) => {
          onSubmitSearch(e.nativeEvent.text);
        }}
        // onOpenSuggestionsList={onOpenSuggestionsList}
        loading={loading}
        useFilter={false} // prevent rerender twice
        textInputProps={{
          placeholder: "Votre adresse",
          autoCorrect: false,
          autoCapitalize: "none",
          style: {
            height: 50,
            backgroundColor: "white",
            margin: 20,
            borderColor: "#BCE0FD",
            borderBottomWidth: 1,
            width: 0.9 * width,
          },
        }}
        rightButtonsContainerStyle={{
          borderRadius: 30,
          right: 30,
          height: 30,
          width: 30,
          top: 30,
          alignSelfs: "center",
          backgroundColor: "white",
          justifyContent: "center",
        }}
        inputContainerStyle={{
          backgroundColor: "transparent",
        }}
        suggestionsListContainerStyle={{
          position: "absolute",
          backgroundColor: "#BCE0FD",
          top: 70,
          opacity: 0.3,
          color: "black",
        }}
        renderItem={(item, text) => (
          <Text
            onPress={() => {
              setAdress(item.id);
              navigation.navigate("Badges");
            }}
            style={{
              color: "black",
              fontSize: 30,
              padding: 15,
            }}
          >
            {item.number + " " + item.name}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputs: {
    height: 50,
    backgroundColor: "white",
    margin: 20,
    borderColor: "#BCE0FD",
    borderWidth: 2,
    borderRadius: 30,
    width: 300,
  },
});
