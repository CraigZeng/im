$(function() {
  var Chat = function(config) {
    this.pomelo = window.pomelo;
    this.config = config || {
      gate: {
        host: window.location.hostname,
        port: 3014,
        log: true
      },
      connector: null,
      userId: 1
    };
  };

  Chat.prototype.init = function(uid, callback) {
    var route = 'gate.gateHandler.queryEntry';
    var that = this,
      pomelo = this.pomelo;
    pomelo.init(that.config.gate, function() {
      pomelo.request(route, {
        uid: uid
      }, function(connectorInfo) {
        if (data.code === 500) {
          return;
        }
        pomelo.disconnect();
        that.config.connector = connectorInfo;
        that.config.connector.log = true;
        pomelo.init(that.config.connector, function(data) {
          callback && callback(data);
        });
      });
    });
  };

  Chat.prototype.joinChannel = function(username, rid, callback) {
    var pomelo = this.pomelo;
    var route = "connector.entryHandler.enter";
    pomelo.request(route, {
      username: username,
      rid: rid
    }, function(data) {
      if (data.error) {
        return;
      } else {
        callback && callback(data)
      }
    });
  };

  Chat.prototype.on = function(eve, callback) {
    var pomelp = this.pomelo;
    pomelo.on(eve, callback);
  };

  Chat.prototype.send = function(data, callback) {
    var route = "chat.chatHandler.send";
    var that = this,
      pomelp = this.pomelo;
    pomelo.request(route, {
      rid: data.rid,
      content: data.msg,
      from: that.userId,
      target: data.target
    }, function(data) {
      callback && callback(data);
    });
  };

  (function() {
    var chat = new Chat();

    chat.pomelo.on('onChat', function(data) {});

    chat.pomelo.on('onAdd', function(data) {});

    chat.pomelo.on('onLeave', function(data) {});

    chat.pomelo.on('disconnect', function(reason) {});
  })();
});
