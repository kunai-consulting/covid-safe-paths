import React, { Component } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import { WebView } from 'react-native-webview';

import languages from './../locales/languages';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import colors from '../constants/colors';
import Colors from '../constants/colors';
import { AUTHORITY_NEWS } from '../constants/storage';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
import fontFamily from '../constants/fonts';
import { GetStoreData } from '../helpers/General';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class NewsScreen extends Component {
  constructor(props) {
    super(props);
    let default_news = {
      name: languages.t('label.default_news_site_name'),
      url: languages.t('label.default_news_site_url'),
    };
    this.state = {
      visible: true,
      default_news: default_news,
      newsUrls: [default_news, default_news],
      current_page: 0,
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  hideSpinner() {
    this.setState({
      visible: false,
    });
  }

  _renderItem = item => {
    console.log('Item', item);
    return (
      <View style={styles.singleNews}>
        <View style={styles.singleNewsHead}>
          <Text style={styles.singleNewsHeadText}>{item.item.name}</Text>
        </View>
        <WebView
          source={{
            uri: item.item.url,
          }}
          containerStyle={{
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
          cacheEnabled
          onLoad={() =>
            this.setState({
              visible: false,
            })
          }
        />
      </View>
    );
  };
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    GetStoreData(AUTHORITY_NEWS)
      .then(nameNewsString => {
        // Bring in news from the various authorities.  This is
        // pulled down from the web when you subscribe to an Authority
        // on the Settings page.
        let arr = [];

        // Populate with subscribed news sources, with default at the tail
        if (nameNewsString !== null) {
          arr = JSON.parse(nameNewsString);
        }
        arr.push(this.state.default_news);

        this.setState({
          newsUrls: arr,
        });
      })
      .catch(error => console.log(error));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    console.log('News URL -', this.state.newsUrls);
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[Colors.VIOLET_BUTTON, Colors.VIOLET_BUTTON_DARK]}
        style={{ flex: 1, height: '100%' }}>
        <NavigationBarWrapper
          title={languages.t('label.latest_news')}
          onBackPress={this.backToMain.bind(this)}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={[Colors.VIOLET_BUTTON, Colors.VIOLET_BUTTON_DARK]}
            style={{ flex: 1, height: '100%' }}>
            <View
              style={{
                backgroundColor: '#3A4CD7',
                flex: 1,
                paddingVertical: 16,
              }}>
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={this.state.newsUrls}
                renderItem={this._renderItem}
                sliderWidth={width}
                itemWidth={width * 0.85}
                layout={'default'}
                scrollEnabled
              />

              {this.state.visible && (
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    top: height / 2,
                    left: width / 2,
                  }}
                  size='large'
                  color='black'
                />
              )}
            </View>
          </LinearGradient>
        </NavigationBarWrapper>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  // Container covers the entire screen
  container: {
    flex: 1,
    flexDirection: 'column',
    color: colors.PRIMARY_TEXT,
    backgroundColor: colors.WHITE,
  },
  web: {
    width: '100%',
    margin: 0,
    padding: 0,
  },
  slide: {
    height: 100,
    backgroundColor: 'rgba(20,20,200,0.3)',
  },
  singleNews: {
    flexGrow: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    alignSelf: 'center',
    width: '100%',
  },
  singleNewsHead: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    marginBottom: 0,
  },
  singleNewsHeadText: {
    fontSize: 18,
    fontFamily: fontFamily.primarySemiBold,
  },
});

export default NewsScreen;
