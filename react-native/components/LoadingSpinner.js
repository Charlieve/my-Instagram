import React from 'react'
import { View, Text } from 'react-native'
import createStyles from "../styles/styles";

export default function loadingSpinner() {
    const styles = createStyles();
    return (
        <View style={{width: '100%', margin: 10, alignItems:'center'}}>
            <Text style={styles.css.boldFont}>୧༼✿ ͡◕ д ◕͡ ༽୨</Text>
            <Text style={styles.css.subFont}>Pretending Loading Spinner</Text>
        </View>
    )
}
