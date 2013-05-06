var fs = require('fs');
var sys = require('sys');
var server = require('http').createServer(function(req,response){
    fs.readFile('bubblebreak.html',function(err,data){
        response.writeHead(200);    
        response.write(data);
        response.end();
        
    });
	
});


server.listen(8080);
sys.print('server started...');

var everyone = require('now').initialize(server);

var bubblelist = new Array();
var playerlist = new Array();
var timer;

everyone.now.getBubbleList = function(callback) {
	callback(bubblelist);
}

everyone.now.bubbleListUpdate = function(localbubblelist) {
	bubblelist = localbubblelist;
}

everyone.now.getPlayerList = function(callback) {
	callback(playerlist);
}

everyone.now.playerNameUpdate = function(localname)
{
	if(playerlist.length == 0)
		timer = setInterval(putbubble,2000);
	playerlist.push([localname,0]);
	everyone.now.pushPlayerList(playerlist);
	console.log(playerlist);
}

everyone.now.removePlayer = function(name)
{
	for(var i=0; i<playerlist.length; i++)
		if(playerlist[i][0] == name)
			break;
	playerlist.splice(i,1);
	everyone.now.pushPlayerList(playerlist);
	if(playerlist.length == 0)
	{
		bubblelist = new Array();
		clearInterval(timer);
	}
}

everyone.now.bubblelistsplice = function(i,x,name)
{
	if(i<bubblelist.length && bubblelist[i][0] == x)
	{	
		bubblelist.splice(i,1);
		for( var i=0; i<playerlist.length; i++)
			if(playerlist[i][0] == name)
			{
				playerlist[i][1]+=1;
				break;
			}
	}
	everyone.now.pushPlayerList(playerlist);
}

function putbubble()
{
		var xc = Math.floor(Math.random()*1000);
		var yc = Math.floor(Math.random()*800);
		bubblelist.push([xc,yc]);
}


