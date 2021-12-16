import { StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function createStyles() {
  const { colors } = useTheme();
  const css = StyleSheet.create({
    normalFont: {
      fontSize: 14,
      lineHeight: 18,
      color: colors.text,
    },
    boldFont: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    superBoldFont: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },
    subFont: {
      fontSize: 14,
      color: colors.subText,
    },
    subBoldFont: {
      fontWeight: "600",
    },
    marginBottom: {
      marginBottom: 4,
    },
    postDateFont: {
      fontSize: 10,
      color: colors.subText,
      lineHeight: 17,
      letterSpacing: 0.2,
    },
    hrefFont: {
      color: colors.primary,
    },
    hrefBoldFont: {
      color: colors.primary,
      fontWeight: "600",
    },
    headerFont: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },

    custumizeHeader: {
      width: "100%",
      height: 44,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      justifyContent: "space-between",
      flexDirection: "row",
    },
    custumizeHeaderTitle: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 20,
    },

    custumizeHeaderSmallTitle: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 14,
    },

    feedContainer: {
      width: "100%",
    },
    feedHeaderContainer: {
      height: 60,
      flexDirection: "row",
      alignContent: "space-between",
    },
    feedHeaderAuthorContainer: {
      flex: 1,
      height: "100%",
      paddingTop: 14,
      paddingBottom: 14,
      paddingLeft: 16,
      flexDirection: "row",
    },
    feedHeaderAuthor: {
      height: "100%",
      paddingLeft: 12,
      flexDirection: "column",
      alignContent: "space-between",
      justifyContent: "center",
    },
    feedHeaderAction: {
      width: 48,
      height: "100%",
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 8,
      justifyContent: "center",
    },
    feedContentContainer: {
      minHeight: 80,
      paddingLeft: 16,
      paddingRight: 16,
    },
    profileBody: {
      flex: 1,
    },
    userInformation: {
      margin: 12,
    },
    userInformationHeader: {
      flexDirection: "row",
      height: 80,
      alignItems: "center",
      marginTop: 8,
      marginBottom: 8,
    },
    userImage: {
      width: 80,
      aspectRatio: 1,
      borderRadius: 50,
    },
    userInformationQtys: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
      paddingLeft: 24,
      paddingRight: 12,
    },
    userInformationQtysComponent: {
      flexDirection: "column",
      flex: 1,
    },
    userInformationBio: {
      flexDirection: "column",
      marginTop: 8,
      marginBottom: 8,
    },
    userInformationBiosComponent: {
      marginTop: 1,
      marginBottom: 1,
    },
    userActions: {
      flexDirection: "row",
    },
    userActionComponent: {
      flex: 1,
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "#dfdfdf",
      margin: 2,
      padding: 10,
      alignItems: "center",
      marginTop: 8,
      marginBottom: 8,
    },
    userActionComponentActivated: {
      flex: 1,
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 5,
      margin: 2,
      padding: 10,
      alignItems: "center",
      marginTop: 8,
      marginBottom: 8,
      backgroundColor: colors.primary,
      borderWidth: 0,
    },
    informationQty: {
      fontSize: 18,
      textAlign: "center",
    },

    commentsBody: {
      width: "100%",
      padding: 16,
    },
    topic: {
      width: "100%",
      flexDirection: "row",
      marginBottom: 10,
    },
    comment: {
      width: "100%",
      flexDirection: "row",
      marginBottom: 12,
    },
    commentLeft: {
      width: 46,
      minHeight: 46,
      paddingTop: 16,
      paddingBottom: 8,
      paddingLeft: 0,
      paddingRight: 12,
    },
    commentRight: {
      flex: 1,
      marginTop: 12,
      marginRight: 12,
    },
    commentBottom: {
      flex: 1,
      flexDirection: "row",
      marginTop: 6,
    },
    commentBottomComponent: {
      marginRight: 12,
    },
    commentUserImage: {
      width: "100%",
      aspectRatio: 1,
      borderRadius: 50,
    },
    commentLike: {
      marginTop: 18,
      marginRight: 12,
      alignItems: "flex-start",
    },
    commentInputContainer: {
      width: "100%",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderStyle: "solid",
      borderColor: colors.border,
      borderTopWidth: 1,
      backgroundColor: colors.background,
    },
    commentInput: {
      width: "100%",
      flexDirection: "row",
      alignItems: "flex-end",
    },
    commentInputUserImage: {
      width: 42,
      aspectRatio: 1,
      borderRadius: 50,
    },
    commentInputTextInput: {
      flex: 1,
      minHeight: 42,
      marginLeft: 10,
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 21,
      borderColor: colors.border,
      paddingRight: 15,
      paddingLeft: 15,
      flexDirection: "row",
      alignItems: "flex-end",
    },
    commentInputTextInputText: {
      flex: 1,
      maxHeight: 120,
      color: colors.text,
      paddingTop: 5,
      paddingBottom: 5,
      marginTop: 3,
      marginBottom: 7,
    },
    commentInputTextInputSubmit: {
      height: 42,
      justifyContent: "center",
      paddingLeft: 7,
    },
    commentInputEmojisContainer: {
      justifyContent: "space-between",
      flexDirection: "row",
      marginBottom: 15,
    },
    commentInputEmoji: {
      fontSize: 24,
    },

    actionContainer: {
      backgroundColor: colors.popup,
      alignItems: "center",
      paddingTop: 20,
      paddingBottom: 200,
      paddingLeft: 10,
      paddingRight: 10,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginBottom: -180,
    },
    actionTipsBar: {
      width: 40,
      height: 4,
      borderRadius: 20,
      backgroundColor: "rgba(128,128,128,0.3)",
      marginBottom: 15,
      transform: [{ translateY: -5 }],
    },
    actionButton: {
      flex: 1,
      backgroundColor: colors.subButton,
      borderRadius: 10,
      padding: 15,
      alignItems: "center",
      margin: 5,
    },
    actionList: {
      flex: 1,
      backgroundColor: colors.subButton,
      alignItems: "center",
      borderRadius: 10,
    },
    actionListButton: {
      width: "100%",
      padding: 15,
      alignItems: "center",
    },

    feedAnimationPreviewHeader: {
      width: "100%",
      height: 50,
      backgroundColor: colors.border,
      flexDirection: "row",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 10,
      alignItems: "center",
    },
    feedAnimationActionListButton: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 20,
      paddingLeft: 20,
    },

    searchContainer: {
      backgroundColor: colors.subButton,
      flexDirection: "row",
      alignItems: "center",
      padding: 3,
      borderRadius: 10,
    },

    messageInputComponent: {
      paddingLeft: 10,
      paddingRight: 10,
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    messageInputContainer: {
      backgroundColor: colors.border,
      borderRadius: 25,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "flex-end",
      padding: 5,
    },
    messageTextInput: {
      flex: 1,
      marginLeft: 8,
      marginRight: 0,
    },
    messageInputCircleButton: {
      borderRadius: 50,
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center",
      height: 32,
    },
    messageInputSmallButton: {
      borderRadius: 50,
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center",
      width: 32,
      marginLeft: 3,
    },
    messageInputTextInputText: {
      flex: 1,
      maxHeight: 120,
      color: colors.text,
      fontSize: 16,
      paddingTop: 5,
      paddingBottom: 5,
      marginTop: 3,
      marginBottom: 3,
    },

    userOnlineDotBackground: {
      position: "absolute",
      bottom: -2,
      right: -2,
      width: 17,
      height: 17,
      backgroundColor: colors.background,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    userOnlineDot: {
      position: "absolute",
      width: 10,
      height: 10,
      backgroundColor: colors.online,
      borderRadius: 50,
    },

    chatMessageContainer: {
      paddingLeft: 12,
      paddingRight: 12,
      paddingBottom: 60,
      flexDirection: "column",
    },

    chatBubble: {
      padding: 10,
      backgroundColor: colors.border,
      borderRadius: 20,
      marginTop: 5,
      marginBottom: 5,
      width: "auto",
      minHeight: 40,
      minWidth: 40,
      alignItems: "center",
    },
    chatFont: {
      fontSize: 16,
      color: colors.text,
    },
    chatBubbleSelf: {
      backgroundColor: colors.chatBubble,
    },
    chatFontSelf: {
      color: "white",
    },

    notificationContainer: {
      position: "absolute",
      width: "100%",
      alignItems: "center",
    },
    notificationBody: {
      padding: 10,
      paddingRight: 20,
      paddingLeft: 20,
      flexDirection: "row",
      backgroundColor: colors.notificationBody,
      maxWidth: 500,
      borderRadius: 10,
      width: "95%",
    },
    notificationImage: {
      height: 60,
      width: 60,
      borderRadius: 50,
      marginRight: 15,
    },
    notificationContent: {
      flex: 1,
      justifyContent: "center",
    },
  });
  const style = { colors, css };
  return style;
}
