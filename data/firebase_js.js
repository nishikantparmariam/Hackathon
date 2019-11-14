 
var firebaseConfig = {
    apiKey: "AIzaSyBfHRwKV9Nq96-KpLoC8VrBRKbCHCtM0cA",
    authDomain: "inter-iit-selection-hackathon.firebaseapp.com",
    databaseURL: "https://inter-iit-selection-hackathon.firebaseio.com",
    projectId: "inter-iit-selection-hackathon",
    storageBucket: "inter-iit-selection-hackathon.appspot.com",
    messagingSenderId: "170890202344",
    appId: "1:170890202344:web:d35d31f6135aa91b608d5d"
  };  
  firebase.initializeApp(firebaseConfig);
  
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    //firebase_user = user;//["user"];
    user_id = user["uid"]; 
    firebaseUser = user;
    var db = firebase.firestore();
    var docRef = db.collection("users").doc(firebaseUser["uid"]);    
    docRef.get().then(function(doc) {
        if (doc.exists) {
            firebaseUserData = doc.data();   
            console.log(firebaseUserData); 
            fetch_posts(0);        
        } else {              
            document.getElementById('askFordisplayName').style.cssText="display:block !important;";         
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    }); 
  
    if (file_code==="a") {  
    window.location="home.html";  //will pass our actual home domain after hosting  
    } 
  } else {
    if (file_code==="b")
    { 
    window.location="index.html"; //will pass our actual domain after hosting    
    }
  } 
 
});

function userSignOut() {
    firebase.auth().signOut().then(function() {
       
      window.location="index.html"; //will pass our actual domain after hosting    
      }).catch(function(error) {
          window.alert('Error')
      });
    }