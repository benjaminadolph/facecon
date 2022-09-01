// Create a new instance. Use one instance for each camera
const handsfree = new Handsfree({
  assetsPath: '/js/assets_handsfree',
  //Face tracker settings
  weboji: {
     // Whether the model is enabled or not
     enabled: true,
     // Custom video settings
     videoSettings: {
       // The video, canvas, or image element
       // Omit this to auto create a <VIDEO> with the webcam
       videoElement: null,
       // ID of the device to use
       // Omit this to use the system default
       deviceId: null,
       // Which camera to use on the device
       // Possible values: 'user' (front), 'environment' (back)
       facingMode: 'user',
 
       // Video dimensions
       idealWidth: 320,
       idealHeight: 240,
       minWidth: 240,
       maxWidth: 1280,
       minHeight: 240,
       maxHeight: 1280
     },
 
     // Thresholds needed before these are considered "activated"
     // - Ranges from 0 (not active) to 1 (fully active)
     morphs: {
       threshold: {
         smileRight: 0.4,
         smileLeft: 0.4,
         browLeftDown: 0.9,
         browRightDown: 0.9,
         browLeftUp: 0.3,
         browRightUp: 0.3,
         eyeLeftClosed: 0.7,
         eyeRightClosed: 0.7,
         mouthOpen: 0.3,
         mouthRound: 0.8,
         upperLip: 0.5
       }
     }
  },
  
  plugin: {
    facePointer: {  
      offset: {
        // Nudge the pointer by this amount
        x: 0,
        y: 0,
        // Calibrate the head (in degrees)
        pitch: 0,
        yaw: 0,
        roll: 0
       
      },
      // Sets how senstive the pointer is
      speed: {
        x: 1,
        y: 1
      }
    },
    faceScroll: {
        // Number of frames over the same element before activating that element
      framesToFocus: 10,
      vertScroll: {
        // The multiplier to scroll by. Lower numbers are slower
        scrollSpeed: 0.05,
        // How many pixels from the top/bottom of the scroll area to scroll
        scrollZone: 50
      }
    },
    faceClick: {
      morphs: {
        0: null,
        1: null,
      }
    },
    scrollv1: {
      enabled: false,
    },
    scrollv2: {
      enabled: false,
    },
    navigatev1: {
      enabled: false,
    },
    navigatev2: {
      enabled: false,
    },
  }  
})

handsfree.enablePlugins('facePointer')
handsfree.showDebugger()
document.querySelector('#cameracontainer').appendChild(handsfree.debug.$wrap)

/*******************
 * SCROLL V1 VARIABLEN 
 *******************/

var Scrollv1 = Scrollv1 || {}
Scrollv1.activate = false
Scrollv1.lastState = false
Scrollv1.screenHeight = window.innerHeight
Scrollv1.button = document.querySelector('#scrolliconv1');

//Scrollbereich für hoch und runter scrollen berechnen
screenHeight = () => {  
  return Scrollv1.screenHeight/2
}

/*******************
 * SCROLL V1 PLUGIN
 *******************/

handsfree.use('scrollv1', {
  tags: ['scrollv1'],
  onEnable () {
    delete handsfree.plugin.faceScroll.config.vertScroll.scrollZone
    handsfree.plugin.faceScroll.config.vertScroll.scrollSpeed = 0.03
    console.log('scrollv1 enabled')
  },
  onFrame: data => {
    if (Scrollv1.lastState == false) {
      if (data.weboji.state.browsUp) { 
        Scrollv1.lastState = true 
        console.log('Scrollv1.lastState = true ')
      }
    } else {
      if (!data.weboji.state.browsUp) { 
        Scrollv1.lastState = false 
        Scrollv1.activate = !Scrollv1.activate;
        if(Scrollv1.activate == true) {
          Scrollv1.button.className = "material-icons activatefunction"
          handsfree.plugin.faceScroll.config.vertScroll.scrollZone = screenHeight()
        }
        else {
          delete handsfree.plugin.faceScroll.config.vertScroll.scrollZone
          Scrollv1.button.className = "material-icons"
        }
        console.log(handsfree.plugin.faceScroll.config.vertScroll.scrollZone)
        console.log("activate: " + Scrollv1.activate)
      }
    }
  },
  onDisable: () => {
    handsfree.plugin.faceScroll.config.vertScroll.scrollZone = 50
    handsfree.plugin.faceScroll.config.vertScroll.scrollSpeed = 0.05
  }
})

/*******************
 * NAVIGATE V1 VARIABLEN 
 *******************/

var Navigatev1 = Navigatev1 || {}
 
Navigatev1.activate = false
Navigatev1.lastState = false

Navigatev1.counterLeft = 0
Navigatev1.counterRight = 0

//Navigationsbereich berechnen
screenWidth = () => {  
  return Navigatev1.screenWidth/4
}
 /*******************
 * NAVIGATE V1 PLUGIN
 *******************/

handsfree.use('navigatev1', {
  tags: ['navigatev1'],
  onFrame: data => {
    if(Navigatev1.lastState==false){
      if(data.weboji.state.eyeLeftClosed && (!data.weboji.state.eyeRightClosed)){
        if(Navigatev1.counterLeft <= 20){
          Navigatev1.counterLeft ++
          console.log("counterLeft: "+ Navigatev1.counterLeft)
        } else {
          Navigatev1.lastState = true
          toggleSiteHandsfree("left") 
          console.log("links")
          Navigatev1.counterLeft = 0
        }
      }
      else if (data.weboji.state.eyeRightClosed && (!data.weboji.state.eyeLeftClosed)){
        if(Navigatev1.counterRight <= 20){
          Navigatev1.counterRight ++
          console.log("counterRight: "+ Navigatev1.counterRight)
        } else {
          Navigatev1.lastState = true
          toggleSiteHandsfree("right")
          console.log("rechts")
          Navigatev1.counterRight = 0
        }
      } else {
        Navigatev1.counterRight = 0
        Navigatev1.counterLeft = 0
      }
    } else {
      if (!data.weboji.state.eyeLeftClosed && !data.weboji.state.eyeRightClosed){
          Navigatev1.lastState = false
      }
    }
  }
})

/*******************
 * NAVIGATE V2 VARIABLEN 
 *******************/
var Navigatev2 = Navigatev2 || {}

//Variablen definieren
Navigatev2.lastRoll = ""
Navigatev2.lastMove = ""
Navigatev2.rollLeft = 0.34
Navigatev2.rollRight = -0.34

 /*******************
 * NAVIGATE V2 PLUGIN
 *******************/

handsfree.use('navigatev2', {
  tags: ['navigatev2'],
  onFrame: data => {
    if (Navigatev2.lastRoll == "") {
      if (data.weboji.rotation[2] > Navigatev2.rollLeft){
        Navigatev2.lastRoll = "left"
        Navigatev2.lastMove = Date.now()
      }
      else if (data.weboji.rotation[2] < Navigatev2.rollRight){
        Navigatev2.lastRoll = "right"
        Navigatev2.lastMove = Date.now()
      }
    } 
    else{
      if (Math.abs(data.weboji.rotation[2]) < 0.1){
        if ((Date.now() - Navigatev2.lastMove) < 1000) {
          switch (Navigatev2.lastRoll) {
            case "right": 
              toggleSiteHandsfree("right")
              break;
            case "left":
              toggleSiteHandsfree("left")  
              break;
          }
        }     
        Navigatev2.lastRoll= ""   
      }
    }
  }
})