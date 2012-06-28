var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var _s = require('underscore.string');

var request = require('request');
var spawn = require('child_process').spawn;


var Mongolian = require("mongolian");
var db = new Mongolian('mongodb://coursedexapp:plato2project@ds033887.mongolab.com:33887/coursedex');

var projects = db.collection("projects");
var tags = db.collection("tags");

exports.index = function(req, res){
  var name;
  projects.find({}).limit(10).toArray(function(err, arr){
    console.log('index');
    console.log('arr', arr);
    if(req.session && req.session.auth && req.session.auth.user){
      name = req.session.auth.user.name;
    }
    res.render('index', {
      title:'Coursedex',
      projects:arr,
      name:name
    });
  });
};

exports.project = function(req, res){
  console.log('hehhe');
  fs.readFile('./projects/' + req.params.pid + '/cd-files.json', 'utf-8', function(err, file){
    if(!err && file){
      file = JSON.parse(file);
      console.log('filed');
      res.render('project', {
        title: 'Coursedex',
        files: file,
        project: req.params.pid
      });
    }else{
      res.json({err:'no such project'});
    }
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
      if(results[2]){
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
      }else{
        res.json({err:'no navigation for project'});
      }
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
          str += '<li><a href="http://coursedex.com/project/'+project+file.path+'">'+file.name+'</a></li>';
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

exports.tags = function(req, res){
 res.render('tags', { title: 'Tags' });
};
exports.tag = function(req, res){
 res.render('tag/'+req.params.tag, { title: req.params.tag });
};
exports.projects = function(req, res){
 res.render('projects', { title: 'Projects' });
};
 /*exports.project = function(req, res){
   res.render('project/'+req.params.project, { title: req.params.project });
 };
 exports.projectfile = function(req, res){
   res.render('project/'+req.params.project + '/'+ req.params[0] + '.jade', { title: req.params.project });
 };*/


 exports.collections = function(req, res){
   res.render('collections', { title: 'Collections' });
 };

 exports.login = function(req, res){
  req.authenticate('facebook', function(error, authenticated) {
    if(authenticated ) {
      console.log(req.session);
      res.redirect('/');
      //res.render('loggedIn',{title:'Coursedex'});
    } else {
      res.end('notLoggedIn');
      //res.render('notLoggedIn',{title:'Coursedex'});
    }
  });
};

exports.isLoggedIn = function(req, res, next){
  if(req.session.auth && req.session.access_token && req.session.auth.user.id){
    next();
  }else{
    res.redirect('/');
  }
};

exports.newProject = function(req, res){
  var name;
  if(req.session && req.session.auth && req.session.auth.user){
    name = req.session.auth.user.name;
  }
  res.render('newProject', {
    title:'Coursedex',
    name:name
  });
};

exports.createNewProject = function(req, res){
  console.log(req.body, req.params);
  if(req.body.pname && req.body.uri){
    var project = {
      pname: req.body.pname,
      uri: req.body.uri
    };
    if(req.body.desc && req.body.desc !== ''){
      project.desc = req.body.desc;
    }
    if(req.body.tags && req.body.tags !== ''){
      project.tags = req.body.tags.split(',');
    }
    project.uploader = req.session.auth.user.id;
    projects.insert(project, function(err){
      console.log('insert Project');
      projects.findOne(project, function(err, proj){
        console.log('find Project');
        fs.mkdir('./projects/'+proj._id, function(){
          console.log('makedir for Project');
          request(project.uri).pipe(fs.createWriteStream('./projects/'+proj._id+'/git.zip')).on('close', function(code){
            console.log('retrieved Project');
            var unzip    = spawn('unzip', ['git.zip']);
            unzip.stderr.on('data', function(err){
              console.log(err.toString());
            });
            unzip.on('exit', function (code) {
              console.log('unzipped Project');
              if(code === 0){
                console.log('unzip successful');
                fs.unlink('./projects/'+proj._id+'/git.zip', function(exception){
                  console.log('unlinked .zip');
                  fs.readDir('./projects/'+proj._id, function(err, files){
                    console.log('find Project Folder name');
                    if(!err && files){
                      console.log('files exist');
                      console.log(files);
                      proj.folder = files[0];
                      projects.update({_id: proj._id}, proj, false, false);
                      res.end('success!');
                    }
                  });
                });
              }else{
                console.log(code);
                res.end('Error');
              }
            });
          });
        });
      });
    });
  }
};