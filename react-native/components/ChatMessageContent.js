import React, {
  useMemo,
  useContext,
  useRef,
  createContext,
  useState,
  useEffect,
} from "react";
import {
  Animated,
  View,
  Text,
  Pressable,
  SectionList,
  LayoutAnimation,
  Platform,
  UIManager,
  PanResponder,
} from "react-native";
import { ChatMessageContext } from "./ChatMessageContext";
import DateShort from "./DateShort";
import createStyles from "../styles/styles";
import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";
import { selectMessageByIndexAndMessageIndex } from "../features/message/messageSlice";
import UserIconImage from "./UserIconImage";
import ChatMessageGradient from "./ChatMessageGradient";
import ChatMessageClock from "./ChatMessageClock";
import ChatMessageQuickReply from "./ChatMessageQuickReply";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ChatContext = createContext();
const ChatCellContext = createContext();

const DateSectionTitle = ({ date }) => {
  const styles = createStyles();
  return (
    <View style={styles.css.chatMessageDateSection}>
      <DateShort
        timestamp={date}
        style={[styles.css.subFont, { fontSize: 12 }]}
      />
    </View>
  );
};

const createChatCellComponent = (props) => {
  const [isHighlight, setHighlight] = useState(false);
  return (
    <View
      style={[
        { transform: [{ scaleY: -1 }] }, //inverted
        isHighlight && { zIndex: 100 },
      ]}
    >
      <ChatCellContext.Provider value={{ setHighlight }}>
        {useMemo(() => props.children, [props])}
      </ChatCellContext.Provider>
    </View>
  );
};

