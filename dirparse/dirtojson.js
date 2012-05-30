var fs = require('fs');
var program = require('commander');
var dir = process.argv[2];
var util = require('util');
var _ = require('underscore');
var _s = require('underscore.string');
var root = dir;
var ignore = ['node_modules', '.git'];
  console.log(dir);
console.log(dir.length);
var fs = require('fs');
var walk = function(dir, done) {

  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      var name = file;
      if(_.any(ignore, function(item){
       // console.log(file, item);
        return item === name;
      }) || _s.startsWith(name, '.')){
        console.log('ignore: ', file);
        pending--;
      }else{
        file = dir + '/' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results.push({name: name, type:'dir', path:file.substring(root.length, file.length), items:res});
              if (!--pending) done(null, results);
            });
          } else {
            if(_s.endsWith(file, '.meta')){
              if (!--pending) done(null, results);
            }else{
            fs.stat(file + '.meta', function(err, meta){
              if(!meta){
                console.log('err');
                results.push({name: name, type: 'file', path:file.substring(root.length, file.length), meta:false});
              }else{
                console.log('meta');
                results.push({name: name, type: 'file', path:file.substring(root.length, file.length), meta:true});
              }
              if (!--pending) done(null, results);
            
            });
          }
          }
        });
      }
    });
  });
};

walk(dir, function(err, results){
  console.log(util.inspect(results, false, null, true));
  fs.writeFile(root + 'cd-files.json', JSON.stringify(results, null, 4), 'utf-8', function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});
});

