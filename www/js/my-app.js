// Initialize your app
var myApp = new Framework7(
{
	template7Pages: true ,
	precompileTemplates: true,
	
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




if(typeof localStorage.localizeme_user_id === "undefined" || localStorage.localizeme_user_id === null){
	 myApp.loginScreen(); 
}
//create account
function createUserAccount(formData){
	
	
	var ref = new Firebase("https://localizeme.firebaseio.com/users");
	//ref.once("value", function(data) {
            // do some stuff once
    //});
	myApp.showPreloader('Wait...')
    setTimeout(function () {
        myApp.hidePreloader();
    }, 2000);
    
    
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
			    ref.child(authData.uid).set({
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
    localStorage.firstname = formData.firstname;
    localStorage.middlename = formData.middlename;
    localStorage.lastname = formData.lastname;
    
    localStorage.fullname = localStorage.firstname+' '+localStorage.middlename+' '+localStorage.lastname || 'anonymous';
    
    myApp.closeModal(); // open Login Screen//load another page with auth form
  }
});

}

//create account
//handle login
function loginFire(sentEmail,sentPassword){ //get this login from database 
    
    //logout any other accounts on this device 
   // logout();
    
    
    //then start thinking of logging in
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
       // myApp.alert(error,"Error logging user in:");
        myApp.alert("Please cross-check your network connectivity","Error logging in:");
    }
    return false; //required to prevent default router action
  } else {
  	//save data in local storage
  	localStorage.localizeme_user_id = authData.uid;
  	
     myApp.alert("Login successful ", 'Success!');
       myApp.closeModal('.login-screen'); //closelogin screen
       myApp.closeModal();
  }
});

myApp.showPreloader('Loading map...')
    setTimeout(function () {
        myApp.hidePreloader();
    }, 2000);
    
    
}


