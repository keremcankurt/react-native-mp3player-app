import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../context/AudioProvider'
import {LayoutProvider, RecyclerListView} from 'recyclerlistview'
import AudioListItem from '../components/AudioListItem'
import Screen from '../components/Screen'
import OptionModal from '../components/OptionModal'
import {Audio} from 'expo-av'
import { pause, play, playNext, resume, selectAudio } from '../misc/audioController'
import { storeAudioForNextOpening } from '../misc/helper'

export class AudioList extends Component {
    static contextType = AudioContext

    constructor(props){
        super(props)
        this.state = {
            optionModalVisible: false,
        }
        this.currentItem = {}
    }
    layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
        switch(type) {
            case 'audio':
                dim.width = Dimensions.get('window').width
                dim.height = 70
                break;
            default:
                dim.width = 0
                dim.height = 0
        }
    })

    
    handleAudioPress = async(audio) => {
        await selectAudio(audio, this.context)
    }

    componentDidMount() {
        this.context.loadPreviousAudio()
    }
    rowRenderer = (type, item, index, extendedState) => {
        return  <AudioListItem 
            item={item} 
            isPlaying={extendedState.isPlaying}
            activeListItem={this.context.currentAudioIndex === index}
            onOptionPress={() => {
                this.currentItem = item
                this.setState({...this.state, optionModalVisible: true
            })
            }}
            onAudioPress={() => this.handleAudioPress(item)}
        />
    }

    navigateToPlayList = () => {
        this.context.updateState(this.context, {
            addToPlayList: this.currentItem,
        })
        this.props.navigation.navigate('PlayList')
    }
  render() {
    return (
        <AudioContext.Consumer>
            {({dataProvider, isPlaying}) => (
                <Screen >
                    <RecyclerListView 
                        dataProvider={dataProvider}  
                        layoutProvider={this.layoutProvider}
                        rowRenderer={this.rowRenderer}
                        extendedState={{isPlaying}}
                    />
                    <OptionModal 
                        options={
                            [
                                {
                                    title: 'Add to Playlist', 
                                    onPress: this.navigateToPlayList
                                }
                            ]
                        }
                        onClose={() => this.setState({...this.state, optionModalVisible: false})} 
                        visible={this.state.optionModalVisible} item={this.currentItem}
                    />
                </Screen>
            )}
        </AudioContext.Consumer>
    )    
  }
}
const styles = StyleSheet.create({
})
export default AudioList