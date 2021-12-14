import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import createStyles from "../styles/styles";
import axios from "axios";
import store from "../app/store";
import { useSelector } from "react-redux";
import { fetchUser, selectUserInfoStatus } from "../features/user/userSlice";
import { fetchMessage } from "../features/message/messageSlice";
import GLOBAL from "../GLOBAL.json";

const Welcome = () => {
  const styles = createStyles();
  const [bots, setBots] = useState();
  const botSelecter = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          store.dispatch(fetchUser(item.id));
          store.dispatch(fetchMessage(item.id));
        }}
      >
        <View
          style={{
            height: 40,
            width: "100%",
            flexDirection: "row",
            marginBottom: 20,
            marginLeft: 20,
            alignItems: "center",
          }}
        >
          <Image
            style={{
              height: "100%",
              aspectRatio: 1,
              borderRadius: 50,
              marginRight: 10,
            }}
            source={{
              uri: `${GLOBAL.SERVERIP}/users/${item.id}/userimage.png`,
            }}
          />
          <Text style={[styles.css.normalFont, { flex: 1, paddingRight: 20 }]}>
            {item.id}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    (async () => {
      const getBots = await axios.get(GLOBAL.SERVERIP + "/api/bots");
      const botsArr = [];
      for (let bot of getBots.data) {
        botsArr.push({ id: bot.userId });
      }
      setBots(botsArr);
    })();
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={[styles.css.boldFont, { fontSize: 18 }]}>
        Select bot to login
      </Text>
      <View
        style={{
          height: 300,
          width: "80%",
          margin: 30,
          backgroundColor: styles.colors.subButton,
          overflow: "hidden",
          borderRadius: 20,
        }}
      >
        <FlatList
          data={bots}
          renderItem={botSelecter}
          keyExtractor={(item, index) => "bot" + index}
          style={{ paddingTop: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
