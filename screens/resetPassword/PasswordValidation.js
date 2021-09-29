import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Entypo } from "@expo/vector-icons";

import { resetPassword } from "../../businessLogic/authentification.js";
import * as ERRORS from "../../businessLogic/errorMessages.js";
import PasswordInput from "../../composants/styledInputs/PasswordInput.js";
import ErrorMessage from "../../composants/errorMessage/ErrorMessage.js";
import * as COLORS from "../../composants/Colors.js";
import RoundedButton from "../../composants/styledButtons/RoundedButton.js";

/**
 *
 *@todo : vérification que l-email contient "@" sinon envoyer une erreur à l'envoi ou côté backend
 */

function PasswordValidation({ navigation, email, isThrusted }) {
  // For main password
  let [password, setPassword] = React.useState("");
  let [isSelectedPassword, setIsSelectedPassword] = React.useState(false);
  let [isValidPassword, setIsValidPassword] = React.useState(false);

  //For password confirmation
  let [passwordConfirmation, setpasswordConfirmation] = React.useState("");
  let [isSelectedPasswordConfirmation, setIsSelectedPasswordConfirmation] =
    React.useState(false);
  let [isValidPasswordConfirmation, setIsValidPasswordConfirmation] =
    React.useState(false);

  let [errorMessage, setErrorMessage] = React.useState("");
  let [passwordIsVisible, setPasswordIsVisible] = React.useState(false);

  //Heights
  let [mainTitleHeight, setMainTitleHeight] = React.useState(0);

  async function askForReset() {
    try {
      if (password === passwordConfirmation && password) {
        //Pérsister les datas dans la base
        let response = await resetPassword(email, password);
        console.log("response:", response);
        if (response.succeded) {
          //si succes alors passer à l'écran lgoin
          navigation.navigate("SignIn");
        } else {
          //sinon afficher les message d'erreur
          setErrorMessage(response.message);
        }
      } else {
        setErrorMessage(ERRORS.UNCOFIRMED_PASSWORD);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(ERRORS.TECHNICAL_ERROR);
    }
  }

  // React.useEffect(()=>{password}, [passwordConfirmation])
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
            Réinitialisation
          </Text>
        </View>
        {/* une image sympa à afficher */}
        <View
          style={{
            flex: 0.75,
            justifyContent: "space-around",
            // backgroundColor: "yellow",
          }}
        >
          {/* un texte de description */}
          <Text style={styles.mainInstructions}>
            Veuiller réinitialiser votre mot de passe
          </Text>
          {/* un texte de sous-description */}
          <Text style={styles.secondaryInstructions}>
            Vous allez bientôt pouvoir vous recconnecter
          </Text>
        </View>

        {/* composant mot de passe */}
        <View style={styles.inputContainer}>
          {/* champ mot de passe */}
          <View
            style={{
              height: 45,
              width: "100%",
            }}
          >
            <PasswordInput
              withHeader={true}
              setPassword={setPassword}
              setIsSelectedPassword={setIsSelectedPassword}
              setIsValidPassword={setIsValidPassword}
            />
          </View>

          {/* composant de confirmation du mot de passe */}

          <View
            style={{
              height: 45,
              width: "100%",
            }}
          >
            <PasswordInput
              withHeader={true}
              setPassword={setpasswordConfirmation}
              setIsSelectedPassword={setIsSelectedPasswordConfirmation}
              setIsValidPassword={setIsValidPasswordConfirmation}
              placeholder="Confirmation mot de passe"
            />
          </View>
        </View>

        {/* message d'erreur */}
        <View
          style={{
            flex: 0.5,
            justifyContent: "center",
            // backgroundColor: "pink",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 10,
              // backgroundColor: "blue",
            }}
          >
            <ErrorMessage message={errorMessage} />
          </View>
        </View>

        {/* Boutton d'envoie */}
        <View
          style={{
            flex: 0.5,
            justifyContent: "flex-end",
            // backgroundColor: "pink",
          }}
        >
          <View
            style={{
              height: 40,
              width: "100%",
            }}
          >
            <RoundedButton
              label="Réinitialiser mon mot de passe"
              onPress={askForReset}
              colored={true}
            />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

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
  mainTitle: {
    marginVertical: "5%",
    fontWeight: "600",
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
  },

  inputContainer: {
    width: "100%",
    flex: 0.5,
    // margin: 10,
    // backgroundColor: "green",
    // position: "relative",
    // flexDirection: "column",
    alignItems: "stretch",
    // backgroundColor: "yellow",
  },
  // passwordInput: {
  //   flex: 1,
  //   borderColor: "#BCE0FD",
  //   borderWidth: 2,
  //   borderRadius: 30,
  // },
  // iconStyle: {
  //   position: "absolute",
  //   right: 0,
  //   alignSelf: "center",
  //   // backgroundColor: "blue",
  // },
  // errorMessage: {
  //   fontSize: 12,
  //   color: "red",
  // },
  // connectBtn: {
  //   marginTop: 30,
  //   width: 300,
  //   height: 50,
  //   backgroundColor: "#2799FB",
  //   borderWidth: 2,
  //   borderRadius: 30,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderWidth: 0,
  // },
});

export default PasswordValidation;
