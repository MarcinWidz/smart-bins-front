import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View, StyleSheet } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Atomic components
import { EmailInput as EmailInput } from "../composants/styledInputs/EmailInput.js";
import PasswordInput from "../composants/styledInputs/PasswordInput.js";
import RoundedButton from "../composants/styledButtons/RoundedButton.js";
import LinkButton from "../composants/styledButtons/LinkButton.js";
import ErrorMessage from "../composants/errorMessage/ErrorMessage.js";

// Other cutsomized business modules
import * as ERRORS from "../businessLogic/errorMessages.js";
import { authenticate } from "../businessLogic/authentification.js";

/**
 * @todo : corriger le fonctionnement du login
 *
 */

function SignIn({ navigation, setIsConnected, askForLogOut }) {
  // console.log("navigation", navigation);
  // console.log("ask for log out:", askForLogOut);
  let [email, setEmail] = React.useState("");
  let [isEmailValid, setIsEmailValid] = React.useState(false);
  let [password, setPassword] = React.useState("");
  // let [passwordIsVisible, setPasswordIsVisible] = React.useState(false);
  let [isSelectedPassword, setIsSelectedPassword] = React.useState(false);
  let [isValidPassword, setIsValidPassword] = React.useState(false);
  let [errorMessage, setErrorMessage] = React.useState();
  let [showErrorMessage, setShowErrorMessage] = React.useState(false);
  async function connectAccount() {
    await authenticate({ email, password });

    try {
      console.log("my password:", password);
      console.log("my email:", email);
      console.log("is passwordvalid:", isValidPassword);
      console.log("is email valid:", isEmailValid);
      if (!isEmailValid) {
        setErrorMessage(ERRORS.NOT_AN_EMAIL);
        setShowErrorMessage(true);
      } else if (!isValidPassword) {
        setErrorMessage(ERRORS.PASSWORD_NOT_TYPED);
        setShowErrorMessage(true);
      } else {
        let authentication = await authenticate({ email, password });
        if (authentication.succeded) {
          setErrorMessage("");
          await AsyncStorage.setItem("userToken", authentication.user_token);
          await AsyncStorage.setItem("userId", authentication.user_id);
          setShowErrorMessage(false);
          setIsConnected(true);
        } else {
          setErrorMessage(authentication.message);
          setShowErrorMessage(true);
        }
      }
    } catch (error) {
      setErrorMessage(ERRORS.TECHNICAL_ERROR);
      setShowErrorMessage(true);
      console.log(error);
    }
  }

  React.useEffect(() => {
    async function logInOut() {
      let asyncKeys = await AsyncStorage.getAllKeys();
      console.log("useeffect", askForLogOut);
      if (asyncKeys.includes("userToken") && askForLogOut) {
        await AsyncStorage.removeItem("userToken");
        setIsConnected(false);
      }
    }
    logInOut();
  }, []);

  return (
    <KeyboardAwareScrollView
      style={styles.scrollContainer}
      contentContainerStyle={{ height: "100%" }}
      showsVerticalScrollIndicator={false}
      // extraScrollHeight={20}
    >
      <View style={styles.mainContainer}>
        {/* Titre de la page */}
        <View style={styles.headerContainer}>
          <View style={styles.verticalMargins}>
            <Text style={styles.headerText}>Smart Bin services</Text>
          </View>
        </View>
        {/* Les champs de saisis et les actions utilisateurs */}
        <View style={styles.contentContainer}>
          {/* inputs group */}
          <View style={styles.inputs}>
            {/* Email input */}
            <View
              style={{
                height: 45,
                width: "100%",
              }}
            >
              <EmailInput
                placeholder="Email"
                withHeader={true}
                errorMessageToShow={ERRORS.NOT_AN_EMAIL}
                setIsEmailValid={setIsEmailValid}
                setEmail={setEmail}
              />
            </View>
            <View style={styles.smallSpacer}></View>

            {/* Password input */}
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
          </View>

          {/* Main error message */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 10,
            }}
          >
            {showErrorMessage ? <ErrorMessage message={errorMessage} /> : null}
          </View>

          {/* Button group */}
          <View style={styles.buttons}>
            {/* Login button */}
            <View
              style={{
                height: 40,
                width: "100%",
              }}
            >
              <RoundedButton
                label="Se connecter"
                onPress={connectAccount}
                colored={true}
              />
            </View>

            {/* Forgotten password button */}
            <View
              style={{
                height: 40,
                width: "100%",
              }}
            >
              <LinkButton
                label="Mot de pass oublié"
                onPress={() => {
                  navigation.navigate("Reset password");
                }}
              />
            </View>
            {/* Subscription button */}
            <View
              style={{
                height: 40,
                width: "100%",
              }}
            >
              <RoundedButton
                label="S'inscrire"
                onPress={() => {
                  navigation.navigate("SignUp");
                }}
                colored={false}
              />
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "green",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  headerContainer: {
    flex: 5,
    height: 200,
    width: "100%",
    backgroundColor: "#2799FB",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerText: {
    color: "white",
    fontSize: 30,
    bottom: 10,
    fontWeight: "bold",
  },

  contentContainer: {
    flex: 7,
    // backgroundColor: "blue",
    padding: 30,
    // width: "100%",
    justifyContent: "space-between",
  },

  inputs: {
    marginTop: 30,
    height: 90,
    justifyContent: "space-between",
  },

  smallSpacer: {
    height: 10,
  },

  buttons: {
    height: 130,
    justifyContent: "space-between",
    marginBottom: 30,
    // backgroundColor: "black",
  },
  errorMessage: {
    fontSize: 12,
    color: "red",
  },
});

export default SignIn;
