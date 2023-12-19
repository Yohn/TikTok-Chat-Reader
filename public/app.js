
// This will use the demo backend if you open index.html locally via file://, otherwise your server will be used
let backendUrl = location.protocol === 'file:' ? "https://tiktok-chat-reader.zerody.one/" : undefined;
let connection = new TikTokIOConnection(backendUrl);
let socket = io();
// (A) LOAD FILE SYSTEM MODU
// Counter
let viewerCount = 0;
let likeCount = 0;
let diamondsCount = 0; let usernames = {};
let userIds = {};
let gifter_ary = [];
let link_ary = {};
let roomId = '';
let uniqueId = '';
let roomDisplayId = '';
let roomDisplayNickname = '';
let roomStart = '';
let roomEnd = '';

function hasClass(elem, className) {
    return elem.classList.contains(className);
}

function calcDate(date1, date2) {
    /*
    * calcDate() : Calculates the difference between two dates
    * @date1 : "First Date in the format MM-DD-YYYY"
    * @date2 : "Second Date in the format MM-DD-YYYY"
    * return : Array
    */

    //new date instance
    const dt_date1 = new Date(date1);
    const dt_date2 = new Date(date2);

    //Get the Timestamp
    const date1_time_stamp = dt_date1.getTime();
    const date2_time_stamp = dt_date2.getTime();

    let calc;

    //Check which timestamp is greater
    if (date1_time_stamp > date2_time_stamp) {
        calc = new Date(date1_time_stamp - date2_time_stamp);
    } else {
        calc = new Date(date2_time_stamp - date1_time_stamp);
    }
    //Retrieve the date, month and year
    const calcFormatTmp = calc.getDate() + '-' + (calc.getMonth() + 1) + '-' + calc.getFullYear();
    //Convert to an array and store
    const calcFormat = calcFormatTmp.split("-");
    //Subtract each member of our array from the default date
    const days_passed = Number(Math.abs(calcFormat[0]) - 1);
    const months_passed = Number(Math.abs(calcFormat[1]) - 1);
    const years_passed = Number(Math.abs(calcFormat[2]) - 1970);

    //Set up custom text
    const yrsTxt = ["year", "years"];
    const mnthsTxt = ["month", "months"];
    const daysTxt = ["day", "days"];

    //Convert to days and sum together
    const total_days = (years_passed * 365) + (months_passed * 30.417) + days_passed;
    const total_secs = total_days * 24 * 60 * 60;
    const total_mins = total_days * 24 * 60;
    const total_hours = total_days * 24;
    const total_weeks = ( total_days >= 7 ) ? total_days / 7 : 0;

    //display result with custom text
    const result = ((years_passed == 1) ? years_passed + ' ' + yrsTxt[0] + ' ' : (years_passed > 1) ?
        years_passed + ' ' + yrsTxt[1] + ' ' : '') +
        ((months_passed == 1) ? months_passed + ' ' + mnthsTxt[0] : (months_passed > 1) ?
            months_passed + ' ' + mnthsTxt[1] + ' ' : '') +
        ((days_passed == 1) ? days_passed + ' ' + daysTxt[0] : (days_passed > 1) ?
            days_passed + ' ' + daysTxt[1] : '');

    //return the result
    return {
        "total_days": Math.round(total_days),
        "total_weeks": Math.round(total_weeks),
        "total_hours" : Math.round(total_hours),
        "total_minutes" : Math.round(total_mins),
        "total_seconds": Math.round(total_secs),
        "result": result.trim()
    }

}

function generateOverlay() {
    let username = $('#uniqueIdInput').val();
    let url = `/obs.html?username=${username}&showLikes=1&showChats=1&showGifts=1&showFollows=1&showJoins=1&bgColor=rgb(24,23,28)&fontColor=rgb(227,229,235)&fontSize=1.3em`;

    if(username) {
        window.open(url, '_blank');
    } else {
        alert("Enter username");
    }
}

// These settings are defined by obs.html
if (!window.settings) window.settings = {};

function sendToDb(table, state, data){
    /*let letData = {
        table: table,
        state: state,
        room: {
            roomId: roomId,
            uniqueId: uniqueId,
            roomDisplayId: roomDisplayId,
            roomDisplayNickname
        },
        "data": data
    }
    //letData.table = table
    //letData.data = data
    $.ajax({
        type: 'POST',
        url: 'https://somewebsites/api/in.php',
        crossDomain: true,
        data: letData,
        dataType: 'text', //'json',
        success: function(responseData, textStatus, jqXHR) {
            //var value = responseData.someKey;
            //console.log(responseData)
            //console.log('/ response')
            //console.log(textStatus)
            //console.log('/ text')
            //console.log(jqXHR)
            //console.log('/ XHR')
        },
        error: function (responseData, textStatus, errorThrown) {
            console.log('POST failed.');
            console.log(responseData)
            console.log('/ response')
            //console.log(textStatus)
            //console.log('/ text')
            //console.log(jqXHR)
            //console.log('/ XHR')
        }
    });*/
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);

    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min; // + ':' + sec ;
    return time;
}

