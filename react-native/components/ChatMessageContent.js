import React, {
  useMemo,
  useContext,
  useRef,
  createContext,
  useState,
  useEffect,
} from "react";
import { Animated, View, Text, Pressable, SectionList } from "react-native";
import { ChatMessageContext } from "./ChatMessageContext";
import DateShort from "./DateShort";
import createStyles from "../styles/styles";
import { useSelector } from "react-redux";
import { selectUserId } from "../features/user/userSlice";
import UserIconImage from "./UserIconImage";

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

const ChatBubble = ({ item: message, index, section, setReacting }) => {
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

  const isFirst =
    index === 0 ||
    !checkMessageinSameSection(message, section.data[index - 1]) ||
    Object.keys(section.data[index - 1].reactions).length !== 0;

  const isLast =
    index === totalQty - 1 ||
    !checkMessageinSameSection(message, section.data[index + 1]) ||
    haveReaction;

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
          </Animated.View>
        </Pressable>
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
  const { item, index, section, setReacting } = useContext(ChatContext);
  return useMemo(
    () => {
      return (
        <ChatBubble
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

const ChatBubbleProvider = ({ item, index, section, setReacting }) => {
  const context = { item, index, section, setReacting };
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
  const { messageData, contactIndex, setReacting } =
    useContext(ChatMessageContext);
  const messageDataSection = useMemo(
    () => sectioningByMessageDate(messageData),
    [messageData]
  );
  return useMemo(
    () => (
      <SectionList
        sections={messageDataSection}
        CellRendererComponent={createChatCellComponent}
        renderItem={({ item, index, section }) => (
          <ChatBubbleProvider
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
        contentContainerStyle={styles.css.chatMessageContainer}
        inverted={-1}
        initialScrollIndex={0}
      />
    ),
    [messageDataSection]
  );
};

export default ChatMessageContent;
