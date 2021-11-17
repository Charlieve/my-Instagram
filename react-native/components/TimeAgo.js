import React from 'react'
import { View, Text} from 'react-native'
import { formatDistanceToNow } from 'date-fns'

export default function TimeAgo({timestamp, style, short=false}) {
    let timeAgo = ''
    if(timestamp){
        const timePerios = formatDistanceToNow(timestamp)
        timeAgo = short?String(timePerios):String(timePerios)+ ' ago'
    }

    return (
        <Text style={style}> {timeAgo}
        </Text>
    )
}