$(document).ready(() => {
    $('#sendToGS').on('click', function(){
        $(this).prop('disabled', true)
        let gt = $('#gifter-table')
        gt.find('.save').removeClass('d-none')
        let rows = gt.html().split("\n"), rowLength = rows.length, a //, fin = text.split("\t")
        let obj = []
        let date2 = new Date();
        for(a=0;a<rowLength;a++){
            let cells = rows[a].split("\t")
            obj.push({
                dat : date2.getMonth()+'/'+date2.getDay()+'/'+date2.getFullYear(),
                username : cells[0],
                nickname : cells[1],
                coinsSent : cells[2],
                userId : cells[3]
            })
        }
        $.post('./gs', obj, function(res){ // {username : 'from here', nickname : 'by me', coinsSent : 400}
            console.log(res)
            $(this).prop('disabled', false)
        })
    })
    $('#copy-table').on('click', function(){
        //console.log('copy btn clicked')
        let gt = $('#gifter-table')
        gt.find('save').removeClass('d-none')
        let text = gt.html(), textarea = document.getElementById('hidden')
        textarea.value = text; //.split("	").join(',');

        //console.log('copy')
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length)
        navigator.clipboard.writeText(textarea.value);
        textarea.setSelectionRange(0,0)
    })
    $('#connectButton').click(connect);
    $('#uniqueIdInput').on('keyup', function (e) {
        if (e.key === 'Enter') {
            connect();
        }
    });

    if (window.settings.username) connect();
	let pops = {
			sanitize: false,
			html: true,
            trigger: 'focus'
		};
	let chatcont = $('#chatcontainer')
	$('#add-row').on('click', function(){
		let row = $('#the-row').html()
		chatcont.prepend(row)
		chatcont.find('li[data-bs-toggle="popover"]:first').popover(pops)
	})
	$('[data-bs-toggle="popover"]').popover(pops);
})

function connect() {
    let uniqueId = window.settings.username || $('#uniqueIdInput').val();
    if (uniqueId !== '') {

        $('#stateText').text('Connecting...');

        connection.connect(uniqueId, {
            enableExtendedGiftInfo: true
        }).then(state => {
            //$('#stateText').text(`Connected to roomId ${state.roomId}`);
            console.log(' -- state --');
            console.log(state)
            console.log(' -- /state --');
            //<span class="input-group-text" id="stats-viewers">Connected to roomId ${state.roomId}</span>
            roomId = state.roomId

            display_start = timeConverter(state.roomInfo.create_time)
            $('#HostInfo').html(`
                <img style="width:75px; max-width:75px;" class="h-auto rounded-circle float-left me-1" src="${state.roomInfo.owner.avatar_thumb.url_list[0]}">
                <h4 class="text-center">
                    ${state.roomInfo.owner.display_id}
                    <br>
                    ${state.roomInfo.owner.nickname}
                    <br>
                    Started: ${display_start}
                </h4>`);
            $('#stateText').text('<h3>Connected</h3>');
            roomDisplayId = state.roomInfo.owner.display_id;
            roomDisplayNickname = state.roomInfo.owner.nickname;
            roomStart = state.roomInfo.create_time

            document.title = roomDisplayId+' - Yohns TikTok Live Chat Analytics Demo Beta 1';

            let all_fans = state.roomInfo.top_fans
                , total_fans = all_fans.length
                , fan_tr = '';
            if(total_fans > 0){
                for(var i=0;i<total_fans;i++){
                    let tick = parseInt(state.roomInfo.top_fans[i].fan_ticket).toLocaleString('en')
                    fan_tr += `
                    <li id="topGiftersDivider"><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="https://tiktok.com/@${state.roomInfo.top_fans[i].user.display_id}" target="_blank">
                        <img alt="top gifters pic" class="h-auto rounded-circle" style="width:45px; max-width:45px;" src="${state.roomInfo.top_fans[i].user.avatar_thumb.url_list[0]}">
                        ${state.roomInfo.top_fans[i].user.nickname}
                        <small>(${tick} coins)</small>
                    </a></li>`;
                    //fan_tr += '<tr><td><a href="'+state.roomInfo.top_fans[i].user.display_id+'"><img src="'+state.roomInfo.top_fans[i].user.avatar_thumb.url_list[0]+'" alt="top gifters pic" class="h-auto rounded-circle" style="width:45px; max-width:45px;"></a></td><td><a href="'+state.roomInfo.top_fans[i].user.display_id+'">'+state.roomInfo.top_fans[i].user.nickname+'</a></td><td>'+state.roomInfo.top_fans[i].fan_ticket+' coins</td></tr>';
                }
                $(fan_tr).insertAfter("#topGiftersDivider")
                //document.getElementById('topGiftersDivider').innerHTML = fan_tr
            }
            // reset stats
            viewerCount = 0;
            likeCount = 0;
            diamondsCount = 0;
            updateRoomStats();

            let g_length = state.availableGifts.length, ii, allGifts = [], html = '';
            for(ii=0;ii<g_length;ii++){
                let list = {
                    id: state.availableGifts[ii].id,
                    diamond_count: state.availableGifts[ii].diamond_count,
                    name: state.availableGifts[ii].name,
                    describe: state.availableGifts[ii].describe,
                    uri: state.availableGifts[ii].icon.uri,
                    url: state.availableGifts[ii].icon.url_list[0],
                }
                allGifts.push(list) //state.availableGifts[i]
            }
            sendToDb('gifts', 'check', allGifts)

            if(roomDisplayId in usernames){} else {
                usernames[roomDisplayId] = {
                    userId : state.roomInfo.owner.id_str,
                    uniqueId : roomDisplayId,
                    nickname : roomDisplayNickname,
                    profilePictureUrl : state.roomInfo.owner.profilePictureUrl
                }
                userIds[state.roomInfo.owner.id_str] = {
                    userId : state.roomInfo.owner.id_str,
                    uniqueId : roomDisplayId,
                    nickname : roomDisplayNickname,
                    profilePictureUrl : state.roomInfo.owner.profilePictureUrl
                }
            }

        }).catch(errorMessage => {
            $('#stateText').text(errorMessage);

            // schedule next try if obs username set
            if (window.settings.username) {
                setTimeout(() => {
                    connect(window.settings.username);
                }, 30000);
            }
        })
    } else {
        alert('no username entered');
    }
}

