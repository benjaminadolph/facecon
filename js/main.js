 /*******************
 * VARIABLES
 *******************/

var activeSite
var lastActiveSite = 0
var sites = ['/site1.html', '/site2.html', '/site3.html']

var buttonsActive = false
var controlbuttons = ['#clickbutton', '#scrollv1button', '#scrollv2button', '#navigationv1button', '#navigationv2button']

var scrollv1Enabled = false
var scrollv2Enabled = false

var navigatev1Enabled = false
var navigatev2Enabled = false

var activateNavigationHelp = false
var activateScrollHelp = false

var navigationHelpRight = document.querySelector("#navigationhelpright");
var navigationHelpLeft = document.querySelector("#navigationhelpleft");
var scrollHelpBottom = document.querySelector("#scrollhelpbottom");
var scrollHelpTop = document.querySelector("#scrollhelptop");

var interactionHelpText = document.querySelector("#interactionhelptext");

var timerActive = false
var startTime
var elapsedTime

 /*******************
 * INITIATE WEBSITE
 *******************/

$(document).ready(function(){
    activeSite = 0
    $('#sitescontainer').load(sites[activeSite])
})

 /*******************
 * ACTIVATE CONTROL BUTTONS
 *******************/ 

toggleControlButtons = () =>{
   if(buttonsActive == false){
      for(i=0; i<=controlbuttons.length; i++){
         $(controlbuttons[i]).prop('disabled', false);
         $(controlbuttons[i]).removeClass('disablebutton');
      }
      buttonsActive = true
   } 
   else {
      for(i=0; i<=controlbuttons.length; i++){
         $(controlbuttons[i]).prop('disabled', true);
         $(controlbuttons[i]).addClass('disablebutton');
      }
      buttonsActive = false
   }
}

 /*******************
 * MENU BUTTONS
 *******************/ 

toggleSiteHandsfree = (movement) =>{
   var headmovement = String(movement)
    
   switch (headmovement) {
      case "left":
         activeSite--
         break;
      case "right":
         activeSite++
         break;
   }

   if(activeSite==sites.length){
      activeSite=0
   } else if (activeSite<0){
      activeSite=sites.length-1
   }

   toggleSite("site" + activeSite)
}

toggleSite = (clicked_id) =>{
    activeSite = clicked_id.substring(4)
    $(document).scrollTop(0)
    $('#sitescontainer').load(sites[activeSite])
    $('#site' + activeSite).addClass('activatebutton');
    $('#site' + activeSite).prop('disabled', true);
    $('#site' + lastActiveSite).removeClass('activatebutton');
    $('#site' + lastActiveSite).prop('disabled', false);
    lastActiveSite = activeSite
}

 /*******************
 * HANDSFREE CONTROLS
 *******************/

toggleCamera = (clicked_id) =>{
   let button = document.querySelector('#' + clicked_id);

   if(button.className == 'controlsbutton activatebutton'){
      button.className = "controlsbutton"
      handsfree.stop()
      toggleControlButtons()
      interactionHelpText.innerHTML = "activate your webcam by clicking on the cameraicon"
      console.log("Handsfree stop")
    } else {   
      button.className = "controlsbutton activatebutton"
      handsfree.start()
      toggleControlButtons()
      interactionHelpText.innerHTML = "activate one or more buttons (click, scroll, navigate) to use the face controls"
      console.log("Handsfree start")
    }
}

toggleClick = (clicked_id) =>{
   let button = document.querySelector('#' + clicked_id);

   if(button.className == 'controlsbutton activatebutton'){
      button.className = "controlsbutton"
      handsfree.disablePlugins('faceClick')
      interactionHelpText.innerHTML = "activate one or more buttons (click, scroll, navigate) to use the face controls"
      console.log("Click disabled")
    } else {   
      button.className = "controlsbutton activatebutton"
      handsfree.enablePlugins('faceClick')
      handsfree.plugin.faceClick.config.morphs[0] = 0.9
      handsfree.plugin.faceClick.config.morphs[1] = 0.9
      interactionHelpText.innerHTML = "You can click on objects with a smile"
      console.log("Click enabled")
    }
}

toggleScrollv1 = (clicked_id) =>{
   let button = document.querySelector('#' + clicked_id);

   if(scrollv2Enabled){
      toggleScrollv2('scrollv2button')
   }

   if(button.className == 'controlsbutton activatebutton'){
         button.className = "controlsbutton"
         handsfree.disablePlugins('faceScroll')
         handsfree.disablePlugins('scrollv1')
         scrollv1Enabled = false
         document.querySelector('#scrolliconv1').className = "material-icons"
         interactionHelpText.innerHTML = "activate one or more buttons (click, scroll, navigate) to use the face controls"
         console.log("Scrollv1 disabled")
     } else {   
         button.className = "controlsbutton activatebutton"
         handsfree.enablePlugins('faceScroll')
         handsfree.enablePlugins('scrollv1')
         scrollv1Enabled = true
         interactionHelpText.innerHTML = "Activate the scroll mode by raising your eyebrows. The more you look up or down, the faster you scroll."
         console.log("Scrollv1 enabled")
     }
}

