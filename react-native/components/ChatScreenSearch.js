import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import createStyles from "../styles/styles";
import Icon from "react-native-vector-icons/Ionicons";

const ChatScreenSearch = () => {
  const styles = createStyles();
  return (
    <View style={{ margin: 10, marginTop:0 }}>
      <View style={styles.css.searchContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            padding: 5,
          }}
        >
          <Icon
            name="search"
            color={styles.colors.subText}
            size={18}
            style={{ marginRight: 5 }}
          />
          <Text
            style={{
              color: styles.colors.subText,
              fontSize: 16,
              fontWeight: "400",
            }}
          >
            Search
          </Text>
        </View>
        <TouchableOpacity style={{ marginRight: 5 }}>
          <Icon name="options" color={styles.colors.subText} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreenSearch;
