var idSeparate = "_";

var Menu = {
	
	root:null,
	chosen:null,
	loading:0,
	loaded:0,
	
	folder$:null,
	file$:null,
	item$:null,
	
	init: function(folder$, file$){
		this.folder$ = folder$;
		this.file$ = file$;
		item$ = $('.item');
		
		var markov = Menu.markovList;
		var pick20 = Menu.pick20;
		var pick10 = Menu.pick10;
		var pick5 = Menu.pick5;
		var pick3 = Menu.pick3;
		
		this.root = new Ref("data", 0);
		var cacheUpdate = parseInt(sessionStorage.getItem("appcache_update"));
		if(cacheUpdate) localStorage.clear();
		this.root.load({
			"Moves":{
				Basic:true, Special:true, Barbarian:true, Bard:true, Cleric:true,
				"Cleric-Spells":true, Druid:true, Fighter:true, Immolator:true,
				Paladin:true, Ranger:true, Thief:true, Wizard:true, "Wizard-Spells":true
			},
			"NPCs":{
				"Name-Gen":{
					Deity:markov, Irish:markov, Tolkien:markov
				},
				"Monsters":{
					Summon:pick5, Caves:true, Depths:true, Folk:true, Hordes:true,
					Planar:true, Strange:true, Swamp:true, Undead:true, Woods:true
				},
				Instincts:pick20, Knacks:pick20
			},
			Gear:true,
			Things:pick10,
			Effects:pick20,
			Plots:pick3,
			Tags:true
		}, cacheUpdate);
	},
	
	// called after all files are loaded
	onLoaded: function(){
		this.folder$.html(this.root.html(true));
		console.log("loaded");
		console.log(this.root);
		sessionStorage.setItem("appcache_update", 0);
		
		// hack for monster summon - glues all monster lists together for Summon
		var r = this.getRef("_data_NPCs_Monsters_Summon");
		r.data = [];
		var f = r.parent.contents;
		for (var i = f.length - 1; i >= 0; i--) {
			r.data = r.data.concat(f[i].data);
		};
	},
	
	open: function(url){
		
		var r = this.getRef(url);
		if(!r){
			console.log("cannot find: "+url);
			return;
		}
		
		// cache
		if(!r.id$) r.id$ = $("#"+r.id());
		this.chosen = r;
		
		if(r.func){
			this.file$.empty();
			this.file$.append(
				this.dataList(r.func(r.data, r.name), r.name)
			);
			this.file$.scrollTop(0);
		} else if(r.contents.length){
			r.id$.toggle();
		} else if(r.data || r.render){
			if(!r.e){
				r.e = this.dataList(r.data, r.name);
				r.data = r.backup = true; // flush for memory
			}
			this.file$.empty();
			this.file$.append(r.e);
			this.file$.scrollTop(0);
		} else {
			console.log("empty ref at: "+url);
		}
	},
	
	// I should be cleverer than this, but not today
	pick3:function(data, title){
		return Rng.pickList(data, 3);
	},
	pick5:function(data, title){
		return Rng.pickList(data, 5);
	},
	pick10:function(data, title){
		return Rng.pickList(data, 10);
	},
	pick20:function(data, title){
		return Rng.pickList(data, 20);
	},
	
	markovList:function(data, title, total){
		if(!Markov.nameSet[title]) Markov.nameSet[title] = data;
		total = total || 20;
		return Markov.getNameList(title, total);
	},
	
	dataList: function(data, title){
		var div = document.createElement('div');
		var str = "";
		if(title) str += "<h3>"+title+"</h3>";
		str += "<ul>";
		for (var i = 0; i < data.length; i++) {
			//console.log(data[i]);
			var lead = data[i].substr(0, 3);
			switch(lead){
				case "<h3": str += data[i]; break;
				case "<b>": str += "<li class='passage'>"+data[i]+"</li>"; break;
				default: str += "<li>"+data[i]+"</li>"; break;
			}
		};
		str += "</ul>";
		div.innerHTML = str;
		return div;
	},
	
	getRef: function(url){
		var path = url.split(idSeparate);
		var r = this.root;
		while(path.length){
			for (var i = 0; i < r.contents.length; i++) {
				//console.log(r.contents[i].name+" "+path[0]);
				if(r.contents[i].name == path[0]){
					r = r.contents[i];
					break;
				}
			};
			path.shift();
		}
		return r;
	}
}
