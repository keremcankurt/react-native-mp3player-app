import { Dimensions, FlatList, Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import color from '../misc/color'
import AudioListItem from './AudioListItem'
import { selectAudio } from '../misc/audioController'

export default function PlayListDetail({visible, playList, onClose}) {
    const playAudio = () => {
        selectAudio(audio, )
    }
  return (
    <Modal visible={visible} animationType='slide' transparent onRequestClose={onClose}>
        <View style={styles.container}>
            <Text style={styles.title}>{playList?.title}</Text>
            <FlatList
                contentContainerStyle={styles.listContainer}
                data={playList?.audios}
                keyExtractor={item => item.id.toString()}
                renderItem={({item})=> 
                    <View style={{marginBottom: 10}}>
                        <AudioListItem item={item} onAudioPress={() => playAudio(item)}/>
                    </View>
                }
            />
        </View>
        <View style={[StyleSheet.absoluteFillObject,styles.modalBG]}/>
    </Modal>
  )
}

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        height: height / 1.5,
        width: width - 15,
        backgroundColor: color.APP_BG,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        paddingVertical: 5,
        color: color.ACTIVE_BG,
        fontSize: 20
    },
    modalBG: {
        backgroundColor: color.MODAL_BG,
        zIndex: -1
    },
    listContainer: {
        padding: 20,
    }
})