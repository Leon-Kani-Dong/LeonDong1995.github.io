var database = firebase.database();
var Local=function(){
    var game;
    var INTERVAL =400;
    var timer= null;
    var timeCount=0;
    var time=0;
    var username;
    var score=0;
    var bindKeyEvent=function(){
	document.onkeydown= function(e){
	    if(e.keyCode==38){//up
		e.preventDefault();
		game.rotate();
	    }else if(e.keyCode==39){//right
		e.preventDefault();
		game.right();
	    }else if(e.keyCode==40){//down
		e.preventDefault();
		game.down();
	    }else if(e.keyCode==37){//left
		e.preventDefault();
		game.left();
	    }else if(e.keyCode=32){//space
		e.preventDefault();
		game.fall();
	    }
	}
    }
    var bindTouchEvent=function(){
	
	var myElement = document.getElementById('game');
	var leftElement=document.getElementById('left');
	var rightElement=document.getElementById('right');
	var rotateElement=document.getElementById('rotate');
	var mc = new Hammer(myElement);
	var l= new Hammer(leftElement);
	var r=new Hammer(rightElement);
	var ro=new Hammer(rotateElement);
/*	//var ld=document.getElementById('operate');

// We create a manager object, which is the same as Hammer(), but without the presetted recognizers. 
	var l_d = new Hammer.Manager(leftElement);


// Tap recognizer with minimal 2 taps
l_d.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
// Single tap recognizer
l_d.add( new Hammer.Tap({ event: 'singletap' }) );


// we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
l_d.get('doubletap').recognizeWith('singletap');
// we only want to trigger a tap, when we don't have detected a doubletap
l_d.get('singletap').requireFailure('doubletap');


l_d.on("singletap doubletap", function(ev) {
    if (ev.type=="doubletap"){
	ev.preventDefault();
	console.log(ev);
	game.rotate();
    }else{
	ev.preventDefault();
	game.left();
    }
});*/
	// listen to events...
	mc.on("panleft panright tap press",function(ev) {
	    if (ev.type=="panleft" ){
		game.left();
	    }else if(ev.type=="panright"){
		game.right();
	    }else if(ev.type=="tap"){
		game.rotate();
	    }else if(ev.type=="press"){
		game.fall();
	    }
	});
	l.on("panleft panright tap press",function(ev) {
	     if(ev.type=="tap"){
		 game.left();
	    }else if(ev.type=="press"){
		game.left();
	    }
	});
	r.on("panleft panright tap press",function(ev) {
	     if(ev.type=="tap"){
		 game.right();
	    }else if(ev.type=="press"){
		game.right();
	    }
	});
	ro.on("panleft panright tap press",function(ev) {
	     if(ev.type=="tap"){
		 game.rotate();
	    }else if(ev.type=="press"){
		game.fall();
	    }
	});
    }

    var move= function(){
	timeFunc();
	if (!game.down()){
	    game.fixed();
	    var line=game.checkClear();
	    if(line){
		game.addScore(line);
	    }
	    var gameOver=game.checkGameOver();
	    if (gameOver){
		//alert(score);
		score=game.gameOver();
		writeUserData(username,score);
		//alert(score+"bbb");
		stop();
	    }else{
		game.performNext(generateType(),generateDir());
	    }
	}
    }
    var timeFunc=function(){
	timeCount++;
	if(timeCount==5){
	    timeCount=0;
	    time++;
	    game.setTime(time); 
	}
    }
    // randomly genarate square
    var generateType = function(){
       return 	Math.ceil(Math.random()*7)-1;
    }
    var generateDir = function(){
       return 	Math.ceil(Math.random()*4)-1;
    }
    var start=function(){
	var doms={
	    gameDiv: document.getElementById('game'),
	    nextDiv: document.getElementById('next'),
	    timeDiv: document.getElementById('time'),
	    scoreDiv: document.getElementById('score'),
	    resultDiv: document.getElementById('gameover')
	}
	username=qs["name"];
	game=new Game();
	game.init(username,doms,generateType(),generateDir());
	bindKeyEvent();
	bindTouchEvent();
	game.performNext(generateType(),generateDir());
	timer=setInterval(move,INTERVAL);
    }
    //var database = firebase.database();
    function writeUserData(userId,scorenow) {
	usersref.once("value").then(function(snapshot) {
	    if ( userId in snapshot.val() ){
	    var prescore =  snapshot.val()[userId].score;
	    //alert(prescore,scorenow);
	    if (prescore<scorenow){
			firebase.database().ref('users/' + userId).set({
			    score: scorenow
			   
			});//alert(scorenow);
	    }
	    }else{
			firebase.database().ref('users/' + userId).set({
			    score: scorenow});
	    }
	})
    }
    var usersref = database.ref("/users");
    function userscore(user){
	usersref.once("value").then(function(snapshot) {
	    var score =  snapshot.val()[user].score;
	})
    }
								    
    function iteratedata(){
	usersref.once("value").then(function(snapshot) {
	    var dic={};
	    users=snapshot.val();
	    for (var key in users) {
		dic[key]=snapshot.val()[key].score;
	    }
	//console.log(dic);
	    var items = Object.keys(dic).map(function(key) {
		return [key, dic[key]];
	    });
	items.sort(function(first, second) {
	    return second[1] - first[1];
	});
	rating=items.slice(0, 5);
	content="";
	for (var i = 0; i <rating.length; i++) {
	   content=content+"<div>"+rating[i][0]+":"+rating[i][1]+"</div>" ;
	}
	    ratingDiv.innerHTML=content;
	    //alert(content);
	})
    }
    var stop=function(){
	if(timer){
	    clearInterval(timer);
	    timer=null;
	}
	//alert(username+score);
	//writeUserData(username,score);
	//writeUserData("tes",500);
	alert("Your score: "+score);
	iteratedata();
	document.onkeydown=null;
	//writeUserData("Noname",300)
	//console.log(userscore(username));
    }
    this.start=start;
}
