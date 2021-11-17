import React, {useState} from 'react';
import { FlatList } from 'react-native';
import Feed from '../components/Feed'
import DemoJSON from "../demo/feed/feed1.json"

export default function FeedsDetailContainer({navigation}) {
  const [data,setData] = useState([DemoJSON,DemoJSON])
  return(
      <FlatList style={{width:'100%'}}
        data={data}
        renderItem = {({item})=> (<Feed feedData={item} navigation={navigation}/>)}
        initialNumToRender = {1}
        onEndReachedThreshold={0.5}
        onEndReached = {()=> {
          setData([...data, DemoJSON]);
        }}
        onRefresh = {()=>{
          setData([DemoJSON])
        }}
        refreshing = {false}
      />
  )
  }