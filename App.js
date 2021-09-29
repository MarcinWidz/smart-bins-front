import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, DrawerItem, Animated } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

// Import des Ecrans
import Dashboard from "./screens/Dashboard";
import Settings from "./screens/Settings";
import SignIn from "./screens/Signin";
import SignUp from "./screens/Signup";
import Invoices from "./screens/Invoices";
import Newscast from "./screens/newscast/Newscast";
import EmailInput from "./screens/resetPassword/EmailInput";
import CodeVerification from "./screens/resetPassword/CodeVerification.js";
import PasswordValidation from "./screens/resetPassword/PasswordValidation.js";
import ArticleScreen from "./screens/newscast/ArticleScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

//Définition du thème global des composants
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2799FB",
    accent: "yellow",
    background: "#FFFFFF",
  },
};

export default function App() {
  let [isConnected, setIsConnected] = React.useState(false);
  /**
   * @Todo récupérer l'id de l'utilisateur à la connexion et le persister dans l'asyn storage
   */

  console.log("theme principal:", DefaultTheme);

  React.useEffect(() => {
    async function findToken() {
      let asyncKeys = await AsyncStorage.getAllKeys();
      if (asyncKeys.includes("userToken")) {
        console.log("connected");
        setIsConnected(true);
      } else {
        console.log("not connected");
        setIsConnected(false);
      }
    }
    findToken();
  }, [isConnected]);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        {!isConnected ? (
          <Stack.Navigator>
            <Stack.Screen
              name="SignIn"
              options={{ headerShown: false, animationEnabled: false }}
            >
              {(props) => <SignIn {...props} setIsConnected={setIsConnected} />}
            </Stack.Screen>
            <Stack.Screen
              name="Reset password"
              options={{ headerShown: false, animationEnabled: false }}
            >
              {() => {
                let [email, setEmail] = React.useState("");
                let [code, setCode] = React.useState("");
                let [isThrusted, setIsThrusted] = React.useState(false);

                return (
                  <Stack.Navigator
                    screenOptions={{
                      title: "",
                      headerBackTitle: "Précédent",
                      headerStyle: {
                        shadowColor: "white",
                      },
                    }}
                  >
                    <Stack.Screen name="Email input">
                      {(props) => (
                        <EmailInput
                          {...props}
                          setEmail={setEmail}
                          setCode={setCode}
                        />
                      )}
                    </Stack.Screen>
                    <Stack.Screen name="Vérification du code">
                      {(props) => (
                        <CodeVerification
                          {...props}
                          code={code}
                          setIsThrusted={setIsThrusted}
                        />
                      )}
                    </Stack.Screen>
                    <Stack.Screen name="Réinitialisation mot de passe">
                      {(props) => (
                        <PasswordValidation
                          {...props}
                          isThrusted={isThrusted}
                          email={email}
                        />
                      )}
                    </Stack.Screen>
                  </Stack.Navigator>
                );
              }}
            </Stack.Screen>
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              // options={{ headerShown: false, animationEnabled: false }}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Sidebar" options={{ headerShown: false }}>
              {() => {
                return (
                  <Drawer.Navigator>
                    {/* initialRouteName="Signup" */}
                    <Drawer.Screen
                      name="Tableau de Bord"
                      component={Dashboard}
                    />
                    {/* <Drawer.Screen name="Mes Factures" component={Invoices} /> */}
                    <Drawer.Screen name="Mes Factures" component={Invoices} />
                    <Drawer.Screen name="Actualités" component={Newscast} />
                    <Drawer.Screen name="Utilisateur">
                      {(props) => (
                        <Settings {...props} setIsConnected={setIsConnected} />
                      )}
                    </Drawer.Screen>
                    <Drawer.Screen name="Déconnexion">
                      {(props) => (
                        <SignIn
                          {...props}
                          setIsConnected={setIsConnected}
                          askForLogOut={true}
                        />
                      )}
                    </Drawer.Screen>
                  </Drawer.Navigator>
                );
              }}
            </Stack.Screen>
            <Stack.Screen
              name="Article"
              component={ArticleScreen}
            ></Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}
