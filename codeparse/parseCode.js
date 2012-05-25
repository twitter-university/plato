#!/usr/bin/env node
var _ = require('underscore');
var _str = require('underscore.string');
var program = require('commander');
var fs = require('fs');
program
.version('0.0.1')
.option("-f, --file [value], 'file to parse'")
.parse(process.argv);
fs.readFile(program.file, function(err, file){
  if(!err && file){
    var arr = [];
    var i = 0;
    _.each(_str.lines(file), function(item){
      i++;
      item = _str.clean(item);
      if(_str.include(item, '//')){
        var n = item.match(/\B<[0-9,+]+>$/g);
        if(_.isNull(n)){
        }else{
          var o = _str.trim(n, '<');
          o = _str.trim(o, '>');
          o = o.split('+');
          var obj = {
            marker: n[0],
            start:o[0]
          };
          if(o.length > 1){
            obj.end = o[1];
          }
          arr.push(obj);
        }
      }
    });
    addContent(arr);
  }
});

function addContent(arr){
  fs.readFile(program.file + '.meta', 'utf-8', function(err, file){
   file = JSON.parse(file); 
   _.each(file, function(item){
     _.each(arr, function(arrItem){
       var testMarker = '<'+arrItem.start+'>';
       if(testMarker === item.marker){
         if(item.title){
           arrItem.title = item.title;
         }
         if(item.content){
           arrItem.content = item.content;
         }
       }
     })
   })
   console.log(arr);
  })
}
