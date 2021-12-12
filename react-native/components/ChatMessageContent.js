import React from "react";
import { ScrollView, View, Text } from "react-native";

const ChatMessageContent = (props) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{height:6000, backgroundColor:'#000'}}>
        <Text></Text>
        {props.children}
      </View>
    </ScrollView>
  );
};

export default ChatMessageContent;
