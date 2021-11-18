import React from 'react';
import { Image, Text, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

const uri = 'https://s3.amazonaws.com/exp-icon-assets/ExpoEmptyManifest_192.png';

export default function NewPostStackScreen() {
  const text = 'Hello, my container is blurring contents underneath!';
  return (
    <View style={styles.container}>
      <Image style={[StyleSheet.absoluteFill, styles.image]} source={{ uri }} />
      <BlurView intensity={100} style={styles.blurContainer}>
        <Text style={styles.text}>{text}</Text>
      </BlurView>
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <Text style={styles.text}>{text}</Text>
      </BlurView>
      <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
        <Text style={[styles.text, { color: '#fff' }]}>{text}</Text>
      </BlurView>
      <View><Text>asdfasdfasdf</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '600'
  },
});

