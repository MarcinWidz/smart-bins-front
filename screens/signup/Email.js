import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

import EmailInput from "../../composants/styledInputs/HintedInput";
import RoundedButton from "../../composants/styledButtons/RoundedButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as COLORS from "../../composants/Colors.js";
import ErrorMessage from "../../composants/errorMessage/ErrorMessage.js";

const Email = ({ navigation, email, setEmail, setToConfirm }) => {
  const [message, setMessage] = useState();
  const [checkEmail, setCheckEmail] = useState();
  const [isLastNameSelected, setIsLastNameSelected] = useState(false);
  const [mainTitleHeight, setMainTitleHeight] = useState(0);
  let [errorMessage, setErrorMessage] = React.useState("");

  const verifyEmail = async () => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      try {
        const response = await axios.get(
          `http://smartbins-back.herokuapp.com/api/account/checkEmail/${email}`
        );
        setCheckEmail(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      setMessage("Merci de saisir un e-mail valide");
    }
  };

  useEffect(() => {
    if (checkEmail) {
      if (checkEmail.succeded === false) {
        setMessage("Un compte est déjà enregistré avec cet email.");
      } else {
        handleEmail();
      }
    }
  }, [checkEmail]);

  const handleEmail = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3310/api/utils/generateMailCodeValidatorFor/${email}`
      );
      console.log(response.data);
      setToConfirm(response.data.data[0].validation_code);
      console.log("VALIDATION CODE:", response.data.data[0].validation_code);
      setMessage(response.data.message);
    } catch (error) {
      console.log(error);
    }
    navigation.navigate("ConfirmEmail");
  };

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
            Veuillez renseigner votre email:
          </Text>
          {/* un texte de sous-description */}
          <Text style={styles.secondaryInstructions}></Text>
          <View
            style={{
              height: 65,
              width: "100%",
            }}
          >
            <EmailInput
              placeholder='Email'
              withHeader={true}
              errorMessageToShow={message}
              errorChecker={() => {
                return false;
              }}
              setInputValue={setEmail}
              setIsInputValueSelected={setIsLastNameSelected}
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
          {/* {isLastNameSelected && ( */}
          <View
            style={{
              height: 40,
              width: "100%",
            }}
          >
            <RoundedButton
              label='Suivant'
              onPress={() => {
                verifyEmail();
              }}
              colored={true}
            />
          </View>
          {/* ) */}
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

export default Email;
