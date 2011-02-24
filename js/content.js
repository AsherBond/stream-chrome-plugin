/* gets injected every page, creates a new port connection named c-{timestamp},
   and injects ui elems in todo the dom */
$(function() {
   var container = $('<div id="mu-stm"/>'), MAX_CHILDREN = 3;
  $(document.body).append(container);
  var onRsvp = function(rsvp) {
    if (rsvp.response != "yes") return;
      var span = $(['<div class="item"><span><a target="_blank" href="',rsvp.event.event_url,'">', rsvp.group.group_name,
                  "</a></span></div>"].join(""));
    container.append(span);
    var kids = container.children();
    kids.each(function(idx) {
      if (idx < kids.size() - MAX_CHILDREN) $(this).remove();
    });
    span.animate({ width: 'show' }, 1000);
  }
, port = chrome.extension.connect({name:"c-"+ (+new Date())});
  container.click(function(e) {
    port.postMessage({state:'toggle'});
    return true;
  });
  port.onDisconnect.addListener(function(e) {
    // disconnected
  });
  port.onMessage.addListener(function(msg) {
    try {
      if(msg.state) {
        // show connect/disconnect states
         if(msg.state == 'close') {
           container.addClass("mu-conn-closed");
         } else {
           container.removeClass("mu-conn-closed");
         }
      } else if(msg.rsvp) {
        onRsvp(msg.rsvp);
      } else if(msg.vis) {
        container.slideDown(200);
      } else { container.slideUp(200); }
    } catch(e) { alert("onMessage error " + e); }
 });
});