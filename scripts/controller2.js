// JavaScript Document


$(document).ready(function(){

var controller = {};

controller = {

	docWidth : $(document).width(), 
	docHeight : $(document).height(),
	redBoxIncrement : 130,
	infinPlay : false,
	infinProgram : "",
	playing : "",
	previousCookie : "",
	newProgramInterval : "",
	defaultPrograms : ["match", "tube", "bolt", "copyCat", "livingArt"],

	constructOverlay : function() {
			   var overlay = document.createElement("div");
			   var overlayText = document.createElement("div");
			   overlay.setAttribute("id","overlay");
			   overlay.setAttribute("class", "overlay");
			   overlayText.setAttribute("id","overlayText");
			   overlayText.setAttribute("class", "overlayText");
			   document.body.appendChild(overlay);
			   overlay.appendChild(overlayText);
			   $("#overlay").css("width", controller.docWidth);
			   $("#overlay").css("height", controller.docHeight);
			   var overlayBtn = document.createElement("div");
			   overlayBtn.setAttribute("class","overlayBtn");
			   $('#overlayText').append(overlayBtn);
			   $('#saveCommit').hide();
			   var saveChangesBtn = document.createElement("div");
				saveChangesBtn.setAttribute("id","saveCommit");
				overlayText.appendChild(saveChangesBtn);
				$('').hide();
				var cancelChangesBtn = document.createElement("div");
				cancelChangesBtn.setAttribute("class","cancelChanges");
				overlayText.appendChild(cancelChangesBtn);
				$('.cancelChanges, #saveCommit, .overlayBtn').hide();
			    //$(overlay).show();
	},

	init : function(){

		$("#saveChanges").css('background-position', '100% 100%');

		$("#login_btn").click(function(event){
		    controller.login();
		});

		$('#password').focus(function(e) {
		   $("input#password").css("border","#fff solid 1px");
		   $("#badLogin").hide("slow");  
		});

		$('#password').keydown(function(e) {
		  if(e.keyCode==13){
		  controller.login();
		  }
		});

		$("ul#buttonList").on("click", "li", function(event){
			$('.active').hide();
			$(this).find('.active').show();

		});

		$( "#programlist" ).sortable({
			 handle: '.numberDiv',
			 axis: "y",
			 start: function(event, ui) {
				 controller.resetSideButtons();
				 
				  },
		     sort: function(event, ui) {
				
			 },
			stop: function(event, ui) {
				borderPosition();
				$("#saveChanges").css('background-position', '0% 100%'); 
				controller.resetRedBorder();
			   resetProgramValues();    
			}
		});

		$("ul#buttonList").on('click', 'li .addProgramBtn', function(event){
				
				var addThisProgram = controller.defaultPrograms[$(this).parent().parent().index()];

				controller.addProgram([addThisProgram], [15]);
					
				$("#saveChanges").css('background-position', '0% 100%');
					   
				});

		$(".overlayTrigger").click(function(event){

			   	$('.cancelChanges, #saveCommit, .overlayBtn').hide();
				
			    $('#overlay').show("fast");
			   
			   switch(event.target.id) {
			       case "matchInfin":
				   	  $(".overlayText").css("background","url(images/match_modal.png)");
					  controller.checkValues("PUMAMatchMyPair", true);
					  $(".overlayBtn").show();
				   break;
				   case "tubeInfin":
				   	  $(".overlayText").css("background","url(images/tube_modal.png)");
					  controller.checkValues("PUMATube", true);
					  $(".overlayBtn").show();
				   break;
				   case "boltInfin":
				   	  $(".overlayText").css("background","url(images/bolt_modal.png)");
					  controller.checkValues("PUMABeatBolt", true);
					  $(".overlayBtn").show();
				   break;
				   case "copyInfin":
					  $(".overlayText").css("background","url(images/copycat_modal.png)");
					  controller.checkValues("PUMACopyCat", true);
					  $(".overlayBtn").show();
				   break;
				   case "artInfin":
					   $(".overlayText").css("background","url(images/livingart_modal.png)");
					   controller.checkValues("PUMAWall", true);
					   $(".overlayBtn").show();
				   break;
				   case "saveChanges":
					   $(".overlayText").css("background","url(images/save_bg.png)");
					   $(".overlayText").attr("id","saveBox");
					   $("#saveCommit, .cancelChanges").show();
				   break;
				    case "logout":
					   $(".overlayText").css("background","url(images/logout_bg.png)");
					   $(".overlayText").attr("id","saveBox");
					   $("#saveCommit, .cancelChanges").show();
				   break;

			   }


				$("#saveCommit").on("click", function(event){ 
								$("div#overlay").hide();
								controller.checkValues(null, false);
								$("#saveChanges").css('background-position', '100% 100%');
						   });

				$(".overlayBtn").click(function(event){ 
						$("div#overlay").hide();
							controller.checkValues(null, false);
					   });
					   
				$(".cancelChanges").click(function(event){ 
							$("div#overlay").hide();
							$("#saveChanges").css('background-position', '0% 100%');
					   });
			   
			   
			   
			    $("#logoutCommit").click(function(event){ 
					$("div#overlay").remove();
					controller.checkValues(null, false);
					$("#saveChanges").css('background-position', '100% 100%');
					$('#login').animate({
			            height: 'toggle'
			        }, 1000);
					clearInterval(controller.newProgramInterval);
			   });  
		
		// end overlay trigger code	   
		});
		  
		controller.savedSettings();	
		controller.resetSideButtons();
		controller.constructOverlay();

	},

	login : function(){
		{
		$("#password").blur();
		if ($("#password").val() === "puma") {
			$('#login').animate({
		    height:'toggle'
		  }, 1000, function(){
			$("#password").val("")  
		  });
		} else { 
		   $("input#password").css("border","#f00 solid 1px");
		   $("input#password").val("");
		   $("#badLogin").show("slow");  
		}
		};
	},


	holderListener: function() {

		//alert(pos);	
			
		$( "#borderHolder" ).draggable({
		                axis: "y",
		                cursor: "n-resize",
		                containment: [100, 107, 300, 2000],
		                stop: function(event, ui) {
							        controller.resetSideButtons();
		                            controller.resetRedBorder();
		                            $("#saveChanges").css('background-position', '0% 100%');              
		                  }
		                });
		},

	resetRedBorder: function() {
				
	
                var listItems = $("li.addedProgram,li.playing");
				$("li.addedProgram").removeClass("playing");
				$("li.addedProgram").find(".closeBtn").removeClass('ui-disabled');
				$(".nowPlaying").fadeTo('fast', 0);
				
				 var newPosition = $("#borderHolder").position().top - 234;
				
                var maxLength = (listItems.length - 1) * controller.redBoxIncrement;
                if( (newPosition) < 0 ) {
                                $("#borderHolder").animate({top: 0}, 200);                        
                }
                else if( (newPosition) > maxLength ) {
                                $("#borderHolder").animate({top: maxLength}, 200);                    
                } else {
                                snapTo=(newPosition/130);
                                snapTo=(snapTo.toFixed(0)*130);
                                $("#borderHolder").animate({top: snapTo}, 200);
                };
				
				
                //console.log($("#borderHolder").position().top);
				
				var newBorderIndex = Math.round(newPosition / 130);
				
				if(newBorderIndex + 1 > listItems.length) {
					newBorderIndex = listItems.length - 1;	
				}
				
				/*console.log("border index: " + newBorderIndex + "now active " + listItems.length);*/
			    var nowActive = listItems[newBorderIndex];
				$(nowActive).addClass("playing");
				$(".playing").find(".nowPlaying").fadeTo('slow',1);
				$(".playing").find(".closeBtn").addClass('ui-disabled');
	},


	savedSettings : function(){
	
		controller.playing = 1;
		//var programs = getCookie("CurrentPrograms");
		var programs = "PUMACopyCatPUMABeatBoltPUMABeatBoltPUMAWall"
		//var timeIntervals = getCookie("ProgramTimes");
		var timeIntervals = "90018002160144"

		/*console.log("Index: " + playing);
		console.log("Current Programs: " + programs);
		console.log("Times: " + timeIntervals);*/


		var savedProgramArray = Array();
		var intervalArray = Array();
		var programString = "";

		 	
		if (controller.playing === undefined) {
		   savedProgramArray = programArray;
		   intervalArray = ["60", "60", "60", "60", "60"];
		   playing = 0;
		}  else {

		for(i=0; i < programs.length; i++) {
			programString = programString += programs[i];
			
			switch (programString) {
			case "PUMAMatchMyPair":
			savedProgramArray.push( "match" );
			var programString = "";
			break;
			case "PUMATube":
			savedProgramArray.push( "tube" );
			var programString = "";
			break;
			case "PUMABeatBolt":
			savedProgramArray.push( "bolt" );
			var programString = "";
			break;
			case "PUMACopyCat":
			savedProgramArray.push( "copyCat" );
			var programString = "";
			break;
			case "PUMAWall":
			savedProgramArray.push( "livingArt");
			var programString = "";
			case ",":
			var programString = "";
			break;		
			}
			
		}

		var intervalString = "";


		for(i=0; i < timeIntervals.length; i++) {
			intervalString = intervalString += timeIntervals[i];
			//console.log(intervalString);
			
			switch (intervalString) {
			case "900":
			intervalArray.push("15");
			intervalString = "";
			break;
			case "1800":
			intervalArray.push("30");
			intervalString = "";
			break;
			case "3600":
			intervalArray.push("60");
			intervalString = "";
			break;
			case "7200":
			intervalArray.push("120");
			intervalString = "";
			break;
			case "10800":
			intervalArray.push("180");
			intervalString = "";
			break;
			case "14400":
			intervalArray.push("240");
			intervalString = "";
			break;
			case "18000":
			intervalArray.push("300");
			intervalString = "";
			break;
			case "2160":
			intervalArray.push("360");
			intervalString = "";
			break;
			case "25200":
			intervalArray.push("420");
			intervalString = "";
			break;
			case "28800":
			intervalArray.push("480");
			intervalString = "";
			break;
			case "32400":
			intervalArray.push("540");
			intervalString = "";
			break;
			case "36000":
			intervalArray.push("600");
			intervalString = "";
			break;
			case "39600":
			intervalArray.push("660");
			intervalString = "";
			break;
			case "43200":
			intervalArray.push("720");
			intervalString = "";
			break;
			case "46800":
			intervalArray.push("780");
			intervalString = "";
			break;
			case "50400":
			intervalArray.push("840");
			intervalString = "";
			break;
			case "54000":
			intervalArray.push("900");
			intervalString = "";
			break;
			case "57600":
			intervalArray.push("960");
			intervalString = "";
			break;
			case "61200":
			intervalArray.push("1020");
			intervalString = "";
			break;
			case "64800":
			intervalArray.push("1080");
			intervalString = "";
			break;
			case "68400":
			intervalArray.push("1140");
			intervalString = "";
			break;
			case "72000":
			intervalArray.push("1200");
			intervalString = "";
			break;
			case "75600":
			intervalArray.push("1260");
			intervalString = "";
			break;
			case "79200":
			intervalArray.push("1320");
			intervalString = "";
			break;
			case "82800":
			intervalArray.push("1380");
			intervalString = "";
			break;
			case "86400":
			intervalArray.push("1440");
			intervalString = "";
			break;
			case ",":
			intervalString = "";
			break;		
			}
			
		}
		}

		/*console.log(savedProgramArray);
		console.log(intervalArray);
		console.log(playing);*/
		controller.addProgram(savedProgramArray, intervalArray, controller.playing);	
		controller.previousCookie = controller.playing;
	},

	resetSideButtons: function() {
		$(".active").hide("fast");
	},

	checkValues: function(whichProgram, infinStatus) {
		
		controller.infinProgram = whichProgram;
		controller.infinPlay = infinStatus;
		
		var currentTime = getTime();
		
		var borderPos = $("#borderHolder").position().top - 234;
		//console.log(borderPos);
		
		var programIndex = borderPos / controller.redBoxIncrement;

		
		var currentIndex = Math.round(programIndex);
		controller.previousCookie = currentIndex;
		//console.log("prev cookie:" + previousCookie);
		
		var programItems = document.getElementsByClassName("addedProgram");
		$(programItems).removeClass("playing");
		 
		var i=0;
		for (i=0; i < programItems.length; i++) {	
		    if (i === currentIndex) {
				var programToChange = programItems[i];
				$(programToChange).addClass('playing');
			}
		}
		
		
		var cookies = document.cookie.split(";");
	    for (var i = 0; i < cookies.length; i++)
	    eraseCookie(cookies[i].split("=")[0]);

			
		controller.playing=$("li.playing").attr('id');
		
	    setCookie("playing",controller.playing,365);	
		
		
		//console.log("Number of programs " + $(".addedProgram").length);
		
		var programArray = Array();
		var timeIntervals = Array();
		
		$('.addedProgram').each(function(index) {
		   //console.log("Added Programs: " +  $(this).attr('id') );
		   switch($(this).attr('id')) {
			   case "match":
			   programArray.push( "PUMAMatchMyPair" );
			   break;
			   case "tube":
			   programArray.push( "PUMATube" );
			   console.log("tube");
			   break;
			   case "bolt":
			   programArray.push( "PUMABeatBolt" );
			   console.log("bolt");
			   break;
			   case "copyCat":
			   programArray.push( "PUMACopyCat" );
			    console.log("copyCat");
			   break;
			   case "livingArt":
			   programArray.push( "PUMAWall" );
			   console.log("livingArt");
			   break;
		   
		   //programArray.push( $(this).attr('id') );
			
		   }
		   timeIntervals.push( $(this).find("option:selected").val() * 60 );
		   
		});
		
		var playingTitle = $("li.playing").attr('id');

		console.log (currentIndex + programArray + timeIntervals + controller.infinProgram)
		
		$.post("schedule.php", 
					{ index: currentIndex,
						ids: programArray.join(','),
						times: timeIntervals.join(','),
						infinValue: controller.infinProgram },
				    "json");
	    },
	
	addProgram : function(programArray, newTimeArray, playing){ 
     
		$("#borderHolder").show();
		/*console.log("Playing index " + playing);*/
		
		$("saveChanges").removeClass('ui-disabled');

		var uList = document.getElementById("programlist"); 
		controller.resetSideButtons();
		/*$("#saveChanges").css('background-position', '0% 100%');*/
	 
		for(i=0; i < programArray.length; i++) {	
		    var programToAdd = programArray[i];
			
			//creates new li element in the list
			var newProgram = document.createElement('li');
			
			//creates the div to hold the number value of program
			var numberDiv = document.createElement('div');
			numberDiv.setAttribute('class', 'numberDiv');
			
			//creates name div
			var nameDiv = document.createElement('div');
			nameDiv.setAttribute('class', "nameDiv");
			
			// creating the time dropdown menu
			var newList = document.createElement('select');
			newList.setAttribute('class', "duration");
			
			// create infinite play and close buttons
			var closeDiv = document.createElement('div');
			closeDiv.setAttribute('class', "closeBtn");
			
			
			var nowPlaying = document.createElement('div');
			nowPlaying.setAttribute("class", "nowPlaying");
			
			// attaching to parents
			newProgram.appendChild(closeDiv);
			newProgram.appendChild(nowPlaying);
			newProgram.appendChild(nameDiv);
			newProgram.appendChild(numberDiv);
			uList.appendChild(newProgram);
			
			// applies specific class to li according to program
			switch (programArray[i]) {
				case "match":
				newProgram.setAttribute('class', 'match addedProgram');
				newProgram.setAttribute('id', 'match');
				break;
				case "tube":
				newProgram.setAttribute('class', 'tube addedProgram');
				newProgram.setAttribute('id', 'tube');
				break;
				case "bolt":
				newProgram.setAttribute('class', 'bolt addedProgram');
				newProgram.setAttribute('id', 'bolt');
				break;
				case "copyCat":
				newProgram.setAttribute('class', 'copycat addedProgram');
				newProgram.setAttribute('id', 'copyCat');
				//$(newProgram).find('div.nameDiv').html('APP NAME');
				break;
				case "livingArt":
				newProgram.setAttribute('class', 'livingArt addedProgram');
				newProgram.setAttribute('id', 'livingArt');
				break;
				default:
				newProgram.setAttribute('id', 'default');
			}
			
			var	timeArray = ["00:15", "00:30", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00" ];
			var	timeIntervalArray = [15, 30, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380, 1440];
			
			for (ind=0; ind < timeArray.length; ind++) {
				
				var newOption = "option" + [ind];
				newOption = document.createElement('option');
				newOption.setAttribute('value', timeIntervalArray[ind]);
				$(newOption).html(timeArray[ind]);
				newList.appendChild(newOption);
			}
			
			nameDiv.appendChild(newList);
			//alert("Current time array " + newTimeArray[i]);
			$(newList).val(newTimeArray[i]);

			$(newList).customSelect();
			
			 var newItemNo = $(uList).children().index() + 1;

			 $(newProgram).children('div.numberDiv').html(newItemNo);
			 
			 $(newProgram).find(".nowPlaying").html('now playing')
			 
			var origPosition = $("#borderHolder").position();  
			 	 
		   if ($(newProgram).index() == 0 && controller.playing == null) {
				     	//console.log("border holder " + origPosition.top);
						$(newProgram).addClass("playing");
						$(".playing").find(".nowPlaying").fadeTo('fast',1);
				
			 } else if (playing == i) {
				   
				    var newPosition = controller.playing * 130;
					 $("#borderHolder").css({top: newPosition});
					 var playingProgram = programArray[i];
					 //console.log("Currently playing :" + playing);
				    $(newProgram).addClass("playing");	
					$(".playing").find(".nowPlaying").fadeTo('fast',1); 
			 }
			 
			controller.holderListener();
			resetSortable();
			initButtons();	
			 
			 /* console.log("playing var: " + playing + "i " +i); */
			
		   }	 
			
    }

// end of controller constructor function
};


controller.init();		



function getTime() {

var dTime = new Date();
var hours = dTime.getHours();
var minute = dTime.getMinutes();
var seconds = dTime.getSeconds();
/*var period = "AM";
if (hours > 12) {
period = "PM"
 }
 else {
 period = "AM";
 }
hours = ((hours > 12) ? hours - 12 : hours)*/
return hours + ":" + minute + ":" + seconds;
 
}
	

	
function borderPosition(){
	     
         var newPos = $("li.playing").position().top - 234;
		 
	   	$("#borderHolder").css({"top": newPos});
}
   
// add Button listeners   
   
   function initButtons() {
	   
	    $(".closeBtn").click(function(event){
			
		  controller.resetSideButtons();
			
	      var progToKill = $(this).parent();
		  
		  $('.overlayBtn').hide();
		  $('#saveCommit').addClass('removeProgram').show();
		  $('#overlay, .cancelChanges').show("fast");
		  $(".overlayText").css("background","url(images/delete_bg.png)");

   
		$(".removeProgram").click(function(event){
			$(progToKill).remove();	
			$('#overlay').hide("fast");
			resetProgramValues();
			borderPosition();
	     });
		 
		 $(".cancelChanges").click(function(event){
			$('#overlay').hide("fast");		
	     });
			
	
	});  
	   	
   };
   
function resetSortable() {
	if ( $("li.addedProgram").length == 1 ) {
		 $("#programlist").sortable("disable");
		 $("#borderHolder").draggable("disable");
   } else if ( $("li.addedProgram").length > 1 ) {
		 $("#programlist").sortable("enable");
		 $("#borderHolder").draggable("enable");
   } 
 }
  
// resets program number values
   
   function resetProgramValues() {
	   
	 resetSortable(); 
	   
	 //console.log( $("li.addedProgram").length );
  
	   
   var listItems2 = $("li.addedProgram,li.playing"); 
		  
		  for (i=0; i < listItems2.length; i++) {
			 var currentListItem2 = listItems2[i];
			 $(currentListItem2).children('div.numberDiv').html(i + 1);
		   };   
		   
   }; 

function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
  {
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}

function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}




function eraseCookie(name) {
    setCookie(name,"",-1);
}

//controller.newProgramInterval = setInterval(checkPlaying,4000);

function checkPlaying() { 

$.ajax({
  type: "GET",
  url: 'schedule.txt',
  dataType: 'html',
}).done(function( html ) {
  var playData = html;
  //console.log("da new index is " + playData);
  var dataText = String(playData);
  var dataPos = dataText.indexOf("\n") + 1
  var newIndex = dataText.charAt(dataPos);
  //console.log("new Index: " + newIndex);
   advancePlayhead(newIndex);	
	});


function advancePlayhead(newIndex){

var presentIndex = $("li.playing").index();
//console.log("Previous Cookie: " + previousCookie + ", New Cookie: " + newIndex);

if (controller.previousCookie != newIndex) {
		var newProgram = $(".addedProgram")[newIndex];
		$(".playing").find(".nowPlaying").fadeTo('fast',0);
		$("li.playing").removeClass("playing");
		$(newProgram).addClass("playing");
		$(newProgram).find(".nowPlaying").fadeTo('fast',1);
		borderPosition();
			
		controller.previousCookie = newIndex;

	}
  }
}

   
 });


// baking cookies 