//function to create anything
function updateAnything(formData, childVar){
	var postsRef = new Firebase("https://localizeme.firebaseio.com/");
     ref = postsRef.child(childVar);
     ref.update(formData,   function(error) {
  if (error) {
    myApp.alert("Data could not be saved. :" + error);
  } else {
   // myApp.alert("Update successful.","Updated");
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
  if (localStorage.localizeme_user_id != null) {
    
       myApp.closeModal(); //closelogin screen
  } else {
			myApp.loginScreen(); // open Login Screen if user is not logged in
  }
}
// Register the callback to be fired every time auth state changes
var ref = new Firebase("https://localizeme.firebaseio.com");
ref.onAuth(checkLoggedIn);



  
  function logout(){
  	 		 
          	   myApp.modal({
    title:  'Are you sure you wish to logout?',
    text: '<div class="list-block"></div>',
    buttons: [
      {
        text: 'yes',
        onClick: function() {
          	  var ref = new Firebase("https://localizeme.firebaseio.com");
          	myApp.alert("You are loging out", "Logout");
          	  ref.unauth(); //logout
          	  localStorage.removeItem("user_id");
          	  localStorage.removeItem("fullname");
          	 myApp.loginScreen(); // open Login Screen if user is not logged in 
          	 
        }
      },
      {
        text: 'cancel',
        bold: true,
        
      },
    ]
  })
  }
 

  	
  	
  
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
  
  


  
  
  
   $$('#logout').on('click', function () {
         logout();
 });


  

 $$('.demo-progressbar-load-hide .button').on('click', function () {
    var container = $$('.demo-progressbar-load-hide p:first-child');
    if (container.children('.progressbar').length) return; //don't run all this if there is a current progressbar loading
 
    myApp.showProgressbar(container, 0);
 
    // Simluate Loading Something
    var progress = 0;
    function simulateLoading() {
        setTimeout(function () {
            var progressBefore = progress;
            progress += Math.random() * 20;
            myApp.setProgressbar(container, progress);
            if (progressBefore < 100) {
                simulateLoading(); //keep "loading"
            }
            else myApp.hideProgressbar(container); //hide
        }, Math.random() * 200 + 200);
    }
    simulateLoading();
}); 
  
  
  
  
$$(document).on('pageInit', function (e) {
	checkLoggedIn();
	
	
	
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


			 //get users location using their longitude and lattitude
			function ReverseGeocode(latitude, longitude){
						    var reverseGeocoder = new google.maps.Geocoder();
						    var currentPosition = new google.maps.LatLng(latitude, longitude);
						    reverseGeocoder.geocode({'latLng': currentPosition}, function(results, status) {
						 
						            if (status == google.maps.GeocoderStatus.OK) {
						                    if (results[0]) {
						                  // $$('.yourCurrentLocation').html('Address : ' + results[0].formatted_address + ',' + 'Type : ' + results[0].types+ '<br/>');
						            $$('.yourCurrentLocation').html('<div class="content-block-title">Click any of the links below to chat with and discover people around there</div>'+
											'<div class="list-block">'+
											  '<ul>'+
						                         '<li>'+ 
						                    '<a class="item-content" href="messages_view.html?selectedRadius=0.5&name='+results[0].address_components[1].long_name+'" >'+
											     '<div class="item-inner">'+
												 '<div class="item-title">'+
						                         results[0].address_components[1].long_name + 
						                         '</div></div></a></li>'+
						                         '<li>'+ 
						                    '<a class="item-content" href="messages_view.html?selectedRadius=1&name='+results[1].address_components[1].long_name+'" >'+
											     '<div class="item-inner">'+
												 '<div class="item-title">'+
						                         results[1].address_components[1].long_name + 
						                         '</div></div></a></li>'+
						                         '<li>'+ 
						                    '<a class="item-content" href="messages_view.html?selectedRadius=5&name='+results[2].address_components[1].long_name+'" >'+
											     '<div class="item-inner">'+
												 '<div class="item-title">'+
						                         results[2].address_components[1].long_name + 
						                         '</div></div></a></li>'+
						                         '<li>'+ 
						                    '<a class="item-content" href="messages_view.html?selectedRadius=20&name='+results[3].address_components[1].long_name+'" >'+
											     '<div class="item-inner">'+
												 '<div class="item-title">'+
						                         results[3].address_components[1].long_name + 
						                         '</div></div></a></li>'+'<li>'+ 
						                    '<a class="item-content" href="messages_view.html?selectedRadius=50&name='+results[4].address_components[1].long_name+'" >'+
											     '<div class="item-inner">'+
												 '<div class="item-title">'+
						                         results[4].address_components[1].long_name + 
						                         '</div></div></a></li>'+
						                         '</ul> </div>');
						                    }
						            else {
						                    $$('.yourCurrentLocation').html('Unable to detect your address.');
						                    }
						        } else {
						            $$('.yourCurrentLocation').html('Unable to detect your address.');
						        }
						    });
						}
			 	
 	
 	
 	//get user current location
			function getLocation() {
			    if (window.navigator.geolocation) {
			        window.navigator.geolocation.watchPosition(getPosition,showError,{maximumAge: 15000, timeout: 15000, enableHighAccuracy: true });
			    } else {
			        myApp.alert("Geolocation is not supported by this browser.");
			    }
			}

 	
 		 function getPosition(position) {
					       userLatitude = position.coords.latitude;
					       userLongitude = position.coords.longitude; 
					      localStorage.userLatitude = userLatitude;
					      localStorage.userLongitude = userLongitude;
					      				//myApp.alert("got the error ");	
					// Global map variable
					//prints users location
						ReverseGeocode(userLatitude, userLongitude);
					
					var map;
 	
 	
 	   }    
            

		function showError(error) {
		    switch(error.code) {
		        /*case error.PERMISSION_DENIED:
		           myApp.alert("User denied the request for Geolocation.");
		            break;
		        case error.POSITION_UNAVAILABLE:
		            myApp.alert("Location information is unavailable.");
		            break;
		        case error.TIMEOUT:
		           myApp.alert("The request to get user location timed out.");
		            break;
		        case error.UNKNOWN_ERROR:
		            myApp.alert("An unknown error occurred.");
		            break;*/
		    }
		}
		  
 
 	
 myApp.onPageInit('home', function(page) {
 	

 
			var isMobile = {  
			  Opera: function() {
			       //return navigator.userAgent.match(/Opera Mini/i);
			       alert("This app is not destinied for opera mini, please try other browsers like chrome, mozilla or safari");
			    },/*
			    Android: function() {
			        return navigator.userAgent.match(/Android/i);
			    },
			    BlackBerry: function() {
			        return navigator.userAgent.match(/BlackBerry/i);
			    },
			    iOS: function() {
			        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			    },
			  
			    Windows: function() {
			        return navigator.userAgent.match(/IEMobile/i);
			    },
			    any: function() {
			        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			    }*/
			};
			 	
 		});
 	
 	
 	

myApp.onPageInit('users_edit', function(page) {
	
	
	//fill up form from databse
	var usersRef = new Firebase('https://localizeme.firebaseio.com/users/'+page.query.user_id);
	
		 	usersRef.once('value', function(snapshot) {
			    //GET DATA
			  //  var formData = snapshot.val();
			    
			    var formData = {
				    'firstname': 'John',
				    'email': 'john@doe.com',
				    'gender': 'female',
				    'switch': ['yes'],
				    'slider': 10
				  }
				  
				  
  					myApp.formFromJSON('#editProfileForm', formData);
			    });
  
  
});
	
	
 	
 	
 	
 	
 	
 	
 	
 	
 	
 	
 	
 	
function myProfile(){
	mainView.router.loadPage('users_view.html?user_id='+localStorage.localizeme_user_id);
	    }
 		

	
	myApp.onPageInit('users_view', function(page) {
	
 	//show logout button
		 	if(localStorage.localizeme_user_id == page.query.user_id){
		 		
		 		var logoutButton = $$('.logoutbuttondiv');
				logoutButton.html('<div class="card">'+
								       '<p>'+
								        '<a href="#" class="button button-big button-fill button-raised" id="logout" onclick="logout()">'+
								        '<i class="fa fa-power-off" aria-hidden="true"></i> Logout</a>'+
								      '</p>'+
								'</div>');
			
				$$('.edit_profile').html('<a href="users_edit.html?user_id='+page.query.id+'" class="link button button-fill"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp;Edit</a>');
			}else{
				$$('.toolbar-inner').append('<a href="messages_user.html?user_id={{url_query.user_id}}&&name={{url_query.name}}" class="link">'+
			    		'<i class="fa fa-comment-o" ></i>&nbsp;chat</a>');
			}
	
	
	
		 myApp.showPreloader('Retrieving information...');
		    setTimeout(function () {
		        myApp.hidePreloader();
		    }, 2000);
		    
		     
			
			
		    var usersRef = new Firebase('https://localizeme.firebaseio.com/users/'+page.query.user_id);
	
		 	usersRef.once('value', function(snapshot) {
			    //GET DATA
			    var data = snapshot.val();
			    //var username = data.username || "";
			    var firstname = data.firstname || "";
			    var middlename = data.middlename || "";
			    var lastname = data.lastname || "";
			    var uname = firstname+' '+middlename+' '+lastname;
			    var gender = data.gender || "";
			    var about = data.about || "nothing yet";
			    var get_user_id = snapshot.key();
			   
			    
			    var day = data.day;
			    var time = data.time;
			   // $$('.username').text(uname);
			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			   var usersRefElement = $$('.userProfileCard');
			   $$('.username').text(uname);
		   usersRefElement.html( '<div class="content-block-title">Profile Details</div>'+
				'<div class="list-block media-list inset">'+
				  '<ul>'+
				    '<li>'+
				        '<div class="item-inner">'+
				          '<div class="item-title-row">'+
				            '<div class="item-title">Gender</div>'+
				          '</div>'+
				          '<div class="item-subtitle">'+data.gender+'</div>'+
				        '</div>'+
				   '</li>');
				   
				   usersRefElement.append(
				    '<li>'+
				        '<div class="item-inner">'+
				          '<div class="item-title-row">'+
				            '<div class="item-title">About</div>'+
				          '</div>'+
				          '<div class="item-subtitle">'+data.about+'</div>'+
				        '</div>'+
				   '</li>'+
				  '</ul>'+
				'</div>' );
		    });

            //if 
           
		     var postsRef = new Firebase("https://localizeme.firebaseio.com/posts");
		 	postsRef.orderByChild("user_id").startAt(localStorage.localizeme_user_id).endAt(localStorage.localizeme_user_id).limitToLast(50).on('value', function(snapshot) {
			    //GET DATA
			    var data = snapshot.val();
			    var username = data.username || "";
			    var firstname = data.firstname || "";
			    var middlename = data.middlename || "";
			    var lastname = data.lastname || "";
			    var uname = firstname+' '+middlename+' '+lastname;
			    var gender = data.gender || "";
			    var get_user_id = snapshot.key();
			   // myApp.alert(snapshot.val());
			    
			    var day = data.day;
			    var time = data.time;
			    
			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			   $$('.username').text(uname);
			   
			   var usersRefElement = $$('.userPostCard');
				   usersRefElement.html('<div class="content-block-title"></div>'+
					'<div class="card">'+
					'<div class="card-header">'+uname+'('+gender+')</div>'+
					  '<div class="card-content">'+
					    '<div class="list-block">'+
					      '<ul>'+
					        '<li>'+
					          '<a href="#" class="item-link item-content">'+
					            '<div class="item-inner">'+
					            '</div>'+
					          '</a>'+
					        '</li>'+
					      '</ul>'+
					    '</div>'+
					  '</div>'+
					'</div>');
				    });
		    
		    
		    
 	});
 	
 
 

 myApp.onPageInit('messages_user', function(page) {




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
			  var messagesRef = new Firebase('https://localizeme.firebaseio.com/messages_user');
               
               
               //find this message, 
              var thismessage = messagesRef.child(page.query.id);
              thismessage.once("value", function(snapshot) {
				// attach it as the first message
				   //GET DATA
				 
			    var data = snapshot.val();
			    var username = data.name || "anonymous";
			    var message = "<b>"+data.title+"</b> <br/> "+data.text;
			    
			    if(localStorage.localizeme_user_id == data.user_id){ //if this is the sender
					 var messageType = 'sent';
					   }else{
					   	     var messageType = 'received';
					   }
			    var day = data.day;
			    var time = data.time;
			    
			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
				try{
					myMessages.addMessage({
				    // Message text
				    text: message,
				    // Random message type
				    type: messageType,
				    // Avatar and name:
				    //avatar: avatar,
				    //name: name,
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  });
				}catch(err){
					//alert("got the error"+err);
				}
				  
				});
				
				
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
				  
			
			  
				var userReply = messagesRef.child(page.query.id+"/messages_user_replies");
				  // Add message
				  userReply.push({
				  	//userid
				  	user_id: localStorage.localizeme_user_id, 
				  	receiver_user_id: page.query.id,
				    // Message text
				    text: messageText,
				    complaint_id: page.query.id,
				    // Random message type
				    // Avatar and name:
				    //avatar: avatar,
				   // name: name,
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  })
				  
				
				  // Update conversation flag
				  conversationStarted = true;
				});                


			  // Add a callback that is triggered for each chat message. .child("receiver_user_id")equalTo(page.query.id)
			  //messagesRef.orderByChild("personal_doctor_id").equalTo(page.query.id).limitToLast(20).on('child_added', function (snapshot) {
			  var replyMessage = messagesRef.child(page.query.id+"/messages_user_replies");
			  replyMessage.on('child_added', function (snapshot) {
			    //GET DATA
			    var data = snapshot.val();
			    var username = data.title || "anonymous";
			    var message = data.text;
			    
			    if(localStorage.localizeme_user_id == data.user_id){ //if this is the sender
					 var messageType = 'sent';
					   }else{
					   	     var messageType = 'received';
					   }
			    var day = data.day;
			    var time = data.time;
			    
			    

			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			 
			
				try{
					myMessages.addMessage({
				  	
				    // Message text
				    text: message,
				    // Random message type
				    type: messageType,
				    // Avatar and name:
				    //avatar: avatar,
				    //name: name,
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  });
				}catch(err){
					//alert("got the error"+err);
				}
				  
			  });

});


 
 
 
 
 	
 myApp.onPageInit('messages_view', function(page) {


 myApp.showPreloader('Scanning location...');
    setTimeout(function () {
        myApp.hidePreloader();
    }, 2000);

localStorage.radius = page.query.selectedRadius;
  	//redirect
  	if(localStorage.radius < 1){ //i agree, this is stuoid. Reassigning new values to page query. Plain stupid, but no time
		page.query.selectedRadius = usersCurrentRadius = (localStorage.radius*1000)+' meters radius';
	}else{
		page.query.selectedRadius = localStorage.radius+' kilometers radius';
	}
	
 $$('.userBeggingThingz').html('');
 $$('.userBeggingThingz').hide('');
 getLocation();	
   
     /* myApp.showIndicator();
    setTimeout(function () {
        myApp.hideIndicator();
    }, 2000);
     */
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

			     	
							  
				// Init Messagebar
				//var myMessagebar = myApp.messagebar('.messagebar');
				
	

			
					/*
					// Set the center as Firebase HQ
					var locations = {
					  "userLocation": [userLatitude, userLongitude],
					  "friendsLocation": [37.7789, -122.3917]
					}; */


					var center = [Number(localStorage.userLatitude), Number(localStorage.userLongitude)];
					//var center = locations["userLocation"];
					

						
					// Query radius
					var radiusInKm = Number(localStorage.radius) || Number(0.3);
                    var formDataUser = {};
                    formDataUser.latitude = localStorage.userLatitude;
					formDataUser.longitude = localStorage.userLongitude;
					var geoFireUsers = new GeoFire(geomessagesRef.child("geousers"));
                    geoFireUsers.set(localStorage.localizeme_user_id, center);
				    
				    
				  	 
				
				  	
                    
				// Handle message
				$$('.messagebar .link').on('click', function () { 
				
				
                    
				  // Message text
				  var messageText = '<span style="font-size:15px;">'+myMessagebar.value().trim()+'</span>';
				  // Exit if empy message
				  if (messageText.length === 0) return;
				 
				  // Empty messagebar
				  myMessagebar.clear()
				 
				  
				 var name = localStorage.fullname || 'anonymous'; 
			
						
						
				  try{
					 var newPostRef =  messagesRef.push({
				  	//userid
				  	user_id: localStorage.localizeme_user_id, 
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
				      geomessagesRef.child(postRefKey).onDisconnect().remove();

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
 
 
			    
 	  messagesRef.child(key).once('value', function (snapshot) {
			    //GET DATA
			    
			    
			    var data = snapshot.val();
			    var username = data.name || "";
			    var message = data.text;
			    
			   // myApp.alert(snapshot.val());
			    
			    
			    if(localStorage.localizeme_user_id == data.user_id){ //if this is the sender
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
				    name: username,
				    //label: key + " entered query at " + location + " (" + distance + " km from center)",
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  })
				}catch(err){
					myApp.alert("got the error "+err);
				}
				
				
			  });


			
        });



//fiind users around center for the right panel
// Create a new GeoQuery instance
				var geoQuery = geoFireUsers.query({
				  center: center,
				  radius: radiusInKm
				});

      
      var mySearchbar = myApp.searchbar('.searchbar', {
		    searchList: '.list-block-search',
		    searchIn: '.item-title'
		}); 
      
        
         totalResultsFound = 0;
	geoQuery.on("key_entered", function(key, location, distance) {
			///	  var john = key + " entered query at " + location + " (" + distance + " km from center)";
 

		  //get the list from database
	   var userRef = new Firebase("https://localizeme.firebaseio.com/users");	    
 	  userRef.child(key).once('value', function (snapshot) {
			    //GET DATA
			     totalResultsFound += 1;
			    
			    var data = snapshot.val();
			    var username = data.username || "";
			    var firstname = data.firstname || "";
			    var middlename = data.middlename || "";
			    var lastname = data.lastname || "";
			    var uname = firstname+' '+middlename+' '+lastname;
			    var gender = data.gender || "";
			    var get_user_id = snapshot.key();
			   // myApp.alert(snapshot.val());
			    
			    
			 
			    var day = data.day;
			    var time = data.time;
			    
			    

			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			      if(data.gender != null && snapshot.key() != localStorage.localizeme_user_id){   
			   var messageList = $$('.users-list-block');
             
       
				 	 messageList.append('<li>'+
			      '<a href="users_view.html?user_id='+get_user_id+'&name='+uname+'" class="item-link item-content" data-context-name="languages">'+
			          '<!--<div class="item-media"><i class="fa fa-plus-square" aria-hidden="true"></i></div>-->' +
			          '<div class="item-inner">'+
			            '<div class="item-title"><i class="fa fa-user" aria-hidden="true"></i> '+uname+'</div>'+
			            '<div class="item-after">('+data.gender+')</div>'+
			          '</div>'+
			      '</a>'+
			    '</li>');
					
			 }
		  
				
			  });


			
        });
         
         
         //$$('.totalResultsFound').text(totalResultsFound+' people found');

       
       
       
      myApp.openPanel('right');
     $$('.panel-close').on('click', function (e) {
        myApp.closePanel();
    });





});



//code to prevent back button misbehaviour
document.addEventListener('backbutton', function (e) {
            e.preventDefault();
            /* Check for open panels */
            if ($$('.panel.active').length > 0) {
                f7.closePanel();
                return;
            }
            /* Check for go back in history */
            var view = f7.getCurrentView();
            if (!view) return;
            if (view.history.length > 1) {
                view.router.back();
                return;
            }
            /* Quit app */
            navigator.notification.confirm(
                'Exit Application ?',              // message
                function (n) {
                    if (n == 1) navigator.app.exitApp(); 
                },
                'Bite To Eat',        // title
                ['OK', 'Cancel']      // button labels
            );
        }, false);
