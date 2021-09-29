import * as React from "react";
import { View, StyleSheet } from "react-native";
("./RegularInput.js");

import HintedInput from "./HintedInput.js";

function EmailInput({
  placeholder,
  errorMessageToShow,
  setIsEmailValid,
  setEmail,
  withHeader,
}) {
  let [input, setInput] = React.useState("");
  let [isSelected, setIsSelected] = React.useState("");

  function errorChecker(input) {
    let reg =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !reg.test(input);
  }

  React.useEffect(() => {
    console.log("erreur email:", errorChecker(input));
    console.log(isSelected);
    if (!isSelected) {
      setIsEmailValid(!errorChecker(input));
    }
  }, [isSelected]);
  React.useEffect(() => {
    console.log(input);
    setEmail(input);
  }, [input]);
  return (
    <View style={styles.main}>
      <HintedInput
        placeholder={placeholder}
        withHeader={withHeader}
        errorMessageToShow={errorMessageToShow}
        errorChecker={errorChecker}
        setInputValue={setInput}
        setIsInputValueSelected={setIsSelected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // backgroundColor: "blue",
  },
});

export { EmailInput };