const ChatBubble = ({
  contactIndex,
  item: message,
  index,
  section,
  setReacting,
  setReplying,
  setHighlight,
  setScrollable,
}) => {
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  const totalQty = section.data.length;
  const checkMessageinSameSection = (message, checkedMessage) => {
    const sameUserId = message.userId === checkedMessage.userId;
    const sameStatus = message.status === checkedMessage.status;
    const min = 100 * 60;
    const sendInMin =
      message.date + min > checkedMessage.date ||
      checkedMessage.date + min > message.date;
    return sameUserId && sameStatus && sendInMin;
  };
  const haveReaction = Object.keys(message.reactions).length !== 0;
  const haveReplying = message.replyToMessageIndex;

  const isFirst =
    index === 0 ||
    !checkMessageinSameSection(message, section.data[index - 1]) ||
    Object.keys(section.data[index - 1].reactions).length !== 0 ||
    haveReplying;

  const isLast =
    index === totalQty - 1 ||
    !checkMessageinSameSection(message, section.data[index + 1]) ||
    haveReaction ||
    section.data[index + 1].replyToMessageIndex;

  const myMessage = message.userId === userId;

  const [isExpended, setExpended] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const pressProgress = useRef(new Animated.Value(0)).current;

  const closeExpended = () => {
    setExpended(false);
    setHighlight(false);
    setReacting({ display: false });
  };
  const expend = ({ pageX, pageY }) => {
    const touchPoint = { x: pageX, y: pageY };
    setExpended(true);
    setHighlight(true);
    setReacting({ display: true, touchPoint, message, closeExpended });
  };
  useEffect(() => {
    if (isExpended) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [isExpended]);

  return (
    <Animated.View style={{ flexDirection: "row" }}>
      <View
        style={[
          { flex: 1 },
          {
            flexDirection: myMessage ? "row-reverse" : "row",
          },
          isFirst && { marginTop: 5 },
          isLast && { marginBottom: 5 },
          haveReaction && { marginBottom: 15 },
        ]}
      >
        <View
          style={{
            maxWidth: "70%",
            flexDirection: myMessage ? "row-reverse" : "row",
            alignItems: "flex-end",
          }}
        >
          {useMemo(
            () =>
              !myMessage && (
                <View style={{ width: 30, height: 30, marginRight: 10 }}>
                  {isLast && <UserIconImage userId={message.userId} />}
                </View>
              ),
            [isLast]
          )}
          <Animated.View
            style={[
              styles.absoluteFill,
              {
                backgroundColor: "black",
                left: -9999,
                right: -9999,
                top: -9999,
                bottom: -9999,
              },
              { display: isExpended === false ? "none" : "flex" },
              {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.7],
                }),
              },
            ]}
          >
            {/* <Pressable
              style={{ width: "100%", height: "100%" }}
              onPress={() => closeExpended()}
            /> */}
          </Animated.View>
          <QuickReplyPanHandler
            message={message}
            myMessage={myMessage}
            setScrollable={setScrollable}
            setReplying={setReplying}
          >
            <Pressable
              onPressIn={() => {
                setScrollable(false);
                Animated.timing(pressProgress, {
                  toValue: 1,
                  useNativeDriver: false,
                }).start();
              }}
              onPressOut={() => {
                Animated.spring(pressProgress, {
                  toValue: 0,
                  friction: 4,
                  useNativeDriver: false,
                }).start();
              }}
              onLongPress={({ nativeEvent }) => {
                Animated.spring(pressProgress, {
                  toValue: 0,
                  friction: 4,
                  useNativeDriver: false,
                }).start();
                expend(nativeEvent);
              }}
            >
              <Animated.View
                style={[
                  {
                    transform: [
                      {
                        scale: pressProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.85],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {haveReplying && (
                  <ReplyingBubble
                    myMessage={myMessage}
                    contactIndex={contactIndex}
                    replyingIndex={message.replyToMessageIndex}
                  />
                )}
                <View
                  style={[
                    styles.css.chatBubble,
                    myMessage
                      ? styles.css.chatBubbleSelf
                      : styles.css.chatBubbleOther,
                    isFirst && {
                      borderTopRightRadius: 20,
                      borderTopLeftRadius: 20,
                    },
                    isLast && {
                      borderBottomRightRadius: 20,
                      borderBottomLeftRadius: 20,
                    },
                    message.status === "pending" && { opacity: 0.7 },
                  ]}
                >
                  {/* <ChatMessageGradient /> */}
                  {useMemo(
                    () => (
                      <ChatBubbleContent
                        message={message}
                        myMessage={myMessage}
                      />
                    ),
                    [message]
                  )}
                  {useMemo(
                    () => (
                      <ChatBubbleReaction
                        reactions={message.reactions}
                        myMessage={myMessage}
                      />
                    ),
                    [message.reactions]
                  )}
                </View>
              </Animated.View>
            </Pressable>
          </QuickReplyPanHandler>
        </View>
      </View>
      <ChatMessageClock myMessage={myMessage} timestamp={message.date} />
    </Animated.View>
  );
};

const QuickReplyPanHandler = (props) => {
  const { message, myMessage, setScrollable, setReplying } = props;
  const pan = useRef(new Animated.ValueXY()).current;
  const [progress, setProgress] = useState(0);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (event, gestureState) =>
        myMessage ? gestureState.dx < -5 : gestureState.dx > 5,
        
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        setScrollable(false);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        listener: (event, gestureState) =>
          setProgress(
            Math.min(100, gestureState.dx * (100 / 70) * (myMessage ? -1 : 1))
          ),
        useNativeDriver: false,
      }),

      onPanResponderTerminate: (event, gestureState) => {
        Animated.spring(
          pan, // Auto-multiplexed
          { toValue: { x: 0, y: 0 }, useNativeDriver: false } // Back to zero
        ).start();
        if (
          Math.min(100, gestureState.dx * (100 / 70) * (myMessage ? -1 : 1)) ===
          100
        ) {
          setReplying({ display: true, replyingMessage: message });
        }
        setProgress(0);
        setScrollable(true);
      },
      onPanResponderRelease: (event, gestureState) => {
        Animated.spring(
          pan, // Auto-multiplexed
          { toValue: { x: 0, y: 0 }, useNativeDriver: false } // Back to zero
        ).start();
        if (
          Math.min(100, gestureState.dx * (100 / 70) * (myMessage ? -1 : 1)) ===
          100
        ) {
          setReplying({ display: true, replyingMessage: message });
        }
        setProgress(0);
        setScrollable(true);
      },
    })
  ).current;
  return (
    <View>
      <Animated.View
        style={{
          transform: [
            {
              translateX: pan.x.interpolate(
                myMessage
                  ? {
                      inputRange: [-2, 0, 2],
                      outputRange: [-1, 0, 0],
                    }
                  : {
                      inputRange: [-2, 0, 2],
                      outputRange: [0, 0, 1],
                    }
              ),
            },
          ],
        }}
        {...panResponder.panHandlers}
      >
        {props.children}
      </Animated.View>
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            top: 0,
            justifyContent: "center",
          },
          myMessage ? { right: -40 } : { left: -40 },
          {
            transform: [
              {
                translateX: pan.x.interpolate(
                  myMessage
                    ? {
                        inputRange: [-81, -80, -2, 0, 2],
                        outputRange: [-40, -40, -1, 0, 0],
                      }
                    : {
                        inputRange: [-2, 0, 2, 80, 81],
                        outputRange: [0, 0, 1, 40, 40],
                      }
                ),
              },
            ],
          },
        ]}
      >
        <ChatMessageQuickReply size={32} progress={progress} />
      </Animated.View>
    </View>
  );
};

