var todoApp = {};
todoApp.myUserId = null;
todoApp.todoRef = new Firebase("https://todo-app-with-auth.firebaseio.com/todos");
// todoApp.todoRef.onAuth(function(authData) {
  // if (authData) {
    // myUserID = authData.facebook.id;
    // $("#loginDiv").text(authData.facebook.displayName);
  // }
// });
todoApp.todoRef.on('child_added', function(snapshot){
	var data = snapshot.val(),
	title = data && data.title ? data.title : '';
	if(title){
		var todoElem = $('<li>').text(title);
		$('#todoList').append(todoElem);
	}
});

var todoInput = $('#todoInput');
todoInput.keypress(function(e){
	if(e.keyCode != 13){
		return;
	}
	// if(!todoApp.myUserId){
		// alert('You must login to use this app.');
		// return;
	// }
	if(todoInput.val()){
		todoApp.todoRef.push({
			userid: todoApp.myUserId,
			title: todoInput.val(),
			isActive: true,
			createdUtc: '',
			lastModUtc: ''
		});
		todoInput.val('');
	}
});

//Handle Login
var loginElem = $('#login');
loginElem.click(function() {
  todoApp.todoRef.authWithOAuthPopup('facebook', function(){});
});
