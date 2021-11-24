import React from 'react'
import { View } from 'react-native'
import NotCreateYet from './NotCreateYet'


export default function ChatStackScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <NotCreateYet />
    </View>
  )
}