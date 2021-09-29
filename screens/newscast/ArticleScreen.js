import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const ArticleScreen = ({ navigation, route }) => {
  const [liked, setLiked] = useState(route.params.likes);

  console.log("id:", route.params.id);

  const handlePress = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await axios.post(
        "http://smartbins-back.herokuapp.com/api/actualites/article/liker",
        {
          idArticle: `${route.params.id}`,
          idAccount: `${userId}`,
        }
      );
      setLiked(response.data.data[0].likes);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ position: "relative" }}>
          <Image
            style={styles.img}
            source={{
              uri: `${route.params.picture}`,
            }}
          ></Image>
          {/* <View
            style={styles.likesContainer}
            onPress={() => {
              alert("hello");
              handlePress();
              console.log("hello");
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: 18,
                  color: "rgb(188,224,253)",
                  marginRight: 5,
                }}
              >
                {liked}
              </Text>
              <AntDesign
                name="like2"
                size={24}
                color="rgb(188,224,253)"
                style={{ marginRight: 10 }}
              />
            </View>
          </View> */}
        </View>
        <Text style={styles.title}>{route.params.title}</Text>
        <Text style={styles.body}>{route.params.body}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    marginBottom: 20,
    marginTop: 20,
  },
  container: { alignItems: "center", marginTop: 20, backgroundColor: "white" },
  img: {
    width: width,
    height: 300,
  },
  body: {
    width: 0.98 * width,
    fontSize: 18,
    margin: 20,
    lineHeight: 20,
    padding: 10,
  },
  likesContainer: {
    flexDirection: "row",
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    padding: 2,
    paddingLeft: 10,
  },
});

export default ArticleScreen;
