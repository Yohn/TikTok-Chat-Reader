
const updateCountDown = (time) => {
	const etime = document.getElementById('battle-time')
	const ebar = document.getElementById('battle-bar')
	const totalTime = time
	const t = setInterval(() => {
		const minutes = Math.floor(time / 60)
		const seconds = time % 60
		const sec = seconds < 10 ? '0'+seconds : seconds
		const result = `${parseInt(minutes)}:${sec}`
		const width = parseInt(((totalTime - time)/totalTime)*100) //+'%'
    const wid = parseInt(100-width)
    if(minutes == 0 && seconds < 31){
			ebar.classList.add("bg-warning")
			etime.classList.add("bg-warning")
      if(seconds < 11){
					ebar.classList.add("bg-danger")
					ebar.classList.remove("bg-warning")
					etime.classList.add("bg-danger")
					etime.classList.remove("bg-warning")
      }
    }
		etime.innerHTML = result
		ebar.style.width = wid+'%'
		time--
		if (minutes === 0 && seconds === 0) {
			clearInterval(t)
		}
	}, 1000)
}

String.prototype.removeLast = function(n) {
	var string = this.split('')
	string.length = string.length - n
	return string.join('')
}

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

function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp * 1000);

	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	const nthNumber = (number) => {
		if (number > 3 && number < 21) return "th";
		switch (number % 10) {
			case 1:
			return "st";
			case 2:
			return "nd";
			case 3:
			return "rd";
			default:
			return "th";
		}
	};
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	//var sec = a.getSeconds();
	var add0 = min < 10 ? 0 : ''
	var time = month+' '+date+nthNumber(date)+' '+year+' '+hour+':'+add0+min; // + ':' + sec ;
	return time;
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

function loadNote(title){ // , note
	let box = Array.isArray(Config.notes[title]) ? Config.notes[title][0] : Config.notes[title]
	for(const note in Config['notes']){
		if(Config.notes[note].name == title){
			$('#note-id').val(title)
			$('#new-note-name').val(title)
			$('#new-note-info').val(Config.notes[note].note.replace("<br>", "\n"))
			$('#new-note-form').collapse('show')
			//$('#new-note').slideUp('fast')
			$('#delete-note').slideUp('fast', function(){
				$('#delete-note').attr('data-note-title', title)
					.removeClass('d-none').slideDown('fast')
			})
		}
	}
}

function removeGift(th){
	let t = $(th), gift = t.data('name')
	t.closest('li').slideUp()
	socket.emit('removeGiftSound', {
		gift : gift
	})
}

function playSound(th){
	let t = $(th), url = t.data('url')
	t.find('.s-on').removeClass('d-none')
	t.find('.s-off').addClass('d-none')
	sounds.addSound(url)
}

// Prevent Cross site scripting (XSS)
function sanitize(text) {
	return text ? text.replace(/</g, '&lt;') : ''
}

function updateRoomStats() {
	$('#viewerCountStats').val(parseInt(viewerCount).toLocaleString('en'));
	$('#likeCountStats').val(parseInt(likeCount).toLocaleString('en'));
	$('#diamondsCountStats').val(parseInt(diamondsCount).toLocaleString('en'));
}

function generateUsernameLink(data) {
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
		const emoteImageTag = `<img src="${emoteObj.emoteImageUrl}" alt="emote" class="img-fluid chat-img-emote">`;
		// Insert the image tag at the specified position
		comment = comment.slice(0, position) + emoteImageTag + comment.slice(position);
	});
	return comment;
}
function playText(text) {
	if (speechSynthesis.paused && speechSynthesis.speaking) {
		return speechSynthesis.resume()
	}
	if (speechSynthesis.speaking) return
	utterance.text = text
	utterance.rate = 1 //speedInput.value || 1
	//textInput.disabled = true
	speechSynthesis.speak(utterance)
}
function addChatItem(color, data, text, cont) {
	let container = location.href.includes('obs.html') ? $('.eventcontainer') : $(cont);
	//🚔 👮
	let nickname, badgeLength = data.userBadges.length, afterName = '', b4Name = '';
	if(badgeLength > 0){
		for(let i = 0;i<badgeLength;i++){
			if(data.userBadges[i].type == 'image'){
				afterName += '<img src="'+data.userBadges[i].url+'" class="img-fluid chat-img-badge">';
			} else if(data.userBadges[i].name == 'Moderator'){
				afterName += '👮';
			} else if(data.userBadges[i].badgeSceneType == 8){
				// gifter level
				b4Name += '<span class="gifter-level gifter-level-'+data.userBadges[i].level+'">💎 '+data.userBadges[i].level+'</span>'
			} else if(data.userBadges[i].badgeSceneType == 10){
				// team level
				b4Name += '<span class="team-level team-level-'+data.userBadges[i].level+'">💗 '+data.userBadges[i].level+'</span>'
			} else {

			}
		}
	}
	nickname = data.nickname.replace("'", "\\'")
	let isFoll = '', followInfo
	if(data && typeof data === 'object' && data.followInfo){
		isFoll = data.followInfo.followStatus == 2 ? 'Friends w/ Host'
		: data.followInfo.followStatus == 1 ? 'Following Host' : 'Not Following Host';
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
					<b>${b4Name}${generateUsernameLink(data)}${afterName}:</b>
					<span style="color:${color}">${text}</span>
				</span>
			</div>
		</div>
	</li>`);
	//	 <p>${data.userDetails.bioDescription.replaceAll("'", "&apos;")}</p>
	if(voiceComments == 1){
		playText(text)
	}
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
	//	scrollTop: container[0].scrollHeight
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

	let badgeLength = data.userBadges.length
	let afterName = '';
	let b4Name = '';
	if(badgeLength > 0){
		for(let i = 0;i<badgeLength;i++){
			if(data.userBadges[i].type == 'image'){
				afterName += '<img src="'+data.userBadges[i].url+'" class="img-fluid chat-img-badge">';
			} else if(data.userBadges[i].name == 'Moderator'){
				afterName += '👮';
			} else if(data.userBadges[i].badgeSceneType == 8){
				// gifter level
				b4Name += '<span class="gifter-level gifter-level-'+data.userBadges[i].level+'">💎 '+data.userBadges[i].level+'</span>'
			} else if(data.userBadges[i].badgeSceneType == 10){
				// team level
				b4Name += '<span class="team-level team-level-'+data.userBadges[i].level+'">💗 '+data.userBadges[i].level+'</span>'
			} else {

			}
		}
	}

	let html = `<li class="list-group-item list-group-item-action p-1" data-streakid="${isPendingStreak(data) ? streakId : ''}">
	<div class="row g-2">
		<div class="col-1">
			<img class="w-100 h-auto rounded" src="${data.profilePictureUrl}">
		</div>
		<div class="col-11">
			<p class="fw-bold mb-1">${b4Name} ${generateUsernameLink(data)} ${afterName}:</b> <span>${data.describe} ${giftFor}</span></p>
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

		if(saveGifts == 1){
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

		let sPath = Config["sounds"]["gift"][data["giftName"].toLowerCase()]
			|| Config["sounds"]["gift"]["default"]
		if(playSounds == 1 && Config["enabled"]["gift"] && sPath){
			console.log('play sound?')
			sounds.addSound(sPath)
		}
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


function removeName(th){
	let th2 = $(th), name = th2.data('name')
	socket.emit('removeNames', {
		name : name
	})
}
