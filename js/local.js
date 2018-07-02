var Local=function(){
    var game;
    var INTERVAL =200;
    var timer= null;
    var timeCount=0;
    var time=0;
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
	var mc = new Hammer(myElement);
	var l= new Hammer(leftElement);
	var r=new Hammer(rightElement);
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
		game.gameOver();
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
	game=new Game();
	game.init(doms,generateType(),generateDir());
	bindKeyEvent();
	bindTouchEvent();
	game.performNext(generateType(),generateDir());
	timer=setInterval(move,INTERVAL);
    }
    var stop=function(){
	if(timer){
	    clearInterval(timer);
	    timer=null;
	}
	document.onkeydown=null;
    }
    this.start=start;
}
