import GLOBAL from "../GLOBAL.json";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import createStyles from "../styles/styles";
import UserIconImage from "./UserIconImage";

const ChatMessageHeaderUserInfo = ({ contactId }) => {
  const styles = createStyles();
  const StringUserId = (userId) => {
    userId = Array.isArray(userId) ? userId : [userId];
    return String(userId).length > 20 && userId.length > 1
      ? `${String(userId[0]).replace(/(.{30})(.*)/, "$1...")} and ${
          userId.length > 2
            ? String(userId.length - 1) + " other users"
            : String(userId[1]).replace(/(.{30})(.*)/, "$1...")
        }`
      : String(userId).replace(",", ", ");
  };
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ alignItems: "center", width:"80%" }}>
        <View
          style={{
            height: 100,
            aspectRatio: 1,
            borderRadius: 50,
            margin: 10,
            marginTop: 20,
          }}
        >
          <UserIconImage userId={contactId} aspectRatio={1.3} />
        </View>
        <Text style={[styles.css.boldFont, { margin: 5, fontSize: 16, textAlign: 'center'}]}>
          {StringUserId(contactId)}
        </Text>
        <TouchableOpacity
          style={{
            padding: 5,
            paddingLeft: 10,
            paddingRight: 10,
            borderColor: styles.colors.subButton,
            borderWidth: 1,
            borderRadius: 5,
            margin: 5,
          }}
        >
          <Text style={styles.css.boldFont}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatMessageHeaderUserInfo;
