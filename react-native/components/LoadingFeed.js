import React from "react";
import { View, Text } from "react-native";
import createStyles from "../styles/styles";
import LoadingEffect from "./LoadingEffect";
import LoadingText from "./LoadingText";

const LoadingFeed = ({ style }) => {
  const styles = createStyles();
  return (
    <View style={style}>
      <View style={styles.css.feedHeaderContainer}>
        <View style={styles.css.feedHeaderAuthorContainer}>
          <LoadingEffect
            style={{ height: "100%", aspectRatio: 1, borderRadius: 50 }}
          />
          <View style={styles.css.feedHeaderAuthor}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 6,
              }}
            >
              <LoadingEffect
                style={{ width: 120, height: 8, marginTop: 4, marginBottom: 4 }}
              />
            </View>
          </View>
        </View>
      </View>
      <LoadingEffect
        style={{
          width: "100%",
          aspectRatio: 1,
          borderRadius: 0,
        }}
      />
      <View style={[styles.css.feedContentContainer,{paddingTop:20}]}>
        <LoadingText style={{ width: "90%" }} />
        <LoadingText style={{ width: "20%", marginTop: 10 }} />
      </View>
    </View>
  );
};

export default LoadingFeed;
