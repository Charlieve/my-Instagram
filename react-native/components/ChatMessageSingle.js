import GLOBAL from "../GLOBAL.json";
import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import createStyles from "../styles/styles";
import Icon from "react-native-vector-icons/Ionicons";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";

import ChatMessageProvider from "./ChatMessageProvider";

const ChatMessageSingle = ({ contactId }) => {
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, marginTop: 25 }}>
      {/* HEADER */}
      <View
        style={[
          styles.css.custumizeHeader,
          {
            alignItems: "center",
            marginBottom: 5,
            height: 55,
            paddingRight: 5,
          },
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
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10,
            marginLeft: 5,
          }}
          //   onPress={() => navigation.push("Modal")} UserProfile
        >
          <Image
            style={{ height: "100%", aspectRatio: 1, borderRadius: 50 }}
            source={{
              uri: `${GLOBAL.SERVERIP}/users/${contactId}/userimage.png`,
            }}
          />
          <Text
            style={[
              styles.css.custumizeHeaderSmallTitle,
              { marginLeft: 10, marginRight: 5 },
            ]}
          >
            {contactId.replace(/(.{22})(.*)/, "$1...")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ margin: 10 }}>
          <Icon name="call-outline" color={styles.colors.text} size={28} />
        </TouchableOpacity>
        <TouchableOpacity style={{ margin: 10 }}>
          <Icon name="videocam-outline" color={styles.colors.text} size={28} />
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <View style={{ flex: 1 }}>
        {/* USER INFORMATION */}
        <View style={{ alignItems: "center" }}>
          <Image
            style={{
              height: 100,
              aspectRatio: 1,
              borderRadius: 50,
              margin: 10,
              marginTop: 20,
            }}
            source={{
              uri: `${GLOBAL.SERVERIP}/users/${contactId}/userimage.png`,
            }}
          />
          <Text style={[styles.css.boldFont, { margin: 5, fontSize: 16 }]}>
            {contactId}
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

        {/* MESSAGES */}

        <ChatMessageProvider contactId={contactId} />
        
      </View>
    </SafeAreaView>
  );
};

export default ChatMessageSingle;