// Prevent Cross site scripting (XSS)
function sanitize(text) {
    return text ? text.replace(/</g, '&lt;') : ''
}

function updateRoomStats() {
    $('#viewerCountStats').val(parseInt(viewerCount).toLocaleString('en'));
    $('#likeCountStats').val(parseInt(likeCount).toLocaleString('en'));
    $('#diamondsCountStats').val(parseInt(diamondsCount).toLocaleString('en'));
    /*$('#roomStats').html(`
    <div class="input-group mb-3">
        <span class="input-group-text text-light" id="stats-viewers"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M1.981 8.444h20.038c.398 0 .747.264.856.648l1.105 3.904.02.139c0 .209-.127.402-.33.48l-.001.001c-.24.092-.511-.005-.635-.231l-1.144-2.071-.328 7.967c-.017.403-.347.719-.749.719h-.001c-.393 0-.716-.306-.746-.698-.068-.865-.249-2.933-.304-3.752-.022-.34-.271-.54-.541-.54-.242 0-.514.2-.537.54-.055.819-.236 2.887-.304 3.752-.03.392-.352.698-.746.698h-.001c-.402 0-.732-.316-.749-.719-.086-2.08-.435-8.736-.435-8.736h-1.669s-.349 6.656-.435 8.736c-.017.402-.347.719-.749.719h-.001c-.394 0-.716-.306-.746-.698-.068-.865-.249-2.933-.304-3.752-.023-.34-.295-.54-.537-.54h-.004c-.242 0-.515.2-.537.54-.055.819-.236 2.887-.304 3.752-.03.392-.353.698-.746.698h-.001c-.402 0-.732-.316-.749-.719-.086-2.08-.435-8.736-.435-8.736h-1.681s-.349 6.656-.435 8.736c-.017.403-.347.719-.749.719h-.001c-.394 0-.716-.306-.746-.698-.068-.865-.249-2.933-.304-3.752-.023-.34-.295-.54-.537-.54-.27 0-.519.2-.541.54-.055.819-.236 2.887-.304 3.752-.03.392-.353.698-.746.698h-.001c-.402 0-.732-.316-.749-.719l-.328-7.967-1.144 2.071c-.124.226-.395.323-.635.231l-.001-.001c-.203-.078-.33-.271-.33-.48l.02-.139 1.105-3.904c.109-.384.458-.648.856-.648zm3.019-4.444c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm14 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm-6.994 0c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2z"/></svg></span>
        <input readonly id="viewerCountStats" value="${viewerCount.toLocaleString()}" type="text" class="form-control " placeholder="0" aria-label="Viewers" aria-describedby="stats-viewers">
        <span class="input-group-text text-light" id="stats-likes"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4.021 10.688c1.208.172 2.51 1.312 2.979 1.781v-10.514c0-1.08.92-1.955 2-1.955s2 .875 2 1.955v6.058c0 .784.814.885.919.103.216-1.604 2.519-1.817 2.693.399.043.546.726.655.866.027.326-1.444 2.501-1.458 2.758.758.066.579.796.696.848.034.051-.67.281-.934.607-.934 1.098 0 2.309 2.019 2.309 4.41 0 4.295-3 4.306-3 11.19h-10c-.332-3.942-3.462-7.431-6.271-10.241-.488-.488-.729-1.052-.729-1.564 0-.93.759-1.688 2.021-1.507z"/></svg></span>
        <input readonly id="likeCountStats" value="${likeCount.toLocaleString()}" type="text" class="form-control" placeholder="0" aria-label="Likes" aria-describedby="stats-likes">
        <span class="input-group-text text-light" id="stats-viewers"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 1h-11.916l-6.084 7 12 15 12-14.917-6-7.083zm-3.387 8l-2.613 7.839-2.613-7.839h5.226zm-4.588-2l1.969-2.412 1.94 2.412h-3.909zm5.612-1.073l-2.354-2.927h3.33l-.976 2.927zm-7.286-.037l-.964-2.89h3.322l-2.358 2.89zm-1.738 1.11h-3.094l2.236-2.573.858 2.573zm.666 2l2.8 8.397-6.718-8.397h3.918zm9.442 0h3.975l-6.787 8.437 2.812-8.437zm.666-2l.868-2.604 2.206 2.604h-3.074z"/></svg></span>
        <input readonly id="diamondsCountStats" value="${diamondsCount.toLocaleString()}" type="text" class="form-control" placeholder="0" aria-label="Diamonds" aria-describedby="stats-diamonds">
    </div>
    `)
    /*
    Viewers: <b>${viewerCount.toLocaleString()}</b>
    Likes: <b>${likeCount.toLocaleString()}</b>
    Earned Diamonds: <b>${diamondsCount.toLocaleString()}</b> */
}

