window.onload = function(){
	starttime = new Date();
};

window.onbeforeunload = function(e){
	var endtime=new Date();
	var interval = (endtime-starttime)/1000;
	var mins = Math.floor(interval / 60);
	var secs = Math.round((interval/60 - mins)*60);
    alert("You have killed "+mins+" minutes "+secs+" seconds here! be proud.");
};
