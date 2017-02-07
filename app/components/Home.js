/*
This component is responsible to show and manage all functionality
*/
import React, {Component} from 'react'
import {
  Text, View, ScrollView, Button, Image,
  TextInput, TouchableOpacity, Picker,
  DatePickerAndroid, TouchableWithoutFeedback } from 'react-native'
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view'
import Realm from 'realm'
import { ListView } from 'realm/react-native'
import BackgroundImage from './BackgroundImage'

import { connect } from 'react-redux';
import { updateMealRate } from '../actions/navActions';


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




class Home extends Component{
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
  var selectedDate = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
  this.setState({ selectedDate: selectedDate, mealStateName:'' });

  this.setState({ selectedMonth: d.getMonth(), costStateName:'' });

  let allMembers = realm.objects('Names');
  this.setState({dataSource: this.state.dataSource.cloneWithRows(allMembers)});

  this.calculateMealReate();

//  this.props.updateTdata('a');

}

componentWillMount(){
  let allMembers = realm.objects('Names');
  this.setState({dataSource: this.state.dataSource.cloneWithRows(allMembers)});
}

calculateMealReate(){
  //get total meals
  var totalMeal = 0;
  var selectedMonth = this.state.selectedMonth;
  let totalMealObj = realm.objects('Meal');
  totalMealObj.forEach((meals) =>{
      var date = meals.date;
      var dateArr = date.split("-");
      var month = parseInt(dateArr[1]);
      if(month == selectedMonth){
        totalMeal = totalMeal + meals.meal;
      }
  });

///find total cost
var totalCost = 0;
  let totalCostObj = realm.objects('Cost');
  totalCostObj.forEach((costs) =>{
      if(costs.month == selectedMonth){
        totalCost = totalCost + costs.cost;
      }
  });

  ///find total Deposit
  var totalDepo = 0;
    let totalDepoObj = realm.objects('Deposit');
    totalDepoObj.forEach((deps) =>{
        if(deps.month == selectedMonth){
          totalDepo = totalDepo + deps.deposit;
        }
    });

  var millrate = totalCost/totalMeal;
   millrate = millrate.toFixed(2);

  var credit = totalDepo - totalCost;

  this.setState({mealRate: millrate});
  this.props.updateMealRate(millrate);
this.setState({credit: credit});

}

showPicker = async (stateKey, options) => {
   try {
     var newState = {};
     const {action, year, month, day} = await DatePickerAndroid.open(options);
     if(action == DatePickerAndroid.dateSetAction){
        //console.log(action, year, month, day);
        this.setState({ selectedDate: day + '-' + month + '-' + year });
        //alert(day + '-' + month + '-' + year);
     }
     if (action === DatePickerAndroid.dismissedAction) {
       newState[stateKey + 'Text'] = 'dismissed';
     } else {
       var date = new Date(year, month, day);
       newState[stateKey + 'Text'] = date.toLocaleDateString();
       newState[stateKey + 'Date'] = date;
     }
     this.setState(newState);
   } catch ({code, message}) {
     console.warn(`Error in example '${stateKey}': `, message);
   }


 };

addOrUpdateMealtoDb(member_id,meal, mealId){
  if(this.state.mealStateName == '') return;
  var newMeal = parseFloat(this.state.mealStateName);
  var selectedDate = this.state.selectedDate;
  var id = Math.floor(Date.now())
  if(meal == 0){
    realm.write(() => {
      // Update book with new price keyed off the id
      realm.create('Meal', {id: id, member_id: member_id, meal:newMeal, date:selectedDate});
    });
  }
  else{
    realm.write(() => {
      // Update book with new price keyed off the id
      realm.create('Meal', {id: mealId, member_id:member_id, meal:newMeal, date:selectedDate}, true);
    });
  }

  this.setState({mealStateName:''});

  let allMembers = realm.objects('Names');
  this.setState({dataSource: this.state.dataSource.cloneWithRows(allMembers)});

  this.calculateMealReate();

}


addOrUpdateCosttoDb(member_id,cost, costId){
  if(this.state.costStateName == '') return;
  var newCost = parseFloat(this.state.costStateName);
  var selectedMonth = this.state.selectedMonth;
  var id = Math.floor(Date.now())
  if(cost == 0){
    realm.write(() => {
      // Update book with new price keyed off the id
      realm.create('Cost', {id: id, member_id: member_id, cost:newCost, month:selectedMonth});
    });
  }
  else{
    realm.write(() => {
      // Update book with new price keyed off the id
      realm.create('Cost', {id: costId, member_id:member_id, cost:newCost, month:selectedMonth}, true);
    });
  }

  this.setState({costStateName:''});

  let allMembers = realm.objects('Names');
  this.setState({dataSource: this.state.dataSource.cloneWithRows(allMembers)});

  this.calculateMealReate();

}


