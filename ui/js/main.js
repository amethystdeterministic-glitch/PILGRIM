(function () {
"use strict";
var API = "http://127.0.0.1:9090";

function byId(i){return document.getElementById(i);}
function setText(e,t){if(e)e.textContent=t;}

function init(){
  var addressBar = byId("address-bar");

  // Speed dial (updates address bar only)
  var speed = byId("speed-dial");
  speed.onclick = function(e){
    if(e.target.tagName!=="LI") return;
    setText(addressBar, e.target.getAttribute("data-target"));
  };

  // Zyte feed toggle + load
  var feed = byId("zyte-feed");
  var feedList = document.querySelector("#zyte-feed-content ul");
  feed.onclick = function(){
    var s = feed.getAttribute("data-state");
    feed.setAttribute("data-state", s==="expanded"?"collapsed":"expanded");
    var label = feed.querySelector(".zyte-toggle");
    setText(label, s==="expanded" ? "Tap to expand" : "Tap to collapse");
    if(s!=="expanded"){
      fetch(API+"/zytes").then(r=>r.json()).then(z=>{
        feedList.innerHTML="";
        z.forEach(i=>{
          var li=document.createElement("li");
          li.textContent=i.title+" v"+i.version;
          feedList.appendChild(li);
        });
      });
    }
  };

  // Create
  byId("zb-create").onclick = function(){
    fetch(API+"/zyte",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        id:byId("zb-id").value.trim(),
        title:byId("zb-title").value.trim(),
        content:byId("zb-content").value.trim()
      })}).then(r=>r.text()).then(t=>setText(byId("zb-create-result"),t));
  };

  // Update
  byId("zb-update").onclick = function(){
    fetch(API+"/zyte/update",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        id:byId("zb-id").value.trim(),
        title:byId("zb-title").value.trim(),
        content:byId("zb-content").value.trim()
      })}).then(r=>r.text()).then(t=>setText(byId("zb-create-result"),t));
  };

  // Zox bind
  byId("zox-bind").onclick = function(){
    fetch(API+"/zox",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        id:byId("zox-id").value.trim(),
        zyte:byId("zox-zyte").value.trim()
      })}).then(r=>r.text()).then(t=>setText(byId("zox-result"),t));
  };

  // Export
  byId("exp-json").onclick = function(){
    fetch(API+"/export/json/"+byId("exp-id").value.trim()).then(r=>r.text()).then(t=>setText(byId("exp-result"),t));
  };
  byId("exp-md").onclick = function(){
    fetch(API+"/export/md/"+byId("exp-id").value.trim()).then(r=>r.text()).then(t=>setText(byId("exp-result"),t));
  };

  // Proof
  byId("proof-get").onclick = function(){
    fetch(API+"/proof/"+byId("proof-id").value.trim()).then(r=>r.text()).then(t=>setText(byId("proof-result"),t));
  };
}

document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();
