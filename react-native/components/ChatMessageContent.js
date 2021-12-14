import React from "react";
import { ScrollView, View, Text } from "react-native";

const ChatMessageContent = (props) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View 
      // style={{height:6000}}
      >
        <Text></Text>
      </View>
        {props.children}
    </ScrollView>
  );
};

export default ChatMessageContent;
