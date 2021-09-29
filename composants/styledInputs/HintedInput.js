import * as React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import RegularInput from "./RegularInput.js";
("./RegularInput.js");

import * as COLORS from "../../composants/Colors.js";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";

function HintedInput({
  placeholder,
  withHeader,
  errorMessageToShow,
  errorChecker,
  setInputValue,
  setIsInputValueSelected,
  isPassword,
}) {
  //for calculating heights
  let [componentHeight, setComponentHeight] = React.useState(0);
  let [fieldNameHeight, setFieldNameHeight] = React.useState(0);
  let [errorMessageHeight, setErrorMessageHeight] = React.useState(0);
  let [inputHeight, setInputHeight] = React.useState(0);

  //for storing datas
  let [input, setInput] = React.useState("");
  let [isInputSelected, setIsInputSelected] = React.useState(false);
  let [errorMessage, setErrorMessage] = React.useState(errorMessageToShow);
  let [isPasswordVisible, setIsPasswordVisible] = React.useState(
    isPassword ? false : true
  );
  React.useEffect(() => {
    setInputValue(input);
  }, [input]);
  React.useEffect(() => {
    setIsInputValueSelected(isInputSelected);
  }, [isInputSelected]);

  return (
    <View
      style={styles.main}
      onLayout={(event) => {
        setComponentHeight(event.nativeEvent.layout.height);
        // console.log("height:", event.nativeEvent.layout.height);
      }}
    >
      {/* Input Name */}
      <View
        style={[styles.fieldName, { flex: 2.5 }]}
        onLayout={(event) => {
          setFieldNameHeight(event.nativeEvent.layout.height);
        }}
      >
        {withHeader && (
          <>
            {isInputSelected || input ? (
              <Text style={[styles.fieldName, { fontSize: fieldNameHeight }]}>
                {placeholder}
              </Text>
            ) : null}
          </>
        )}
      </View>

      {/* Spacer */}
      <View style={styles.spacer}></View>

      {/* The input section */}
      <View
        style={[styles.input]}
        onLayout={(event) => {
          setInputHeight(event.nativeEvent.layout.height);
        }}
      >
        {/* Input */}
        <RegularInput
          placeholder={placeholder}
          setInput={setInput}
          setIsInputSelected={setIsInputSelected}
          isInputVisible={isPasswordVisible}
        />
        {/* Password icon */}
        {isPassword && (
          <Ionicons
            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
            size={inputHeight}
            color={
              isInputSelected
                ? COLORS.AGORIQUE_BLUE
                : input
                ? COLORS.AGORIQUE_BLUE
                : COLORS.MEDIUM_GREY
            }
            style={styles.passwordIcon}
            onPress={() => {
              setIsPasswordVisible(!isPasswordVisible);
            }}
          />
        )}
      </View>

      {/* Spacer */}
      <View style={styles.spacer}></View>

      {/* The error message */}
      <View
        style={[styles.errorMessage, { flex: 2.5 }]}
        onLayout={(event) => {
          setErrorMessageHeight(event.nativeEvent.layout.height);
        }}
      >
        {!isInputSelected && input && errorChecker(input) ? (
          <Text style={[styles.errorMessage, { fontSize: errorMessageHeight }]}>
            {errorMessageToShow}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },

  fieldName: {
    color: COLORS.AGORIQUE_BLUE,
    // backgroundColor: COLORS.LIGHT_GREY,
  },
  spacer: {
    flex: 1,
    // backgroundColor: "blue",
  },
  input: {
    flex: 4.2,
    flexDirection: "row",
    position: "relative",
  },
  passwordIcon: {
    position: "absolute",
    right: 0,
    // backgroundColor: "pink",
  },
  errorMessage: {
    color: COLORS.RED_CRIMSON,
    // backgroundColor: COLORS.LIGHT_GREY,
  },
});

export default HintedInput;
