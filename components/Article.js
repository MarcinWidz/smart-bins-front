import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  Provider as PaperProvider,
  Card,
  Title,
  Paragraph,
  Avatar,
  Button,
} from "react-native-paper";

const Like = (props) => <Avatar.Icon {...props} icon="like" />;

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const ArticleCard = ({ title, image, body, id, picture, likes }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Article", {
          title: title,
          picture: picture,
          body: body,
          likes: likes,
          id: id,
        });
      }}
    >
      <Card
      // mode="elevated" elevation={5}
      >
        <Card.Content style={{ position: "relative" }}>
          <Card.Cover source={{ uri: `${picture}` }} />
          {/* <View style={styles.likesContainer}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: 18,
                  color: "rgb(188,224,253)",
                  marginRight: 5,
                }}
              >
                {likes}
              </Text>
              <AntDesign
                name='like2'
                size={24}
                color='rgb(188,224,253)'
                style={{ marginRight: 10 }}
              />
            </View>
          </View> */}
        </Card.Content>
        <Card.Content>
          <Title>{title}</Title>
          <Paragraph numberOfLines={2}>{body}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: 0.9 * width,
    height: 0.25 * height,
    borderRadius: 20,
    position: "relative",
  },
  container: { alignItems: "center", marginTop: 20 },
  header: { fontSize: 18, width: 0.9 * width, margin: 10 },
  background: {
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "rgba(188,224,253,0.3)",
    borderColor: "#BCE0FD",
    borderWidth: 1,
    padding: 15,
    width: 0.95 * width,
  },
  description: { width: 0.9 * width, margin: 10 },
  likesContainer: {
    flexDirection: "row",
    position: "absolute",
    right: 20,
    bottom: 5,
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    padding: 2,
    paddingLeft: 10,
  },

  cardStyle: {
    marginVertical: 50,
  },
});

export default ArticleCard;