const ReplyingBubble = ({ myMessage, contactIndex, replyingIndex }) => {
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  const replyingMessage = useSelector((state) =>
    selectMessageByIndexAndMessageIndex(state, contactIndex, replyingIndex)
  ) || { content: "message deleted" };
  const replyingMyMessage = replyingMessage?.userId === userId;
  const replyHeader = myMessage
    ? `You replied${replyingMyMessage ? " to youreself" : ""}`
    : `Replied to ${replyingMyMessage ? "you" : "themselves"}`;
  return (
    <View>
      <View
        style={[
          { marginBottom: 5, marginHorizontal: 10 },
          myMessage ? { alignItems: "flex-end" } : { alignItems: "flex-start" },
        ]}
      >
        <Text style={[styles.css.chatBubbleReplyHeaderFont]}>
          {replyHeader}
        </Text>
      </View>
      <View
        style={[
          { opacity: 0.7 },
          myMessage
            ? { flexDirection: "row-reverse" }
            : { flexDirection: "row" },
        ]}
      >
        <View style={styles.css.chatBubbleReplySymbol} />
        <View
          style={[
            styles.css.chatBubble,
            styles.css.chatBubbleReply,
            replyingMyMessage && styles.css.chatBubbleSelf,
          ]}
        >
          <Text
            style={[
              styles.css.chatFont,
              replyingMyMessage && styles.css.chatFontSelf,
            ]}
            numberOfLines={3}
          >
            {replyingMessage.content}
          </Text>
        </View>
      </View>
    </View>
  );
};

const ChatBubbleContent = ({ message, myMessage }) => {
  const styles = createStyles();
  return (
    <View>
      <Text style={[styles.css.chatFont, myMessage && styles.css.chatFontSelf]}>
        {message.content}
      </Text>
    </View>
  );
};

const ChatBubbleReaction = ({ reactions, myMessage }) => {
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  const reactionsAnalyst = {};
  for (const [user, reaction] of Object.entries(reactions)) {
    reactionsAnalyst[reaction] = Array.isArray(reactionsAnalyst[reactions])
      ? reactionsAnalyst[reaction].push(user)
      : [user];
  }
  const reactionsText = [];
  for (const [reaction, users] of Object.entries(reactionsAnalyst)) {
    reactionsText.push(
      <View key={"reaction:" + reaction}>
        <Text numberOfLines={1} style={styles.css.chatBubbleReactionEmoji}>
          {reaction}
        </Text>
        {users.length > 1 && <Text>users.length</Text>}
      </View>
    );
  }
  if (Object.keys(reactionsAnalyst).length > 0) {
    return (
      <View
        style={[
          styles.css.chatBubbleReactionContainer,
          // myMessage && { backgroundColor: styles.colors.chatBubble },
        ]}
      >
        {reactionsText}
      </View>
    );
  } else {
    return <View />;
  }
};

