import React from "react";
import { View, Text } from "react-native";
import createStyles from "../styles/styles";
import Icon from "react-native-vector-icons/Ionicons";
import { format } from "date-fns";

const ChatMessageClock = ({ myMessage, timestamp }) => {
  const styles = createStyles();
  return (
    <View style={styles.css.chatClockContainer}>
      <View style={{ flexDirection: "row", alignItems: "center"}}>
        <Icon
          name={
            myMessage
              ? "arrow-forward-circle-outline"
              : "arrow-back-circle-outline"
          }
          size={18}
          color={styles.colors.subText}
        />
        <Text style={{ color: styles.colors.subText, fontSize: 12, marginLeft:2 }}>
          {format(timestamp, "HH:mm")}
        </Text>
      </View>
    </View>
  );
};

export default ChatMessageClock;
