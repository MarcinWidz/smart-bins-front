import * as React from "react";
import { TextInput, View, StyleSheet } from "react-native";

import { Button } from "react-native-paper";
import HintedInput from "./HintedInput";

import * as ERRORS from "../../businessLogic/errorMessages.js";

function PasswordInput({
  withHeader,
  setPassword,
  setIsSelectedPassword,
  setIsValidPassword,
  placeholder,
}) {
  let [input, setInput] = React.useState("");
  let [isSelected, setIsSelected] = React.useState("");
  let [isValidInput, setIsValidInput] = React.useState(false);

  React.useEffect(() => {
    // console.log(input);
    setPassword(input);
    if (input) {
      setIsValidInput(true);
      setIsValidPassword(true);
    } else {
      setIsValidInput(false);
      setIsValidPassword(false);
    }
  }, [input]);
  React.useEffect(() => {
    setIsSelectedPassword(isSelected);
  }, [isSelected]);

  return (
    <View style={styles.main}>
      <HintedInput
        placeholder={placeholder ?? "Mot de passe"}
        withHeader={withHeader}
        setInputValue={setInput}
        setIsInputValueSelected={setIsSelected}
        isPassword={true}
        errorMessageToShow=""
        errorChecker={(input) => {
          return false;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // backgroundColor: "pink",
  },
});

export default PasswordInput;
