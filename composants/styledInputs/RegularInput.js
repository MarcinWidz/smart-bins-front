import * as React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";

import * as COLORS from "../../composants/Colors.js";

const activeTextColor = COLORS.REGULAR_BLACK;
const inactiveTextColor = COLORS.AGORIQUE_BLUE;
const activeLineColor = COLORS.AGORIQUE_BLUE;
const inactiveLineColor = COLORS.LIGHT_GREY;
const cursorColor = COLORS.AGORIQUE_BLUE;
const placeHolderColor = COLORS.MEDIUM_GREY;

function RegularInput({
  placeholder,
  setInput,
  setIsInputSelected,
  isInputVisible,
}) {
  let [componentHeight, setComponentHeight] = React.useState(0);
  let [isSelected, setIsSelected] = React.useState(false);
  let [textInput, setTextInput] = React.useState("");

  return (
    <View
      style={styles.main}
      onLayout={(event) => {
        setComponentHeight(event.nativeEvent.layout.height);
        console.log("height:", event.nativeEvent.layout.height);
      }}
    >
      {/* Input */}
      <View style={[styles.input]}>
        <TextInput
          secureTextEntry={!isInputVisible}
          placeholder={placeholder ?? ""}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          style={[
            styles.text,
            { fontSize: componentHeight / 1.2 },
            { color: activeTextColor },
          ]}
          placeholderTextColor={placeHolderColor}
          selectionColor={cursorColor}
          onFocus={() => {
            setIsSelected(true);
            setIsInputSelected(true);
          }}
          onBlur={() => {
            setIsSelected(false);
            setIsInputSelected(false);
          }}
          onChangeText={(input) => {
            setTextInput(input);
            setInput(input);
          }}
        >
          {textInput}
        </TextInput>
      </View>

      {/* Default underlining line */}
      <View
        style={[
          styles.line,
          {
            borderBottomColor: isSelected
              ? activeLineColor
              : textInput
              ? activeLineColor
              : inactiveLineColor,
          },
        ]}
      />
      {/* Underlining line when input is selected */}
      <>
        {isSelected && (
          <View style={[styles.line, { borderBottomColor: activeLineColor }]} />
        )}
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // backgroundColor: "green",
  },
  input: {
    flexDirection: "row",
    // paddingHorizontal: 4,
    // backgroundColor: "pink",
  },
  text: {
    flex: 1,
    // fontSize: 100,
    // backgroundColor: "blue",
  },
  line: {
    borderBottomWidth: 1,
  },
});

export default RegularInput;
