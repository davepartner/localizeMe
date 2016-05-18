// Initialize your app
var myApp = new Framework7(
{
	template7Pages: true ,
	pushState: 0,
	//pushState: 0,
	swipeBackPage: true,
   // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
    
 });

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
   // domCache: true,
});


//create account
function createUserAccount(formData){
	var ref = new Firebase("https://localizeme.firebaseio.com");
	//ref.once("value", function(data) {
            // do some stuff once
    //});
	
ref.createUser(formData,
 function(error, userData) {
  if (error) {
    myApp.alert("Error creating account:"+error.message, error);
  } else {
    //alert("Successfully created user account with uid:", userData.uid);
    //log user in and create user profile at  /users
       loginFire(formData.email, formData.password);
    		
    		//create user profile
			// we would probably save a profile when we register new users on our site
			// we could also read the profile to see if it's null
			// here we will just simulate this with an isNewUser boolean
			var isNewUser = true;
			ref.onAuth(function(authData) {
			  if (authData && isNewUser) {
			    // save the user's profile into the database so we can list users,
			    // use them in Security and Firebase Rules, and show profiles
			    ref.child("users").child(authData.uid).set({
			      provider: authData.provider,
			      name: getName(authData) //the first part of the users email
			    });
			    
			    //update the user's data to carry the rest of the data
			    var hopperRef = ref.child(authData.uid);
				hopperRef.update(formData);
			  }
			});
			// find a suitable name based on the meta info given by each provider
			function getName(authData) {
			  switch(authData.provider) {
			     case 'password':
			       return authData.password.email.replace(/@.*/, '');
			     case 'twitter':
			       return authData.twitter.displayName;
			     case 'facebook':
			       return authData.facebook.displayName;
			  }
			}
    
    
    myApp.alert("Successfully created account. Logging you in","Success!");
    localStorage.setItem(formData);
    myApp.closeModal(); // open Login Screen//load another page with auth form
  }
});

}

//create account
//handle login
function loginFire(sentEmail,sentPassword){ //get this login from database 
	var ref = new Firebase("https://localizeme.firebaseio.com");
ref.authWithPassword({
  email    : sentEmail,
  password : sentPassword
}, function(error, authData) {
  if (error) {
  	switch (error.code) {
      case "INVALID_EMAIL":
        myApp.alert("The specified user account email is invalid.","Error");
        break;
      case "INVALID_PASSWORD":
        myApp.alert("The specified user account password is incorrect.","Error");
        break;
      case "INVALID_USER":
        myApp.alert("The specified user account does not exist.","Error");
        break;
      default:
        myApp.alert("Error logging user in:", error);
    }
    return false; //required to prevent default router action
  } else {
  	//save data in local storage
  	localStorage.user_id = authData.uid;
  	
     myApp.alert("Login successful ", 'Success!');
       myApp.closeModal('.login-screen'); //closelogin screen
       myApp.closeModal();
  }
});

}

function changeEmail(){
	var ref = new Firebase("https://localizeme.firebaseio.com");
ref.changeEmail({
  oldEmail : "bobtony@firebase.com",
  newEmail : "bobtony@google.com",
  password : "correcthorsebatterystaple"
}, function(error) {
  if (error === null) {
    console.log("Email changed successfully");
  } else {
    console.log("Error changing email:", error);
  }
});
}

function changeEmail(){
	var ref = new Firebase("https://localizeme.firebaseio.com");
ref.changeEmail({
  oldEmail : "bobtony@firebase.com",
  newEmail : "bobtony@google.com",
  password : "correcthorsebatterystaple"
}, function(error) {
  if (error === null) {
    console.log("Email changed successfully");
  } else {
    console.log("Error changing email:", error);
  }
});
}

function changePassword(){
	var ref = new Firebase("https://localizeme.firebaseio.com");
ref.changePassword({
  email       : "bobtony@firebase.com",
  oldPassword : "correcthorsebatterystaple",
  newPassword : "neatsupersecurenewpassword"
}, function(error) {
  if (error === null) {
    console.log("Password changed successfully");
  } else {
    console.log("Error changing password:", error);
  }
});
}

