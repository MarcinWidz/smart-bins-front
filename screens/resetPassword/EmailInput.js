import React from "react";
import {
  StyleSheet,
  Text,
  // TextInput,
  View,
  // TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { sendEmail, checkEmail } from "../../businessLogic/authentification.js";
import * as ERRORS from "../../businessLogic/errorMessages.js";
import RoundedButton from "../../composants/styledButtons/RoundedButton.js";
import { EmailInput as EmailRealInput } from "../../composants/styledInputs/EmailInput.js";
import ErrorMessage from "../../composants/errorMessage/ErrorMessage.js";
import * as COLORS from "../../composants/Colors.js";

/** @todo : animer l'apparition et la disparition des composants */
//next email + search boutton
/**
 *
 *@todo : vérification que l-email contient "@" sinon envoyer une erreur à l'envoi ou côté backend
 */

function EmailInput({ navigation, setEmail, setCode }) {
  let [tempEmail, setTempEmail] = React.useState("");
  let [isEmailValid, setIsEmailValid] = React.useState(false);
  let [errorMessage, setErrorMessage] = React.useState("");
  let [isEmailExist, setIsEmailExist] = React.useState(false);

  //Heights
  let [mainTitleHeight, setMainTitleHeight] = React.useState(0);

  async function receiveEmail() {
    try {
      let isEmailInDB = await checkEmail(tempEmail);
      setIsEmailExist(!isEmailInDB.succeded);
      if (isEmailInDB.succeded) {
        setErrorMessage(isEmailInDB.message);
      } else {
        let request = await sendEmail(tempEmail);
        setErrorMessage(request.message);
        if (request.succeded) {
          //renvoyer vers la page de chargement du code l'utilisateur
          setEmail(tempEmail);
          setCode(request.validation_code);
          console.log("code:", request.validation_code);
          navigation.navigate("Vérification du code");
        } else {
          setIsEmailExist(false);
        }
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(ERRORS.TECHNICAL_ERROR);
    }
    // console.log(requestInformations);
  }
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
            Mot de passe oublié ?
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
            Veuillez renseigner votre adresse e-mail
          </Text>
          {/* un texte de sous-description */}
          <Text style={styles.secondaryInstructions}>
            Nous vous enverrons un e-mail avec un code.
          </Text>
          <View
            style={{
              height: 45,
              width: "100%",
              // backgroundColor: "black",
            }}
          >
            <EmailRealInput
              placeholder="Email"
              withHeader={true}
              errorMessageToShow={ERRORS.NOT_AN_EMAIL}
              setIsEmailValid={setIsEmailValid}
              setEmail={setTempEmail}
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
          {!isEmailExist ? <ErrorMessage message={errorMessage} /> : null}
        </View>
        {/* boutton d'envoi d'un email */}
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            // backgroundColor: "pink",
          }}
        >
          {isEmailValid ? (
            <View
              style={{
                height: 40,
                width: "100%",
              }}
            >
              <RoundedButton
                label="Recevoir mon code"
                onPress={receiveEmail}
                colored={true}
              />
            </View>
          ) : null}
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

export default EmailInput;
