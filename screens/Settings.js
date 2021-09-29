import React from "react";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import {
  TextInput as TextInput2,
  Button,
  IconButton,
  Avatar,
} from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ERRORS from "../businessLogic/errorMessages.js";
import AddressModal from "../composants/AddressModal.js";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as FIELDSNAMES from "../businessLogic/fieldsNames.js";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import {
  getUserInformations,
  sendEmail,
  updateName,
  updateEmail,
  updatePassword,
  updateAddress as updateRemoteAddress,
  checkToken,
  updateTokens,
} from "../businessLogic/authentification";
/**
 *
 * @todo: manque le numéro et le nom du département à retourner
 * @todo: fonction de persistance des données à ajouter
 */

const CELL_COUNT = 6;

function Settings({ setIsConnected }) {
  // Modification de l'avatar
  let [avatarUrl, setAvatarUrl] = useState("");
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [takenPicture, setTakenPicture] = useState(null);

  // Modification du nom et prénom
  let [firstName, setFirstName] = useState("");
  let [tempFirstName, setTempFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [tempLastName, setTempLastName] = useState("");
  let [isNameEditable, setIsNameEditable] = useState(false);

  // Modification de l'email
  let [email, setEmail] = useState("");
  let [isEmailEditable, setIsEmailEditable] = useState(false);
  let [tempEmail, setTempEmail] = useState("");

  // Saisi du code de validation
  let [emailCodeValidation, setEmailCodeValidation] = useState();
  let [isValidationCodeVisible, setIsValidationCodeVisible] = useState(false);

  // Modification du mot de passe
  let [password, setPassword] = useState("");
  let [passwordConfirmation, setPasswordConfirmation] = useState("");
  let [set, setTempPassword] = useState("");
  let [isPasswordEditable, setIsPasswordEditable] = useState(false);

  // Modification de l'adresse
  let [address, setAddress] = useState({});
  let [isAddressEditable, setIsAddressEditable] = useState(false);

  // Modification des tokens
  let [tokens, setTokens] = useState([]);
  let [newToken, setNewToken] = useState("");
  let [tempTokens, setTempTokens] = useState([]);
  let [isValidNewToken, setIsValidNewToken] = useState(true);

  async function loadData() {
    try {
      let userId = await AsyncStorage.getItem("userId");
      let userToken = await AsyncStorage.getItem("userToken");
      // console.log("myInformations:", userId, userToken);
      let response = await getUserInformations(userId, userToken);
      // console.log("my response:", response);
      if (response.succeded) {
        setFirstName(response.firstName);
        setTempFirstName(response.firstName);
        setLastName(response.lastName);
        setTempLastName(response.lastName);
        setEmail(response.email);
        setTempEmail(response.email);
        setAddress(response.address);
        setTokens(response.tokens);
        // console.log("mytokens:", response.tokens);
        // console.log("my address:", response.address);
      } else {
        //quoi faire
        //Afficher un message
      }
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    loadData();
  }, []);
  React.useEffect(() => {
    loadData();
  }, [tempTokens]);

  React.useEffect(() => {
    loadData();
  }, [firstName, lastName, email]);

  async function updateAddress(newAddress) {
    try {
      // console.log("my new address:", newAddress);
      let userToken = await AsyncStorage.getItem("userToken");
      let userId = await AsyncStorage.getItem("userId");
      let response = await updateRemoteAddress(
        userToken,
        userId,
        newAddress.id
      );
      setAddress(newAddress);
    } catch (error) {
      console.log("an error occured when updating the address:", error);
    }
  }

  // Pour la validation du code
  const [value, setValue] = React.useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [errorMessage, setErrorMessage] = useState("  ");
  React.useEffect(() => {
    // console.log(value);
    async function checkCodeValidity() {
      if (value.length === 6) {
        // console.log("here1", value, emailCodeValidation);
        if (value === emailCodeValidation) {
          setErrorMessage("goood");
          let userToken = await AsyncStorage.getItem("userToken");
          let userId = await AsyncStorage.getItem("userId");
          await updateEmail(userToken, userId, tempEmail);
          setIsValidationCodeVisible(false);
          setEmail(tempEmail);
          setValue("");
          //faire la requête de persistance de l'e-mail
          // console.log("here2");
        } else {
          setErrorMessage(ERRORS.BAD_CODE);
        }
      }
    }
    checkCodeValidity();
    // console.log("value", value);
  }, [value]);

  // const getPermissionAndGetPicture = async () => {
  //   // demander la permission d'accès à la galerie photo
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  //   if (status === "granted") {
  //     // ouvrir la galerie photo
  //     const result = await ImagePicker.launchImageLibraryAsync();
  //     console.log(result);

  //     if (!result.cancelled) {
  //       // on stocke la photo sélectionnée dans un state
  //       setSelectedPicture(result.uri);
  //     } else {
  //       alert("Pas de photo sélectionnée");
  //     }
  //   } else {
  //     alert("Permission refusée");
  //   }
  // };

  // const getPermissionAndTakePicture = async () => {
  //   // demander la permission d'accès à l'appareil' photo
  //   const { status } = await ImagePicker.requestCameraPermissionsAsync();

  //   if (status === "granted") {
  //     // ouvrir l'appareil photo
  //     const result = await ImagePicker.launchCameraAsync();
  //     console.log(result);

  //     if (!result.cancelled) {
  //       // on stocke la photo prise avec l'appareil dans un state
  //       setTakenPicture(result.uri);
  //     } else {
  //       alert("Pas de photo prise");
  //     }
  //   } else {
  //     alert("Permission refusée");
  //   }
  // };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="height"
        keyboardVerticalOffset={50}
      >
        <View style={styles.mainContainer}>
          <View style={styles.mainMarginContainer}>
            <Text style={styles.pageTitle}>Bonjour {firstName},</Text>
            {/* Section pour image+ bouton changement photo + chargement photo + nom + prenom */}
            <View style={[styles.profilHeader]}>
              <View style={styles.profilContainer}>
                <View style={styles.avatarContainer}>
                  {!avatarUrl ? (
                    <Avatar.Icon
                      icon="account-circle"
                      size={100}
                      style={{ backgroundColor: "#2699FB" }}
                      color="white"
                    />
                  ) : null}
                  {/* <Text>Pour la photo de profile</Text> */}
                </View>
                {/* Edition de la photo */}
                {/* <View style={styles.editAvatar}>
                  <IconButton
                    icon="camera"
                    color="#2699FB"
                    size={30}
                    onPress={() => {
                      getPermissionAndTakePicture();
                    }}
                  />
                  <IconButton
                    icon="folder-multiple-image"
                    color="#2699FB"
                    size={30}
                    onPress={() => {
                      getPermissionAndGetPicture();
                    }}
                  />
                </View> */}
              </View>
              {/* Nom et prénom */}
              <View style={styles.shortDescription}>
                {/* les champs nom et prenoms */}
                <View style={styles.nameInputs}>
                  <TextInput2
                    underlineColor={"#2699FB"}
                    selectionColor={"#2699FB"}
                    style={styles.inputStyle}
                    disabled={!isNameEditable}
                    onChangeText={(text) => {
                      setTempFirstName(text);
                    }}
                    value={tempFirstName}
                  >
                    {/* <Text>{firstName}</Text> */}
                  </TextInput2>
                  <TextInput2
                    underlineColor={"#2699FB"}
                    selectionColor={"#2699FB"}
                    style={styles.inputStyle}
                    disabled={!isNameEditable}
                    onChangeText={(text) => {
                      setTempLastName(text);
                    }}
                    value={tempLastName}
                  >
                    {/* {lastName} */}
                  </TextInput2>
                </View>
                {/* les boutons pour la modification du nom et prénom */}
                <View>
                  <IconButton
                    icon={!isNameEditable ? "pencil" : "send"}
                    color={"#2699FB"}
                    size={25}
                    onPress={async () => {
                      if (isNameEditable) {
                        //send data à implémenter
                        let userToken = await AsyncStorage.getItem("userToken");
                        let userId = await AsyncStorage.getItem("userId");
                        // console.log("my authenticators:", userToken, userId);
                        let response = await updateName(
                          userToken,
                          userId,
                          tempLastName,
                          tempFirstName
                        );
                        setFirstName(tempFirstName);
                        setLastName(tempLastName);
                        // console.log(response);
                      }
                      setIsNameEditable(!isNameEditable);
                    }}
                  />
                </View>
              </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Section pour email et modt de passe */}
              <View style={styles.section}>
                {/* Le titre */}
                <Text style={styles.sectionTitle}>{FIELDSNAMES.MYEMAIL}</Text>

                <View style={styles.emailInput}>
                  {/* le champs d'email*/}
                  <TextInput2
                    underlineColor={"#2699FB"}
                    selectionColor={"#2699FB"}
                    style={[styles.inputStyle, { flex: 1 }]}
                    disabled={!isEmailEditable}
                    onChangeText={(text) => {
                      setTempEmail(text);
                    }}
                    value={tempEmail}
                  >
                    {/* {tempEmail} */}
                  </TextInput2>
                  {/* Les boutons pour modifier l'email */}
                  <IconButton
                    icon={!isEmailEditable ? "pencil" : "send"}
                    color={"#2699FB"}
                    size={25}
                    onPress={async () => {
                      if (isEmailEditable) {
                        // L'utilisateur a fini la saisi donc du coup il faut sauvegarder le mail temporaire
                        let verificationCode = await sendEmail(tempEmail);
                        console.log(verificationCode.validation_code);
                        setEmailCodeValidation(
                          verificationCode.validation_code
                        ); /// Pas très bon ce code
                        setIsEmailEditable(!isEmailEditable); // désactiver le mode édition
                        setIsValidationCodeVisible(true); // afficher la modale
                      }
                      setIsEmailEditable(!isEmailEditable);
                    }}
                  />
                </View>
                {isValidationCodeVisible ? (
                  <Modal>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <Text>hello</Text>
                      <CodeField
                        ref={ref}
                        {...props}
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFiledRoot}
                        caretHidden={true}
                        autoCompleteType="off"
                        keyboardType="default"
                        textContentType="oneTimeCode"
                        onSubmitEditing={() => console.log("hello")}
                        renderCell={({ index, symbol, isFocused }) => (
                          <View
                            onLayout={getCellOnLayoutHandler(index)}
                            key={index}
                            style={[
                              styles.cellRoot,
                              isFocused && styles.focusCell,
                            ]}
                          >
                            <Text style={styles.cellText}>
                              {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                          </View>
                        )}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          // ne pas oublier de réinitialiser l'ensemble des champs
                          setIsValidationCodeVisible(false);
                          setTempEmail(email);
                          setValue("");
                        }}
                      >
                        <Text>Annuler</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          //envoyer et sauvegarder le code de validation
                          let verificationCode = await sendEmail(tempEmail);
                          console.log(verificationCode.validation_code);
                          setEmailCodeValidation(
                            verificationCode.validationCode
                          );
                        }}
                      >
                        <Text>Envoyer un nouveau code</Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                ) : null}
              </View>
              {/* Section de modification du mot de passe */}
              <View style={styles.section}>
                {/* boutton pour la modification du mot de passe */}

                <Button
                  icon="key"
                  mode={isPasswordEditable ? "contained" : "outlined"}
                  color="#2699FB"
                  onPress={async () => {
                    if (isPasswordEditable) {
                      if (password === passwordConfirmation) {
                        //persiste data
                        let userToken = await AsyncStorage.getItem("userToken");
                        let userId = await AsyncStorage.getItem("userId");
                        let response = await updatePassword(
                          userToken,
                          userId,
                          password
                        );
                        if (response.succeded) {
                          await AsyncStorage.setItem(
                            "userToken",
                            response.data[0].newToken
                          );
                          // console.log(await AsyncStorage.getItem("userToken"));
                          setIsPasswordEditable(false);
                          // empty passwords
                          setPassword("");
                          setPasswordConfirmation("");
                          setIsConnected(true);
                        }
                      } else {
                        //afficher un message d'erreur
                        console.log("mauvais password");
                      }
                    }
                    setIsPasswordEditable(!isPasswordEditable);
                  }}
                >
                  {isPasswordEditable
                    ? FIELDSNAMES.RESETMYPASSWORD
                    : FIELDSNAMES.CONFIRMEMYPASSWORD}
                </Button>

                {isPasswordEditable ? (
                  <>
                    <TextInput2
                      underlineColor={"#2699FB"}
                      selectionColor={"#2699FB"}
                      secureTextEntry={true}
                      style={[styles.inputStyle, { marginTop: 10 }]}
                      disabled={!isPasswordEditable}
                      onChangeText={(text) => {
                        setPassword(text);
                      }}
                      value={password}
                      placeholder={"Nouveau mot de passe"}
                    >
                      {/* {password} */}
                    </TextInput2>
                    <TextInput2
                      underlineColor={"#2699FB"}
                      selectionColor={"#2699FB"}
                      secureTextEntry={true}
                      style={[styles.inputStyle, { marginTop: 10 }]}
                      disabled={!isPasswordEditable}
                      placeholder={"Confirmation de mot de passe"}
                      onChangeText={(text) => {
                        setPasswordConfirmation(text);
                      }}
                      value={passwordConfirmation}
                    >
                      {/* {passwordConfirmation} */}
                    </TextInput2>
                    <Text
                      style={
                        password === passwordConfirmation
                          ? styles.errorMessageHide
                          : styles.errorMessageShow
                      }
                    >
                      Les mots de passes ne sont pas identiques
                    </Text>
                  </>
                ) : null}
              </View>
              {/* Section pour l'adresse */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{FIELDSNAMES.MYADDRESS}</Text>

                <View style={styles.emailInput}>
                  <View style={[styles.nameInputs, { flex: 1 }]}>
                    <TextInput2
                      underlineColor={"#2699FB"}
                      selectionColor={"#2699FB"}
                      style={[styles.inputStyle]}
                      disabled={true}
                      value={address.houseNumber + " " + address.streetName}
                    ></TextInput2>
                    <TextInput2
                      underlineColor={"#2699FB"}
                      selectionColor={"#2699FB"}
                      style={[styles.inputStyle]}
                      disabled={true}
                      value={address.cityName + ", " + address.postCode}
                    ></TextInput2>
                  </View>
                  <IconButton
                    icon={"pencil"}
                    color={"#2699FB"}
                    size={25}
                    onPress={async () => {
                      setIsAddressEditable(true);
                    }}
                  />
                </View>
                {isAddressEditable && (
                  <AddressModal
                    setIsAddressEditable={setIsAddressEditable}
                    updateAddress={updateAddress}
                  />
                )}
              </View>
              {/* Section pour les badges */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{FIELDSNAMES.MYTOKENS}</Text>
                <View style={styles.emailInput}>
                  <TextInput2
                    underlineColor={"#2699FB"}
                    selectionColor={"#2699FB"}
                    style={[styles.inputStyle, { flex: 1 }]}
                    value={newToken}
                    onChangeText={(input) => {
                      setIsValidNewToken(true);
                      setNewToken(input);
                    }}
                  ></TextInput2>
                  <IconButton
                    icon={"plus-box"}
                    color={"#2699FB"}
                    size={30}
                    onPress={async () => {
                      try {
                        let response = await checkToken(newToken);
                        if (response.succeded) {
                          // console.log(
                          //   "new collection of tokens:",
                          //   [...tokens].push(response.data[0])
                          // );
                          // console.log("old tokens:", tokens);
                          let newTokenCollection = [...tokens];
                          // console.log("oldTokens copy:", newTokenCollection);
                          // console.log(
                          //   "response data :",
                          //   response,
                          //   response.data[0]
                          // );
                          newTokenCollection.push(response.data[0]);
                          // console.log(newTokenCollection);
                          // console.log(
                          //   "new collection of tokens:",
                          //   newTokenCollection
                          // );
                          // console.log(
                          //   "new collection of tokens:",
                          //   newTokenCollection
                          // );
                          let userToken = await AsyncStorage.getItem(
                            "userToken"
                          );
                          let userId = await AsyncStorage.getItem("userId");
                          // console.log(
                          //   "new collection ids:",
                          //   newTokenCollection.map((e) => e.id)
                          // );
                          let response2 = await updateTokens(
                            userToken,
                            userId,
                            newTokenCollection.map((e) => e.id)
                          );
                          // console.log("response 2:", response2);

                          setTempTokens(newTokenCollection);

                          setIsValidNewToken(true);
                        } else {
                          setIsValidNewToken(false);
                        }
                      } catch (error) {
                        setIsValidNewToken(false);
                      }
                    }}
                  />
                </View>
                <Text
                  style={
                    isValidNewToken
                      ? styles.errorMessageHide
                      : styles.errorMessageShow
                  }
                >
                  Badge invalide
                </Text>
                <View>
                  {tokens.length > 0 ? (
                    tokens.map((e, i) => (
                      <TextInput2
                        key={i}
                        underlineColor={"#2699FB"}
                        selectionColor={"#2699FB"}
                        style={styles.inputStyle}
                        disabled={true}
                        value={e.code}
                      ></TextInput2>
                    ))
                  ) : (
                    <Text>Aucun babge pour le moment</Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "blue",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  mainMarginContainer: {
    flex: 1,
    marginVertical: "5%",
    marginHorizontal: "3%",
    // backgroundColor: "yellow",
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: "3%",
    // backgroundColor: "pink",
  },
  profilHeader: {
    // height: 200,
    // backgroundColor: "blue",
    flexDirection: "row",
    // flexDirection: "column",
    backgroundColor: "white",
    // borderWidth: 1,
  },
  profilContainer: {
    // backgroundColor: "yellow",
    // marginVertical: "3%",
    // paddingVertical: "O%",
    // flex: 1,
    alignItems: "center",
  },
  avatarContainer: {
    // flex: 3,
  },
  editAvatar: {
    // flex: 1,
    marginVertical: 5,
    width: "50%",
    // backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  shortDescription: {
    // flex: 2,
    marginHorizontal: "3%",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    // backgroundColor: "yellow",
  },
  nameInputs: { width: "60%" },
  inputStyle: {
    // width: "70%",
    backgroundColor: "white",
    height: 25,
    fontSize: 15,
    // width: "70%",
  },
  section: {
    marginTop: 20,
    marginHorizontal: 6,
    // backgroundColor: "black",
    borderRadius: 10,
    // flex: 1,
    // padding: 10,
    // shadowColor: "black",
    // shadowOffset: { height: 4, width: 2 },
    // shadowRadius: 3,
    // shadowOpacity: 0.5,
  },
  emailInput: {
    flexDirection: "row",
    // backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "space-between",
    // flex : 1
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2799FB",
    marginVertical: 6,
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

  errorMessageHide: {
    fontSize: 12,
    color: "rgba(100,100,100,0)",
  },
  errorMessageShow: {
    fontSize: 12,
    color: "red",
  },
});

export default Settings;