function sendPasswordResetEmail(recoveryEmail){ 
//You can edit the content of the password reset email from the Login & Auth tab of your App Dashboard.
	var ref = new Firebase("https://localizeme.firebaseio.com");
ref.resetPassword({
  email : recoveryEmail
}, function(error) {
  if (error === null) {
    myApp.alert("Password reset email sent successfully");
  } else {
  	myApp.alert("Error sending password reset email:", error);
  }
});
}

function deleteUser(){
	var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
ref.removeUser({
  email    : "bobtony@firebase.com",
  password : "correcthorsebatterystaple"
}, function(error) {
  if (error === null) {
    console.log("User removed successfully");
  } else {
    console.log("Error removing user:", error);
  }
});
}

// Create a callback which logs the current auth state
function checkLoggedIn(authData) {
  if (localStorage.user_id != null) {
    
       myApp.closeModal(); //closelogin screen
  } else {
			myApp.loginScreen(); // open Login Screen if user is not logged in
  }
}
// Register the callback to be fired every time auth state changes
var ref = new Firebase("https://localizeme.firebaseio.com");
ref.onAuth(checkLoggedIn);



 

  	
  	
  
  //recover email
  $$('.recovery-button').on('click', function () {
  	var email = pageContainer.find('input[name="recoveryEmail"]').val();
  	sendPasswordResetEmail(email);
    });
  	

	$$('.list-button').on('click', function () {
   // var email = pageContainer.find('input[name="email"]').val();
    var formData = myApp.formToJSON('#signupForm'); //convert submitted form to json.
  
  createUserAccount(formData); //do the registration and report errors if found
  
 
  });
    	
       //run login function
	//messages must be initialized here
  $$('.login-button').on('click', function () {
  	var email = $$('input[name="loginemail"]').val();
  	var password = $$('input[name="loginpassword"]').val();
  loginFire(email, password);
  
  });
  
  

 $$('.logout').on('click', function () {
 	 var ref = new Firebase("https://localizeme.firebaseio.com");
          	myApp.alert("You are loging out", "Logout");
          	  ref.unauth(); //logout
          	  localStorage.removeItem("user_id");
          	 myApp.loginScreen(); // open Login Screen if user is not logged in 
 });
  
