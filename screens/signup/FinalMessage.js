import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";

function FinalMessage({ signupRequest }) {
  const [message, setMessage] = useState();
  useEffect(() => {
    const sendData = async () => {
      console.log("body:", signupRequest);
      try {
        const response = await axios.post(
          "http://smartbins-back.herokuapp.com/api/account/signup",
          signupRequest
        );
        // setMessage(response.data[1].message);
        console.log("signup request:", signupRequest);
        console.log("response: ", response.data);
      } catch (error) {
        console.log(error);
      }
    };
    sendData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Merci! Votre Demande d'inscription a été envoyé et attend la validation
        de la part de la Mairie
      </Text>
      {/* <Text>{message}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: "100%",
  },
  headerText: {
    color: "#2799FB",
    fontSize: 30,
    fontWeight: "bold",
    margin: 20,
  },
});

export default FinalMessage;
