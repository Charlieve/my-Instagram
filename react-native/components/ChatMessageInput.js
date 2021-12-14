import GLOBAL from "../GLOBAL.json";
import React, { useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import createStyles from "../styles/styles";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";

import { ChatMessageContext } from "./ChatMessageContext";

const HiddenButton = (props) => {
  const { showAllButtons, typing } = props;
  return (
    <Animated.View
      style={{
        width: showAllButtons.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 35],
        }),
        opacity: showAllButtons.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
        transform: [
          {
            scale: showAllButtons.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ],
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const FunctionButton = (props) => {
  const { typing } = props;
  return (
    <Animated.View
      style={{
        opacity: typing.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 0, 0],
        }),
        transform: [
          {
            scale: typing.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
        ],
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const TypingButton = (props) => {
  const { typing } = props;
  return (
    <Animated.View
      style={{
        opacity: typing.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 1, 1],
        }),
        transform: [
          {
            scale: typing.interpolate({
              inputRange: [0, 0.2, 1],
              outputRange: [0, 0.8, 1],
            }),
          },
        ],
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const ChatMessageInput = () => {
  const { inputContent, onChangeText } = useContext(ChatMessageContext);
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  const typing = useRef(new Animated.Value(0)).current;
  const showAllButtons = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (inputContent.length > 0 && typing.__getValue() === 0) {
      Animated.timing(typing, {
        toValue: 1,
        duration: 120,
        useNativeDriver: false,
      }).start();
    }
    if (inputContent.length === 0 && typing.__getValue() === 1) {
      Animated.timing(typing, {
        toValue: 0,
        duration: 120,
        useNativeDriver: false,
      }).start();
    }
  }, [inputContent]);

  return (
    <View style={styles.css.messageInputComponent}>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 10,
          width: "100%",
          backgroundColor: styles.colors.background,
          height: "50%",
        }}
      />
      <View style={styles.css.messageInputContainer}>
        <FunctionButton typing={typing}>
          <TouchableOpacity
            style={[
              styles.css.messageInputCircleButton,
              {
                backgroundColor: styles.colors.smartButton,
              },
            ]}
            onPress={() => {
              console.log("camera");
            }}
          >
            <Icon name="camera" size={24} color="white" />
          </TouchableOpacity>
        </FunctionButton>
        <View
          style={{
            position: "absolute",
            bottom: 5,
            left: 5,
            display: inputContent ? "flex" : "none",
          }}
        >
          <TypingButton typing={typing}>
            <TouchableOpacity
              style={[
                styles.css.messageInputCircleButton,
                {
                  backgroundColor: styles.colors.smartButton,
                },
              ]}
              onPress={() => {
                console.log("search");
              }}
            >
              <Icon name="search" size={24} color="white" />
            </TouchableOpacity>
          </TypingButton>
        </View>
        <View style={styles.css.messageTextInput}>
          <TextInput
            multiline
            numberOfLines={1}
            placeholder="Message..."
            placeholderTextColor={styles.colors.subText}
            style={styles.css.messageInputTextInputText}
            value={inputContent}
            onChangeText={(text) => onChangeText(text)}
          />
        </View>
        <View style={{ height: "100%", minWidth: 60 }}>
          <Animated.View
            style={[
              {
                display: !inputContent ? "flex" : "none",
                flexDirection: "row",
                transform: [
                  {
                    scale: typing.interpolate({
                      inputRange: [0, 0.9, 1],
                      outputRange: [1, 1, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FunctionButton typing={typing}>
                <TouchableOpacity style={styles.css.messageInputSmallButton}>
                  <Icon
                    name="mic-outline"
                    size={28}
                    color={styles.colors.text}
                  />
                </TouchableOpacity>
              </FunctionButton>
              <FunctionButton typing={typing}>
                <TouchableOpacity style={styles.css.messageInputSmallButton}>
                  <Icon
                    name="image-outline"
                    size={28}
                    color={styles.colors.text}
                  />
                </TouchableOpacity>
              </FunctionButton>
              <FunctionButton typing={typing}>
                <HiddenButton showAllButtons={showAllButtons} typing={typing}>
                  <TouchableOpacity style={styles.css.messageInputSmallButton}>
                    <Icon
                      name="document-outline"
                      size={32}
                      color={styles.colors.text}
                      style={{
                        transform: [
                          { rotateX: "135deg" },
                          { translateX: 1 },
                          { scaleY: 1.1 },
                          { scaleX: 1.05 },
                        ],
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        height: 12,
                        width: 23,
                        overflow: "hidden",
                        top: 9,
                        left: 8,
                      }}
                    >
                      <Icon
                        name="logo-reddit"
                        size={32}
                        color={styles.colors.text}
                        style={{ top: -15, left: -9, position: "absolute" }}
                      />
                    </View>
                  </TouchableOpacity>
                </HiddenButton>
              </FunctionButton>

              <FunctionButton typing={typing}>
                <HiddenButton showAllButtons={showAllButtons} typing={typing}>
                  <TouchableOpacity style={styles.css.messageInputSmallButton}>
                    <Icon
                      name="chatbox-ellipses-outline"
                      size={28}
                      color={styles.colors.text}
                    />
                  </TouchableOpacity>
                </HiddenButton>
              </FunctionButton>
            </View>

            <FunctionButton typing={typing}>
              <Animated.View
                style={{
                  marginRight: showAllButtons.interpolate({
                    inputRange: [0, 1],
                    outputRange: [5, 0],
                  }),
                  transform: [
                    {
                      rotateZ: showAllButtons.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "45deg"],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={[styles.css.messageInputSmallButton]}
                  onPress={() => {
                    Animated.timing(showAllButtons, {
                      toValue: +!showAllButtons.__getValue(),
                      duration: 120,
                      useNativeDriver: false,
                    }).start();
                  }}
                >
                  <Icon
                    name="add-circle"
                    size={28}
                    color={styles.colors.text}
                  />
                </TouchableOpacity>
              </Animated.View>
            </FunctionButton>
          </Animated.View>
          <TouchableOpacity
            style={{
              position: "absolute",
              justifyContent: "center",
              bottom: -3,
              right: 0,
              display: inputContent ? "flex" : "none",
            }}
          >
            <TypingButton typing={typing}>
              <Text
                style={[
                  styles.css.boldFont,
                  {
                    fontSize: 18,
                    color: styles.colors.smartButton,
                    paddingLeft: 5,
                    paddingRight: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                  },
                ]}
              >
                Send
              </Text>
            </TypingButton>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatMessageInput;
