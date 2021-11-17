import React from 'react'
import {View, Text} from 'react-native'
import { useSelector } from 'react-redux'

export const TestComponent = () => {
  const test = useSelector((state) => state.test)

  function RenderedTest(){
      return(
    <View>
      <Text>{test.testCotent}</Text>
    </View>
  )}

  return (
    <View>
      <RenderedTest />
    </View>
  )
}