function generateUsernameLink(data) {
    //console.log('---')
    //console.log(data)
    //console.log('---')
    return `<a href="https://tiktok.com/@${data.uniqueId}" title="${data.nickname}" target="_blank" class="usernamelink">${data.nickname}</a>`; /*<button type="button" class="usernamelink btn btn-link" title="${data.nickname}" data-bs-toggle="popover" onclick="openPop()" data-bs-title="${data.nickname}">${data.uniqueId}</button>`; */
}

function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}

/**
 * Add a new message to the chat container
 */
function insertEmotes(comment, subEmotes) {
    // Sort emotes by placeInComment, in descending order
    subEmotes.sort((a, b) => (b.placeInComment || 0) - (a.placeInComment || 0));

    // Loop through the emotes and splice them into the comment
    subEmotes.forEach(emoteObj => {
        const position = emoteObj.placeInComment || 0;
        const emoteImageTag = `<img src="${emoteObj.emote.image.imageUrl}" alt="emote" class="img-fluid chat-img-emote">`;

        // Insert the image tag at the specified position
        comment = comment.slice(0, position) + emoteImageTag + comment.slice(position);
    });

    return comment;
}
function addChatItem(color, data, text, cont) {
    let container = location.href.includes('obs.html') ? $('.eventcontainer') : $(cont);
    //🚔 👮
    let badgeLength = data.userBadges.length
    let afterName = '';
    if(badgeLength > 0){
        for(let i = 0;i<badgeLength;i++){
            if(data.userBadges[i].name == 'Moderator'){
                afterName += '👮';
            } else if(data.userBadges[i].type == 'image'){
                afterName += '<img src="'+data.userBadges[i].url+'" class="img-fluid chat-img-badge">';
            } else {

            }
        }
    }
    nickname = data.nickname.replace("'", "\\'")
    let isFoll = '', followInfo
    if(data && typeof data === 'object' && data.followInfo){
        isFoll = data.followInfo.followerCount == 2 ? 'Friends' : data.followInfo.followerCount == 1 ? 'Following Host' : 'Not Following Host';
        followInfo = `<div class="input-group my-3">
        <span class="input-group-text w-50 text-center">${data.followInfo.followerCount} Followers</span>
        <span class="input-group-text w-50 text-center">${data.followInfo.followingCount} Following</span>
      </div>`;
    }
    container.prepend(`
    <li class="list-group-item list-group-item-action px-1 pt-2 pb-1" title="${data.nickname}" data-bs-title="${data.nickname}" data-bs-toggle="popover" data-bs-content='<div class="row">
    <div class="col-4"><img class="w-100 h-auto rounded-circle" src="${data.profilePictureUrl}"></div>
    <div class="col-8">
        <h3 style="white-space:pre;">${data.nickname.replaceAll("'", "&apos;")}</h3><h5 style="white-space:pre;">@${data.uniqueId}</h5>
        <div class="bg-dark-subtle p-3 text-emphasis-dark border border-light-subtle">
            ${isFoll}
        </div>
    </div>
  </div>
  <div class="d-grid gap-2 col-12 mx-auto">
    ${followInfo}
    <a href="https://tiktok.com/@${data.uniqueId}" title="${data.nickname.replaceAll("'", "&apos;")}"   target="_blank" class="btn btn-primary">View TikTok</a>
  </div>'>
        <div class="row g-1 d-table">
            <div class="col-2 col-sm-1 d-table-cell align-top">
                <img class="w-100 h-auto rounded-circle" src="${data.profilePictureUrl}">
            </div>
            <div class="col-10 col-sm-11 d-table-cell align-middle">
                <span>
                    <b>${generateUsernameLink(data)}${afterName}:</b>
                    <span style="color:${color}">${text}</span>
                </span>
            </div>
        </div>
    </li>`);
    //     <p>${data.userDetails.bioDescription.replaceAll("'", "&apos;")}</p>

  container.find('li[data-bs-toggle="popover"]:first').popover({
		sanitize: false,
		html: true,
        customClass: 'user-pop',
        //trigger: 'click',
        //delay: {"show": 200, "hide": 500}
	}).on('show.bs.popover', () => {
        $('li[data-bs-toggle="popover"]').not($(this)).popover('hide');
        setTimeout(function(){
            $('li[data-bs-toggle="popover"]').popover('hide');
        },10000)
    })
    container.find('[data-bs-toggle="tooltip"]:first').tooltip()
    //new bootstrap.Tooltip(this)
    //container.stop();
    //container.animate({
    //    scrollTop: container[0].scrollHeight
    //}, 400);
    if(data.uniqueId in usernames){} else {
        //let tempuname = {};
        usernames[data.uniqueId] = {
            userId : data.userId,
            uniqueId : data.uniqueId,
            nickname : data.nickname,
            profilePictureUrl : data.profilePictureUrl
        }
        userIds[data.userId] = {
            userId : data.userId,
            uniqueId : data.uniqueId,
            nickname : data.nickname,
            profilePictureUrl : data.profilePictureUrl
        }
    }
}

