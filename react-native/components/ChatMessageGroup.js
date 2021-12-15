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
import UserIconImage from "./UserIconImage";

const ChatMessageGroup = ({ contactId }) => {
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
          <View style={{ height: "100%", aspectRatio: 1.1 }}>
            <UserIconImage userId={contactId} aspectRatio={1.1}/>
          </View>
          <Text
            style={[
              styles.css.custumizeHeaderSmallTitle,
              { marginLeft: 10, marginRight: 5 },
            ]}
          >
            {String(contactId).replace(/(.{22})(.*)/, "$1...")}
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
        {/* MESSAGES */}

        <ChatMessageProvider contactId={contactId} />
      </View>
    </SafeAreaView>
  );
};

export default ChatMessageGroup;
