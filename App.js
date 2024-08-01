// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { DatabaseContext } from './DatabaseContext.js';

import AboutScreen from './screens/AboutScreen.js';
import NewDestinationScreen from './screens/NewDestinationScreen.js';
import DestinationListScreen from './screens/DestinationListScreen.js';

const db = SQLite.openDatabase('AdventureExplorer.db');

const Tab = createBottomTabNavigator();

const App = () => {

  // create a state variable which will be passed in context so that accesssibl in each screen. so when I add places to db in one screen, the list screen will be updated automatically when useState is monitoring this variable in the list screen
  const [listRefresh, setListRefresh] = useState(true);

  useEffect(() => {
    createTable();
  }, [])

  return (
    <NavigationContainer>
      <Image source={{ uri: 'https://www.vaniercollege.qc.ca/wp-content/themes/vaniermain/images/logo.png' }} style={{ backgroundColor: 'red', width: 100, height: 30, position: 'absolute', zIndex: 1, top: 50, right: 20, }} />
      <DatabaseContext.Provider value={{db, listRefresh, setListRefresh}}>
        <Tab.Navigator>
          <Tab.Screen
            name="New Destination"
            component={NewDestinationScreen}
            options={{
              tabBarIcon: () => <Image source={require('./assets/blank.png')} style={{ width: 30, height: 30 }} />
            }}
          />
          <Tab.Screen
            name="Destinations List"
            component={DestinationListScreen}
            options={{
              tabBarIcon: () => <Image source={require('./assets/blank.png')} style={{ width: 30, height: 30 }} />
            }}
          />
          <Tab.Screen
            name="About Me"
            component={AboutScreen}
            options={{
              tabBarIcon: () => <Image source={require('./assets/blank.png')} style={{ width: 30, height: 30 }} />
            }}
          />
        </Tab.Navigator>
      </DatabaseContext.Provider>
    </NavigationContainer>
  );
};



const createTable = () => {
  // Create the table if it doesn't exist
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Places (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          latitude TEXT,
          longitude TEXT,
          place_name TEXT,
          post_code TEXT,
          description TEXT
        );`,
      [],
      (_, result) => {
        console.log('Database table created successfully.');
      },
      (_, error) => {
        console.error('Failed to create database table:', error);
      }
    );
  });

}

export default App;
