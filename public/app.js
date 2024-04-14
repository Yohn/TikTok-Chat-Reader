
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

let playSounds = 1;
let saveGifts = 1;
let voiceComments = 1;

let ttn = [];

let select2Options = {
	theme: 'bootstrap-5',
	dropdownParent: $('#soundModal')
}


function connect() {
	let uniqueId = window.settings.username || $('#uniqueIdInput').val();


	if(uniqueId !== ''){
		if(!Config.names.includes(uniqueId)){
			socket.emit('addToNames', {
				name : uniqueId
			})
		}
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
			// for sounds

			display_start = timeConverter(state.roomInfo.create_time)
			$('#HostInfo').html(`
				<div class="row">
					<div class="col-6">
						<div class="fs-4 text-center">
							${state.roomInfo.owner.nickname}
						</div>
						<img class="h-auto rounded-circle float-left me-2" src="${state.roomInfo.owner.avatar_thumb.url_list[0]}">
						<div class="fs-4 text-center">
							@${state.roomInfo.owner.display_id}
							<br>
							Started: ${display_start}
						</div>
					</div>
					<div class="col-6">
						<div class="p-1 m-2 bg-secondary-subtle text-secondary-emphasis border rounded">
							${state.roomInfo.owner.bio_description.replace("\n", "<br>")}
						</div>
					</div>
				</div>`);
			$('#stateText').html('<h4 class="mb-0">Connected</h4>');
			roomDisplayId = state.roomInfo.owner.display_id;
			roomDisplayNickname = state.roomInfo.owner.nickname;
			roomStart = state.roomInfo.create_time

			document.title = roomDisplayId+' - Yohns TikTok Live Chat Analytics Demo Beta 3';

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

			let g_length = state.availableGifts.length, ii, allGifts = [], html = ''
			, giftDrop = '';
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
				giftDrop += `<option value="${list.name}" data-coins="${list.diamond_count}" data-img="${list.url}">${list.name}</option>`
			}
			//console.log(allGifts)
			//var data = $.map(giftDrop, function (obj, two) {
			//	obj.text = obj.text || obj.name; // replace name with the property used for the text
			//	obj.oid = obj.id
			//	obj.id = obj.name
			//	return obj;
			//});
			function select2Gifts(state){
				if (!state.id) {
					return state.text;
				}
				//console.log('-- select2 gifts ---')
				//console.log(state)
				//console.log('-- /select2 gifts ---')
				// <img src="sounds/${state.element.value}" class="img-flag" />
				const coins = state.element.dataset.coins
				const img = state.element.dataset.img
				var $state = $(`<div><img src="${img}" alt=" "> ${state.text} <span>${coins} coins</span></div>`);
				return $state;
			}
			$('#group-gift').html(giftDrop).select2({
				//data : data,
				templateResult: select2Gifts,
				templateSelection: select2Gifts
			}).trigger('change')
			$('#save-gift-sound').attr('disabled', false)
			//sendToDb('gifts', 'check', allGifts)

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

			// the scores when connected
			//? state.link_mic.battle_scores
				/*[
						{
							"score": 15193,
							"user_id": 7028441764432709000
						},
						{
							"score": 111,
							"user_id": 6932573195062085000
						}
					],*/
			//? state.link_mic.battle_settings
				/*{
					"battle_id": 7357466536107855000,
					"channel_id": 7357464768338349000,
					"duration": 301,
					"finished": 0,
					"match_type": 0,
					"start_time": 1713043672,
					"start_time_ms": 1713043672732,
					"theme": ""
				},*/
			//? state.link_mic.rival_anchor_id": 6932573195062085000,
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


String.prototype.removeLast = function(n) {
	var string = this.split('')
	string.length = string.length - n
	return string.join('')
}

let playingSound = false, soundQue = []

// These settings are defined by obs.html
if (!window.settings) window.settings = {};


const utterance = new SpeechSynthesisUtterance()
let currentCharacter
utterance.addEventListener('boundary', e => {
	currentCharacter = e.charIndex
})

Config.updateConfig();

const userCog = $('#userCog')
$(document).ready(() => {
	$('#delete-note').on('click', ()=>{
		let name = $('#note-id').val()
		console.log(name)
		socket.emit('deleteNote', {
			name: name
		})
	})
	$('#save-gift-sound').on('click', () => {
		let gift = $('#group-gift').val(), sound = $('#group-sound').val()
		socket.emit('saveGiftSound', {
			gift: gift,
			sound: '/sounds/'+sound
		})
	})
	$('#play-gift-sound').on('click', () => {
		let sfile = $('#group-sound').val()
		let announcement = new Announcement(
			'/sounds/'+sfile
		);
		announcement.sound();
	})
	$('#new-note').on('click', function(){
		$('#note-id').val('new')
		$('#delete-note').slideUp('fast')
		$('#new-note-name').val('')
		$('#new-note-info').val('')
		$('#new-note-form').collapse('show')
	})
	$('#save-note').on('click', function(){
		let id = $('#note-id').val(),
		name = $('#new-note-name'),
		info = $('#new-note-info'),
		error = false,
		box = ''
		if(name.val() == ''){
			error = true
			name.addClass('is-invalid')
		} else {
			name.removeClass('is-invalid')
		}
		if(name.val() == 'new'){
			error = true
			name.addClass('is-invalid')
		}
		if(info.val() == ''){
			error = true
			info.addClass('is-invalid')
		} else {
			info.removeClass('is-invalid')
		}
		if(error == false){
			let na2 = name.val().replace("'", "\'").replace('"', '\"')
				, no2 = info.val()
			socket.emit('saveNote', {
				id: id,
				name: na2,
				note: no2
			})
			if(id == 'new'){
				$('#note-list').html(`<button type="button" class="m-2 btn btn-outline-secondary"'
					+'onclick="loadNote('${na2}')">${na2}</button>
					${$('#note-list').html()}`
				// , \''+no2.replace("<br>", "\n")+'\'
				)
			} else {
				//$(`#note-list button[onclick="loadNote('${na2}')]`)
			}
			$('#new-note-form').collapse('hide')
			$('#note-id').val('new')
			$('#new-note-name').val('')
			$('#new-note-info').val('')
			Config.updateConfig();
			//if(Array.isArray(json['notes'][note])){
			//	box = json['notes'][note][0].replace("'", "\'")
			//} else {
			//	box = json['notes'][note].replace("'", "\'")
			//}
		}
	})
	$('#add-username').on('click', function(){
		let name = $('#new-username'), uname = name.val()
		if(uname == ''){
			// make error
			name.addClass('is-invalid')
		} else {
			if(Config.names.includes(uname)){

			} else {
				name.removeClass('is-invalid')
				socket.emit('addToNames', {
					name : uname
				})
			}
		}
	})
	$('#vc-on').on('click', function(){
		voiceComments = 2
		$('#vc-on').addClass('d-none')
		$('#vc-off').removeClass('d-none')
	})
	$('#vc-off').on('click', function(){
		voiceComments = 1
		$('#vc-off').addClass('d-none')
		$('#vc-on').removeClass('d-none')
	})
	$('#s-on').on('click', function(){
		playSounds = 2
		$('#s-on').addClass('d-none')
		$('#s-off').removeClass('d-none')
	})
	$('#s-off').on('click', function(){
		playSounds = 1
		$('#s-off').addClass('d-none')
		$('#s-on').removeClass('d-none')
	})
	$('#g-on').on('click', function(){
		saveGifts = 2
		$('#g-on').addClass('d-none')
		$('#g-off').removeClass('d-none')
	})
	$('#g-off').on('click', function(){
		saveGifts = 1
		$('#g-off').addClass('d-none')
		$('#g-on').removeClass('d-none')
	})
	$('#ch').on('click', function(){

		socket.emit('addToNames', {
			name : 'another name'
		})
		console.log('playSounds = '+playSounds)
		console.log('saveGifts = '+saveGifts)
		console.log('------------')
	})
	$('#userSignUpLink').on('click', function(){
		bootstrap.showAlert({title: "Sign Up Closed", body: "During testing phases, our sign up process will be closed. If you would like to test some new features, please contact Yohn."})
	})

	$('#userLogin').on('click', function(){
		userCog.find('.switch-toggle').toggleClass('d-none')
		socket.emit('userLogin', {
			email : $('#userEmail').val(),
			pass : $('#userPassword').val()
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


//socket.on('readUsernames', (data) => {
//	console.log(data)
//})

socket.on('toDoData', (data) => {
	console.log(data)
})
socket.on('removeGiftSound', (data) => {
	console.log(data)
})
socket.on('saveGiftSound', (data) => {
	console.log(data)
})
socket.on('deleteNote', (data) => {
	$('#note-results').html(`<div class="alert alert-secondary mt-3" role="alert">
		${data.r}
	</div>`).collapse('show')
	$('#note-id').val('new')
	$('#new-note-name').val('')
	$('#new-note-info').val('')
	$('#new-note-form').collapse('hide')
	$('#delete-note').slideUp('fast')
	setTimeout(function(){
		$('#note-results').collapse('hide')
		//Config.updateConfig();
		Config.grabConfig('notes')
	}, 2000)
})
socket.on('saveNote', (data) => {
	$('#note-results').html(`<div class="alert alert-secondary mt-3" role="alert">
		${data.r}
	</div>`).collapse('show')
	setTimeout(function(){
		$('#note-results').collapse('hide')
		//Config.updateConfig();
		Config.grabConfig('notes')
	}, 5000)
})
socket.on('addToNames', (data) => {
	console.log('-----addToNames return-----')
	console.log(data)
	$('#name-list').prepend(`<li data-list-name="${data.name}"
		class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
		${data.name}
		<span class="badge text-bg-primary rounded-pill c-pointer"
		data-name="${data.name}" onclick="removeName(this)">🗑️</span>
	</li>`)
	console.log('-----addToNames return-----')
})
socket.on('removeNames', (data) => {
	console.log('-----removeNames return-----')
	console.log(data)
	console.log('-----removeNames return-----')
	$('li[data-list-name="'+data.name+'"]').slideUp('fast', function(){$(this).remove();})
})
socket.on('soundDirectory', (data) => {
	for(const sound in data.files){
		$('#group-sound').append(`<option value="${data.files[sound]}">${data.files[sound].removeLast(4)}</option>`)
	}

	$('#group-sound')
	.select2({
		theme: 'bootstrap-5',
		dropdownParent: $('#soundModal')
	}).trigger('change')
})
socket.on('loginTry', (data) => {
	userCog.find('.switch-toggle').toggleClass('d-none')
	if(data.r == 'ok'){
		console.log('logged in successful')
		console.log(data)
		console.log('/login in data')
		let list = JSON.parse(data.info.userList)
			, userListLen = list.length, u, usersHtml = '', userTags = '';
		if(userListLen > 0){
			for(u=0;u<userListLen;u++){
				usersHtml += '<option value="'+list[u]+'"></option>';
			}
			$('#datalistOptions').html(usersHtml);
		}
		$('#settingLoginLi').html(`<li>
			<a class="dropdown-item" href="#" id="moAutofillHost">Autofill Hosts</a>
		</li>
		<li>
			<a class="dropdown-item" href="#" id="moNotes">Notes Hosts</a>
		</li>`)//addClass('d-none').after(data.replaceForm)
		//$('#settingLoginLi')
		//	created: "12/21/2023 4:24:59"
		//	email: "yohns@live.com"
		//	keyFile: "Some key file"
		//	lastLogin: ""
		//	name: "Yohn"
		//	premiumUntil: ""
		//	sheetId: "",
		//	sounds: '{"rose":"rose"}',
		//	userList: '{"yohn.john", "dancehallwifi", "aviannaav", "imanalyn31"}'*/
		console.log(data)
	} else {
		console.log('could not login - 1')
	}
})

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
		userId:	 msg.userId,
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

	//let msgcom = msg.hasOwnProperty('subemotes') ? insertEmotes(sanitize(msg.comment), msg.subemotes) : sanitize(msg.comment);
	let msgcom = insertEmotes(sanitize(msg.comment), msg.emotes);
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
	console.log('--- questionNew')
	console.log(data)
	console.log('--- questionNew')
})
let battleStats = $('#battleParties')
connection.on('linkMicBattle', (data) => {
	//console.log('---- linkMicBattle')
	//console.log(data)
	//console.log('---- linkMicBattle')
	let peopleSpan = 6
	if(data.battleUsers.length == 4){
		peopleSpan = 3
	}
	let i, str = `<div class="row">`;
	for(i=0;i<data.battleUsers.length;i++){
		str += '<div class="col-'+peopleSpan+' text-center"><a href="https://www.tiktok.com/@'+data.battleUsers[i].uniqueId+'" target="_blank">'
		+data.battleUsers[i].nickname+'<br>'
		+'<img src="'+data.battleUsers[i].profilePictureUrl+'" class="rounded-circle" style="max-height:75px; width:auto;">'
		+'<br>@'+data.battleUsers[i].uniqueId+'</a><br>'
		+'<div id="battle-'+data.battleUsers[i].userId+'"></div></div>'
	}
	str += `</div>
	<div class="w-100 progress mt-2" role="progressbar" aria-label="Time Left in Battle" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="height: 20px">
		<div id="battle-bar" class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%;"></div>
		<div id="battle-time" class="px-2 ms-auto text-end fw-bolder bg-primary fs-6">5:00</div>
	</div>`
	//console.log(str)
	$('#battleParties').html(str)
	updateCountDown(299)
	console.log('inserted battle stuff..')
})

connection.on('linkMicArmies', (data) => {
	//console.log('linkMicArmies')
	//console.log(data)
	//console.log('/linkMicArmies')
	let i;
	//$('#battleStats').removeClass('d-none')
	for(i=0;i<data.battleArmies.length;i++){
		let i2, helpers = '', help_len = data.battleArmies[i].participants.length, giftersHere
		for(i2=0;i2<help_len;i2++){
			if(helpers != '') helpers += '<br>'
			helpers += data.battleArmies[i].participants[i2].nickname
		}
		giftersHere = helpers == '' ? '' : '<p class="fs-6 bg-body-tertiary p-2 m-0">'+helpers+'</p>'
		$('#battle-'+data.battleArmies[i].hostUserId).html('<big class="badge text-bg-primary">'+data.battleArmies[i].points+'</big>'+giftersHere)
		//$(helpers)('#battle-'+data.battleArmies[i].hostUserId)
	}
	//console.log('inserted info')
})
connection.on('liveIntro', (data) => {
	console.log('liveIntro')
	console.log(data)
	console.log('/liveIntro')

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

connection.on('streamEnd', (actionId) => {
	let msg = 'Stream Ended';
	if (actionId === 3) {
		msg = 'Stream ended by user';
	}
	if (actionId === 4) {
		msg = 'Stream ended by platform moderator (ban)';
	}

	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes(); // + ":" + today.getSeconds();
	var dateTime = date+' '+time;
	//document.getElementById('dt').innerHTML = dateTime
	$('#stateText').html(msg+'<br>Ended At: '+dateTime);

	// schedule next try if obs username set
	if (window.settings.username) {
		setTimeout(() => {
			connect(window.settings.username);
		}, 30000);
	}
})

window.addEventListener("beforeunload", function (e) {
	e.preventDefault();
	e.returnValue = ""
});