addOrUpdateDeposittoDb(member_id, deposit, depositId){
  if(this.state.depositStateName == '') return;
  var newDeposit = parseFloat(this.state.depositStateName);
  var selectedMonth = this.state.selectedMonth;
  var id = Math.floor(Date.now())
  if(deposit == 0){
    realm.write(() => {
      // Update book with new price keyed off the id
      realm.create('Deposit', {id: id, member_id: member_id, deposit:newDeposit, month:selectedMonth});
    });
  }
  else{
    realm.write(() => {
      // Update book with new price keyed off the id
      realm.create('Deposit', {id: depositId, member_id:member_id, deposit:newDeposit, month:selectedMonth}, true);
    });
  }

  this.setState({depositStateName:''});

  let allMembers = realm.objects('Names');
  this.setState({dataSource: this.state.dataSource.cloneWithRows(allMembers)});

  this.calculateMealReate();

}



getMeal(id){
  let meals = realm.objects('Meal');
  var date = this.state.selectedDate;
 //alert(date);
  let mealObj = meals.filtered("member_id = $0 AND date = $1",id,date);
  //console.log('gotLength',mealObj.length);
  if(mealObj.length != 0){
    return {id:mealObj[0].id, meal:mealObj[0].meal};
  }
  return {id:0, meal:0};
}

 listMeals(member){
    let meal = this.getMeal(member.id);
    console.log('returned meal',meal);
   return(
     <View style={styles.tabContent}>
       <Text style={styles.name}> {member.name}: {meal.meal} </Text>
         <TextInput
               style={styles.textInput} placeholder="Meal"
                   onChangeText={(mealStateName) => this.setState({mealStateName})}
                    keyboardType="numeric"
                     onSubmitEditing= {this.addOrUpdateMealtoDb.bind(this, member.id, meal.meal,meal.id)}
                           />
                         <TouchableOpacity style={styles.btnCnt} onPress={this.addOrUpdateMealtoDb.bind(this, member.id, meal.meal,meal.id)}>
               <Text style={styles.button}> ADD </Text>
           </TouchableOpacity>
     </View>
   );

 }


