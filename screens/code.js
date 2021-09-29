import React, { useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { Entypo } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const Stack = createStackNavigator();

const departements = [
  "92 - Hauts-de-Seine",
  "93 - Seine-Saint-Denis",
  "94 - Val-de-Marne",
];

const villes = ["Fontenay Sous Bois", "Vicennes", "Boulogne-Billancourt"];

function signUp({ navigation }) {
  const [next, setNext] = useState(0);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [input, setInput] = useState("");
  const [department, setDepartment] = useState("");
  const [toConfirm, setToConfirm] = useState("");
  const [badges, setBadges] = useState([]);
  const objectKeys = [
    "name",
    "surname",
    "email",
    "password",
    "password",
    "departement",
    "ville",
    "adresse",
    "badges",
  ];

  const renderNextButton = () => {
    if (next !== 4 && next !== 3 && next !== 8) {
      return (
        <TouchableOpacity
          onPress={() => {
            let userInfoCopy = { ...userInfo };
            userInfoCopy[objectKeys[next]] = input;
            setUserInfo(userInfoCopy);
            setInput("");
            setNext(next + 1);
            // console.log("next1:", next);
            // console.log("user info1:", userInfo);
          }}
          style={{ color: "white", fontSize: 18 }}
          style={styles.connectBtn}
        >
          <Text>Suivant</Text>
        </TouchableOpacity>
      );
    } else {
      if (next === 8) {
        return (
          <TouchableOpacity
            onPress={() => {
              let userInfoCopy = { ...userInfo };
              // console.log("mes badges", badges);
              // console.log("les objets:", objectKeys[next]);
              userInfoCopy[objectKeys[next]] = badges;
              console.log("mon user copy:", userInfoCopy);
              setUserInfo(userInfoCopy);
              // console.log("test:", userInfo);
              setNext(next + 1);
              setInput("");
            }}
            style={{ color: "white", fontSize: 18 }}
            style={styles.connectBtn}
          >
            <Text>Envoyer la demande</Text>
          </TouchableOpacity>
        );
      } else if (next === 3) {
        return (
          <TouchableOpacity
            onPress={() => {
              setToConfirm(input);
              setInput("");
              setNext(next + 1);
            }}
            style={{ color: "white", fontSize: 18 }}
            style={styles.connectBtn}
          >
            <Text>Suivant</Text>
          </TouchableOpacity>
        );
      } else if (input === toConfirm) {
        return (
          <TouchableOpacity
            onPress={() => {
              let userInfoCopy = { ...userInfo };
              userInfoCopy[objectKeys[next - 1]] = input;
              setUserInfo(userInfoCopy);
              setNext(next + 1);
              setInput("");
            }}
            style={{ color: "white", fontSize: 18 }}
            style={styles.connectBtn}
          >
            <Text>Confirmer le Mot de passe</Text>
          </TouchableOpacity>
        );
      }
    }
  };

  const step = () => {
    if (next === 0) {
      return (
        <View>
          <Text>Nom de famille:</Text>
          <TextInput
            placeholder=' ex. Dupont'
            style={styles.inputs}
            onChangeText={(text) => {
              setInput(text);
            }}
          ></TextInput>
        </View>
      );
    } else if (next === 1) {
      return (
        <View>
          <Text>Prénom:</Text>
          <TextInput
            placeholder=' ex. Jean'
            style={styles.inputs}
            onChangeText={(text) => {
              setInput(text);
            }}
          ></TextInput>
        </View>
      );
    } else if (next === 2) {
      return (
        <View>
          <Text>E-mail:</Text>
          <TextInput
            onChangeText={(text) => {
              setInput(text);
            }}
            placeholder=' ex: jeandupond@mail.com'
            style={styles.inputs}
          ></TextInput>
        </View>
      );
    } else if (next === 3) {
      return (
        <View>
          <Text>Mot de Passe Choisi:</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder=' ••••••••••••••'
              secureTextEntry={!passwordIsVisible}
              style={styles.inputs}
              onChangeText={(text) => {
                setInput(text);
              }}
            ></TextInput>
            <Entypo
              onPress={() => {
                setPasswordIsVisible(!passwordIsVisible);
              }}
              name={passwordIsVisible ? "eye" : "eye-with-line"}
              color='black'
            />
          </View>
        </View>
      );
    } else if (next === 4) {
      return (
        <View>
          <Text>Confirmer le mot de passe:</Text>
          <TextInput
            placeholder=' ••••••••••••••'
            secureTextEntry={true}
            style={styles.inputs}
            onChangeText={(text) => {
              setInput(text);
            }}
          ></TextInput>
        </View>
      );
    } else if (next === 5) {
      return (
        <View>
          <Text>Departement:</Text>
          <SelectDropdown
            dropdownStyle={styles.dropdownStyle}
            rowStyle={styles.dropdownRowStyle}
            rowTextStyle={styles.dropdownRowTxtStyle}
            data={departements}
            onSelect={(selectedItem, index) => {
              setInput(selectedItem);
            }}
            defaultButtonText={"Choisir le departament"}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdownBtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={() => {
              return <Entypo name='chevron-down' size={24} color='black' />;
            }}
            dropdownIconPosition={"right"}
          />
        </View>
      );
    } else if (next === 6) {
      return (
        <View>
          <Text>Ville:</Text>
          <SelectDropdown
            dropdownStyle={styles.dropdownStyle}
            rowStyle={styles.dropdownRowStyle}
            rowTextStyle={styles.dropdownRowTxtStyle}
            data={villes}
            defaultButtonText={"Choisir la Ville"}
            onSelect={(selectedItem, index) => {
              setInput(selectedItem);
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdownBtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={() => {
              return <Entypo name='chevron-down' size={24} color='black' />;
            }}
            dropdownIconPosition={"right"}
          />
        </View>
      );
    } else if (next === 7) {
      return (
        <View>
          <Text>Adresse:</Text>
          <TextInput
            placeholder=' ex: 57 rue Guerin Leroux'
            style={styles.inputs}
            onChangeText={(text) => {
              setInput(text);
            }}
          ></TextInput>
        </View>
      );
    } else if (next === 8) {
      return (
        <View style={{ width: width }}>
          <View style={{ alignItems: "center" }}>
            {badges.map((elem, index) => {
              return <Text key={index}>{elem}</Text>;
            })}
          </View>
          <Text>Numero de Badge:</Text>
          <TextInput
            placeholder=' ex: 53 BA 67'
            style={styles.inputs}
            onChangeText={(text) => {
              setInput(text);
            }}
          ></TextInput>
          <TouchableOpacity
            style={styles.addBadge}
            onPress={() => {
              const copy = [...badges];
              console.log("copy:", copy);
              copy.push(input);
              console.log("copy:", copy);
              console.log("input:", input);
              setBadges(copy);
              console.log("badges:", badges);
            }}
          >
            <Text>Ajouter un autre badge</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (next === 9) {
      // Axios.post les infos
      console.log(userInfo);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {next < 9 ? (
        <View>
          <Text style={styles.headerText}>Créer un compte</Text>
          {step()}
          {renderNextButton()}
          {console.log("user informations updated:", userInfo)}
          {console.log("next:", next)}
        </View>
      ) : (
        <Text style={styles.headerText}>
          Merci! Votre compte a été créé et attend la validation de la Mairie.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inputs: {
    width: 300,
    height: 50,
    backgroundColor: "white",
    margin: 20,
    borderColor: "#BCE0FD",
    borderWidth: 2,
    borderRadius: 30,
    alignItems: "flex-end",
  },

  addBadge: {
    width: 300,
    height: 50,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "#2799FB",
    borderWidth: 2,
    borderRadius: 30,
    marginBottom: 10,
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: "100%",
  },

  connectBtn: {
    marginLeft: 20,
    width: 300,
    height: 50,
    backgroundColor: "#2799FB",
    borderWidth: 2,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },

  SignInBtn: {
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "#2799FB",
    borderWidth: 2,
    borderRadius: 30,
    marginBottom: 30,
  },

  conexionContainer: {
    flex: 1,
    height: 200,
    width: "100%",
    backgroundColor: "#2799FB",
    position: "relative",
    alignItems: "center",
  },

  headerText: {
    color: "#2799FB",
    fontSize: 30,
    fontWeight: "bold",
    margin: 20,
  },
});

export default signUp;
