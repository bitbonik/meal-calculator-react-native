import React, {Component} from 'react'
import { Image } from 'react-native'

class BackgroundImage extends Component{
    render(){
      return(
        <Image source={require('./img/bg.jpg')}
                  style={styles.container}>

                  {this.props.children}

            </Image>
      );
    }
}

const styles = {
  container:{
     flex:1,
     width: null,
     height: null,
     resizeMode: 'cover',
  },
}

export default BackgroundImage;
