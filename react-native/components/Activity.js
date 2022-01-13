import React from 'react'
import { View } from 'react-native'
import NotCreateYet from './NotCreateYet'
import ChatMessageQuickReply from './ChatMessageQuickReply'
import createStyles from "../styles/styles";


export default function ActivityStackScreen() {
  const styles = createStyles();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* <NotCreateYet /> */}
    <ChatMessageQuickReply size={100} progress={88}/>
    </View>
  )
}