function addShareItem(color, data, text, cont) {
    let container = $('.sharecontainer'), sans = sanitize(text);
    container.prepend(`<li class="list-group-item p-1">
        <div class="static">
            <img class="miniprofilepicture" src="${data.profilePictureUrl}">
            <span>
                <b>${generateUsernameLink(data)}:</b>
                <span style="color:${color}">${sans}</span>
            </span>
        </div>
    </li>`);
    if(data.uniqueId in usernames){} else {
        //let tempuname = {};
        usernames[data.uniqueId] = {
            userId : data.userId,
            uniqueId : data.uniqueId,
            nickname : data.nickname,
            profilePictureUrl : data.profilePictureUrl
        }
        userIds[data.userId] = {
            userId : data.userId,
            uniqueId : data.uniqueId,
            nickname : data.nickname,
            profilePictureUrl : data.profilePictureUrl
        }
    }
    sendToDb('share', 'shared', {
        timestamp: data.timestamp,
        sharer: userIds[data.userId],
        count: sans
    })
}
/**
 * Add a new gift to the gift container
 */
function addGiftItem(data) {
    let container = location.href.includes('obs.html') ? $('.eventcontainer') : $('.giftcontainer');
    if(data.uniqueId in usernames){} else {
        //let tempuname = {};
        usernames[data.uniqueId] = {
            userId : data.userId,
            uniqueId : data.uniqueId,
            nickname : data.nickname,
            profilePictureUrl : data.profilePictureUrl
        }
        userIds[data.userId] = {
            userId : data.userId,
            uniqueId : data.uniqueId,
            nickname : data.nickname,
            profilePictureUrl : data.profilePictureUrl
        }
    }
    let streakId = data.uniqueId.toString() + '_' + data.giftId;
    let isPending = isPendingStreak(data)
    let diamonds = data.diamondCount * data.repeatCount
    let diamondsLocal = parseInt(data.diamondCount * data.repeatCount).toLocaleString()

    /*test */
    let giftFor = '', tapName = '';
    if(data.receiverUserId in userIds){
        giftFor = 'to '+generateUsernameLink(userIds[data.receiverUserId]);
    }

    let html = `<li class="list-group-item list-group-item-action p-1" data-streakid="${isPendingStreak(data) ? streakId : ''}">
    <div class="row g-2">
        <div class="col-1">
            <img class="w-100 h-auto rounded" src="${data.profilePictureUrl}">
        </div>
        <div class="col-11">
            <p class="fw-bold mb-1">${generateUsernameLink(data)}:</b> <span>${data.describe} ${giftFor}</span></p>
            <div class="row g-1">
                <div class="col-2">
                    <img class="w-100 h-auto rounded-circle" src="${data.giftPictureUrl}">
                </div>
                <div class="col-10">
                    <span>Name: <b>${data.giftName}</b> (ID:${data.giftId})<span><br>
                    <span>Repeat: <b style="${isPending ? 'color:red' : ''}">x${data.repeatCount.toLocaleString()}</b><span><br>
                    <span>Cost: <b>${diamondsLocal} Diamonds</b><span>
                </div>
            </div>
        </div>
    </div>
    </li>`;


    let existingStreakItem = container.find(`[data-streakid='${streakId}']`);

    if (existingStreakItem.length) {
        existingStreakItem.replaceWith(html);
    } else {
        container.prepend(html);
    }


    if(!isPending){
        let gifter = data.uniqueId;
        if(gifter in gifter_ary){
            gifter_ary[gifter].coins = parseInt(gifter_ary[gifter].coins)+parseInt(diamonds);
            $('[data-gifter="'+gifter+'"]').remove()
        } else {
            gifter_ary[gifter] = {
                username: data.nickname,
                uniqueId: data.uniqueId,
                userId: data.userId,
                coins: diamonds,
                likes: 0,
                shares: 0
            }
        }
        let gifterTable = $('#gifter-table tbody')
        //let tline = gifter_ary[gifter].username+','+gifter_ary[gifter].uniqueId+','+gifter_ary[gifter].coins+"\n";
        gifterTable.prepend(`
            <tr data-gifter="${gifter}">
                <td class="col-5 text-break">${gifter_ary[gifter].username}</td>
                <td class="col-5 text-break">${gifter_ary[gifter].uniqueId}</td>
                <td class="col-2 text-break">${parseInt(gifter_ary[gifter].coins).toLocaleString('en')}</td>
                <td class="d-none save">${gifter_ary[gifter].userId}</td>
                <td class="d-none">${gifter_ary[gifter].likes}</td>
            </tr>
        `)

        socket.emit('addGift', {
            giftId: data.giftId,
            userId: data.userId,
            giftName: data.giftName,
            uniqueId: data.uniqueId,
            nickname: data.nickname,
            timestamp: data.timestamp,
            repeatCount: data.repeatCount,
            receiverUser: data.receiverUserId in userIds ? userIds[data.receiverUserId].nickname : '',
            receiverUserId: data.receiverUserId,
            diamondCount: diamondsLocal,
            giftPictureUrl: data.giftPictureUrl,
            profilePictureUrl: data.profilePictureUrl,
        });
    }
}

