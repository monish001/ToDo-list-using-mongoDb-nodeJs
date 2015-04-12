var todoApp = {};
todoApp.myUserId = null;
todoApp.firebase = todoApp.firebase || {};
todoApp.firebase.url = "https://todo-app-with-auth.firebaseio.com";
todoApp.firebase.rootRef = new Firebase(todoApp.firebase.url);

//Handle Login
var loginElem = $('#login');
loginElem.on('click', function() {
	todoApp.firebase.rootRef.authWithOAuthPopup("facebook", function(error, authData) {
	  if (error) {
		console.log("Login Failed!", error);
	  } else {
		console.log("Authenticated successfully with payload:", authData);
	  }
	});
});

function renderTodo(snapshot){
	var data = snapshot.val(),
	title = data && data.title ? data.title : '';
	if(title){
		var todoElem = $('<li>').text(title);
		$('#todoList').append(todoElem);
	}
}
todoApp.firebase.rootRef.onAuth(function(authData) {
	if (!authData || !authData.uid) {
		return;
	}
	
	todoApp.firebase.todosRef = todoApp.firebase.rootRef.child("todos").child(authData.uid);
	todoApp.firebase.todosRef.on('child_added', renderTodo);

	todoApp.myUserId = authData.uid;
	$("#loginDiv").text(authData.facebook.displayName);
	
	// save new user's profile into Firebase so we can
	// list users, use them in security rules, and show profiles
	// myRef.child('users').child(user.uid).set({
	// displayName: user.displayName,
	// provider: user.provider,
	// provider_id: user.id
	// });
});

var todoInput = $('#todoInput');
todoInput.keypress(function(e){
	if(e.keyCode != 13){
		return;
	}
	if(!todoApp.myUserId){
		alert('You must login to use this app.');
		return;
	}
	if(todoInput.val()){
		var now = new Date();
		todoApp.firebase.todosRef.push({
			title: todoInput.val(),
			isActive: true,
			createdUtc: now,
			lastModUtc: now
		});
		todoInput.val('');
	}
});

