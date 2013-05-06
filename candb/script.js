window.onload=initall;
window.onbeforeunload = function(e) {
	var endtime=new Date();
	var interval = (endtime-starttime)/1000;
	var mins = Math.floor(interval / 60);
	var secs = Math.round((interval/60 - mins)*60);
    alert("You have killed "+mins+" minutes "+secs+" seconds playing cows and bulls");
};

function initall() 
{
	starttime=new Date();
	dictionary = new Array();
	initDict();
	gamestate="";
	guessNo = 0;
	diff=4;
	document.getElementById("lowerdiff").onclick = lowerdiff;
	document.getElementById("incrdiff").onclick = incrdiff; 
	document.getElementById("cbform").onsubmit = findcb;
	document.getElementById("newgame").onclick = newgame;
	document.getElementById("diffbox").disabled = true;
	document.getElementById("helpbox").style.visibility = 'hidden';
	//newgame(); called after dict is loaded
}

function showhidehelp()
{
	var element = document.getElementById("helpbox");
	if(helpbox.style.visibility == 'visible')
		helpbox.style.visibility = 'hidden';
	else
		helpbox.style.visibility = 'visible';
}
function newgame()
{
	if(gamestate=="playing")
	{
		alert("You have decided to quit this game! right answer is "+theWord);
	}
	guessNo = 0;
	setGameDiff();
	document.getElementById("diffbox").value = "Word length:"+diff;
	//alert("new game");
	theWord = getWord(wordLength);
	//alert(theWord);
	clearWord();
	document.getElementById("wordbox").focus();
	clearTable();
	clearScratchpad();
	gamestate = "playing";
}

function alpha(x)
{
	if(x.style.backgroundColor == "red")
		x.style.backgroundColor = "green";
	else if(x.style.backgroundColor == "green")
		x.style.backgroundColor = "black";
	else
		x.style.backgroundColor = "red"
}

function setGameDiff()
{
	switch(diff)
	{
		case 3: maxGuess=10;
				wordLength=3;
				break;
		case 4: maxGuess=15;
				wordLength=4;
				break;
		case 5: maxGuess=20;
				wordLength=5;
				break;
	}
}

function lowerdiff()
{
	if(diff>3)
	{
		diff--;
		alert("Word length will be changed for next game ");
	}
}

function incrdiff()
{
	if(diff<5)
	{
		diff++;
		alert("Word length will be changed for next game ");
	}
}

function clearWord() //clears the textfileld for entering guess and brings focus to it
{
	document.getElementById("wordbox").value="";
	document.getElementById("wordbox").focus();
}

function initDict() //loads words into array using xmlhttp req to a local file
{
	var address = "words35.txt";
	var req = (window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
	if(req == null)
	{
		alert("Error: XMLHttpRequest failed to initiate.");
	}
	req.onload = function() {
    dictionary = req.responseText.split("\n");
    
    for(var i = 0; i < dictionary.length; i++)
        dictionary[i] = dictionary[i].toLowerCase();
	newgame();	
	}
    
    try 
    {
		req.open("GET", address, true);
		req.send(null);
	}
	catch(e) 
	{
		alert("Chrome :( ");
	}
}

function getWord(len) //gets a word from dictionary of length wordLength with no repeating characters
{
	var word="";
	do{
		var ran = Math.floor( ( Math.random()*dictionary.length ) );
		word = dictionary[ran];
	}while (word.length != len || repeating(word))
	
	return word;
}

function notInDict(word) //returns true if a word is not found in dictionary
{
	return (dictionary.indexOf(word.toLowerCase()) == -1)
}

function clearTable() //clears the guess table
{
	var x=document.getElementById('tbl').rows
	for(var i=1;i<x.length;i++)
	{
		var y=x[i].cells
		y[0].innerHTML = "";
		y[1].innerHTML = "";
		y[2].innerHTML = "";
		y[3].innerHTML = "";
	}
}

function clearScratchpad() //clears the colors of scratchpad table
{
	var x=document.getElementById('scratchtable').rows
	for(var i=0;i<x.length;i++)
	{
		var y=x[i].cells
		for( var j=0; j<y.length; j++)
			y[j].style.backgroundColor="black";
	}
}

function repeating(word) //returns true if a word contains repeating characters
{
	var flag=0;
	for( var i=0; i<word.length-1; i++)
	{
		for( var j=i+1; j<word.length; j++)
			if ( word[i]==word[j] )
			{
				flag = 1;
				break;
			}
	}
	return flag;
}

function getBulls(guess) 
{
	var b=0	;
	for(var i=0;i<guess.length;i++)
		if ( guess[i]==theWord[i] )
			b++
	return b
}

function getCows(guess)
{
	var c=0;
	for(var i=0; i<guess.length; i++)
	{
		for(var j=0; j<guess.length ;j++)
		{
			if (i==j)
				continue;
			if( guess[i]==theWord[j] )
				c++;
		}
	}
	return c;
}

function getGuess() //returns value from text box after trimming spaces
{
	var wordbox = document.getElementById("wordbox");
	return wordbox.value.trim();
}

function fillTable(guess,rownum,b,c) //makes an entry in table showing guess , no of cows and no of bulls
{
	var x=document.getElementById('tbl').rows
    var y=x[rownum].cells
    y[0].innerHTML = rownum;
    y[1].innerHTML = guess;
    y[2].innerHTML = c;
    y[3].innerHTML = b;
}

function validateGuess(guess) //validates the guess of user. 1.length must be = to wordLength 2.alphabets should not repeat 3.must be present in dict
{
	var flag = 1;
	//alert("validating guess");
	if (guess.length != wordLength)
	{
		flag = 0;
		alert ("check length!");
	}
	if ( repeating(guess) )
	{
		flag = 0;
		alert ("alphabets repeating!");
	}
	if ( notInDict(guess) )
	{
		flag = 0;
		alert ("does that word really exist? don't cheat! ");
	}
		//alert(flag);
	return flag;

}

function findcb() // finds cows and bulls and updates table..gets ready for next guess. Main game function !
{
	if(gamestate=="win")
	{
		alert("You won already! try playing new game");
		return false;
	}
	else if(gamestate=="loss")
	{
		alert("You lost this game! better luck next game");
		return false;
	}
	var guess=getGuess();
	//alert(guess);
	if(!validateGuess(guess))
		return false;
	guessNo++;
	var b = getBulls(guess);
	var c = getCows(guess);
	if( guessNo >= maxGuess )
	{
		alert("Your attempts are over! Right answer is "+theWord);
		gamestate = "loss";
		return false;
	}
	if( b==wordLength )
	{
		alert("You win!");
		gamestate = "win";
		window.refresh;
		return false;
	}
	fillTable(guess,guessNo,b,c);
	clearWord();
	return false;
}

