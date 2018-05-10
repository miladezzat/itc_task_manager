var express               = require('express');
var router                = express.Router();
var User                  =	require('../models/user.js');
var Rules                 =	require('../models/rules.js');
//All methods for control users
var methodsController     = require("../controllers/methods");
var Project               = require("../models/projects");
var ProjectTasks          = require("../models/projectTasks");
var Tasks                 = require("../models/tasks");

/* GET Profile page. */
router.get('/employeeprofile',methodsController.isLoggedIn, function(req, res, next) {
  User.findOne({email: req.user.email}, function(err, user) {
    if (err) {
       throw err;
    }
    var isProjectManaget= false ;

    Rules.findOne({ruleid: user.rule_id}, function(error, rule){
      if(error) {
        throw error;
      }
      var job = rule.rulename;
      Project.findOne({projectManagerId: user._id}, function(err2, project){
          if(err2) {
              throw err2
          }
          if(project){
              isProjectManaget  = true;
          }
        Tasks.find({employeeId: user._id }, function(err, tasksofEmployee){
            if(err){throw err;}
            Project.find({projectManagerId: user._id}, function (err, projectsForReport) {
               if(err) {throw err;}
               var tasksOfReports = new Array();
               var projectNumbers = projectsForReport.length;

               for(let index=0; index<projectsForReport.length; index++){
                   Tasks.find({projectId: projectsForReport[index]._id}, function (err, tasksReports) {
                       tasksOfReports.push(tasksReports);
                       projectNumbers = projectNumbers - 1;
                       if(projectNumbers == 0){
                           res.render('profile/employees/employeeProfile', { title: 'IT Task Manager', user: user, job:job, isProjectManaget: isProjectManaget,  tasksofEmployee: tasksofEmployee, tasksOfReports: tasksOfReports, projectsForReport: projectsForReport});
                       }
                   });
               }
               if(! isProjectManaget){
                   res.render('profile/employees/employeeProfile', { title: 'IT Task Manager', user: user, job:job, isProjectManaget: isProjectManaget,  tasksofEmployee: tasksofEmployee, tasksOfReports: tasksOfReports, projectsForReport: projectsForReport});
               }
            });
        });
      });
    });    
  });
});

router.get('/projects',methodsController.isLoggedIn, function(req,res,next){
  User.findOne({email: req.user.email}, function(err, user) {
    if (err) {
       throw err;
    }
    Project.find({projectManagerId: user._id}, function(err, projects){
      res.render('profile/employees/projects',{title:'ITC Task Manager', projects: projects, user:user});
    });
  });
});
///project details
router.get('/details/:id',methodsController.isLoggedIn, function(req, res, next){
  User.findOne({email: req.user.email}, function(err, user) {
    Project.findOne({_id: req.params.id}, function(err, project){
      if (err) {
        throw err;
      }
      User.findOne({_id:project.projectManagerId}, function(err, manager){
        if(err) {
          throw err;
        }

        var teamMembersId = project.employees;

        var temaMembers = new Array();
        
        for (let index = 0; index < teamMembersId.length; index++) {
          User.findOne({ _id: teamMembersId[index]}, function(error3, member){
            
            temaMembers.push(member);
            if (teamMembersId.length == temaMembers.length){
              ProjectTasks.findOne({projectId: req.params.id}, function(err, projectTasks){
                if(err) {throw err}
                  Tasks.find({projectId: req.params.id }, function(err, tasksofProject){
                    if (err) {throw err;}
                    if(projectTasks) {
                        projectTasks = projectTasks.tasks;
                    }
                    res.render('profile/employees/projectDetails',{title: 'IT Task Manager',project: project, manager: manager, user:user, temaMembers:temaMembers,projectTasks:projectTasks,tasksofProject:tasksofProject});
                  });    
              });
            }
          });
        }

      });
    });
  });
});


///assign project Tasks
router.get('/addtask/:projectId', methodsController.isLoggedIn,function(req, res, next){
  Project.findOne({_id: req.params.projectId}, function(err, project){
    if (err) {throw err;}

    var teamMembersId = project.employees;

    var temaMembers = new Array();
        
    for (let index = 0; index < teamMembersId.length; index++) {
      User.findOne({ _id: teamMembersId[index]}, function(error3, member){
        
        temaMembers.push(member);

        if (teamMembersId.length == temaMembers.length){
          ProjectTasks.findOne({projectId: req.params.projectId}, function(err, tasks){
            if(err) {throw err}
            if(tasks){
                var tasksP = tasks.tasks;
            }
            res.render('profile/employees/addTask',{title: 'IT Task Manager',project: project, temaMembers:temaMembers, projectTasks: tasksP});
          });          
        }
      });
    }

  });
});