function addLikeItem(color, data, text, summarize) {
    let container = $('.likecontainer');
    //let tt = sanitize(text);
    //console.log(tt);
    if (container.find('div').length > 500) {
        container.find('div').slice(0, 200).remove();
    }
    //container.find('.temporary').remove();
    if(text != ''){
        container.prepend(`<li class="list-group-item list-group-item-action p-1">
            <div class=${summarize ? 'temporary' : 'static'}>
                <img class="miniprofilepicture" src="${data.profilePictureUrl}">
                <span>
                    <b>${generateUsernameLink(data)}:</b>
                    <span style="color:${color}">${sanitize(text)}</span>
                </span>
            </div>
        </li>`);
    }
}

function updateTopGifters(viewers){
    let container = $('#topViewers')
    container.html('Loading Gifters...')
    if(viewers.length > 0){
        let cc = 0, i, top = '', rest = '', drop = `<li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false"></a>
            <ul class="dropdown-menu" style="width:250px;">
        `, drop_end = `</ul></li>`
        for(i=0;i<viewers.length;i++){
            if("nickname" in viewers[i].user){
                if(i < 2){
                    top += `<li class="nav-item">
                        <a class="nav-link" aria-current="page" href="https://tiktok.com/@${viewers[i].user.uniqueId}" target="_blank">
                            <img style="width:45px; max-width:45px;" class="h-auto rounded-circle" src="${viewers[i].user.profilePictureUrl}">
                            ${viewers[i].user.uniqueId}
                            <small>(${viewers[i].coinCount} coins)</small>
                        </a>
                    </li>`
                }
                drop += `<li class="nav-item border-bottom">
                    <a class="nav-link" aria-current="page" href="https://tiktok.com/@${viewers[i].user.uniqueId}" target="_blank">
                        <img style="width:45px; max-width:45px;" class="h-auto rounded-circle" src="${viewers[i].user.profilePictureUrl}">
                        ${viewers[i].user.uniqueId}
                        <small>(${viewers[i].coinCount} coins)</small>
                    </a>
                </li>`

                if(parseInt(viewers[i].coinCount) > 0
                    && typeof viewers[i].user.username != undefined
                    && viewers[i].user.username != 'undefined'
                    && viewers[i].user.username != ''
                    && viewers[i].user.username != null){
                    let gifter = viewers[i].user.uniqueId;

                    if(msg.uniqueId in usernames){} else {
                        //let tempuname = {};
                        usernames[viewers[i].user.uniqueId] = {
                            userId : viewers[i].user.userId,
                            uniqueId : viewers[i].user.uniqueId,
                            nickname : viewers[i].user.nickname,
                            profilePictureUrl : viewers[i].user.profilePictureUrl
                        }
                        userIds[viewers[i].user.userId] = {
                            userId : viewers[i].user.userId,
                            uniqueId : viewers[i].user.uniqueId,
                            nickname : viewers[i].user.nickname,
                            profilePictureUrl : viewers[i].user.profilePictureUrl
                        }
                    }

                    if(gifter in gifter_ary){
                        gifter_ary[gifter].coins = parseInt(viewers[i].coinCount);
                        $('[data-gifter="'+gifter+'"]').remove()
                    } else {
                        gifter_ary[gifter] = {
                            username: viewers[i].user.nickname,
                            uniqueId: viewers[i].user.uniqueId,
                            userId: viewers[i].user.userId,
                            coins: parseInt(viewers[i].coinCount),
                            likes: 0,
                            shares: 0
                        }

                    }
                    let gifterTable = $('#gifter-table tbody')
                    //let tline = gifter_ary[gifter].username+','+gifter_ary[gifter].uniqueId+','+gifter_ary[gifter].coins+"\n";
                    gifterTable.prepend(`
                        <tr data-gifter="${gifter}">
                            <td>${gifter_ary[gifter].username}</td>
                            <td>${gifter_ary[gifter].uniqueId}</td>
                            <td>${gifter_ary[gifter].coins}</td>
                            <td class="d-none save">${gifter_ary[gifter].userId}</td>
                            <td class="d-none">${gifter_ary[gifter].likes}</td>
                        </tr>
                    `)
                }
            }
        }
        container.html('<ul class="nav nav-pills">'+top+drop+drop_end+'</ul>');
        //console.log(top)

    } else {
        container.html('no viewers..?')
        //console.log('no viewers')
    }
}



// viewer stats
connection.on('roomUser', (msg) => {
    //console.log('-- roomUser --')
    //console.log(msg)
    //console.log('-- roomUser --')
    if (typeof msg.viewerCount === 'number') {
        viewerCount = msg.viewerCount;
        updateRoomStats();
        updateTopGifters(msg.topViewers);
    }
})

