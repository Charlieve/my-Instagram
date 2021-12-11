import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import createStyles from "../styles/styles";
import Icon from "react-native-vector-icons/Ionicons";

import ChatScreenChatList from "./ChatScreenChatList";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";

const ChatScreen = () => {
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, marginTop: 25 }}>
      <View
        style={[
          styles.css.custumizeHeader,
          { borderBottomWidth: 0, alignItems: "center", marginBottom: 5 },
        ]}
      >
        <Icon
          onPress={() => {
            navigation.goBack();
          }}
          name="chevron-back"
          color={styles.colors.text}
          size={40}
        />
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          onPress={() => navigation.push("Modal")}
        >
          <Text style={[styles.css.custumizeHeaderTitle, { marginRight: 5 }]}>
            {userId.replace(/(.{20})(.*)/, "$1...")}
          </Text>
          <Icon
            name="chevron-down-outline"
            color={styles.colors.text}
            size={16}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ margin: 5 }}>
          <Icon name="list-outline" color={styles.colors.text} size={32} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            margin: 5,
            marginRight: 10,
            paddingBottom: 2, //visual center Icon
          }}
        >
          <Icon
            name="create-outline"
            color={styles.colors.text}
            size={28}
            onPress={() => navigation.push("ChatNewMessage")}
          />
        </TouchableOpacity>
      </View>
      <ChatScreenChatList userId={userId} />
    </SafeAreaView>
  );
};

export default ChatScreen;
