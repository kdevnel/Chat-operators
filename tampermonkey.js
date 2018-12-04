// ==UserScript==
// @name         Happychat Operators
// @namespace    https://github.com/senff/Chat-operators
// @version      1.1
// @description  List of operators
// @author       Senff
// @require      https://code.jquery.com/jquery-1.12.4.js
// @match        https://hud.happychat.io/*
// @updateURL    https://raw.githubusercontent.com/senff/Chat-operators/master/tampermonkey.js
// @grant        none
// ==/UserScript==

var $ = window.jQuery;

function nameAdd() {

    var opsAll = 0;
    var opsGreen = 0;
    var opsYellow = 0;
    var opsBlue = 0;
    var opsRed = 0;
    var throttleOne = 0;
    var throttleTwo = 0;
    var throttleThree = 0;
    var throttleFour = 0;
    var throttleMore = 0;
    var greenLoad = 0;
    var greenThrottle = 0;
    var greenOpen = 0;
    var blueLoad = 0;
    var blueThrottle = 0;
    var blueOpen = 0;
    var HEsGreen = 'GREEN: ';
    var HEsBlue = 'BLUE: ';
    var HEsYellow = 'YELLOW: ';
    var HEsRed = 'RED: ';
    var allHEs = '';
    var opLang = '';

    if(($('.chat__chat-queue .capacity__operators').length) && (!$('.chat__chat-queue .operators_stats').length)) {
        $('.chat__chat-queue .capacity__operators').after('<div class="operators_stats stats_open"><h4>Operator stats <div class="stats_toggle"></div></h4><div class="operators_all_stats" style="display: block;"><div class="stats-block"><strong>Total ops</strong>: <span class="all-ops">0</span> ( <strong class="green ops-green">0</strong>  <strong class="yellow ops-yellow">0</strong>  <strong class="blue ops-blue">0</strong>  <strong class="red ops-red">0</strong> )</div><div class="stats-block"><strong>GREEN OPS:</strong><br><span class="throttle-one throttle-count">0</span> have a throttle of 1<br><span class="throttle-two throttle-count">0</span> have a throttle of 2<br><span class="throttle-three throttle-count">0</span> have a throttle of 3<br><span class="throttle-four throttle-count">0</span> have a throttle of 4<br><span class="throttle-more throttle-count">0</span> have a throttle of more than 4<br></div><div class="stats-block"><strong>All green ops load</strong>: <span class="green-ops-load">0</span><br><strong>All green ops throttle</strong>: <span class="green-ops-throttle">0</span><br><strong>Green ops open</strong>: <span class="green-ops-open">0</span> <strong class="moar-chat red"></strong></div></div></div>');
    }

    $('.chat__chat-queue .operators').each(function( index ) {

        var opInfo = $(this).find('img').attr('title');
        // var opName = opInfo.substring(0, opInfo.indexOf(' ') + 1);
        if(opInfo.includes('pt-br')) {
            opLang = "pt-br";
        } else if(opInfo.includes(': es') || opInfo.includes(', es')){
            opLang = "es";
        } else {
            opLang = "";
        }
        var opName = opInfo.substring(opInfo.lastIndexOf("(")+1,opInfo.lastIndexOf(")"));
        var opLoadPos = opInfo.indexOf('Load: ');
        var opLoad = opInfo.substr(opLoadPos+6, 1);
        var opThrottlePos = opInfo.indexOf('Throttle: ');
        var opThrottle = opInfo.substr(opThrottlePos+10, 1);
        var opCapacity = opLoad/opThrottle * 100;
        if (opCapacity > 100) {
            opCapacity = 100;
        }
        var opCapLevel = parseInt(opLoad/opThrottle * 10);
        if (opCapLevel > 10) {
            opCapLevel = 'Over';
        }
        $(this).removeClass('capLevel0').removeClass('capLevel1').removeClass('capLevel2').removeClass('capLevel3').removeClass('capLevel4').removeClass('capLevel5').removeClass('capLevel6').removeClass('capLevel7').removeClass('capLevel8').removeClass('capLevel9').removeClass('capLevel10').removeClass('capLevelOver');
        $(this).addClass('capLevel'+opCapLevel);

        if (!$(this).hasClass('hasName')) {
            $(this).addClass('hasName');
            $(this).find('.operator_name').remove();
            $(this).find('img').after('<div class="operator_info" title="'+opLang+'"><span class="operator_name '+opLang+'"></span><div class="operator_load"></div><div class="operator_capacity"><div class="operator_ind"></div></div></div>');
        }

        $(this).find('.operator_name').html(opName);
        $(this).find('.operator_load').html(opLoad+'/'+opThrottle);
        if (opLoad > opThrottle) {
            $(this).find('.operator_load').addClass('red').addClass('highlight');
        } else {
            $(this).find('.operator_load').removeClass('red').removeClass('highlight');
        }
        $(this).find('.operator_ind').css('width',opCapacity+'%');

        if ($(this).hasClass('operators__available')) {
            opsGreen++;
            if (opThrottle == 1) {throttleOne++;}
            if (opThrottle == 2) {throttleTwo++;}
            if (opThrottle == 3) {throttleThree++;}
            if (opThrottle == 4) {throttleFour++;}
            if (opThrottle > 4) {throttleMore++;}
            greenLoad = parseInt(greenLoad) + parseInt(opLoad);
            greenThrottle = parseInt(greenThrottle) + parseInt(opThrottle);
            if (opLoad < opThrottle) {
                var thisOpen = parseInt(opThrottle) - parseInt(opLoad);
                greenOpen = parseInt(greenOpen) + parseInt(thisOpen);
            }
            HEsGreen = HEsGreen + opName + " (" + opLoad + "/" + opThrottle + "), ";
        }

        if ($(this).hasClass('operators__busy')) {
            opsYellow++;
            HEsYellow = HEsYellow + opName + " (" + opLoad + "/" + opThrottle + "), ";
        }
        if ($(this).hasClass('operators__reserve')) {
            opsBlue++;
            blueLoad = parseInt(blueLoad) + parseInt(opLoad);
            blueThrottle = parseInt(blueThrottle) + parseInt(opThrottle);
            if (opLoad < opThrottle) {
                thisOpen = parseInt(opThrottle) - parseInt(opLoad);
                blueOpen = parseInt(blueOpen) + parseInt(thisOpen);
            }
            HEsBlue = HEsBlue + opName + " (" + opLoad + "/" + opThrottle + "), ";
        }
        if ($(this).hasClass('operators__unavailable')) {
            opsRed++;
            HEsRed = HEsRed + opName + " (" + opLoad + "/" + opThrottle + "), ";

        }

        opsAll++;

    });

    $('.all-ops').html(opsAll);
    $('.ops-green').html(opsGreen);
    $('.ops-yellow').html(opsYellow);
    $('.ops-blue').html(opsBlue);
    $('.ops-red').html(opsRed);

    $('.throttle-one').html(throttleOne);
    $('.throttle-two').html(throttleTwo);
    $('.throttle-three').html(throttleThree);
    $('.throttle-four').html(throttleFour);
    $('.throttle-more').html(throttleMore);

    $('.green-ops-load').html(greenLoad);
    $('.green-ops-throttle').html(greenThrottle);
    $('.green-ops-open').html(greenOpen);

    if ((greenLoad >= greenThrottle) && (blueLoad >= blueThrottle)) {
        $('.moar-chat').html('<br>*** MORECHAT ***');
    } else if (greenOpen < 1) {
        $('.moar-chat').html('<br>* GREEN HEs ARE FULL *');
    } else if (greenOpen < 3) {
        $('.moar-chat').html('<br>Green HEs are almost full');
    } else {
        $('.moar-chat').html('');
    }

    if ($('#copyOperatorData').length < 1) {
        $('.chat__chat-queue .capacity__operators').after('<a href="#" class="button" id="hideRedHEs">Hide red HE\'s</a> <a href="#" class="button" id="showRedHEs" style="display: none;">Show red HEs</a> <a href="#" class="button" id="copyOperatorData">Copy Operator Info</a><div id="operatorData"></div>');
    }

    HEsGreen = HEsGreen.slice(0, -2);
    HEsBlue = HEsBlue.slice(0, -2);
    HEsYellow = HEsYellow.slice(0, -2);
    HEsRed = HEsRed.slice(0, -2);

    allHEs = HEsGreen + '\n' + HEsBlue + '\n' + HEsYellow + '\n' + HEsRed + '\n\n';
    allHEs = allHEs + "TOTAL GREEN: " + greenLoad + "/" + greenThrottle + "\n";
    allHEs = allHEs + "TOTAL BLUE: " + blueLoad + "/" + blueThrottle + "\n";
    $('#operatorData').html(allHEs);
}

window.setInterval(function(){
  nameAdd();
}, 5000);

$(document).on('click', '.operators_stats h4', function() {
    $(this).parent().toggleClass('stats_open');
    $(this).parent().find('.operators_all_stats').slideToggle(200);
});

$("body").on('click','#copyOperatorData', function () {
    copyDataToClipboard(document.getElementById("operatorData"));
});

$("body").on('click','#hideRedHEs', function () {
    $('.operators__unavailable').hide();
    $(this).hide();
    $('#showRedHEs').show();
});

$("body").on('click','#showRedHEs', function () {
    $('.operators__unavailable').show();
    $(this).hide();
    $('#hideRedHEs').show();
});


function copyDataToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}
