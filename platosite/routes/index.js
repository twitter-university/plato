var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var _s = require('underscore.string');

exports.index = function(req, res){
  console.log('index');
  fs.readdir('./projects', function(err, files){
    res.render('index', {
      title:'Coursedex',
      projects:files
    });
  });
};

exports.project = function(req, res){
  console.log('hehhe');
  fs.readFile('./projects/' + req.params.pid + '/cd-files.json', 'utf-8', function(err, file){
    file = JSON.parse(file);
    console.log('filed');
    res.render('project', {
      title: 'Coursedex',
      files: file,
      project: req.params.pid
    });
  });
};

exports.projectfile = function(req, res){
  console.log('projectfile');
  console.log(req.params);
  async.parallel([
    function(callback){
      fs.readFile('./projects/'+req.params.pid+'/'+req.params[0], function(err, file){
        callback(null,file);
      });
    },
    function(callback){
      fs.readFile('./projects/'+req.params.pid+'/'+req.params[0]+'.meta', 'utf-8', function(err, file){
        if(!err && file){
          file = JSON.parse(file);
        }
        callback(null, file);
      });
    },
    function(callback){
      fs.readFile('./projects/'+req.params.pid+'/cd-files.json', 'utf-8', function(err, file){
        file = JSON.parse(file);
        callback(null, file);
      });
    }
    ],function(err, results){
      itemslist(results[2], req.params.pid, function(obj){


        res.render('projectfile', {
          title:'Coursedex',
          file: results[0],
          meta: results[1],
          nav: results[2],
          project: req.params.pid,
          filesnav: obj,
          content: parseFile(results[0], results[1])
        });
      });
    });
};

function itemslist(files, project, callback){
  var str = '';
  function listIt(files2, callback){
    if(files && project){
      _.each(files2, function(file){
        if(file.items){
          str+= '<li><a href="#">'+file.name+'</a><ul>';
          listIt(file.items, function(){
            str += '</ul></li>';
          });
        }else{
          str += '<li><a href="http://localhost:3000/project/'+project+file.path+'">'+file.name+'</a></li>';
        }
      });
      console.log(str);
      callback(str);
    }else{
      return str;
    }
  }
  listIt(files, callback);
}
function parseFile(file, meta){
  var arr = [];
  var i = 0;
  _.each(_s.lines(file), function(item){
    i++;
    item = _s.clean(item);
    if(_s.include(item, '//')){
      var n = item.match(/\B<[0-9,+]+>$/g);
      if(_.isNull(n)){
      }else{
        var o = _s.trim(n, '<');
        o = _s.trim(o, '>');
        o = o.split('+');
        var obj = {
          marker: n[0],
          start:o[0],
          line: i
        };
        if(o.length > 1){
          obj.end = o[1];
        }
        arr.push(obj);
      }
    }
  });

  _.each(meta, function(item){
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
   });
 });
  console.log(arr);
  return arr;
}

exports.script = function(req, res){
  async.parallel([
    function(callback){
      fs.readFile('./projects/'+req.params.pid+'/'+req.params[0], function(err, file){
        callback(null,file);
      });
    },
    function(callback){
      fs.readFile('./projects/'+req.params.pid+'/'+req.params[0]+'.meta', 'utf-8', function(err, file){
        if(!err && file){
          file = JSON.parse(file);
        }
        callback(null, file);
      });
    }
    ],function(err, results){
     console.log(req.params);
     res.json(parseFile(results[0], results[1]));
   });
};