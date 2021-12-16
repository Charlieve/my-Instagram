import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated } from "react-native";
import createStyles from "../styles/styles";

import { useSelector, useDispatch } from "react-redux";
import {
  selectNotificationIsShow,
  selectNotificationData,
  pullNotification,
} from "../features/notification/notificationSlice";

const Notification = () => {
  const styles = createStyles();
  const progress = useRef(new Animated.Value(0)).current;
  const contanerPositionTop = 30;
  const isShow = useSelector(selectNotificationIsShow);
  const data = useSelector(selectNotificationData);
  const {image,contentTitle,content} = data;
  const dispatch = useDispatch();

  const timerValue = useRef(2000);

  const startTimer = () => {
    timerValue.current = 2000;
    function countDown() {
      if (timerValue.current > 0) {
        timerValue.current = timerValue.current - 100;
      } else {
        clearInterval(timer);
        dispatch(pullNotification());
        Animated.timing(progress, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    }
    const timer = setInterval(countDown, 100);
  };

  useEffect(() => {
    console.log(data)
    if (isShow === true) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      startTimer();
    }
  }, [isShow,data]);
  return (
    <Animated.View
      style={[
        styles.css.notificationContainer,
        {
          top: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, contanerPositionTop],
          }),
        },
      ]}
    >
      <View style={styles.css.notificationBody}>
        <Image
          style={styles.css.notificationImage}
          source={{ uri: image }}
        />
        <View style={styles.css.notificationContent}>
          <Text numberOfLines={1} style={styles.css.boldFont}>{contentTitle}</Text>
          <Text numberOfLines={1} style={styles.css.normalFont}>{content}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default Notification;