const ChatBubbleView = () => {
  const {
    contactIndex,
    item,
    index,
    section,
    setReacting,
    setReplying,
    setHighlight,
    setScrollable,
  } = useContext(ChatContext);

  return useMemo(
    () => {
      return (
        <ChatBubble
          contactIndex={contactIndex}
          item={item}
          index={index}
          section={section}
          setReacting={setReacting}
          setReplying={setReplying}
          setHighlight={setHighlight}
          setScrollable={setScrollable}
        />
      );
    },
    [section.data[index - 1], item, section.data[index + 1]] //only update when item and between changed
  );
};

const ChatBubbleProvider = ({
  pan,
  contactIndex,
  item,
  index,
  section,
  setReacting,
  setReplying,
  setScrollable,
}) => {
  const { setHighlight } = useContext(ChatCellContext);
  const context = {
    contactIndex,
    item,
    index,
    section,
    setReacting,
    setReplying,
    setHighlight,
    setScrollable,
  };
  return (
    <Animated.View
      style={[
        {
          transform: [
            {
              translateX: pan.x.interpolate({
                inputRange: [-300, -80, 0, 1],
                outputRange: [-120, -60, 0, 0],
              }),
            },
          ],
        },
      ]}
    >
      <ChatContext.Provider value={context}>
        <ChatBubbleView />
      </ChatContext.Provider>
    </Animated.View>
  );
};

const sectioningByMessageDate = (messageData) => {
  const splitTime = 100 * 60 * 30;
  const result = [];
  for (let message of messageData) {
    if (
      !result[result.length - 1]?.date ||
      message.date > result[result.length - 1]?.date + splitTime
    ) {
      result.push({ date: message.date, data: [message] });
    } else {
      result[result.length - 1].data.push(message);
    }
  }
  return result;
};

const ChatMessageContent = ({ contactId }) => {
  const styles = createStyles();
  const { messageData, contactIndex, setReacting, replying, setReplying } =
    useContext(ChatMessageContext);

  const [scrollable, setScrollable] = useState(true);
  const [scrolling, setSrcolling] = useState(false);

  const messageDataSection = useMemo(() => {
    return sectioningByMessageDate(messageData);
  }, [messageData]);

  useMemo(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, "easeInEaseOut", "opacity")
    );
  }, [messageData, replying]);

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) => {
        if (
          scrollable === true &&
          scrolling === false &&
          gestureState.dx < -5
        ) {
          return true;
        }
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderTerminate: () => {
        Animated.spring(
          pan, // Auto-multiplexed
          { toValue: { x: 0, y: 0 }, useNativeDriver: false } // Back to zero
        ).start();
      },
      onPanResponderRelease: () => {
        Animated.spring(
          pan, // Auto-multiplexed
          { toValue: { x: 0, y: 0 }, useNativeDriver: false } // Back to zero
        ).start();
      },
    })
  ).current;

  return useMemo(
    () => (
      <View {...panResponder.panHandlers}>
        <SectionList
          sections={messageDataSection}
          CellRendererComponent={createChatCellComponent}
          renderItem={({ item, index, section }) => (
            <ChatBubbleProvider
              pan={pan}
              contactIndex={contactIndex}
              item={item}
              index={index}
              section={section}
              setReacting={setReacting}
              setReplying={setReplying}
              setScrollable={setScrollable}
            />
          )}
          keyExtractor={(item, index) => "message " + index}
          renderSectionHeader={({ section: { date } }) => (
            <DateSectionTitle date={date} />
          )}
          contentContainerStyle={[
            styles.css.chatMessageContainer,
            replying.display && { paddingTop: 120 },
          ]}
          inverted={-1}
          initialScrollIndex={0}
          onScrollBeginDrag={() => setSrcolling(true)}
          onScrollEndDrag={() => setSrcolling(false)}
          scrollEnabled={scrollable}
          canCancelContentTouches={scrollable}
        />
      </View>
    ),
    [messageDataSection, replying, scrollable]
  );
};

export default ChatMessageContent;
