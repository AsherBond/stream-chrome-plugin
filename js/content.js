/* gets injected every page, creates a new port connection named c-{timestamp},
   and injects ui elems in todo the dom */
$(function() {
  var container = $('<div id="mu-stm"><div id="mu-stm-ch"/></div>'), MAX_CHILDREN = 10;
  $(document.body).append(container);
  var container_ch = $('#mu-stm-ch');
  var onRsvp = function(rsvp) {
    if (rsvp.response != "yes") return;
      var span = $(['<div class="item"><span><a target="_blank" href="',rsvp.event.event_url,'">', rsvp.group.group_name,
                  "</a></span></div>"].join(""));
    container_ch.append(span);
    var kids = container_ch.children();
    kids.each(function(idx) {
      if (idx < kids.size() - MAX_CHILDREN) $(this).remove();
    });
    span.animate({ width: 'show' }, 1000);
  }
, port = chrome.extension.connect({name:"c-"+ (+new Date())});

  var onMessage = function(msg) {
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
  };
  port.onDisconnect.addListener(function(e) {
    if(port.onMessage.hasListener(onMessage)) {
      port.onMessage.removeListener(onMessage);
    }
  });
  port.onMessage.addListener(onMessage);
});