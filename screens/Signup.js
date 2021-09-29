import React, { useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { Entypo } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Adress from "./signup/Adress";
import Badges from "./signup/Badges";
import City from "./signup/City";
import ConfirmPassword from "./signup/ConfirmPassword";
import Email from "./signup/Email";
import LastName from "./signup/LastName";
import Name from "./signup/Name";
import Password from "./signup/Password";
import Department from "./signup/Department";
import ConfirmEmail from "./signup/ConfirmEmail";
import FinalMessage from "./signup/FinalMessage";

const Stack = createStackNavigator();

function Signup() {
  const [email, setEmail] = useState("");
  const [toConfirm, setToConfirm] = useState("");
  const [lastName, setLastName] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [badges, setBadges] = useState("");
  const [adress, setAdress] = useState("");
  const [tokenId, setTokenId] = useState([]);

  console.log("tokenId:", tokenId);

  console.log("adress:", adress);

  console.log("lastName in sign up:", lastName);

  const signupRequest = {
    email: email,
    password: password,
    first_name: name,
    last_name: lastName,
    id_region: department,
    id_municipality: city,
    id_addresses_id: adress,
    is_valide: false,
    tokens_ids: tokenId,
  };

  console.log("REQUEST:", signupRequest);

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="LastName"
        options={{ headerShown: false }}
      >
        <Stack.Screen name="LastName" options={{ headerShown: false }}>
          {(props) => <LastName {...props} setLastName={setLastName} />}
        </Stack.Screen>
        <Stack.Screen name="Name" options={{ headerShown: false }}>
          {(props) => <Name {...props} setName={setName} />}
        </Stack.Screen>
        <Stack.Screen name="Email" options={{ headerShown: false }}>
          {(props) => (
            <Email
              {...props}
              setToConfirm={setToConfirm}
              toConfirm={toConfirm}
              email={email}
              setEmail={setEmail}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ConfirmEmail" options={{ headerShown: false }}>
          {(props) => (
            <ConfirmEmail
              {...props}
              setEmail={setEmail}
              toConfirm={toConfirm}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Password" options={{ headerShown: false }}>
          {(props) => <Password {...props} setToConfirm={setToConfirm} />}
        </Stack.Screen>
        <Stack.Screen name="ConfirmPassword" options={{ headerShown: false }}>
          {(props) => (
            <ConfirmPassword
              {...props}
              setPassword={setPassword}
              toConfirm={toConfirm}
              password={password}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Department" options={{ headerShown: false }}>
          {(props) => <Department {...props} setDepartment={setDepartment} />}
        </Stack.Screen>
        <Stack.Screen name="City" options={{ headerShown: false }}>
          {(props) => (
            <City {...props} setCity={setCity} department={department} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Adress" options={{ headerShown: false }}>
          {(props) => (
            <Adress
              {...props}
              department={department}
              city={city}
              setAdress={setAdress}
              adress={adress}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Badges" options={{ headerShown: false }}>
          {(props) => (
            <Badges
              {...props}
              setBadges={setBadges}
              badges={badges}
              signupRequest={signupRequest}
              setTokenId={setTokenId}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="FinalMessage" options={{ headerShown: false }}>
          {(props) => <FinalMessage {...props} signupRequest={signupRequest} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Signup;
