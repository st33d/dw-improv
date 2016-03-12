var idSeparate = "_";

var Menu = {
	
	root:null,
	chosen:null,
	loading:0,
	loaded:0,
	
	folder$:null,
	file$:null,
	
	init: function(folder$, file$){
		this.folder$ = folder$;
		this.file$ = file$;
		
		var markov = Menu.markovList;
		var pick20 = Menu.pick20;
		var pick10 = Menu.pick10;
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
				Instincts:pick20, Knacks:pick20,
				"Monsters":{
					Folk:true, Woods:true
				}
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
	},
	
	open: function(url){
		
		var r = this.getRef(url);
		if(!r){
			console.log("cannot find: "+url);
			return;
		}
		
		this.chosen = r;
		
		if(r.func){
			this.file$.html(
				this.dataList(r.func(r.data, r.name), r.name)
			);
			this.file$.scrollTop(0);
		} else if(r.contents.length){
			$("#"+r.id()).toggle();
		} else if(r.data){
			this.file$.html(this.dataList(r.data, r.name));
			this.file$.scrollTop(0);
		} else {
			console.log("empty ref at: "+url);
		}
	},
	
	pick3:function(data, title){
		return Rng.pickList(data, 3);
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
		var str = "";
		if(title) str += "<h3>"+title+"</h3>";
		str += "<ul>";
		for (var i = 0; i < data.length; i++) {
			//console.log(data[i]);
			if(data[i].substr(0, 3) == "<h3") str += data[i];
			else str += "<li>"+data[i]+"</li>";
		};
		str += "</ul>";
		return str;
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
