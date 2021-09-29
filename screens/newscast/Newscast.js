import React, { useEffect, useState } from "react";
import { Text, View, FlatList, Image } from "react-native";
import ArticleCard from "../../components/Article";
import ArticleScreen from "./ArticleScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

function Newscast({ navigation }) {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem("userId");
      try {
        const response = await axios.get(
          `http://smartbins-back.herokuapp.com/api/actualites/${userId}`
        );
        setData(response.data.data);
        console.log("fetch:", response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <ArticleCard
      title={item.title}
      picture={item.picture}
      body={item.body}
      likes={item.likes}
      id={item._id}
    />
  );

  return (
    <View style={{ backgroundColor: "white" }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}

export default Newscast;
