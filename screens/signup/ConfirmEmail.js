import React, { useState } from "react";
import RoundedButton from "../../composants/styledButtons/RoundedButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as COLORS from "../../composants/Colors.js";
import ErrorMessage from "../../composants/errorMessage/ErrorMessage.js";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

const CELL_COUNT = 6;

const Name = ({ navigation, setEmail, toConfirm }) => {
  const [isLastNameSelected, setIsLastNameSelected] = useState(false);
  const [mainTitleHeight, setMainTitleHeight] = useState(0);
  let [errorMessage, setErrorMessage] = React.useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [value, setValue] = React.useState("");
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [code, setCode] = useState();
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.mainContainer}>
      <View style={styles.mainViewContainer}>
        {/* un titre */}

        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            // backgroundColor: "pink",
          }}
          onLayout={(event) => {
            setMainTitleHeight(event.nativeEvent.layout.height);
          }}
        >
          <Text
            style={{
              fontSize: mainTitleHeight / 7,
              fontWeight: "600",
              textAlign: "center",
              color: COLORS.AGORIQUE_BLUE,
            }}
          >
            Vérification
          </Text>
        </View>

        <View
          style={{
            flex: 0.75,
            justifyContent: "space-around",
            // backgroundColor: "yellow",
          }}
        >
          {/* un texte de description */}
          <Text style={styles.mainInstructions}>
            Veuillez saisir le code de validation reçu par e-mail
          </Text>
          {/* un texte de sous-description */}
          <Text style={styles.secondaryInstructions}>{"   "}</Text>
        </View>
        {/* un champ pour la saisie de l'email */}
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFiledRoot}
          caretHidden={true}
          autoCompleteType='off'
          keyboardType='default'
          textContentType='oneTimeCode'
          onSubmitEditing={() => {
            value === toConfirm && navigation.navigate("Password");
          }}
          renderCell={({ index, symbol, isFocused }) => (
            <View
              // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
        {/* message d'erreur */}
        {/* <Text>{errorMessage}</Text> */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 10,
          }}
        >
          <ErrorMessage message={errorMessage} />
        </View>
        {/* boutton d'envoi d'un email */}
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            // backgroundColor: "pink",
          }}
        ></View>
      </View>
    </KeyboardAwareScrollView>
  );
};

// <View style={styles.container}>
//   <Text>Veuillez saisir le code de vérification reçu par e-mail:</Text>
//   <TextInput
//     onChangeText={(text) => {
//       setCode(text);
//       text === toConfirm && navigation.navigate("Password");
//       // console.log(text);
//       console.log(toConfirm);
//     }}
//     style={styles.inputs}
//   ></TextInput>
// </View>

const styles = StyleSheet.create({
  //Container du keyboard aware
  mainContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  //conteneur du contenu réel
  mainViewContainer: {
    flex: 1,
    paddingHorizontal: "5%",
    // backgroundColor: "pink",
    alignItems: "stretch",
    marginVertical: 20,
  },
  lottieAnimation: {
    height: 200,
  },
  mainTitle: {
    marginVertical: "5%",
    fontWeight: "600",
    fontSize: 35,
    textAlign: "center",
    color: "#2799FB",
  },
  mainInstructions: {
    marginTop: "5%",
    fontSize: 25,

    textAlign: "center",
    color: "#414952",
    // backgroundColor: "yellow",
  },
  secondaryInstructions: {
    fontSize: 15,
    textAlign: "center",
    marginTop: "1%",
    marginBottom: "5%",
    color: "#ACAFB3",
    // backgroundColor: "pink",
  },

  codeFiledRoot: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    // backgroundColor: "blue",
  },
  cellRoot: {
    width: "10%",
    height: "33%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#2799FB",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 2,
  },
  connectBtn: {
    marginTop: 30,
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

export default Name;