$$(document).on('pageInit', function (e) {
	//checkLoggedIn();
	
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}


 //recover email
  $$('.enter-chat').on('click', function () {
  	var radius = $$('input[name="radius"]').val();
  	localStorage.radius = radius;
  	//redirect
  	mainView.router.loadPage('messages_view.html');
  	
  	});
  	
  	



 	
 myApp.onPageInit('messages_view', function(page) {


// Conversation flag
var conversationStarted = false;

try{
var myMessages = myApp.messages('.messages', {
  autoLayout:true
});
}catch(err1){
	alert("As you can see: "+err1.message);
}

 var myMessagebar = myApp.messagebar('.messagebar', {
    maxHeight: 150
});  

// Do something here when page loaded and initialized
	//var scrolled = 0;
			  // CREATE A REFERENCE TO FIREBASE
			 
               
               var messagesRef = new Firebase("https://localizeme.firebaseio.com/messages");
               var geomessagesRef = new Firebase("https://localizeme.firebaseio.com");
			   
              var geoFire = new GeoFire(geomessagesRef.child("geomessages"));
              
			  // REGISTER DOM ELEMENTS
			  var messageField = $$('#messageInput');
			  var nameField = $$('#nameInput');
			  var messageList = $$('.messages');
			  var sendMessageButton = $$('#sendMessageButton');

			     	//get user current location
					function getLocation() {
					    if (navigator.geolocation) {
					        navigator.geolocation.getCurrentPosition(showPosition);
					    } else {
					       alert("Geolocation is not supported by this browser.");
					    }
					}

							  
				// Init Messagebar
				//var myMessagebar = myApp.messagebar('.messagebar');
				
						
					

					function showPosition(position) {
					      userLatitude = position.coords.latitude;
					      userLongitude = position.coords.longitude; 
					      $$('.latitudeHidden').text(userLatitude);
					      $$('.longitudeHidden').text(userLongitude);
					      
					      
					// Global map variable
					var map;
					/*
					// Set the center as Firebase HQ
					var locations = {
					  "userLocation": [userLatitude, userLongitude],
					  "friendsLocation": [37.7789, -122.3917]
					}; */


					var center = [userLatitude, userLongitude];
					//var center = locations["userLocation"];


						
					// Query radius
					var radiusInKm = Number(localStorage.radius) || Number(0.3);


				// Handle message
				$$('.messagebar .link').on('click', function () { 
				  // Message text
				  var messageText = myMessagebar.value().trim();
				  // Exit if empy message
				  if (messageText.length === 0) return;
				 
				  // Empty messagebar
				  myMessagebar.clear()
				 
				  
				 var name = "Dave"; 
				
				  	
				  try{
				
				  	 
					 var newPostRef =  messagesRef.push({
				  	//userid
				  	user_id: localStorage.user_id, 
				    // Message text
				    text: messageText,
				    // Random message type
				    // Avatar and name:
				    //avatar: avatar,
				    name: name,
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  });
				  
				  
				   // myApp.alert(newPostRef.key()); newPostRef.key()
				  //save location of this message in firebase
				   var postRefKey = newPostRef.key();
				    geoFire.set(postRefKey, center).then(function() {
				      log("Current user " + username + "'s location has been added to GeoFire");

				      // When the user disconnects from Firebase (e.g. closes the app, exits the browser),
				      // remove their GeoFire entry
				      geomessagesRef.child(username).onDisconnect().remove();

				      log("Added handler to remove user " + username + " from GeoFire when you leave this page.");
				      log("You can use the link above to verify that " + username + " was removed from GeoFire after you close this page.");
				    }).catch(function(error) {
				      log("Error adding user " + username + "'s location to GeoFire");
				    });
				    
				    
				  }catch(err1){
						//myApp.alert("As you can see: "+err1.message);
					}
				 
			       
				  // Update conversation flag
				  conversationStarted = true;
				});                
			
			
			// Create a new GeoQuery instance
				var geoQuery = geoFire.query({
				  center: center,
				  radius: radiusInKm
				});

	 
	geoQuery.on("key_entered", function(key, location, distance) {
			///	  var john = key + " entered query at " + location + " (" + distance + " km from center)";
// Add a callback that is triggered for each chat message. .child("receiver_user_id")equalTo(page.query.id)
 
 
			    
 	  messagesRef.child(key).once('value', function (snapshot) {
			    //GET DATA
			    
			    
			    var data = snapshot.val();
			    var username = data.name || "anonymous";
			    var message = data.text;
			    
			   // myApp.alert(snapshot.val());
			    
			    
			    if(localStorage.user_id == data.user_id){ //if this is the sender
					 var messageType = 'sent';
			   }else{
			   	     var messageType = 'received';
			   }
			    var day = data.day;
			    var time = data.time;
			    
			    

			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			   
		//	myApp.alert("After key added: "+message,"Message");
			      // Add message

				try{
					 myMessages.addMessage({
				  	
				    // Message text
				    text: message,
				    // Random message type
				    type: messageType,
				    // Avatar and name:
				    //avatar: avatar,
				    //name: john,
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  })
				}catch(err){
					myApp.alert("got the error "+err);
				}
				
				
			  });


			
        });

   }    


/* Handles any errors from trying to get the user's current location */
  var errorHandler = function(error) {
    if (error.code == 1) {
      log("Error: PERMISSION_DENIED: User denied access to their location");
    } else if (error.code === 2) {
      log("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
    } else if (error.code === 3) {
      log("Error: TIMEOUT: Calculating the user's location too took long");
    } else {
      log("Unexpected error code")
    }
  };
  
 

 
function startWatch(){
if (navigator.geolocation) {
	var optn = {
		enableHighAccuracy : true,
		timeout : Infinity,
		maximumAge : 0
	};
	watchId = navigator.geolocation.watchPosition(showPosition, showError, optn);
} else {
	alert('Geolocation is not supported in your browser');
}
}
function stopWatch() {
	if (watchId) {
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
	}
}

function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			alert("User denied the request for Geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			alert("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			alert("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			alert("An unknown error occurred.");
			break;
	}
}

getLocation();	




  	
  	
});

