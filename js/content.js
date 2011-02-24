/* gets injected every page */
$(function() {
  var port = chrome.extension.connect(),
    socket = new WebSocket("ws://stream.meetup.com/2/rsvps"),
    container = $('<div id="mu-stm"/>');
  socket.onopen = function(e) { };
  socket.onclose = function(e) { };
  $(document.body).prepend(container);
  container.slideDown(500);
  socket.onmessage = function(event) {
    var rsvp = JSON.parse(event.data);
    if (rsvp.response != "yes") return;
    var span = $(['<div class="item"><span>', rsvp.group.group_name,
                  "</span></div>"].join(""));
    container.append(span);
    var childs = container.children();
    var MAX = 3; /* max we think might still be on screen */
    childs.each(function(idx) {
       if (idx < childs.size() - MAX) $(this).remove();
    });
    span.animate({ width: 'show' }, 1000);
  };
});