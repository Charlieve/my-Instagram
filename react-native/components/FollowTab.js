import React from "react";
import FollowTabFollowerScreen from "./FollowTabFollowerScreen"
import FollowTabFollowingScreen from "./FollowTabFollowingScreen"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector } from "react-redux";
import createStyles from "../styles/styles";

import store from "../app/store";
import {
  selectUserFollowerQty,
  selectUserFollowingQty,
} from "../features/user/userSlice";

const Tab = createMaterialTopTabNavigator();

export default function FollowTab({route}) {
    const routeTab = route.params.routeTab
  return (
    <Tab.Navigator initialRouteName={routeTab}>
      <Tab.Screen name={"Followers"} component={FollowTabFollowerScreen} />
      <Tab.Screen name={"Followings"} component={FollowTabFollowingScreen} />
    </Tab.Navigator>
  );
}