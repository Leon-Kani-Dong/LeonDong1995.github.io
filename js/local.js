var Local=function(){
    var game;
    var INTERVAL =400;
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
	var ld=document.getElementById('next');

// We create a manager object, which is the same as Hammer(), but without the presetted recognizers. 
	var l_d = new Hammer.Manager(leftElement,false);


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
	game.rotate();
    }else{
	ev.preventDefault();
	game.right();
    }
});
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
	     if(ev.type=="panleft"){
		 game.left();
	    }else if(ev.type=="press"){
		game.left();
	    }
	});
	r.on("panleft panright tap press",function(ev) {
	     if(ev.type=="panright"){
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
