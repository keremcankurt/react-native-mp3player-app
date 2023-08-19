import React from 'react'
import {AntDesign} from '@expo/vector-icons'
import color from '../misc/color'

export default function PlayerButton(props) {

    const {
        onPress,
        iconType, 
        size = 40, 
        _color = color.FONT, 
    } = props
    getIconName = (type) => {
        switch(type){
            case 'PLAY':
                return 'pausecircle'
            case 'PAUSE':
                return  'play'
            case 'NEXT':
                return 'forward'
            case 'PREVIOUS':
                return 'banckward'
        }
    }
  return (
    <AntDesign onPress={onPress} name={getIconName(iconType)} size={size} color={_color} {...props}/>
  )
}
