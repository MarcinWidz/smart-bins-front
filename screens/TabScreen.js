import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabScreen() {
  return (
    <Stack.Screen
      initialRouteName='Home'
      name='Tab'
      options={{ headerShown: false, animationEnabled: false }}
    >
      {() => (
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: "tomato",
            inactiveTintColor: "gray",
          }}
        >
          <Tab.Screen
            name='Home'
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => {
                return <Icon name={"ios-home"} size={size} color={color} />;
              },
            }}
          >
            {() => (
              <Stack.Navigator>
                <Stack.Screen
                  name='Home'
                  options={{
                    title: "My App",
                    headerStyle: { backgroundColor: "red" },
                    headerTitleStyle: { color: "white" },
                  }}
                >
                  {() => <Dashboard />}
                </Stack.Screen>
              </Stack.Navigator>
            )}
          </Tab.Screen>
          <Tab.Screen
            name='Settings'
            options={{
              tabBarLabel: "Settings",
              tabBarIcon: ({ color, size }) => (
                <Icon name={"ios-options"} size={size} color={color} />
              ),
            }}
          >
            {() => (
              <Stack.Navigator>
                <Stack.Screen
                  name='Settings'
                  options={{ title: "Settings", tabBarLabel: "Settings" }}
                >
                  {() => <Settings />}
                </Stack.Screen>
              </Stack.Navigator>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </Stack.Screen>
  );
}

export default TabScreen;
