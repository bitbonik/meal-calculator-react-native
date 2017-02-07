/*
This component is responsible to add and store members name.
*/
import React, {Component} from 'react'
import {Text, View, TextInput, TouchableOpacity, Image, Button} from 'react-native'
import Realm from 'realm'
import { ListView } from 'realm/react-native'
import BackgroundImage from './BackgroundImage'
import { connect } from 'react-redux';
const NamesSchema = {
  name: 'Names',
   primaryKey: 'id',
  properties: {
    id:  'int',
    name: 'string',
  }
};

//import { updateMealRate } from '../actions/navActions';

let realm = new Realm({schema: [NamesSchema]});


 export default class MemberManage extends Component{
   constructor(props){
     super(props);
     this.state = {name:'', isEdit: false, nameList:<Text>hsld</Text>};
     const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
   }

  componentDidMount(){
  let allMembers = realm.objects('Names');
  this.setState({dataSource: this.state.dataSource.cloneWithRows(allMembers)});
  //this.props.updateMealRate(45.44);
  }

  addNametoDb(){
    var id = Math.floor(Date.now())
    realm.write(() => {
      realm.create('Names', {id: id, name: this.state.name });
    });
  let allMembers = realm.objects('Names');
  this.setState({dataSource: this.state.dataSource.cloneWithRows(allMembers)});
  this.setState({name:''});
  }

  showName(){
    let allMembers = realm.objects('Names');
     let all = allMembers.forEach((member) => {
        return <Text>{member.name}</Text>
     });

     return all;
  }

  goHomeScreen(){
    this.props._handleBackAction();
  }

  updateName(id){
    this.setState({isEdit: true});
    // name = this.state.name;
    // realm.write(() => {
    //   realm.create('Names', {id: id, name:name}, true);
    // });
    //
    // this.setState({isEdit: false});
    // let allMembers = realm.objects('Names');
    // this.setState({dataSource: this.state.dataSource.cloneWithRows(allMembers)});

  }

  deleteName(id){
    realm.write(() => {
      let an = realm.objects('Names');
      let targetName  =  an.filtered('id=$0', id)
      realm.delete(targetName);
    });

    let allMembers = realm.objects('Names');
    this.setState({dataSource: this.state.dataSource.cloneWithRows(allMembers)});

  }

  showAllNameOpt(member){
    return(
      <View style={styles.tabContent}>
        <Text style={styles.names}>{member.name}</Text>
        <TouchableOpacity  onPress={this.deleteName.bind(this, member.id)}>
          <Image
             style={styles.cbutton}
            source={require('./img/remove.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }

  goHomeScreen(){
    this.props._handleBackAction();
  }

  render(){
    return(
      <BackgroundImage>
        <View style={styles.header}>
          <TouchableOpacity onPress={this.goHomeScreen.bind(this)}>
            <Image
               style={styles.bbutton}
              source={require('./img/bb.png')}
            />
          </TouchableOpacity>
          <Text style={styles.title}> Manage Members </Text>
        </View>
        <View style={{flex:0.2, marginTop: 20 }}>
          <Text style={styles.txt}> Add New Member</Text>
           <View style={styles.NameInputGroup}>
              <TextInput
                    style={styles.textInput} placeholder="Type a member name"
                        onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                            onSubmitEditing= {this.addNametoDb.bind(this)}
                                />
                <TouchableOpacity style={styles.btnCnt} onPress={this.addNametoDb.bind(this)}>
                <Text style={styles.button}> ADD </Text>
              </TouchableOpacity>
          </View>
        </View>
        <View style={styles.nameList}>
          <ListView
            enableEmptySections= {true}
            dataSource={this.state.dataSource}
            renderRow={this.showAllNameOpt.bind(this)}
          />
        </View>
      </BackgroundImage>

    );
  }

}


// const mapStateToProps = state => {
//   const { mealrate} = state;
//   console.log("mealrate", state);
//   return {mealrate};
// };
//
// //export default connect(mapStateToProps, { updateMealRate })(MemberManage);



const styles = {
  container:{
    backgroundColor: '#04367B',
    flex:1,
  },
  bbutton:{
    width: 30,
    height: 25,
    marginTop: 10,
    marginLeft: 10,
  },
  cbutton:{
    width: 25,
    height: 25,
    marginTop: 8,
    marginLeft: 20,
  },
  header:{
    flex: 0.1,
    flexDirection: 'row',
  },
  textInput:{
    height: 40,
    borderWidth: 1,
    flex:70,
    marginTop: 5,
    marginLeft: 5,
    backgroundColor: '#FFF',
    borderRadius:5,
  },
  title: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
    marginLeft: 30,
  },
 NameInputGroup:{
   flex: 1,
   flexDirection: 'row',
 },
 btnCnt:{
  flex: 30,
 },
 btnNext:{
   flex:0.1,
   marginBottom: 5,
   marginTop: 20,
   marginLeft: 30,
   marginRight: 30,
 },
 button:{
   fontSize: 16,
   backgroundColor: '#DADEE1',
   paddingTop:8,
   paddingBottom:8,
   paddingLeft:10,
   paddingRight:10,
   color: '#04367B',
   fontWeight: 'bold',
   marginLeft: 10,
   marginTop: 7,
   borderRadius: 5,
   marginRight: 5,
   textAlign: 'center',
 },
 txt:{
   fontSize: 14,
   color: '#FFF',
   marginLeft: 5,
 },
 nameList:{
   flex: 0.63,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#FFF',
  marginLeft: 30,
  marginRight: 30,
  marginBottom: 5,
},
 names: {
   textAlign: 'center',
   color: '#FFF',
   fontSize: 20,
   fontWeight: 'bold',
   marginTop: 5,
 },
 tabContent:{
   flexDirection: 'row',
   justifyContent: 'center',
   marginBottom: 10,
 },

};
