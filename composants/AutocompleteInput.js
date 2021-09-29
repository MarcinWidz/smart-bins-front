import { Searchbar, TextInput, Text, List } from "react-native-paper";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as React from "react";
import { getRegions } from "../businessLogic/authentification.js";
import { set } from "react-native-reanimated";

function AutocompleteInput({
  queryFunction,
  setSelectedItem,
  errorMessage,
  placeholder,
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [foundData, setFoundData] = React.useState([]);
  const [searchListIsVisible, setSearchListIsVisible] = React.useState(false);
  const [tempSelectedItem, setTempSelectedItem] = React.useState("");

  async function onChangeSearch(query) {
    if (query.split("").length > 0) {
      setSearchListIsVisible(true);
    } else {
      setSearchListIsVisible(false);
    }
    let queryResults = await queryFunction(query);
    // console.log("Searchbar results:", queryResults);
    setFoundData(queryResults);
    setSearchQuery(query);
  }
  return (
    <>
      <Text
        style={
          tempSelectedItem ? styles.errorMessageHide : styles.errorMessageShow
        }
      >
        {errorMessage}
      </Text>
      <TextInput
        onChangeText={onChangeSearch}
        // onBlur={() => {
        //   //   setSearchListIsVisible(false);
        // }}
        placeholder={placeholder}
        onFocus={() => {
          setSelectedItem("");
          setTempSelectedItem("");
          if (searchQuery.split("").length > 0) {
            setSearchListIsVisible(true);
          }
        }}
        value={searchQuery}
        selectionColor={"#2699FB"}
        underlineColor={"#2699FB"}
        style={styles.inputStyle}
      ></TextInput>
      {searchListIsVisible && (
        <View style={styles.searchListContainer}>
          <ScrollView style={styles.searchList}>
            {foundData.map((e, i) => (
              <View
                key={i}
                style={{
                  borderBottomWidth: 1,
                  borderColor: "rgba(232, 232, 232, 1)",
                  borderStyle: "solid",
                }}
                // onPress={() => {
                //   setSearchQuery(e.labelToShow);

                //   setTempSelectedItem(e); //
                //   setSelectedItem(e); //
                //   setSearchListIsVisible(false);
                // }}
              >
                {/* <TouchableOpacity>
                  <Text style={styles.foundItemsText}>{e.labelToShow}</Text>
                </TouchableOpacity> */}

                {e.id !== "00" ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchQuery(e.labelToShow);

                      setTempSelectedItem(e); //
                      setSelectedItem(e); //
                      setSearchListIsVisible(false);
                    }}
                  >
                    <Text style={styles.foundItemsText}>{e.labelToShow}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.foundItemsText}>{e.labelToShow}</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: "white",
    position: "relative",
  },
  searchListContainer: {
    shadowColor: "black",
    shadowOffset: { height: 1, width: 1 },
    shadowRadius: 5,
    shadowOpacity: 0.2,
  },
  inputStyle: {
    backgroundColor: "white",
    height: 40,
  },
  searchList: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: "white",
    maxHeight: 100,
    position: "absolute",
    width: "100%",
    marginTop: 2,
  },
  foundItemsText: {
    fontSize: 18,
  },
  errorMessageHide: {
    fontSize: 12,
    color: "rgba(100,100,100,0)",
    // zIndex: -200,
  },
  errorMessageShow: {
    fontSize: 12,
    color: "red",
    // zIndex: -200,
  },
});

export default AutocompleteInput;