// like stats
connection.on('like', (msg) => {
    //console.log('-- likes --')
    //console.log(msg)
    //console.log('-- /likes --')
    if (typeof msg.totalLikeCount === 'number') {
        likeCount = msg.totalLikeCount;
        updateRoomStats();
    }

    if (window.settings.showLikes === "0") return;

    if (typeof msg.likeCount === 'number') {
        var uname = msg.uniqueId;
        if(uname in link_ary){
            link_ary[uname] = link_ary[uname]+1
        } else {
            link_ary[uname] = 1
        }

        let tlike = $('#likestotalcontainer,#alltotalcontainer')
        $(`[data-uname="${msg.uniqueId}"]`).remove()
        let thename = generateUsernameLink(msg)
        tlike.prepend(`
        <li data-uname="${msg.uniqueId}" class="list-group-item list-group-item-action px-1 pt-2 pb-1">
            <div class="row g-1 d-table">
                <div class="col-2 col-sm-1 d-table-cell align-top">
                    <img class="w-100 h-auto rounded-circle" src="${msg.profilePictureUrl}">
                </div>
                <div class="col-10 col-sm-11 d-table-cell align-middle">
                    <span>
                        <b>${thename}:</b>
                        <span style="color:#447dd4"> sent ${link_ary[uname]} likes</span>
                    </span>
                </div>
            </div>
        </li>`)
        if(msg.uniqueId in usernames){} else {
            //let tempuname = {};
            usernames[msg.uniqueId] = {
                userId : msg.userId,
                uniqueId : msg.uniqueId,
                nickname : msg.nickname,
                profilePictureUrl : msg.profilePictureUrl
            }
            userIds[msg.userId] = {
                userId : msg.userId,
                uniqueId : msg.uniqueId,
                nickname : msg.nickname,
                profilePictureUrl : msg.profilePictureUrl
            }
        }
    }
})

// Member join
let joinMsgDelay = 0;
connection.on('member', (msg) => {
    //console.log('-- member --')
    //console.log(msg)
    //console.log('-- member --')
    if (window.settings.showJoins === "0") return;

    let addDelay = 250;
    if (joinMsgDelay > 500) addDelay = 100;
    if (joinMsgDelay > 1000) addDelay = 0;

    joinMsgDelay += addDelay;

    setTimeout(() => {
        joinMsgDelay -= addDelay;
        addChatItem('#21b2c2', msg, msg.label.replace('{0:user}', ''), '#joinstotalcontainer,#alltotalcontainer'); //.joincontainer');
    }, joinMsgDelay);
    //
    sendToDb('member', 'join', {
        userId:     msg.userId,
        uniqueId:   msg.uniqueId,
        nickname:   msg.nickname,
        timestamp:  msg.createTime,
        profilePictureUrl: msg.profilePictureUrl,
        displayType: msg.displayType
    })
    if(msg.uniqueId in usernames){} else {
        //let tempuname = {};
        usernames[msg.uniqueId] = {
            userId : msg.userId,
            uniqueId : msg.uniqueId,
            nickname : msg.nickname,
            profilePictureUrl : msg.profilePictureUrl
        }
        userIds[msg.userId] = {
            userId : msg.userId,
            uniqueId : msg.uniqueId,
            nickname : msg.nickname,
            profilePictureUrl : msg.profilePictureUrl
        }
    }
})

// New chat comment received
connection.on('chat', (msg) => {
    console.log('-- chat --')
    console.log(msg)
    console.log('-- chat --')
    if (window.settings.showChats === "0") return;

    let msgcom = msg.hasOwnProperty('subemotes') ? insertEmotes(sanitize(msg.comment), msg.subemotes) : sanitize(msg.comment);
    addChatItem('', msg, msgcom, '.chatcontainer');
})

// New gift received
connection.on('gift', (data) => {
  //if(data.giftName == 'Gift Box'){
    console.log('-- gift --')
    console.log(data)
    console.log('-- gift --')
  //}
    if (!isPendingStreak(data) && data.diamondCount > 0) {
        diamondsCount += (data.diamondCount * data.repeatCount);
        updateRoomStats();
    }

    if (window.settings.showGifts === "0") return;

    addGiftItem(data);
})
// share, follow
connection.on('social', (data) => {
    //console.log('-- social --')
    //console.log(data)
    //console.log('-- social --')
    if (window.settings.showFollows === "0") return;

    let color = data.displayType.includes('follow') ? '#ff005e' : '#2fb816';
    let conta = data.displayType.includes('follow') ? '#followstotalcontainer,#alltotalcontainer' : '#sharestotalcontainer,#alltotalcontainer';
    addChatItem(color, data, data.label.replace('{0:user}', ''), conta); //'.sharecontainer');

})

connection.on('questionNew', (data) => {
    console.log('questionNew')
    console.log(data)
    console.log('/questionNew')
})
let battleStats = $('#battleParties')
connection.on('linkMicBattle', (data) => {
    //console.log('/linkMicBattle')
    //console.log(data)
    //console.log('linkMicBattle')
    let peopleSpan = 6
    if(data.battleUsers.length == 4){
        peopleSpan = 3
    }
    let i, str = '<div class="card-body" id="battleParties"><div class="battle-row hide">'
        +'<div class="row">'
            +'<div class="col-6 mb-3 text-center">'
                +'<big class="badge text-bg-primary" id="battle-team-1"></big></div>'
            +'<div class="border-start col-6 mb-3 text-center">'
                +'<big class="badge text-bg-primary" id="battle-team-2"></big></div>'
        +'</div><div class="row">';
    for(i=0;i<data.battleUsers.length;i++){
        str += '<div class="col-'+peopleSpan+' text-center"><a href="https://www.tiktok.com/@'+data.battleUsers[i].uniqueId+'" target="_blank">'
        +'<img src="'+data.battleUsers[i].profilePictureUrl+'" class="rounded-circle" style="max-height:75px; width:auto;">'
        +'<br>'+data.battleUsers[i].uniqueId+'</a><br>'
        +'<big class="badge text-bg-primary" id="battle-'+data.battleUsers[i].userId+'"></big></div>'
    }
    str += '</div></div></div>'
    console.log(str)
    $('#battleParties').html(str)
    console.log('inserted battle stuff..')
})

