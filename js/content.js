/* gets injected every page, creates a new port connection named c-{timestamp},
   and injects ui elems in todo the dom */
$(function() {
    var container = $('<div id="mu-stm"/>'), MAX_CHILDREN = 3;
  $(document.body).prepend(container);
  container.slideDown(500);

  var onRsvp = function(rsvp) {
    if (rsvp.response != "yes") return;
    var span = $(['<div class="item"><span>', rsvp.group.group_name,
                  "</span></div>"].join(""));
    container.append(span);
    var kids = container.children();
    kids.each(function(idx) {
      if (idx < kids.size() - MAX_CHILDREN) $(this).remove();
    });
    span.animate({ width: 'show' }, 1000);
  }
, port = chrome.extension.connect({name:"c-"+ (+new Date())});

  port.onDisconnect.addListener(function(e) {
    // disconnected
  });
  port.onMessage.addListener(function(msg) {
    if(msg.state) {
      // show connect/disconnect states
    } else if(msg.rsvp) {
      onRsvp(msg.rsvp);
    }
 });
});