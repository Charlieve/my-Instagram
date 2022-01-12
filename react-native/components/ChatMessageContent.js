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
} from "react-native";
import { ChatMessageContext } from "./ChatMessageContext";
import DateShort from "./DateShort";
import createStyles from "../styles/styles";
import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";
import { selectMessageByIndexAndMessageIndex } from "../features/message/messageSlice";
import UserIconImage from "./UserIconImage";
import ChatMessageGradient from "./ChatMessageGradient";
import MaskedView from "@react-native-masked-view/masked-view";

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
  const { setHighlight } = useContext(ChatCellContext);
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
    <View
      style={[
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
          <Pressable
            style={{ width: "100%", height: "100%" }}
            onPress={() => closeExpended()}
          />
        </Animated.View>
        <Pressable
          onPressIn={() => {
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
                  <ChatBubbleContent message={message} myMessage={myMessage} />
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
      </View>
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
  const { contactIndex, item, index, section, setReacting } =
    useContext(ChatContext);
  return useMemo(
    () => {
      return (
        <ChatBubble
          contactIndex={contactIndex}
          item={item}
          index={index}
          section={section}
          setReacting={setReacting}
        />
      );
    },
    [section.data[index - 1], item, section.data[index + 1]] //only update when item and between changed
  );
};

const ChatBubbleProvider = ({
  contactIndex,
  item,
  index,
  section,
  setReacting,
}) => {
  const context = { contactIndex, item, index, section, setReacting };
  return (
    <ChatContext.Provider value={context}>
      <ChatBubbleView />
    </ChatContext.Provider>
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
  const { messageData, contactIndex, setReacting, replying } =
    useContext(ChatMessageContext);
  const messageDataSection = useMemo(() => {
    return sectioningByMessageDate(messageData);
  }, [messageData]);
  useMemo(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, "easeInEaseOut", "opacity")
    );
  }, [messageData, replying]);

  return useMemo(
    () => (
      <SectionList
        sections={messageDataSection}
        CellRendererComponent={createChatCellComponent}
        renderItem={({ item, index, section }) => (
          <ChatBubbleProvider
            contactIndex={contactIndex}
            item={item}
            index={index}
            section={section}
            setReacting={setReacting}
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
      />
    ),
    [messageDataSection, replying]
  );
};

export default ChatMessageContent;