connection.on('linkMicArmies', (data) => {
    //console.log('linkMicArmies')
    //console.log(data)
    //console.log('/linkMicArmies')
    let i;
    //$('#battleStats').removeClass('d-none')
    for(i=0;i<data.battleArmies.length;i++){
        $('#battle-'+data.battleArmies[i].hostUserId).html(data.battleArmies[i].points)
    }
    console.log('inserted info')
    /*
{
  "battleStatus": 3,
  "battleArmies": [
    {
      "hostUserId": "7157616909898531867",
      "points": 12,
      "participants": [
        {
          "userId": "7129370635487708161",
          "secUid": "",
          "nickname": "🌲For ever🌲",
          "profilePictureUrl": null,
          "userBadges": [],
          "userDetails": {
            "createTime": "0",
            "bioDescription": ""
          },
          "isModerator": false,
          "isNewGifter": false,
          "isSubscriber": false,
          "topGifterRank": null
        },
        {
          "userId": "6913656025014993922",
          "secUid": "",
          "nickname": "ramildegoma",
          "profilePictureUrl": null,
          "userBadges": [],
          "userDetails": {
            "createTime": "0",
            "bioDescription": ""
          },
          "isModerator": false,
          "isNewGifter": false,
          "isSubscriber": false,
          "topGifterRank": null
        }
      ]
    },
    {
      "hostUserId": "7175748192565265435",
      "points": 21,
      "participants": [
        {
          "userId": "7102300554365338629",
          "secUid": "",
          "nickname": "noushi389",
          "profilePictureUrl": null,
          "userBadges": [],
          "userDetails": {
            "createTime": "0",
            "bioDescription": ""
          },
          "isModerator": false,
          "isNewGifter": false,
          "isSubscriber": false,
          "topGifterRank": null
        },
        {
          "userId": "6877725127146374146",
          "secUid": "",
          "nickname": "Ms. Single💔",
          "profilePictureUrl": null,
          "userBadges": [],
          "userDetails": {
            "createTime": "0",
            "bioDescription": ""
          },
          "isModerator": false,
          "isNewGifter": false,
          "isSubscriber": false,
          "topGifterRank": null
        }
      ]
    }
  ]
}
    {
  "hostUserId": "7005525148082390022",
  "points": 124911,
  "participants": [
    {
      "userId": "6989266413383746566",
      "secUid": "",
      "nickname": "Santa_Chris",
      "profilePictureUrl": null,
      "userBadges": [],
      "userDetails": {
        "createTime": "0",
        "bioDescription": ""
      },
      "isModerator": false,
      "isNewGifter": false,
      "isSubscriber": false,
      "topGifterRank": null
    },
    {
      "userId": "6814348056319443973",
      "secUid": "",
      "nickname": "Danny 🥵🇭🇳",
      "profilePictureUrl": null,
      "userBadges": [],
      "userDetails": {
        "createTime": "0",
        "bioDescription": ""
      },
      "isModerator": false,
      "isNewGifter": false,
      "isSubscriber": false,
      "topGifterRank": null
    },
    {
      "userId": "6770103586569143301",
      "secUid": "",
      "nickname": "Steph ❤️",
      "profilePictureUrl": null,
      "userBadges": [],
      "userDetails": {
        "createTime": "0",
        "bioDescription": ""
      },
      "isModerator": false,
      "isNewGifter": false,
      "isSubscriber": false,
      "topGifterRank": null
    }
  ]
}*/
})
connection.on('liveIntro', (data) => {
    //console.log('liveIntro')
    //console.log(data)
    //console.log('/liveIntro')

    addChatItem('#ff00cc', data, data.description, '.chatcontainer');

    if(data.uniqueId in usernames){} else {
        usernames[data.uniqueId] = {
            userId : data.userId,
            uniqueId : data.uniqueId,
            nickname : data.nickname,
            profilePictureUrl : data.profilePictureUrl
        }
        userIds[data.userId] = {
            userId : data.userId,
            uniqueId : data.uniqueId,
            nickname : data.nickname,
            profilePictureUrl : data.profilePictureUrl
        }
    }
})

connection.on('emote', (data) => {
    console.log('emote')
    console.log(data)
    console.log('/emote')
})
connection.on('envelope', (data) => {
    console.log('envelope')
    console.log(data)
    console.log('/envelope')
})
connection.on('subscribe', (data) => {
    console.log('subscribe')
    console.log(data)
    console.log('/subscribe')
})
//connection.on('rawData', (data) => { //(messageTypeName, binary) => {
//    console.log('Raw Data')
//    console.log(data);
//    console.log('/Raw Data')
//})

connection.on('streamEnd', (actionId) => {
    let msg = 'Stream Ended';
    if (actionId === 3) {
        let msg = 'Stream ended by user';
    }
    if (actionId === 4) {
        let msg = 'Stream ended by platform moderator (ban)';
    }
    //let tim = Date.now();
    //var a = new Date(roomStart * 1000);
    //let diff = calcDate(tim,a);
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes(); // + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    //document.getElementById('dt').innerHTML = dateTime
    $('#stateText').text(msg+'<br>Ended At: '+dateTime);

    // schedule next try if obs username set
    if (window.settings.username) {
        setTimeout(() => {
            connect(window.settings.username);
        }, 30000);
    }
})