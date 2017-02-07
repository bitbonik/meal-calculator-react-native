/*
This component is responsible to add and store members name.
*/
import React, {Component} from 'react'
import {Text, View, TextInput, TouchableOpacity} from 'react-native'
import Realm from 'realm'
import { ListView } from 'realm/react-native';
import BackgroundImage from './BackgroundImage'
//const Realm = require('realm');
// let realm = new Realm({
//  schema: [{name: 'Names', primaryKey: 'id', properties:
//    {id:'int', name: 'string'}
//  }]
// });

const NamesSchema = {
  name: 'Names',
   primaryKey: 'id',
  properties: {
    id:  'int',
    name: 'string',
  }
};

const MealsSchema = {
  name: 'Meal',
  primaryKey: 'id',
  properties: {
    id:  'int',
    member_id:'int',
    meal: {type: 'float', default: 0},
    date: 'string',
  }
};

const CostSchema = {
  name: 'Cost',
  primaryKey: 'id',
  properties: {
    id:  'int',
    member_id:'int',
    cost: {type: 'float', default: 0},
    month: 'int',
  }
};

const DepositSchema = {
  name: 'Deposit',
  primaryKey: 'id',
  properties: {
    id:  'int',
    member_id:'int',
    deposit: {type: 'float', default: 0},
    month: 'int',
  }
};

let realm = new Realm({schema: [NamesSchema, MealsSchema, CostSchema, DepositSchema]});


export default class Members extends Component{
   constructor(props){
     super(props);
     this.state = {name:'', nameList:<Text>hsld</Text>};
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
    const homeRoute= {
      type: 'push',
      route: {
        key: 'home',
        title: 'Home Screen'
      }
    }
    this.props._handleNavigate(homeRoute);
  }

  showAllNames(member){
    return(
        <Text style={styles.names}>{member.name}</Text>
    );
  }

  render(){
    return(
      <BackgroundImage>
        <View style={{flex:0.1}}><Text style={styles.title}>  Easy Mess Meal Calculation </Text></View>
        <View style={{flex:0.2, marginTop: 20 }}>
          <Text style={styles.txt}> Add Member Name</Text>
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
            renderRow={this.showAllNames.bind(this)}
          />
        </View>
        <View style={styles.btnNext}>
          <TouchableOpacity style={styles.btnNextCnt} onPress={this.goHomeScreen.bind(this)}>
          <Text style={styles.button}> NEXT > </Text>
        </TouchableOpacity>
        </View>
      </BackgroundImage>

    );
  }

}

const styles = {
  container:{
    backgroundColor: '#04367B',
    flex:1,
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
 }

};
