import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import HintedInput from "../../composants/styledInputs/HintedInput";

const Badges = ({ navigation, setBadges, badges, setTokenId }) => {
  const [addBadge, setAddBadge] = useState("");
  const [badgesArr, setBadgesArr] = useState([]);
  const [data, setData] = useState("");
  const [isLastNameSelected, setIsLastNameSelected] = useState(false);

  const verifyBadge = async () => {
    try {
      console.log(addBadge);
      const response = await axios.get(
        `http://smartbins-back.herokuapp.com/api/utils/searchToken/${addBadge}`
      );
      setData(response.data);
      const copy = [...tokenId];
      copy.push(response.data.data[0].tokenId);
      setTokenId(copy);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAddBadge = () => {
    const copy = [...badgesArr];
    copy.push(addBadge);
    setBadgesArr(copy);
    console.log("badgesArr:", badgesArr);
  };

  useEffect(() => {
    if (data) {
      data.succeded === true && handleAddBadge();
    }
  }, [data]);

  return (
    <View style={styles.container}>
      {data.succeded === false ? (
        <Text style={{ color: "red" }}>{data.message}</Text>
      ) : (
        badgesArr.map((e, i) => {
          return <Text key={i}>{e}</Text>;
        })
      )}
      {/* <TextInput
        onChangeText={(text) => {
          setAddBadge(text);
        }}
        style={styles.inputs}
      ></TextInput> */}
      <View
        style={{
          height: 65,
          width: "95%",
        }}
      >
        <HintedInput
          placeholder='Nom de Famille'
          withHeader={true}
          errorMessageToShow=''
          errorChecker={() => {
            return false;
          }}
          setInputValue={setAddBadge}
          setIsInputValueSelected={setIsLastNameSelected}
          isPassword={false}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          verifyBadge();
        }}
        style={styles.addBadge}
      >
        <Text>Ajouter un badge</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          const copy = [...badgesArr];
          setBadges(copy);
          navigation.navigate("FinalMessage");
        }}
        style={styles.btn}
      >
        <Text>Finaliser la demande d'inscription</Text>
      </TouchableOpacity>
    </View>
  );
};
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

  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: "100%",
  },

  btn: {
    width: 300,
    height: 50,
    backgroundColor: "#2799FB",
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },

  addBadge: {
    width: 300,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "#2799FB",
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default Badges;
