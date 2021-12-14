import GLOBAL from "../GLOBAL.json";
import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import createStyles from "../styles/styles";

const ChatMessageHeaderUserInfo = ({contactId}) => {
    const styles = createStyles();
    return (
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
    )
}

export default ChatMessageHeaderUserInfo