///assign project Tasks
router.post('/addtask',methodsController.isLoggedIn, function(req, res, next){
  var employeeDetail = req.body.employeeId.split(',');

  var employeeId = employeeDetail[0];
  var employeeName = employeeDetail[1]+" "+employeeDetail[2]
  
  var newAssignTask = new Tasks();

  newAssignTask.employeeName    =   employeeName;
  newAssignTask.projectName     =   req.body.projectName;
  newAssignTask.projectId       =   req.body.projectId;
  newAssignTask.taskName        =   req.body.taskName;
  newAssignTask.employeeId      =   employeeId;
  newAssignTask.startDate       =   req.body.startDate;
  newAssignTask.EndDate         =   req.body.endDate;
  newAssignTask.finshed         =   'no';

  newAssignTask.save(function(err){
    if(err){throw err;}
    res.redirect('/employees/details/'+req.body.projectId);
  });
});

// Finshed Tasks
router.get('/finshedTask/:id',methodsController.isLoggedIn, function(req, res, next){
    var date = new Date();
    Tasks.findOneAndUpdate({_id:req.params.id},
        {
            $set: {
                finshed			      : "Yes",
                finshedTime			  :	date.getFullYear() +" - "+(date.getMonth()+1)+" - "+date.getDate()
            }
        }, null, function(err){
            if (err) {
                throw err;
            }
            res.redirect('/employees/employeeprofile');
        });
});


//Divided Project To Tasks
router.get('/dividedProject/:projectId',methodsController.isLoggedIn, function(req, res, next){
  res.render('profile/employees/dividedProject', {title: "ITC Task Manager", projectId: req.params.projectId});
});
//Divided Project To Tasks
router.post('/dividedProject',methodsController.isLoggedIn, function(req, res, next){
  var newProjectTasks = new ProjectTasks();
      
  newProjectTasks.projectId = req.body.projectId;
  newProjectTasks.tasks   = req.body.tasks;

  newProjectTasks.save(function(err){
    if(err) { throw err;}
    res.redirect('/employees/details/'+req.body.projectId);
  });
});

//update project
router.get('/projectUpdate/:id', methodsController.isLoggedIn,function(req, res, next){
  User.findOne({email: req.user.email}, function(err, user) {
    Project.findOne({_id: req.params.id}, function(err, project){
      if (err) {
        throw err;
      }
      User.findOne({_id:project.projectManagerId}, function(err, manager){
        if(err) {
          throw err;
        }
        User.find({}, function(err, employees){
          res.render('profile/employees/projectUpdate',{title: 'IT Task Manager',project: project, manager: manager, employees:employees, user: user});
        });
      });
    });
  });
});
router.post('/projectUpdate/:id',methodsController.isLoggedIn, function(req, res, next){
  Project.findOneAndUpdate({_id:req.params.id},
		{
			$set: {
        projectName			: 	req.body.projectName,
				startDate			  :		req.body.startDate,
				endDate	        : 	req.body.endDate,
				employees			  : 	req.body.employees,
			}
		}, null, function(err){
		if (err) {
		  throw err;
		}
		res.redirect('/employees/employeeprofile');
	  });
});

//Add new Tasks Or Update Old
router.get('/updateTasksProject/:id',methodsController.isLoggedIn, function(req, res, next){
    ProjectTasks.findOne({projectId: req.params.id}, function (err, tasks) {
        if(err) {
            throw err;
        }
        res.render('profile/employees/update', {title: "ITC Task Manager", tasks: tasks.tasks,projectId: req.params.id});
    });
});

router.post('/updateTasksProject/:id',methodsController.isLoggedIn, function(req, res, next){
    ProjectTasks.findOneAndUpdate({projectId :req.params.id},
        {
            $set: {
                tasks	:   req.body.tasks
            }
        }, null, function(err){
            if (err) {
                throw err;
            }
            res.redirect('/employees/details/'+req.params.id);
        });
});

module.exports = router;
