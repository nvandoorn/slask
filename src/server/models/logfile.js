'use strict';

const fs = require('fs');
const async = require('async');
const events = require('events');
const path = require('path');
const util = require('util');
const walk = require('walk');
const Heap = require('heap');
const clone = require('clone');
const dateFormat = require('dateformat');

const helpers = require('../helpers/helpers');
const constants = require('../helpers/constants');
const lineParser = require('../helpers/lineparser');

const DEFAULT_LEVEL = constants.defaultLevel;
const DEFAULT_LEVEL_STR = constants.defaultLevelStr;
const DEFAULT_SPLIT_STR = '\n'; // TODO put this in config

function parseLine(datetimePattern, levelPattern, timeFormatter){
  return function(line){
    const dateSplit = line.split(datetimePattern);
    const levelSplit = dateSplit[2].split(levelPattern);
    if(levelSplit[1] === undefined) debugger;
    const levelObj = getLevel(levelSplit[1], constants.levels);
    const dateObj = new Date(dateSplit[1]);
    return {
      text: levelSplit[2],
      level: levelObj.level,
      levelStr: levelObj.str,
      datetime: dateObj.getTime(),
      datetimeStr: dateFormat(dateObj, timeFormatter)
    }
  }
}

// TODO remove this filthy jank
function getLevel(levelStr, levelEnum){
  for(let key in levelEnum){
    if(levelStr.trim().toLowerCase().includes(key.toLowerCase())){
      return {
        level: levelEnum[key],
        str: key.toLowerCase()
      }
    }
  }
  return {
    level: DEFAULT_LEVEL,
    str: DEFAULT_LEVEL_STR
  }
}

const Logfile = {
  create: function(filepath, config){
    this.filepath = filepath;
    this.config = config;
    this.readFile();
    return this;
  },
  readFile: function(){
    const data = fs.readFileSync(this.filepath);
    // Filter to avoid empty lines
    const lines = data.toString().split(DEFAULT_SPLIT_STR).filter(k => k.length > 0);
    this.loglines = lines.map(parseLine(this.config.datetimePattern,
                    this.config.levelPattern, this.config.timeFormatter));
  },
  query: function(queryParmas){

  },
  paginate: function(){

  },
  getAll: function(){
    return this.loglines;
  }
};

module.exports= Logfile;

