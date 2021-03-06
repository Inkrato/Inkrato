/**
 * Configures the site wide database on startup.
 * 
 * This code is slightly buggy and it will be removed once there is a web based
 * interface for site admins.
 */

var Q = require('q'),
    Topic = require('../models/Topic'),
    Priority = require('../models/Priority'),
    State = require('../models/State'),
    Forum = require('../models/Forum');

module.exports = new function() {
  
  // Update topic list
  this.topics = function(topics) {
    var deferred = Q.defer(); 
    
    // Start by marking all existing topics as deleted
    Topic.update({}, { $set: { deleted: true } },  { multi: true }, function() {

      // Once all topics marked as deleted, (re)enable each configured topic
      Q.fcall(function() {
        var promises = [];
        topics.forEach(function(topic, index) {
          var promise = enableTopic(topic, index);
          promises.push(promise);
        });
        return Q.all(promises);
      })
      .then(function() {
        // Return list of all currently enabled topics
        Topic
        .find({ deleted: false }, null, { sort : { order: 1 } })
        .exec(function(err, topicsFromDatabase) {
          deferred.resolve(topicsFromDatabase);
        });
      });
      
    });
    return deferred.promise;
  };

  // On startup, create a topic in the DB if that topic doesn't exist already
  function enableTopic(topic, order) {
    var deferred = Q.defer();

    Topic
    .findOne({ name: new RegExp('^'+topic.name+'$', "i") })
    .exec(function(err, topicInDatabase) {
      if (topicInDatabase) {
        // If the topic exists aready, update it and mark it as enabled
        topicInDatabase.name = topic.name;
        topicInDatabase.icon = topic.icon;
        topicInDatabase.description = topic.description;
        topicInDatabase.order = order;
        topicInDatabase.deleted = false;
        topicInDatabase.save(function(err) {
          if (err)
            console.log('Unable to update topic in DB: '+topic.name+"\n"+err);
      
          deferred.resolve(topicInDatabase);
        });
      } else {
        // If the topic doesn't exist, create it
        var newTopic = new Topic({
          name: topic.name,
          icon: topic.icon,
          description: topic.description,
          order: order,
          deleted: false
        });
        newTopic.save(function(err) {
          if (err)
            console.log('Unable to create new topic in DB: '+topic.name+"\n"+err);

          deferred.resolve(newTopic);
        });
      }
    });

    return deferred.promise;
  };
  
  
  // Update priority list
  this.priorities = function(priorities) {
    var deferred = Q.defer(); 
    
    // Start by marking all existing priorities as deleted
    Priority.update({}, { $set: { deleted: true } },  { multi: true }, function() {
      // Once all priorities marked as deleted, (re)enable each configured priority
      Q.fcall(function() {
        var promises = [];
        priorities.forEach(function(priority, index) {
          var promise = enablePriority(priority, index);
          promises.push(promise);
        });
        return Q.all(promises);
      })
      .then(function() {
        // Return list of all currently enabled priorities
        Priority
        .find({ deleted: false }, null, { sort : { order: 1 } })
        .exec(function(err, prioritiesFromDatabase) {
          deferred.resolve(prioritiesFromDatabase);
        });
      });
      
    });
    return deferred.promise;
  };

  // On startup, create a priority in the DB if that priority doesn't exist already
  function enablePriority(priority, order) {

    var deferred = Q.defer();

    Priority
    .findOne({ name: new RegExp('^'+priority.name+'$', "i") })
    .exec(function(err, priorityInDatabase) {
      if (priorityInDatabase) {
        // If the priority exists aready, update it and mark it as enabled
        priorityInDatabase.name = priority.name;
        priorityInDatabase.color = priority.color;
        priorityInDatabase.order = order;
        priorityInDatabase.deleted = false;
        priorityInDatabase.save(function(err) {
          if (err)
            console.log('Unable to update priority in DB: '+priority.name+"\n"+err);
      
          deferred.resolve(priorityInDatabase);
        });
      } else {
        // If the priority doesn't exist, create it
        var newPriority = new Priority({
          name: priority.name,
          color: priority.color,
          order: order,
          deleted: false
        });
        newPriority.save(function(err) {
          if (err)
            console.log('Unable to create new priority in DB: '+newPriority.name+"\n"+err);

          deferred.resolve(newPriority);
        });
      }
    });

    return deferred.promise;
  };

  // Update state list
  this.states = function(states) {
    var deferred = Q.defer(); 
    
    // Start by marking all existing states as deleted
    State.update({}, { $set: { deleted: true } },  { multi: true }, function() {

      // Once all states marked as deleted, (re)enable each configured states
      Q.fcall(function() {
        var promises = [];
        states.forEach(function(state, index) {
          var promise = enableState(state, index);
          promises.push(promise);
        });
        return Q.all(promises);
      })
      .then(function() {
        // Return list of all currently enabled states
        State
        .find({ deleted: false }, null, { sort : { order: 1 } })
        .exec(function(err, stateFromDatabase) {
          deferred.resolve(stateFromDatabase);
        });
      });
      
    });
    return deferred.promise;
  };

  // On startup, create a state in the DB if that state doesn't exist already
  function enableState(state, order) {
    var deferred = Q.defer();

    State
    .findOne({ name: new RegExp('^'+state.name+'$', "i") })
    .exec(function(err, stateInDatabase) {
      if (stateInDatabase) {
        // If the state exists aready, update it and mark it as enabled
        stateInDatabase.name = state.name;
        stateInDatabase.open = state.open;
        stateInDatabase.order = order;
        stateInDatabase.deleted = false;
        stateInDatabase.save(function(err) {
          if (err)
            console.log('Unable to update state in DB: '+state.name+"\n"+err);
          deferred.resolve(stateInDatabase);
        });
      } else {
        // If the state doesn't exist, create it
        var newState = new State({
          name: state.name,
          open: state.open,
          order: order,
          deleted: false
        });
        newState.save(function(err) {
          if (err)
            console.log('Unable to create new state in DB: '+state.name+"\n"+err);

          deferred.resolve(newState);
        });
      }
    });

    return deferred.promise;
  };
  
  // Update forum list
  this.forums = function(forums) {
    var deferred = Q.defer(); 
    
    // Start by marking all existing forums as deleted
    Forum.update({}, { $set: { deleted: true } },  { multi: true }, function() {

      // Once all forums marked as deleted, (re)enable each configured forum
      Q.fcall(function() {
        var promises = [];
        forums.forEach(function(forum, index) {
          var promise = enableForum(forum, index);
          promises.push(promise);
        });
        return Q.all(promises);
      })
      .then(function() {
        // Return list of all currently enabled forums
        Forum
        .find({ deleted: false }, null, { sort : { order: 1 } })
        .exec(function(err, forumFromDatabase) {
          deferred.resolve(forumFromDatabase);
        });
      });
      
    });
    return deferred.promise;
  };

  // On startup, create a state in the DB if that state doesn't exist already
  function enableForum(forum, order) {
    var deferred = Q.defer();

    Forum
    .findOne({ name: new RegExp('^'+forum.name+'$', "i") })
    .exec(function(err, forumInDatabase) {
      if (forumInDatabase) {
        // If the forum exists aready, update it and mark it as enabled
        forumInDatabase.name = forum.name;
        forumInDatabase.icon = forum.icon;
        forumInDatabase.description = forum.description;
        forumInDatabase.order = order;
        forumInDatabase.deleted = false;
        forumInDatabase.save(function(err) {
          if (err)
            console.log('Unable to update forum in DB: '+forum.name+"\n"+err);
          deferred.resolve(forumInDatabase);
        });
      } else {
        // If the state doesn't exist, create it
        var newForum = new Forum({
          name: forum.name,
          icon: forum.icon,
          description: forum.description,
          order: order,
          deleted: false
        });
        newForum.save(function(err) {
          if (err)
            console.log('Unable to create new forum in DB: '+forum.name+"\n"+err);
          
          deferred.resolve(newForum);
        });
      }
    });

    return deferred.promise;
  };  
  
};