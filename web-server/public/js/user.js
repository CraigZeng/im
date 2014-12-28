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
      uid: null
    };
  };

  Chat.prototype.init = function(uid, callback) {
    var route = 'gate.gateHandler.queryEntry';
    var that = this,
    pomelo = this.pomelo;
    that.config.uid = uid;
    pomelo.init(that.config.gate, function() {
      pomelo.request(route, {
        uid: uid
      }, function(connectorInfo) {
        if (connectorInfo.code === 500) {
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

  Chat.prototype.joinChannel = function(kid, callback) {
    var that = this;
    var pomelo = this.pomelo;
    var route = "connector.entryHandler.enter";
    pomelo.request(route, {
      username: that.config.uid,
      rid: kid
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
      rid: data.kid,
      content: data.msg,
      from: this.config.uid,
      target: data.target
    }, function(data) {
      callback && callback(data);
    });
  };

  (function() {
    var chat = new Chat();

    var initEvents = function(){
      chat.pomelo.on('onChat', function(data) { console.log(data.msg)});

      chat.pomelo.on('onAdd', function(data) { console.log("onAdd")});

      chat.pomelo.on('onLeave', function(data) { console.log("onLeave")});

      chat.pomelo.on('disconnect', function(reason) { console.log("disconnect")});
    }

    var initChannel = function(){
      var kid = "k123456";
      chat.joinChannel(kid);
    }

    var bindUIEvents = function(){
      $("#sendMsgBtn").click(function(){
        var msg = {};
        msg.target = msg.kid = "k123456";
        msg.msg = $("#msg").val();
        chat.send(msg, function(data){
          console.log(data);
        });
      });
    }

    //用户和id
    chat.init('u123456', function(data){
      initChannel();
      initEvents();
      bindUIEvents();
    });
  })();
});
