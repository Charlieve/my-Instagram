import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import createStyles from "../styles/styles";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

import ChatScreenSearch from "./ChatScreenSearch";

const ChatScreenChatList = ({ userId }) => {
  const navigation = useNavigation();
  const styles = createStyles();
  return (
    <ScrollView>
      <ChatScreenSearch />
      <View
        style={{
          height: "100%",
          marginTop: "20%",
          padding: "10%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Icon name="chatbubbles" size={72} color={styles.colors.subText} /> */}
        <Text
          style={[styles.css.boldFont, { fontSize: 24, fontWeight: "800" }]}
        >
          Message your friends
        </Text>
        <Text
          style={[
            styles.css.subFont,
            {
              textAlign: "center",
              marginTop: 30,
              marginBottom: 20,
              lineHeight: 20,
            },
          ]}
        >
          Message, video chat or share your favourite posts directly with people
          you care about.
        </Text>
        <TouchableOpacity onPress={()=>navigation.push('ChatNewMessage')}>
          <Text style={styles.css.hrefBoldFont}>Send message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ChatScreenChatList;
