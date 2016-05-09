// Initialize your app
var myApp = new Framework7(
{
	//pushState: 0,
	swipeBackPage: true,
   // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    },
    
    preroute: function (mainView, options) {
    	
    }
    
 });

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    domCache: true,
});




//create account
function createUserAccount(formData){
	var ref = new Firebase("https://doctordial.firebaseio.com");
ref.createUser(formData,

 function(error, userData) {
  if (error) {
    myApp.alert("Error creating account:"+error.message, error);
  } else {
    //alert("Successfully created user account with uid:", userData.uid);
    myApp.alert("Successfully created account. Please login");
    localStorage.setItem(formData);
    myApp.loginScreen(); // open Login Screen//load another page with auth form
  }
});
}

//handle login
function loginFire(sentEmail,sentPassword){ //get this login from database 
	var ref = new Firebase("https://doctordial.firebaseio.com");
ref.authWithPassword({
  email    : sentEmail,
  password : sentPassword
}, function(error, authData) {
  if (error) {
  	
  	myApp.alert("Error loging in, if you are sure you are registered, please try again or use the forgot password feature", "Incorrect Login");
    myApp.loginScreen(); // open Login Screen //load another page with auth form
    return false; //required to prevent default router action
  } else {
  	localStorage.user_id = authData.uid;
     //myApp.alert("Login successful", authData);
  	//save data in local variablable
     myApp.alert("Login successful ", 'Success!');
       myApp.closeModal('.login-screen'); //closelogin screen
  }
});

}

function changeEmail(){
	var ref = new Firebase("https://doctordial.firebaseio.com");
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
	var ref = new Firebase("https://doctordial.firebaseio.com");
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
	var ref = new Firebase("https://doctordial.firebaseio.com");
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
var ref = new Firebase("https://doctordial.firebaseio.com");
ref.onAuth(checkLoggedIn);



 

  	
  	
  $$('.open-3-modal').on('click', function () {
  	
  myApp.modal({
    title:  'Type your health complaint below',
    text: '<div class="list-block"><ul><li class="align-top"><div class="item-content"><div class="item-inner"><div class="item-input"> <textarea></textarea></div> </div> </div> </li> </ul> </div>',
    buttons: [
      {
        text: 'submit',
        onClick: function() {
          myApp.alert('Complaint succeffuly submitted','Success!')
        }
      },
      {
        text: 'call',
        onClick: function() {
          myApp.alert('You clicked second button!')
        }
      },
      {
        text: 'cancel',
        bold: true,
        onClick: function() {
        //  myApp.alert('You clicked third button!')
        }
      },
    ]
  })
});
  
  
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
  	var email = pageContainer.find('input[name="email"]').val();
  	var password = pageContainer.find('input[name="password"]').val();
  loginFire(email, password);
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
			  var messagesRef = new Firebase('https://doctordial.firebaseio.com/messages');
               
               // Create a GeoFire index
              var geoFire = new GeoFire(messagesRef);
              var ref = geoFire.ref();  // ref === messagesRef
              
              
			  // REGISTER DOM ELEMENTS
			  var messageField = $$('#messageInput');
			  var nameField = $$('#nameInput');
			  var messageList = $$('.messages');
			  var sendMessageButton = $$('#sendMessageButton');

			  
							  
				// Init Messagebar
				var myMessagebar = myApp.messagebar('.messagebar');
				 
				// Handle message
				$$('.messagebar .link').on('click', function () {
					
				  // Message text
				  var messageText = myMessagebar.value().trim();
				  // Exit if empy message
				  if (messageText.length === 0) return;
				 
				  // Empty messagebar
				  myMessagebar.clear()
				 
				  
				 var name = nameField.val(); 
				 //SAVE DATA TO FIREBASE AND EMPTY FIELD
			     // messagesRef.push({name:name, text:messageText});
				  // Avatar and name for received message
				 // var avatar;
				  
					    if (navigator.geolocation) {
					        navigator.geolocation.watchPosition(showPosition);
					    } else {
					        myApp.alert("Geolocation is not supported by this browser.");
					    }
					
					function showPosition(position) {
					    var lati = position.coords.latitude;
					    var longi = position.coords.longitude; 
					
					geoFire.set("location", [longi, lati]).then(function() {
					  myApp.alert("Provided key has been added to GeoFire");
					
					  messagesRef.push({
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
				  })
					
					
					}, function(error) {
					  console.log("Error: " + error);
					});
					
					
				  // Add message
				
					}
			
			       
			      
				
				  
				
				  // Update conversation flag
				  conversationStarted = true;
				});                


			  // Add a callback that is triggered for each chat message.
			  messagesRef.limitToLast(20).on('child_added', function (snapshot) {
			    //GET DATA
			    var data = snapshot.val();
			    var username = data.name || "anonymous";
			    var message = data.text;
			    var day = data.day;
			    var time = data.time;
			  
			    
			    
			    if(localStorage.user_id == data.user_id){ //if this is the sender
					 var messageType = 'sent';
			   }else{
			   	     var messageType = 'received';
			   }
			   
			  
			     
				try{
					myMessages.addMessage({
				  	
				    // Message text
				    text: message,
				    // Random message type
				    type: messageType,
				    // Avatar and name:
				    //avatar: avatar,
				    name: name,
				  
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  });
				}catch(err){
					//alert("got the error"+err);
				}
				  
				  
				  
				  
			  });

}).trigger();

