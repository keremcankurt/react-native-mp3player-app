import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import AppNavigator from './navigation/AppNavigator';
import AudioProvider from './context/AudioProvider';
import color from './misc/color';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.APP_BG,
  }
}
export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
        <AppNavigator/>
      </NavigationContainer>
    </AudioProvider>
  );
}

