import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';
import { convertTime } from '../misc/helper';


export default function AudioListItem(
    {
        item,
        isPlaying,
        onAudioPress, 
        onOptionPress, 
        activeListItem,
    }) {
    const renderPlayPauseIcon = isPlaying => {
        if(!isPlaying) return <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />
        return <Entypo name="controller-paus" size={24} color={color.ACTIVE_FONT}  />
    }
    
  return (
    <>
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={onAudioPress}>
                <View style={styles.leftContainer}>
                    <View style={[styles.thumbnail, {backgroundColor: activeListItem ? color.ACTIVE_BG : color.FONT_LIGHT}]}>
                        <Text style={styles.thumbnailText}>
                        {
                            activeListItem ? 
                            renderPlayPauseIcon(isPlaying)
                            :
                            item?.filename[0]
                        }
                        </Text>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text numberOfLines={1} style={styles.title}>{item?.filename}</Text>
                        <Text numberOfLines={1} style={styles.timeText}>{convertTime(item?.duration)}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.rightContainer}>
                <Entypo 
                    onPress={onOptionPress}
                    name="dots-three-vertical" 
                    size={20} 
                    color={color.FONT_MEDIUM} 
                />
            </View>
        </View>
        <View style={styles.separator}/>
    </>
        
  )
}

const {width} = Dimensions.get('window')
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: width -80,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    rightContainer: {
        flexBasis: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnail: {
        height: 50,
        backgroundColor: color.FONT_LIGHT,
        flexBasis: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    thumbnailText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: color.FONT,
    },
    titleContainer: {
        width: width - 180,
        paddingLeft: 10,
    },
    title: {
        fontSize: 16,
        color: color.FONT,
    },
    separator: {
        width: width - 80,
        backgroundColor: '#333',
        opacity: 0.3,
        height: 0.6,
        alignSelf: 'center',
        marginTop: 10
    },
    timeText: {
        fontSize: 14,
        color: color.FONT_LIGHT,
    }
})