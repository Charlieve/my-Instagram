import GLOBAL from "../GLOBAL.json";
import React, { useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  FlatList,
  Image,
  PanResponder,
  Animated,
} from "react-native";
import createStyles from "../styles/styles";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

import { useSelector, useDispatch } from "react-redux";
import { selectMessage, deleteMessage } from "../features/message/messageSlice";

import ChatScreenSearch from "./ChatScreenSearch";

const EmptyChatList = () => {
  const navigation = useNavigation();
  const styles = createStyles();
  return (
    <View
      style={{
        height: "100%",
        padding: "10%",
        paddingTop: '0%',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={[styles.css.boldFont, { fontSize: 24, fontWeight: "800", marginTop:-80 }]}>
        Message your friends
      </Text>
      <Text
        style={[
          styles.css.subFont,
          {
            textAlign: "center",
            marginTop: 30,
            marginBottom: 20,
            lineHeight: 20,
          },
        ]}
      >
        Message, video chat or share your favourite posts directly with people
        you care about.
      </Text>
      <TouchableOpacity onPress={() => navigation.push("ChatNewMessage")}>
        <Text style={styles.css.hrefBoldFont}>Send message</Text>
      </TouchableOpacity>
    </View>
  );
};

const ChatListItem = ({ userId, lastMessage, setScrollable }) => {
  const navigation = useNavigation();
  const styles = createStyles();
  const dispatch = useDispatch();

  let open = false;
  const pan = useRef(new Animated.ValueXY()).current;

  const actionComponentsWidth = useRef(0);
  const actionComponents = (event) => {
    actionComponentsWidth.current = event.nativeEvent.layout.width;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (event, gestureState) =>
        (open && Math.abs(gestureState.dx) > 5) || gestureState.dx < -5,
      onPanResponderGrant: () => {
        setScrollable(false);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderTerminate: () => {
        setScrollable(true);
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          speed: 20,
          bounciness: 2,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderRelease: (event, gestureState) => {
        setScrollable(true);
        if (gestureState.dx < 0) {
          open = true;
          pan.flattenOffset({
            x: 0,
            y: 0,
          });
          Animated.spring(pan, {
            toValue: { x: actionComponentsWidth.current * -1, y: 0 },
            speed: 20,
            bounciness: 2,
            useNativeDriver: false,
          }).start();
        } else {
          open = false;
          pan.flattenOffset({
            x: 0,
            y: 0,
          });
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            speed: 20,
            bounciness: 2,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={{ height: 70, flexDirection: "row-reverse" }}>
      <View
        style={{ flexDirection: "row-reverse" }}
        onLayout={actionComponents}
      >
        <TouchableOpacity
          style={{
            height: "100%",
            backgroundColor: styles.colors.warning,
            justifyContent: "center",
            padding: 20,
          }}
          onPress={() => {
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              speed: 20,
              bounciness: 2,
              useNativeDriver: false,
            }).start();
            dispatch(deleteMessage(userId));
          }}
        >
          <Text style={[styles.css.normalFont, { fontSize: 18, color:'white' }]}>Delete</Text>
        </TouchableOpacity>
        <Pressable
          style={{
            height: "100%",
            backgroundColor: styles.colors.subButton,
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Text style={[styles.css.normalFont, { fontSize: 18 }]}>Mute</Text>
        </Pressable>
      </View>

      {/* slider background color */}
      <View
        style={{
          height: "100%",
          flex: 1,
          backgroundColor: styles.colors.subButton,
        }}
      />

      <Animated.View
        style={[
          {
            height: "100%",
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            position: "absolute",
            backgroundColor: styles.colors.background,
          },
          {
            transform: [
              {
                translateX: pan.x.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-1, 0, 0],
                }),
              },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Pressable
          style={({ pressed }) => [
            {
              height: "100%",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 8,
              paddingBottom: 8,
              paddingRight: 15,
              paddingLeft: 15,
            },
            {
              backgroundColor: pressed
                ? styles.colors.subButton
                : "transparent",
            },
          ]}
          onPress={() => navigation.push("ChatMessage", { contactId: userId })}
        >
          <Image
            style={{ height: "100%", aspectRatio: 1, borderRadius: 50 }}
            source={{
              uri: `${GLOBAL.SERVERIP}/users/${userId}/userimage.png`,
            }}
          />
          <Text
            style={[
              styles.css.boldFont,
              { flex: 1, marginLeft: 15, marginRight: 10, fontSize: 13 },
            ]}
          >
            {userId}
          </Text>
          <TouchableOpacity>
            <Icon
              name="camera-outline"
              color={styles.colors.subText}
              size={32}
            />
          </TouchableOpacity>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const ChatList = ({ message }) => {
  const navigation = useNavigation();
  const styles = createStyles();
  const [scollable, setScrollable] = useState(true);
  return (
    <FlatList
      data={message}
      renderItem={({ item }) => (
        <ChatListItem userId={item.userId} setScrollable={setScrollable} />
      )}
      keyExtractor={(item, index) => "chatList" + index}
      scrollEnabled={scollable}
    />
  );
};

const ChatScreenChatList = ({ userId }) => {
  const navigation = useNavigation();
  const message = useSelector(selectMessage);
  const styles = createStyles();
  return (
    <View style={{ flex: 1 }}>
      <ChatScreenSearch />
      {message.length === 0 ? (
        <EmptyChatList />
      ) : (
        <ChatList message={message} />
      )}
    </View>
  );
};

export default ChatScreenChatList;