getCost(id){
  let meals = realm.objects('Cost');
  var month = this.state.selectedMonth;
  let costObj = meals.filtered("member_id = $0 AND month = $1",id,month);
  //console.log('gotLength',mealObj.length);
  if(costObj.length != 0){
    return {id:costObj[0].id, cost:costObj[0].cost};
  }

  return {id:0, cost:0};
}

 listCosts(member){
   let cost = this.getCost(member.id);
   //console.log('returned meal',meal);
  return(
    <View style={styles.tabContent}>
      <Text style={styles.name}> {member.name}: {cost.cost} </Text>
        <TextInput
              style={styles.textInput} placeholder="Cost"
                  onChangeText={(costStateName) => this.setState({costStateName})}
                   keyboardType="numeric"
                    onSubmitEditing= {this.addOrUpdateCosttoDb.bind(this, member.id, cost.cost,cost.id)}
                          />
                        <TouchableOpacity style={styles.btnCnt} onPress={this.addOrUpdateCosttoDb.bind(this, member.id, cost.cost,cost.id)}>
        <Text style={styles.button}> ADD </Text>
      </TouchableOpacity>
    </View>
  );

 }



 getDeposit(id){
   let deps = realm.objects('Deposit');
   var month = this.state.selectedMonth;
   let depositObj = deps.filtered("member_id = $0 AND month = $1",id,month);
   //console.log('gotLength',mealObj.length);
   if(depositObj.length != 0){
     return {id:depositObj[0].id, deposit:depositObj[0].deposit};
   }

   return {id:0, deposit:0};
 }

 listDeposits(member){
   let deposit = this.getDeposit(member.id);
   //console.log('returned meal',meal);
  return(
    <View style={styles.tabContent}>
      <Text style={styles.name}> {member.name}: {deposit.deposit} </Text>
        <TextInput
              style={styles.textInput} placeholder="Deposit"
                  onChangeText={(depositStateName) => this.setState({depositStateName})}
                   keyboardType="numeric"
                    onSubmitEditing= {this.addOrUpdateDeposittoDb.bind(this, member.id, deposit.deposit,deposit.id)}
                          />
                        <TouchableOpacity style={styles.btnCnt} onPress={this.addOrUpdateDeposittoDb.bind(this, member.id, deposit.deposit,deposit.id)}>
        <Text style={styles.button}> ADD </Text>
      </TouchableOpacity>
    </View>
  );

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

goMembers(){
  const memberRoute= {
    type: 'push',
    route: {
      key: 'memberManage',
      title: 'Member Manage Screen'
    }
  }
  this.props._handleNavigate(memberRoute);
}

goReports(){
  const memberRoute= {
    type: 'push',
    route: {
      key: 'report',
      title: 'Report Screen'
    }
  }
  this.props._handleNavigate(memberRoute);
}


  render(){
    return(
      <BackgroundImage style={styles.containerMain}>
        <View style={styles.mainHeader}>
          <Text style={styles.txt}> {this.getMonthByIndex(this.state.selectedMonth)}  </Text>
          <Text style={styles.txt}> Meal Rate: {this.props.mealrate}  </Text>
          <Text style={styles.txt}> Credit: {this.state.credit} , t:  </Text>
        </View>
        <View style={styles.nav}>
          <TouchableOpacity onPress={this.goMembers.bind(this)}><Text style={styles.button}> Members </Text></TouchableOpacity>
          <TouchableOpacity onPress={this.goReports.bind(this)}><Text style={styles.button}> Report </Text></TouchableOpacity>
        </View>
        <View style={styles.tabCnt}>
          <ScrollableTabView
            renderTabBar={()=><DefaultTabBar backgroundColor='rgba(255, 255, 255, 0.7)' />}
            tabBarPosition='overlayTop'
          >
            <ScrollView tabLabel='Meal'>
                <View style={styles.tabContentMain}>
                  <View style={styles.dateInfo}>
                    <Text style={styles.date}> Date: {this.state.selectedDate} </Text>
                    <TouchableOpacity style={styles.datePicker} onPress={this.showPicker.bind(this, 'simple', {date: this.state.simpleDate})}><Text style={styles.button}> Select Date </Text></TouchableOpacity>
                  </View>
                  <View style={styles.mealListCnt}>
                    <ListView
                      dataSource={this.state.dataSource}
                      renderRow={this.listMeals.bind(this)}
                    />
                 </View>
              </View>
            </ScrollView>
            <ScrollView tabLabel='Cost'>
              <View style={styles.tabContentMain}>
                <View style={styles.monthInfo}>
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
                <View style={styles.mealListCnt}>
                    <ListView
                      dataSource={this.state.dataSource}
                      renderRow={this.listCosts.bind(this)}
                    />
                </View>
              </View>
            </ScrollView>
            <ScrollView tabLabel='Deposit Money'>
              <View style={styles.tabContentMain}>
                <View style={styles.monthInfo}>
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
                <View style={styles.mealListCnt}>
                    <ListView
                      dataSource={this.state.dataSource}
                      renderRow={this.listDeposits.bind(this)}
                    />
                </View>
              </View>
            </ScrollView>
          </ScrollableTabView>
        </View>
     </BackgroundImage>
    );
  }
}


const mapStateToProps = state => {
  const { mealrate } = state;
  console.log("mealrate", state);
  return {mealrate};
};

export default connect(mapStateToProps, { updateMealRate })(Home);



const styles = {
  container:{
     flex:1,
     width: null,
     height: null,
     resizeMode: 'cover',
  },
  containerMain:{
     flex:1,
  },
  tabContentMain:{
    marginTop: 70,
    flex: 1,
  },
  mainHeader:{
    flex: 0.05,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  nav:{
    flex:0.13,
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    justifyContent: 'space-between',
    height: 150,
  },
  tabCnt:{
    flex: 0.85,
  },
  mealTab:{

  },
  txt:{
    fontSize: 14,
    color: '#FFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  info:{
    fontSize: 12,
    color:'#FFF',
    marginLeft: 5,
    textAlign: 'center',
  },
  name:{
    fontSize: 18,
    color: '#FFF',
    marginLeft: 5,
    flex: 50,
    marginTop: 11,

  },
  tabContent:{
    flexDirection: 'row',
    marginBottom: 20,
  },
  textInput:{
    height: 40,
    borderWidth: 1,
    flex:20,
    marginTop: 5,
    marginLeft: 5,
    backgroundColor: '#FFF',
    borderRadius:5,
  },
  btnCnt:{
   flex: 30,
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
  dateInfo:{
    flexDirection: 'row',
    height: 40,
    flex: 0.08,
  },
  mealListCnt:{
   borderRadius: 10,
   borderWidth: 1,
   borderColor: '#FFF',
   marginLeft: 5,
   marginRight: 5,
   marginBottom: 5,
   flex: 0.50,
   marginTop: 10,
   paddingTop: 5,
   paddingBottom: 5,
  },
  empty:{
    flex: 10,
  },
  date:{
    flex: 50,
    fontSize: 14,
    color: '#FFFFFF',
  },
  datePicker:{
    flex: 50,
    marginTop: -15,
  },
  picker:{
    color:'#FFF',
    borderColor: '#FFF',
    width: 120,
  },
  monthInfo:{
    alignItems:'center',
  },

}
