import React, { useState } from "react";

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

import PasswordInput from "../../composants/styledInputs/HintedInput";
import RoundedButton from "../../composants/styledButtons/RoundedButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as COLORS from "../../composants/Colors.js";
import ErrorMessage from "../../composants/errorMessage/ErrorMessage.js";

const Password = ({ navigation, setToConfirm }) => {
  const [isLastNameSelected, setIsLastNameSelected] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [mainTitleHeight, setMainTitleHeight] = useState(0);
  let [errorMessage, setErrorMessage] = React.useState("");
  let [isSelected, setIsSelected] = React.useState("");

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
            Creer un compte:
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
            Veuillez choisir un mot de passe:
          </Text>
          {/* un texte de sous-description */}
          <Text style={styles.secondaryInstructions}></Text>
          <View
            style={{
              height: 65,
              width: "100%",
            }}
          >
            <PasswordInput
              withHeader={true}
              setPassword={setToConfirm}
              setInputValue={setTempPassword}
              setIsSelectedPassword={isLastNameSelected}
              setIsValidPassword={true}
              placeholder='Votre Mot de Passe Choisi'
              setIsInputValueSelected={setIsSelected}
              isPassword={true}
              errorMessageToShow=''
              errorChecker={(input) => {
                return false;
              }}
            />
          </View>
        </View>
        {/* un champ pour la saisie de l'email */}

        {/* message d'erreur */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 10,
          }}
        >
          {!isLastNameSelected ? <ErrorMessage message={errorMessage} /> : null}
        </View>
        {/* boutton d'envoi d'un email */}
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            // backgroundColor: "pink",
          }}
        >
          {/* {tempLastName ? ( */}
          <View
            style={{
              height: 40,
              width: "100%",
            }}
          >
            <RoundedButton
              label='Suivant'
              onPress={() => {
                setToConfirm(tempPassword);
                navigation.navigate("ConfirmPassword");
              }}
              colored={true}
            />
          </View>
          {/* ) : null} */}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

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

  mainInstructions: {
    marginTop: "5%",
    fontSize: 25,
    textAlign: "center",
    color: "#414952",
    // backgroundColor: "blue",
  },
  secondaryInstructions: {
    fontSize: 15,
    textAlign: "center",
    marginTop: "1%",
    marginBottom: "5%",
    color: "#ACAFB3",
    // backgroundColor: "pink",
  },
});

export default Password;
