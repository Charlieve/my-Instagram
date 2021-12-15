import React from "react";
import { Image, View } from "react-native";
import GLOBAL from "../GLOBAL.json";
import createStyles from "../styles/styles";

export default function UserIconImage({ userId, aspectRatio = 1 }) {
  const styles = createStyles();
  userId = Array.isArray(userId) ? userId : [userId];
  const SingleUserImage = ({ userId, queue = -1, qty }) => (
    <Image
      style={[
        {
          aspectRatio: 1,
          borderRadius: 50,
        },
        queue === -1
          ? {
              height: "100%",
              width: "100%",
            }
          : {
              position: "absolute",
              height: "100%",
              aspectRatio: 1,
              top: `${queue * (20 / (qty - 1)) - 10}%`,
              left: `${
                queue * ((20 + (aspectRatio - 1) * 100) / (qty - 1)) -
                10 -
                (aspectRatio - 1) * 50
              }%`,
              borderWidth: 2,
              borderColor: styles.colors.background,
            },
      ]}
      source={{
        uri: `${GLOBAL.SERVERIP}/users/${userId}/userimage.png`,
      }}
    />
  );
  if (userId.length > 1) {
    const multiUsersImageArr = [];
    for (let i = 0; i < Math.min(4, userId.length); i++) {
      multiUsersImageArr.push(
        <SingleUserImage
          userId={userId[i]}
          queue={i}
          qty={Math.min(4, userId.length)}
        />
      );
    }
    return (
      <View
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        {multiUsersImageArr}
      </View>
    );
  } else {
    return <SingleUserImage userId={userId} />;
  }
}