toggleScrollv2 = (clicked_id) =>{
   let button = document.querySelector('#' + clicked_id);

   if(scrollv1Enabled){
      toggleScrollv1('scrollv1button')
   }
   
   if(button.className == 'controlsbutton activatebutton'){
      button.className = "controlsbutton"
      handsfree.disablePlugins('faceScroll')
      toggleScrollHelp()
      scrollv2Enabled = false
      interactionHelpText.innerHTML = "activate one or more buttons (click, scroll, navigate) to use the face controls"
      console.log("Scrollv2 disabled")
    } else {   
      button.className = "controlsbutton activatebutton"
      handsfree.enablePlugins('faceScroll')
      toggleScrollHelp()
      scrollv2Enabled = true
      interactionHelpText.innerHTML = "Scroll up or down by moving the pointer to the marked zones at the edge of the screen."
      console.log("Scrollv2 enabled")
    }
}

toggleNavigatev1 = (clicked_id) =>{
   let button = document.querySelector('#' + clicked_id);

   if(navigatev2Enabled){
      toggleNavigatev2('navigationv2button')
   }
   
   if(button.className == 'controlsbutton activatebutton'){
      button.className = "controlsbutton"
      handsfree.disablePlugins('navigatev1')
      navigatev1Enabled = false
      interactionHelpText.innerHTML = "activate one or more buttons (click, scroll, navigate) to use the face controls"
      console.log("Navigatev1 disabled")
   } else {   
      button.className = "controlsbutton activatebutton"
      handsfree.enablePlugins('navigatev1')
      navigatev1Enabled = !navigatev1Enabled
      interactionHelpText.innerHTML = "Activate the navigation mode by raising your eyebrows. Turn your head so that the pointer is in on of the marked zones for a short time."
      console.log("Navigatev1 enabled")
   }
}

toggleNavigatev2 = (clicked_id) =>{
   let button = document.querySelector('#' + clicked_id);

   if(navigatev1Enabled){
      toggleNavigatev1('navigationv1button')
   }
   
   if(button.className == 'controlsbutton activatebutton'){
      button.className = "controlsbutton"
      handsfree.disablePlugins('navigatev2')
      navigatev2Enabled = false
      interactionHelpText.innerHTML = "activate one or more buttons (click, scroll, navigate) to use the face controls"
      console.log("Navigatev2 disabled")
   } else {   
      button.className = "controlsbutton activatebutton"
      handsfree.enablePlugins('navigatev2')
      navigatev2Enabled = !navigatev2Enabled
      interactionHelpText.innerHTML = "Navigate between pages by rolling your head to the left or right side."
      console.log("Navigatev2 enabled")
   }
}

/*******************
 * SHOW NAVIAGTION & SCROLL ZONES FOR HELP
 *******************/

toggleScrollHelp = () =>{
   if(activateScrollHelp){
      scrollHelpBottom.style.display="none"
      scrollHelpTop.style.display="none"
      activateScrollHelp = false
   } else {
      scrollHelpBottom.style.display="block"
      scrollHelpTop.style.display="block"
      activateScrollHelp = true
   }
}

 /*******************
 * VIDEO BUTTONS
 *******************/

toggleVideo = () =>{
   var vid = document.getElementById("video1");
   var icon = document.getElementById("playicon");
   if(icon.innerHTML == "play_circle"){
      icon.innerHTML = "pause_circle"
      vid.play()
   } else {
      icon.innerHTML = "play_circle"
      vid.pause()
   }
}

 /*******************
 * TIMER
 *******************/

var startTime
var elapsedTime

const millisToMinutesAndSeconds = (millis) => {
   var minutes = Math.floor(millis / 60000)
   var seconds = ((millis % 60000) / 1000).toFixed(0)
   return `elapsed time: ${minutes} minutes, ${(seconds < 10 ? "0" : "")}${seconds} seconds`
}

startTimer = () => {
   startTime = Date.now()
   document.querySelector("#evaluationbutton").classList.add("hide")
   timerActive = true
}

endTimer = () => {
   if(timerActive == true) {
      elapsedTime = Date.now() - startTime
      alert(millisToMinutesAndSeconds(elapsedTime))
      timerActive = false
   }
}
