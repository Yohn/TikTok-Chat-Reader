let Config = {
	buildNames(json){
		let datalist = document.getElementById('datalistOptions');
		datalist.innerHTML = ''
		//let nameList = document.getElementById('name-list');
		let html = '', gsound = '', notes = ''
		for(const item of json['names']){
			datalist.appendChild(new Option(item,item));
			html += `<li data-list-name="${item}"
				class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
				${item}
				<span class="c-pointer" data-name="${item}" onclick="removeName(this)">
					<svg fill="#842029" xmlns="http://www.w3.org/2000/svg"
						width="24" height="24" viewBox="0 0 24 24">
						<use href="#svg-trash"></use>
					</svg>
				</span>
			</li>`
		}
		$('#name-list').html(html)
	},
	buildNotes(json){
		let notes = ''
		//for(const note in json['notes']){
		//	console.log(note)
		//	notes += `<button type="button" class="m-2 btn btn-outline-secondary"
		//		onclick="loadNote('${note}')">${note}</a>`
		//		// , '${no1.replace("\n", "<br>").replace("'", "\'")}'
		//}
		for(const note in json['notes']){
			console.log(note)
			notes += `<button type="button" class="m-2 btn btn-outline-secondary"
				onclick="loadNote('${json['notes'][note].name}')">${json['notes'][note].name}</a>`
		}
		$('#note-list').html(notes)
	},
	buildSounds(json){
		let gsound = '' //, i, count = json['sounds']['gift'].length
		for(const sou in json['sounds']['gift']){
			//<span>${json['sounds']['gift'][sou].removeLast(4)}</span>
			//for(i=0;i < count; i++){
			let filename = json['sounds']['gift'][sou]
			let file = String(filename).removeLast(4).replace('/sounds/', '')
			gsound += `<li data-list-name="${sou}"
			class="list-group-item list-group-item-action d-flex">
			<span class="flex-grow-1">${sou}</span>
			<span>${file}</span>
			<span class="ms-3 c-pointer"
				data-url="${json['sounds']['gift'][sou]}"
				onclick="playSound(this)">
				<svg fill="#0d6efd" class="s-on d-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 7l8-5v20l-8-5v-10zm-6 10h4v-10h-4v10zm20.264-13.264l-1.497 1.497c1.847 1.783 2.983 4.157 2.983 6.767 0 2.61-1.135 4.984-2.983 6.766l1.498 1.498c2.305-2.153 3.735-5.055 3.735-8.264s-1.43-6.11-3.736-8.264zm-.489 8.264c0-2.084-.915-3.967-2.384-5.391l-1.503 1.503c1.011 1.049 1.637 2.401 1.637 3.888 0 1.488-.623 2.841-1.634 3.891l1.503 1.503c1.468-1.424 2.381-3.309 2.381-5.394z"/></svg>
				<svg fill="#6c757d" class="s-off" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 7.358v15.642l-8-5v-.785l8-9.857zm3-6.094l-1.548-1.264-3.446 4.247-6.006 3.753v3.646l-2 2.464v-6.11h-4v10h.843l-3.843 4.736 1.548 1.264 18.452-22.736z"/></svg>
			</span>
			<span class="ms-3 c-pointer"
				data-name="${sou}" onclick="removeGift(this)">
				<svg fill="#842029" xmlns="http://www.w3.org/2000/svg"
					width="24" height="24" viewBox="0 0 24 24">
						<use href="#svg-trash"></use>
					</svg>
			</span>
			</li>`
		}
		$('#gift-list').html(gsound)
	},
	buildUnusedGifts(json){
		let giftDrop = '' //, i, count = json['sounds']['gift'].length
		for(const gift in json['sounds']['unused']){
			giftDrop += '<option value="'+gift+'">'+gift+'</option>'
		}
		$('#group-gift').html(giftDrop)
		.select2({
			theme: 'bootstrap-5',
			dropdownParent: $('#soundModal')
		}).trigger('change')
	},
	grabConfig(ups){
		fetch("/config.json").then((response) => response.json()).then((json) => {
			Config = Object.assign({}, Config, json);
			if(ups == 'all'){
				Config.buildNames(json)
				Config.buildNotes(json)
				Config.buildSounds(json)
				Config.buildUnusedGifts(json)
			} else if(ups == 'names'){
				Config.buildNames(json)
			} else if(ups == 'notes'){
				Config.buildNotes(json)
			} else if(ups == 'sounds'){
				Config.buildSounds(json)
			}
		});
	},

	updateConfig() {
		Config.grabConfig('all')
		//fetch("/config.json").then((response) => response.json()).then((json) => {
		//	Config = Object.assign({}, Config, json);
		//	Config.buildNames(json)
		//	Config.buildNotes(json)
		//	Config.buildSounds(json)
		//});
	}
}

class Sounds {
	playlist = []
	playing = false
	volume = 70 // Config.volume
	//audio = new Audio()
	addSound(sound){
		this.playlist.push(sound)
    this.play()
		return true
	}
	isPlaying(){
		return this.playing
	}
	clearSounds(){
		this.playlist = []
	}
	play(){
		if(this.isPlaying() == false && this.playlist[0]){
			const audio = new Audio(this.playlist[0])
			//audio.volume = this.volume;
			this.playing = true
			audio.play()
			audio.onended = ()=>{
				this.playing = false
				this.playlist.shift()
				if(this.playlist.length > 0){
					this.play()
				}
			}
		}
	}
}

//! exactly like the Sounds class but for text to speech
//? Idk if we need this..
class TTS {
	list = []
	talking = false

	say(text){
		this.list.push(text)
    this.talk()
		return true
	}
	isTalking(){
		return this.talking
	}
	talk(){
		if(this.isTalking() == false && this.list[0]){
			//const utterance = new SpeechSynthesisUtterance()
			//let currentCharacter
			if (speechSynthesis.paused && speechSynthesis.speaking) {
				return speechSynthesis.resume()
			}
			if (speechSynthesis.speaking) return
			utterance.text = text
			utterance.rate = 1
			this.talking = true
			speechSynthesis.speak(utterance)
			speechSynthesis.onend = ()=>{
				this.talking = false
				this.list.shift()
				if(this.list.length > 0){
					this.talk()
				}
			}
		}
	}
	shutUp(){
		speechSynthesis.cancel()
	}
}

//change some settings
// https://github.com/AucT/b5toast
// https://auct.github.io/b5toast/b5toast_demo
// b5toast.show('warning', 'my message', 'optional title', optionalDelay);
const b5toastContainerElement = document.getElementById("toast-container");

//don't touch code below if you don't know what are you doing
const b5toast = {
    delayInMilliseconds: 7000,
    htmlToElement: function (html) {
        const template = document.createElement("template");
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    },
    show: function (color, message, title, delay) {
        title = title ? title : "";
        const html = `<div class="toast align-items-center mt-1 text-bg-${color} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">
                <b>${title}</b>
                <div>${message}</div>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>`;
        const toastElement = b5toast.htmlToElement(html);
        b5toastContainerElement.appendChild(toastElement);
        const toast = new bootstrap.Toast(toastElement, {
            delay: delay?delay:b5toast.delayInMilliseconds,
            animation: true
        });
        toast.show();
        setTimeout(() => toastElement.remove(), delay?delay:b5toast.delayInMilliseconds + 3000); // let a certain margin to allow the "hiding toast animation"
    },

    error: function (message, title, delay) {
        b5toast.show("danger", message, title, delay);
    },
    success: function (message, title, delay) {
        b5toast.show("success", message, title, delay);
    },
};