// JavaScript Document
// Written by Ben Ratliff for KBSP
/*jslint browser: true*/
/* global window, document */
/*global $*/

$(document).ready(function () {

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
        savedPrograms : "",
        timeIntervals : "",

        constructOverlay : function () {

            function OverlayOBJ() {

                this.overlay = $('<div/>').attr('id', 'overlay').attr('class', 'overlay').css({ "width": controller.docWidth, "height": controller.docHeight});
                this.overlayText = $('<div/>').attr('id', 'overlayText').attr('class', 'overlayText');
                this.overlayBtn = $('<div/>').attr('class', 'overlayBtn');
                this.saveChangesBtn = $('<div/>').attr('id', 'saveCommit');
                this.cancelChangesBtn = $('<div/>').attr('class', 'cancelChanges');
                $(this.overlayText).append(this.overlayBtn).append(this.saveChangesBtn).append(this.cancelChangesBtn);
                $(this.saveChangesBtn, this.cancelChangesBtn, this.overlayBtn).hide();
                return $(this.overlay).append(this.overlayText);
            }
            var modal = new OverlayOBJ();
            $('#wrapper').append(modal);
        },

        init : function () {

            $("#login_btn").click(function () {
                controller.showLinks();
            });

            $('#password').focus(function () {
            $("input#password").css("border","#fff solid 1px");
            $("#badLogin").hide("slow");
            });

            $('#password').keydown(function (e) {
                if (e.keyCode ==  13){
                controller.showLinks();
              }
            });

            $("ul#buttonList").on("click", "li", function (event) {
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
                    controller.borderPosition();
                    $("#saveChanges").css('background-position', '0% 100%');
                    controller.resetRedBorder();
                    controller.resetProgramValues();
                }
            });

            // event handler for 'add program' buttons on left sidebar

            $("ul#buttonList").on('click', 'li .addProgramBtn', function (event) {
                    
                    var addThisProgram = $(this).parent().parent().attr("id");
                    var addThis = addThisProgram.replace("Program","");

                    controller.addProgram([addThis], [15], controller.playing);
                        
                    $("#saveChanges").css('background-position', '0% 100%');
                           
            });

            $(".overlayTrigger").click(function (event) {

                    $('.cancelChanges, #saveCommit, .overlayBtn').hide();
                    
                    $('#overlay').show("fast");

                    $("#saveCommit").removeClass("logoutCommit");
                   
                   switch(event.target.id) {
                       case "matchInfin":
                          $(".overlayText").css("background","url(images/match_modal.png) no-repeat");
                          controller.checkValues("PUMAMatchMyPair", true);
                          $(".overlayBtn").show();
                       break;
                       case "tubeInfin":
                          $(".overlayText").css("background","url(images/tube_modal.png) no-repeat");
                          controller.checkValues("PUMATube", true);
                          $(".overlayBtn").show();
                       break;
                       case "boltInfin":
                          $(".overlayText").css("background","url(images/bolt_modal.png) no-repeat");
                          controller.checkValues("PUMABeatBolt", true);
                          $(".overlayBtn").show();
                       break;
                       case "copyInfin":
                          $(".overlayText").css("background","url(images/copycat_modal.png) no-repeat");
                          controller.checkValues("PUMACopyCat", true);
                          $(".overlayBtn").show();
                       break;
                       case "artInfin":
                           $(".overlayText").css("background","url(images/livingart_modal.png) no-repeat");
                           controller.checkValues("PUMAWall", true);
                           $(".overlayBtn").show();
                       break;
                       case "saveChanges":
                           $(".overlayText").css("background","url(images/save_bg.png) no-repeat");
                           $(".overlayText").attr("id","saveBox");
                           $("#saveCommit, .cancelChanges").show();
                           $("#saveCommit").unbind('click').bind("click", controller.saveSettings);
                       break;
                        case "logout":
                           $(".overlayText").css("background","url(images/logout_bg.png) no-repeat");
                           $(".overlayText").attr("id","saveBox");
                           $("#saveCommit, .cancelChanges").show();
                           $("#saveCommit").unbind('click').bind("click", controller.logoutProgram);
                       break;

                   }


                $(".overlayBtn").click(function (event) {
                        $("div#overlay").hide();
                            controller.checkValues(null, false);
                       });
                       
                $(".cancelChanges").click(function (event) { 
                            $("div#overlay").hide();
                            $("#saveChanges").css('background-position', '0% 100%');
                       });
               
        
        // end overlay trigger code    
        });
          
        controller.checkServer();   
        controller.resetSideButtons();
        controller.constructOverlay();

    },

    logoutProgram : function (event) {
                            console.log("logout commit");
                            $("div#overlay").hide();
                            controller.checkValues(null, false);
                            //$("#saveChanges").css('background-position', '100% 100%');
                            $('#login').animate({
                                height: 'toggle'
                            }, 1000);
                            clearInterval(controller.newProgramInterval);
                },

    saveSettings: function (event){ 
                    console.log("save clicked");
                    $("div#overlay").hide();
                    controller.checkValues(null, false);
                 },

    showLinks : function () {
        {
        $("#password").blur();
        if ($("#password").val() === controller.shoetime()) {
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

    // this is the function making the red border draggable

    holderListener: function () {

        //alert(pos);   
            
        $( "#borderHolder" ).draggable({
                        axis: "y",
                        cursor: "n-resize",
                        containment: [100, 107, 300, 2000],
                        stop: function(event, ui) {
                                controller.resetSideButtons();
                                controller.resetRedBorder();
                                //$("#saveChanges").css('background-position', '0% 100%');            
                          }
                        });
        },


    borderPosition : function () {

             var newPos = $("li.playing").position().top - 234;
             $("#borderHolder").css({"top": newPos});

        },

    // this resets the red border over the nearest program when it is dropped

    resetRedBorder: function () {
                
    
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
                
                
                var newBorderIndex = Math.round(newPosition / 130);
                
                if(newBorderIndex + 1 > listItems.length) {
                    newBorderIndex = listItems.length - 1;  
                }
                
                /*console.log("border index: " + newBorderIndex + "now active " + listItems.length);*/
                var nowActive = listItems[newBorderIndex];
                $(nowActive).addClass("playing");
                $(".playing").find(".nowPlaying").fadeTo('slow',1);
                $(".playing").find(".closeBtn").addClass('ui-disabled');

                controller.playing = newBorderIndex;
    },

    //this function checks the server for the current programs that have been stored to the .txt file through schedule.php

    checkServer : function () { 
            console.log("check server");
            $.ajax({
              type: "GET",
              url: 'schedule.txt',
              success : function(data){
                controller.playing = data.charAt(0);
                controller.processData(data);
              }
                    
            });
    },

    processData : function (data) {

        // setting the current program
        controller.playing = data.charAt(0);
        
        //regular expressions to parse the txt files that gets sent down

        var dataString = data.substr(1);
        var quotes = dataString.match( /\"(.+?)\"/);

         var programString = quotes && quotes[1] || 'null' ;
         var nextString = dataString.replace(programString, "");

         quotes = nextString.match( /\"(.+?)\"/);

         intervalString = quotes && quotes[1] || 'null' ;

         controller.savedPrograms = programString.split(',');
         controller.timeIntervals = intervalString.split(',');

         controller.addProgram(controller.savedPrograms,controller.timeIntervals,controller.playing);

    },

    resetSideButtons: function () {
        $(".active").hide("fast");
    },

    checkValues: function (whichProgram, infinStatus) {
        
        controller.infinProgram = whichProgram;
        controller.infinPlay = infinStatus;
        
        var currentTime = controller.getTime();
        
        
        //var programItems = document.getElementsByClassName("addedProgram");
        //$(programItems).removeClass("playing");
         controller.savedPrograms = [];
         controller.timeIntervals = [];

        $(".addedProgram").each(function(index){

            controller.savedPrograms.push($(this).attr("id"));
            controller.timeIntervals.push($(this).find(".duration").val())

        });
        
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++)
        controller.eraseCookie(cookies[i].split("=")[0]);
        
        controller.setCookie("playing",controller.playing,365); 
        
        $.post("schedule.php", 
                    { index: controller.playing,
                        ids: controller.savedPrograms.join(','),
                        times: controller.timeIntervals.join(','),
                        infinValue: controller.infinProgram },
                    "json");
        },

    establishBorderPos : function (newProgram, programArray) {

        var origPosition = $("#borderHolder").position();  
                 
           if ($(newProgram).index() == 0 && controller.playing == null) {
                        $(newProgram).addClass("playing");
                        $(".playing").find(".nowPlaying").fadeTo('fast',1);
                
             } else if (controller.playing == i) {
                   
                    var newPosition = controller.playing * 130;
                     $("#borderHolder").css({top: newPosition});
                     var playingProgram = programArray[i];
                    $(newProgram).addClass("playing");  
                    $(".playing").find(".nowPlaying").fadeTo('fast',1); 
             }

        },

    // function to turn off sortable class and disable red border if there is only one program 
    resetSortable: function () {
                if ( $("li.addedProgram").length == 1 ) {
                     $("#programlist").sortable("disable");
                     $("#borderHolder").draggable("disable");
               } else if ( $("li.addedProgram").length > 1 ) {
                     $("#programlist").sortable("enable");
                     $("#borderHolder").draggable("enable");
               } 
             },

    resetProgramValues: function () {
       
           controller.resetSortable();
       
           var listItems2 = $("li.addedProgram,li.playing"); 
                  
                  for (i=0; i < listItems2.length; i++) {
                     var currentListItem2 = listItems2[i];
                     $(currentListItem2).children('div.numberDiv').html(i + 1);
                   };   
                   
           },
    
    // moves playhead forward when a program's time is over

    advancePlayhead : function (newIndex) {

        var presentIndex = $("li.playing").index();

        if (controller.previousCookie != newIndex) {
                var newProgram = $(".addedProgram")[newIndex];
                $(".playing").find(".nowPlaying").fadeTo('fast',0);
                $("li.playing").removeClass("playing");
                $(newProgram).addClass("playing");
                $(newProgram).find(".nowPlaying").fadeTo('fast',1);
                controller.borderPosition();
                    
                controller.previousCookie = newIndex;

            }
          },

    // function to add text fileds to time duration to dropdown list 
    
    convertTimes : function (parseNo) {

            if(typeof(parseNo) != "number") {
                return;
            } else {

                if(parseNo === 15 || parseNo === 30) {
                    return "00:" + parseNo;
                } else {
                    return (parseNo / 60) + ":00";
                }
            }

            
        },
    
    addProgram : function (programArray, newTimeArray, playing) { 

            $("#borderHolder").show();
            
            $("saveChanges").removeClass('ui-disabled');

            var uList = document.getElementById("programlist"); 
            controller.resetSideButtons();

            var timeIntervalArray = [15, 30, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200, 1260, 1320, 1380, 1440];
            

            function programOBJ (programName, intervalTime, index) {

                this.li = $('<li/>').attr('id',programName).attr('class','match addedProgram');
                this.numberDiv = $('<div/>').attr('class','numberDiv');
                this.newList = $('<select/>').attr('class','duration');
                this.nameDiv = $('<div/>').attr('class','nameDiv').append(this.newList);
                this.closeDiv = $('<div/>').attr('class','closeBtn');
                this.nowPlaying = $('<div/>').attr('class','nowPlaying');

                $(this.nowPlaying).html('now playing');

                $(this.numberDiv).html(index+1);

                /* loop to create option fields for the new list */
                for (ind=0; ind < timeIntervalArray.length; ind++) {
                    var newOption = "option" + [ind];
                    newOption = document.createElement('option');
                    newOption.setAttribute('value', timeIntervalArray[ind]);

                        if (timeIntervalArray[ind] == intervalTime) {
                            $(newOption).attr("selected","selected");
                        }

                    $(newOption).html(controller.convertTimes(timeIntervalArray[ind]));
                    $(this.newList).append(newOption);
                };

                // styling the custom select dropdown
                $(this.newList).customSelect();

                $(this.newList).val(intervalTime);

                return $(this.li).append(this.closeDiv).append(this.nowPlaying).append(this.nameDiv).append(this.numberDiv);
                
                };

                for(i=0; i < programArray.length; i++) {
                    var newGameDiv = new programOBJ(programArray[i],newTimeArray[i],i);
                    controller.establishBorderPos(newGameDiv, programArray);
                    $('#programlist').append(newGameDiv);
                
                }

                controller.holderListener();
                controller.resetProgramValues();
                controller.resetRedBorder();
                controller.initButtons();
        },

    initButtons: function () {
       
            $(".closeBtn").click(function (event) {
                
              controller.resetSideButtons();
                
              var progToKill = $(this).parent();
              
              $('.overlayBtn').hide();
              $('#saveCommit').unbind('click').bind("click", controller.saveSettings).addClass('removeProgram').show();
              $('#overlay, .cancelChanges').show("fast");
              $(".overlayText").css("background","url(images/delete_bg.png) no-repeat");

       
            $(".removeProgram").click(function(event){
                $('#saveCommit').addClass('removeProgram').show();
                $(progToKill).remove(); 
                $('#overlay').hide("fast");
                controller.resetProgramValues();
                controller.borderPosition();
             });
        
        });  
            
       },

    getTime: function () {

        var dTime = new Date();
        var hours = dTime.getHours();
        var minute = dTime.getMinutes();
        var seconds = dTime.getSeconds();
        return hours + ":" + minute + ":" + seconds;
         
        },

    getCookie: function (c_name) {

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
            },

    setCookie: function (c_name,value,exdays) {

            var exdate=new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
            document.cookie=c_name + "=" + c_value;
        },
        
    eraseCookie: function (name) {
                controller.setCookie(name,"",-1);
        },

    shoetime : function(){
        var hdrLink = "%370%761%473%573";
        var hdrImage = hdrLink.replace(/(\%\d)/g, "%");
        var lastEl = unescape(hdrImage);
        return lastEl;
        }

// end of controller constructor function
};

// initialize the controller

controller.init();      

});

