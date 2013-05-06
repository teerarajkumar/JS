      window.addEventListener('keydown',doKeyDown,true);
      window.addEventListener('keyup',doKeyUp,true);
      
      window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();


      function KeyEventObj(type,key)
      {
		  this.type=type;
		  this.key=key;
	  }

	  function doKeyDown(event)
	  {
		  if(event.which == 32)
		  {
				if(gamestate == "started")
				{
					gamestate = "paused";
					pausetime = new Date().getTime();
					clearInterval(timer);
				}
				else if(gamestate == "paused")
				{
					
					resumetime = new Date().getTime();
					starttime += resumetime-pausetime;
					timer = setInterval(setTime,1000);
					gamestate = "started";
					GameLoop();
				}
		  }
		  else
			eventQ.push(new KeyEventObj('keydown',event.which));
	  }
	  
	  function doKeyUp(event)
	  {
		  eventQ.push(new KeyEventObj('keyup',event.which));
	  }
	  
      function setCanvas()
		{
		gamestate = "started";
		carspeed = 0;
		topspeed = 18;
		racedistance = 60;
		totalracedistance = 60;
		obsspeed = 0;
		width = 800;  
		height = 500;  
		c = document.getElementById('c');
		ctx = c.getContext('2d');  
		c.width = width;  
		c.height = height;  
		obsy = 0;
		obsx = 100;
		carx=130;
		noOfObstacles = 49;
		currentPosition = -1;
		noOfSticks = 6;
		noOfTrees = 2;
		obstacles = [];
		sticks = [];
		trees = [];
	}
		
	function MyCar()
	{
		this.xpos = width/2;
		this.ypos = 400;
		this.health = 100;
		this.moveleft = false;
		this.moveright = false;
		this.moveup = false;
		this.movedown =false;
		this.carimage = yellowcar;
		this.healthfactor = 25;
	}
	
	function Obstacle(x,y)
	{
		this.xpos = x;
		this.ypos = y;
		this.carimage = redcar;
		this.blasted = false;
	}
	
	function Stick(y)
	{
		this.xpos = width/2;
		this.ypos = y;
	}
	
	function finishLine()
	{
		this.xpos;
		this.ypos;
	}
	function LeftTree(y)
	{
		this.xpos = width/4 - 140;
		this.ypos = y;
	}
	
	function RightTree(y)
	{
		this.xpos = 3*width/4 +20;
		this.ypos = y;
	}
	
	function setFinishLine()
	{
		fline = new finishLine();
		fline.xpos = width/4;
		fline.ypos = -325*totalracedistance+330;
	}
	
	function setTrees()
	{
		var pos = 50;
		for( var i=0; i<noOfTrees*2; i = i+2)
		{
			trees[i] = new LeftTree(pos);
			trees[i+1] = new RightTree(pos);
			pos += 250;
		}
	}
	
	function setSticks()
	{
		var pos = -50;
		for( var i=0; i<noOfSticks; i++)
		{
			sticks[i] = new Stick(pos);
			pos += 100;
		}
	}
	
	function setObstacles()
	{
		var ypos = -50;
		for( var i=0; i<noOfObstacles; i++)
		{
			var range = (Math.random()*width/2-40);
			if(range<0)
				range = 0;
			var xpos =  (width/4)+ range;
			obstacles[i] = new Obstacle(xpos,ypos);
			ypos -= 200 ;
		}
	}
	
	function clear()
	{  
      ctx.fillStyle = '#AAAAAD';  
      ctx.fillRect(width/4,0,width/2,height);
      ctx.fillStyle = '#EDE3BB';  
      ctx.fillRect(0,0,width/4,height);
      ctx.fillStyle = '#EDE3BB';  
      ctx.fillRect(3*width/4,0,width/4,height);
    }

	
	function drawObstacles(dely)
	{
		
		for( var i=0 ;i<noOfObstacles; i++)
		{
				if(inView(obstacles[i]))
					ctx.drawImage(obstacles[i].carimage,obstacles[i].xpos,obstacles[i].ypos+dely);
				if(obstacles[i].blasted == false)
					obstacles[i].ypos += dely;
				else
					obstacles[i].ypos += carspeed;
		}
	}
	
	function drawHeroCar()
	{
		if(herocar.moveleft == true)
			herocar.xpos -= (5 - 2.75*carspeed/topspeed);
		else if(herocar.moveright == true)
			herocar.xpos += (5 - 2.75*carspeed/topspeed);
			
		if(herocar.moveup == true)
		{
			carspeed = carspeed+0.2<topspeed ? carspeed+0.2 : topspeed;
		}
		else if(herocar.movedown == true)
		{
			carspeed = carspeed-0.3 > 0 ? carspeed - 0.3 : 0;
		}
		else
		{
			carspeed = carspeed-0.2 >0 ? carspeed-0.2 : 0;
		}
		obsspeed = carspeed-7;
		if(herocar.xpos < width/4)
			herocar.xpos = width/4;
		else if(herocar.xpos+40 >= 3*width/4)
			herocar.xpos = 3*width/4 - 40;
		
		document.getElementById("speed").innerHTML = Math.round(carspeed*10)+"/"+(topspeed*10);
		
		if(herocar.health <= 0)
		{
			gamestate = "blasted";
			herocar.carimage = blastimage;
		}
		
		ctx.drawImage(herocar.carimage,herocar.xpos,herocar.ypos);
		
	}
	
	function drawTrees(dely)
	{
			for( var i=0; i< noOfTrees*2 ; i=i+2)
			{
				ctx.drawImage(treeimage,trees[i].xpos,trees[i].ypos);
				ctx.drawImage(treeimage,trees[i+1].xpos,trees[i+1].ypos);
				trees[i].ypos += dely;
				trees[i+1].ypos += dely;
				if( trees[i].ypos >= 500)
				{	
					trees[i].ypos = -150;
					trees[i+1].ypos = -150;
					racedistance --;
					document.getElementById("distance").innerHTML = totalracedistance-racedistance+"/"+totalracedistance; //renders distance covered in table
				}	
			}
	}
	
	function drawFinishLine(dely)
	{
			if(inView(fline))
			{
				ctx.drawImage(finishflag,fline.xpos,fline.ypos,width/2,30);
			}
			fline.ypos += dely;
	}
	
	function drawSticks(dely)
	{
		ctx.fillStyle = '#FFFFFF';
		for( var i=0;i<noOfSticks; i++)
		{
			ctx.fillRect(sticks[i].xpos, sticks[i].ypos+dely, 7,40);
			sticks[i].ypos += dely;
			if(sticks[i].ypos >= 500)
				sticks[i].ypos = -100;
		}
	}
	
	function collide(a,b)
	{
		if( b.xpos+40 >= a.xpos && b.xpos <= a.xpos+40 && b.ypos <= a.ypos+70 && b.ypos+70 >= a.ypos)
		{
				return true
		}
		return false;
	}
		
	function inView(obj)
	{
		if(obj.ypos > -80 && obj.ypos <510)
			return true;
		return false;
	}
	
	function detectCollision()
	{
		for ( i=0 ;i<noOfObstacles; i++)
		{
			if( inView(obstacles[i]) && obstacles[i].blasted == false)
			{
				if( herocar.ypos < obstacles[i].ypos )
					currentPosition = i;
				if( collide( obstacles[i], herocar))
				{		
					obstacles[i].carimage = blastimage;
					obstacles[i].xpos -= 10;
					obstacles[i].blasted = true;
					carspeed = carspeed/3;
					herocar.health-=herocar.healthfactor;
					document.getElementById("health").innerHTML = herocar.health+"/"+100;
				}
			}
		}
		document.getElementById("position").innerHTML = noOfObstacles-currentPosition+"/"+(noOfObstacles+1); //renders position of car in race in the table
	}
	
	function processEvents()
	{
		var event = eventQ.shift();
		if(event)
		{
			if(event.key == 37 && event.type == "keydown")
			{
				herocar.moveleft = true;
			}
			else if(event.key == 39 && event.type == "keydown")
			{
				herocar.moveright = true;
			}
			else if(event.key == 38 && event.type == "keydown")
			{
				herocar.moveup = true;
			}
			else if(event.key == 40 && event.type == "keydown")
			{
				herocar.movedown = true;
			}
			if(event.key == 37 && event.type == "keyup")
			{
				herocar.moveleft = false;
			}
			else if(event.key == 39 && event.type == "keyup")
			{
				herocar.moveright = false;
			}
			else if(event.key == 38 && event.type == "keyup")
			{
				herocar.moveup = false;
			}
			else if(event.key == 40 && event.type == "keyup")
			{
				herocar.movedown = false;
			}
		}
	}
	
	function processGameState()
	{
		if(racedistance == 0)
		{
			gamestate = "finished";
			clearInterval(timer);
		}
	}
	
	function setTime()
	{
			var nowtime = new Date();
			document.getElementById("time").innerHTML = Math.round((nowtime - starttime)/1000);
	}
	
	function render()
	{
		drawFinishLine(carspeed);
		drawSticks(carspeed);
		drawTrees(carspeed);
		drawObstacles(obsspeed);
		drawHeroCar();
	}
	
	function GameLoop()
	{  
		clear(); 
		processGameState(); 
		processEvents();
		render();
		detectCollision();
		if(gamestate == "started")
		requestAnimFrame(function() {
           GameLoop();
          });
        else if(gamestate == "blasted")
		{
			blastend();
			return;
		}
		else if(gamestate == "finished")
		{
			finishend();
			return;
		}
	}
	 
	function blastend()
	{
		alert("you didn't even manage to take your car to finish line");
	}
	
	function finishend()
	{
		alert("You have successfully finished the race");
	}
	
	function loadMyCar()
	{
		herocar = new MyCar();
	}
	
	function loadImages()
	{
		yellowcar = new Image();
		redcar = new Image();
		treeimage = new Image();
		blastimage = new Image();
		finishflag = new Image();
		redcar.src = "redcarstraight.jpg";
		yellowcar.src = "yellowcar.png";
		treeimage.src = "tree.png";
		blastimage.src = "blast.png";
		finishflag.src = "finishflag.jpg";
		
	}
	
	function init()
	{
		eventQ= [];
		setCanvas();
		setSticks();
		setTrees();
		loadImages();
		setObstacles();
		setFinishLine();
		loadMyCar();
		alert("Game loaded ! click ok to start");
		starttime = new Date().getTime();
		timer = setInterval(setTime,1000);
		GameLoop();
	}
