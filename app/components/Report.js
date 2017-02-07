/*
This component is responsible to show and manage all functionality
*/
import React, {Component} from 'react'
import {
  Text, View, ScrollView, Button,
  TextInput, TouchableOpacity, Picker, Image,
  DatePickerAndroid, TouchableWithoutFeedback } from 'react-native'
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view'
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

class Report extends Component{
  constructor(props){
    super(props);
    //const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { selectedMonth:'', selectedDate: '', mealRate: '', credit: '',
     dataSource: new ListView.DataSource({
       rowHasChanged: (row1, row2) => row1 !== row2,
     })
   };
  }


componentDidMount(){
  var d= new Date();
  // console.log(d);
  this.setState({ selectedMonth: d.getMonth()});

  let allMembers = realm.objects('Names');
  this.setState({dataSource: this.state.dataSource.cloneWithRows(allMembers)});

}



getMeal(id){
  let meals = realm.objects('Meal');
  var selectedMonth = this.state.selectedMonth;
  var totalMeal = 0;
  let mealObj = meals.filtered("member_id = $0",id);
  mealObj.forEach((meal) => {
    var rawdate = meal.date;
    var monthArr = rawdate.split('-');
    var month = monthArr[1];
    if(month == selectedMonth){
      totalMeal = totalMeal + meal.meal;
    }
  })
  return totalMeal;
}


 getDeposit(id){
   let deps = realm.objects('Deposit');
   var month = this.state.selectedMonth;
   let depositObj = deps.filtered("member_id = $0 AND month = $1",id,month);
   //console.log('gotLength',mealObj.length);
   var totalDeposit = 0;
   if(depositObj.length != 0){
      totalDeposit = depositObj[0].deposit;
   }

   return totalDeposit;
 }


 selectMonth(month){
   this.setState({selectedMonth: month});
   let allMembers = realm.objects('Names');
   this.setState({dataSource: this.state.dataSource.cloneWithRows(allMembers)});

 }

 getMonthByIndex(index){
   switch (index) {
     case 0:
      return "January"
    case 1:
    return "February"
    case 2:
    return "March"
    case 3:
    return "April"
    case 4:
    return "May"
    case 5:
    return "June"
    case 6:
    return "July"
    case 7:
    return "August"
    case 8:
    return "September"
    case 9:
    return "October"
    case 10:
    return "November"
    case 11:
    return "December"
     default:
     return "Error!"

   }
 }

 getOwe(meals, deposit){
  // alert(this.props.navigation.title);
  var totalEtean = meals * this.props.mealrate;
   var saving = deposit - totalEtean;
   return saving.toFixed(2);
 }

 createReport(member){
   var meals = this.getMeal(member.id);
   var deposit = this.getDeposit(member.id)
   return(
     <View style={styles.tabContent}>
       <Text style={styles.txt}>{member.name}</Text>
       <Text style={styles.txt}> {meals} </Text>
       <Text style={styles.txt}> {deposit} </Text>
       <Text style={styles.txt}> {this.getOwe(meals,deposit)} </Text>
     </View>
   );
 }

 renderHead(){
   return(
      <View style={styles.listHeader}>
        <Text style={styles.ttxt}> Name </Text>
          <Text style={styles.ttxt}> Meals </Text>
            <Text style={styles.ttxt}> Deposit </Text>
        <Text style={styles.ttxt}> Saving </Text>
      </View>
   );
 }

 goHomeScreen(){
   this.props._handleBackAction();
 }

  render(){
    return(
      <BackgroundImage>
        <View style={styles.mainHeader}>
          <TouchableOpacity  onPress={this.goHomeScreen.bind(this)}>
            <Image
               style={styles.cbutton}
              source={require('./img/bb.png')}
            />
          </TouchableOpacity>
          <Text style={styles.htxt}> Report  </Text>
            <Picker
              style={styles.picker}
              selectedValue={this.state.selectedMonth}
              onValueChange={this.selectMonth.bind(this)}>
              <Picker.Item label="January" value={0} />
              <Picker.Item label="February" value={1} />
              <Picker.Item label="March" value={2} />
              <Picker.Item label="April" value={3} />
              <Picker.Item label="May" value={4} />
              <Picker.Item label="June" value={5} />
              <Picker.Item label="July" value={6} />
              <Picker.Item label="August" value={7} />
              <Picker.Item label="September" value={8} />
              <Picker.Item label="October" value={9} />
              <Picker.Item label="November" value={10} />
              <Picker.Item label="December" value={10} />
            </Picker>
        </View>
        <View style={styles.reportCnt}>
          <ListView
            dataSource={this.state.dataSource}
            renderHeader={this.renderHead.bind(this)}
            renderRow={this.createReport.bind(this)}
          />
        </View>
     </BackgroundImage>
    );

  }
}


const mapStateToProps = state => {
  const { mealrate } = state;
  return mealrate;
};

export default connect(mapStateToProps, { null })(Report);

const styles = {
  container:{
     backgroundColor: '#04367B',
     flex:1,
  },
  cbutton:{
    width: 25,
    height: 25,
    marginTop: 8,
    marginLeft: 20,
  },
  mainHeader:{
    flex:15,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  listHeader:{
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 5,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  htxt:{
    fontSize: 16,
    color: '#FFF',
    marginLeft: 5,
    marginTop: 5,
    fontWeight: 'bold',
  },
  txt:{
    fontSize: 16,
    color: '#FFF',
    marginLeft: 5,
  },
  ttxt:{
    fontSize: 14,
    color: '#ea0003',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  tabContent:{
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    marginTop: 7,
  },

  picker:{
    color:'#FFF',
    borderColor: '#FFF',
    width: 120,
    marginTop: -7,
  },
  monthInfo:{
    alignItems:'center',
  },
  reportCnt:{
    flex: 85,
   borderRadius: 10,
   borderWidth: 1,
   borderColor: '#FFF',
   marginLeft: 30,
   marginRight: 30,
   marginBottom: 5,
 },

}
