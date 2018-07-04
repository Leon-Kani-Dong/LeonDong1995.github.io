var database = firebase.database();
var username="Noname";
var ratingDiv=document.getElementById('rating');
function writeUserData(userId,score) {
  firebase.database().ref('users/' + userId).set({
      score: score
  });
}

function savedata(){
    var username=document.getElementById('username').value;
    writeUserData(username,456);
}
var usersref = database.ref("/users");
function iteratedata(){
    usersref.once("value").then(function(snapshot) {
	var dic={};
	users=snapshot.val();
	for (var key in users) {
	    dic[key]=snapshot.val()[key].score
	}
	//console.log(dic);
	var items = Object.keys(dic).map(function(key) {
	    return [key, dic[key]];
	});
	items.sort(function(first, second) {
	    return second[1] - first[1];
	});
	//console.log(items.slice(0, 5));
	rating=items.slice(0, 5);
	content="";
	for (var i = 0; i <rating.length; i++) {
	   content=content+"<div>"+rating[i][0]+":"+rating[i][1]+"</div>" ;
	}
	//console.log(ratingDiv);
	ratingDiv.innerHTML=content;
    })
}

iteratedata();
