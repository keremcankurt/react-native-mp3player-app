import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Player from '../screens/Player'
import PlayList from '../screens/PlayList'
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AudioList from '../screens/AudioList';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import PlayListDetail from '../screens/PlayListDetail';

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const PlayListScreen = () => {
    return <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='PlayList' component={PlayList}/>
        <Stack.Screen name='PlayListDetail' component={PlayListDetail}/>
    </Stack.Navigator>
}
export default function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={{
        gestureEnabled: true,
        ...(TransitionPresets.ModalPresentationIOS)}}>
        <Tab.Screen name='AudioList' component={AudioList} options={{
            tabBarIcon: ({color, size}) => {
                return <MaterialIcons name="headset" size={size} color={color} />
            },
            headerShown: false
            }}/>
        <Tab.Screen name='Player' component={Player} options={{
            tabBarIcon: ({color, size}) => {
                return <FontAwesome5 name="compact-disc" size={size} color={color} />
            },
            headerShown: false
            }}/>
        <Tab.Screen name='PlayList' component={PlayListScreen} options={{
            tabBarIcon: ({color, size}) => {
                return <MaterialIcons name="library-music" size={size} color={color} />
            },
            headerShown: false
            }}/>
    </Tab.Navigator>
  )
}
