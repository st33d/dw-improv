var idSeparate = "_";

var Menu = {
	
	root:null,
	chosen:null,
	loading:0,
	loaded:0,
	framed:"",
	
	folder$:null,
	folder:null,
	file$:null,
	file:null,
	
	init: function(folder$, file$){
		
		this.folder$ = folder$;
		this.folder = folder$[0];
		this.file$ = file$;
		this.file = file$[0];
		
		var markov = Menu.markovList;
		var pick20 = Menu.pick20;
		var pick10 = Menu.pick10;
		var pick5 = Menu.pick5;
		var pick3 = Menu.pick3;
		
		this.root = new Ref("data", 0);
		var cacheUpdate = parseInt(sessionStorage.getItem("appcache_update"));
		this.framed = localStorage.getItem("framed");
		if(cacheUpdate){
			localStorage.clear();
			localStorage.setItem("framed", this.framed);
		}
		if(this.framed == "1") this.toggleFramed(true);
		this.root.load({
			"Moves":{
				Basic:true, Special:true, GM:true, Barbarian:true, Bard:true, Cleric:true,
				"Cleric-Spells":true, Druid:true, Fighter:true, Immolator:true,
				Paladin:true, Ranger:true, Thief:true, Wizard:true, "Wizard-Spells":true
			},
			"NPCs":{
				"Name-Gen":{
					Deity:markov, English:pick20, Irish:markov, Tolkien:markov
				},
				"Monsters":{
					Summon:pick5, Caves:true, Depths:true, Folk:true, Hordes:true,
					Planar:true, Strange:true, Swamp:true, Undead:true, Woods:true
				},
				Instincts:pick20, Knacks:pick20, Hirelings:true
			},
			"Places":{
				"Names":Menu.placeNameList,
				"Steadings":true
			},
			Gear:true,
			Things:pick10,
			Effects:pick20,
			Plots:pick3,
			Tags:true,
			"First-Game":true
		}, cacheUpdate);
	},
	
	// called after all files are loaded
	onLoaded: function(){
		this.folder$.html(this.root.html(true));
		console.log("loaded");
		console.log(this.root);
		sessionStorage.setItem("appcache_update", 0);
		
		// hack for monster summon - glues all monster lists together for Summon
		var r = this.getRef("data_NPCs_Monsters_Summon");
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
		
		// on mobile? href to #file so we can use back button to get to menu
		var style = window.getComputedStyle(this.file);
		var scrollTo = 
			this.framed != "1" &&
			style.display.indexOf("inline-block") == -1;
		
		// cache
		if(!r.id$) r.id$ = $("#"+r.id());
		this.chosen = r;
		
		if(r.func){
			this.file$.empty();
			this.file$.append(
				this.dataList(r.func(r), r.name)
			);
			this.file$.scrollTop(0);
			if(scrollTo) window.location.href = "#file";
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
			if(scrollTo) window.location.href = "#file";
		} else {
			console.log("empty ref at: "+url);
		}
	},
	
	// I should be cleverer than this, but not today
	pick3:function(r){
		return Rng.pickList(r.data, 3);
	},
	pick5:function(r){
		return Rng.pickList(r.data, 5);
	},
	pick10:function(r){
		return Rng.pickList(r.data, 10);
	},
	pick20:function(r){
		return Rng.pickList(r.data, 20);
	},
	
	markovList:function(r, total){
		if(!Markov.nameSet[r.name]) Markov.nameSet[r.name] = r.data;
		total = total || 20;
		return Markov.getNameList(r.name, total);
	},
	
	placeNameList:function(r, total){
		var i, roll, d = r.data, data = ["<h3>Region</h3>"];
		
		// Perilous Wilds did not make this easy to code:
		if(!r.initialised){
			var list = [[]];
			for(i = 0; i < d.length; i++){
				if(d[i] == "*"){
					list.push([]);
				} else {
					list[list.length-1].push(d[i]);
				}
			}
			r.data = d = {};
			d.terrainType = list[0];
			d.terrainAdj = list[1];
			d.terrainNoun = list[2];
			d.placeType = list[3];
			d.placeAdj = list[4];
			d.placeNoun = list[5];
			r.initialised = true;
		}
		for(i = 0; i < 10; i++){
			roll = Rng.die(12);
			if(roll <= 4) data.push(Rng.pick(d.terrainAdj)+" "+Rng.pick(d.terrainType));
			else if(roll <= 6) data.push(Rng.pick(d.terrainType)+" of (the) "+Rng.pick(d.terrainNoun));
			else if(roll <= 8) data.push("The "+Rng.pick(d.terrainType)+" "+Rng.pick(d.terrainAdj));
			else if(roll <= 10) data.push(Rng.pick(d.terrainNoun)+" "+Rng.pick(d.terrainType));
			else if(roll <= 11) data.push(Rng.pick(d.terrainNoun)+"'s "+Rng.pick(d.terrainAdj)+" "+Rng.pick(d.terrainType));
			else data.push(Rng.pick(d.terrainAdj)+" "+Rng.pick(d.terrainType)+" of (the) "+Rng.pick(d.terrainNoun));
		}
		data.push("<h3>Places</h3>");
		for(i = 0; i < 10; i++){
			roll = Rng.die(12);
			if(roll <= 2) data.push("The "+Rng.pick(d.placeType));
			else if(roll <= 4) data.push("The "+Rng.pick(d.placeAdj)+" "+Rng.pick(d.placeType));
			else if(roll <= 6) data.push("The "+Rng.pick(d.placeType)+" of (the) "+Rng.pick(d.placeNoun));
			else if(roll <= 8) data.push("(The) "+Rng.pick(d.placeNoun)+"'s "+Rng.pick(d.placeType));
			else if(roll <= 10) data.push(Rng.pick(d.placeType)+" of the "+Rng.pick(d.placeAdj)+" "+Rng.pick(d.placeNoun));
			else  data.push("The "+Rng.pick(d.placeAdj)+" "+Rng.pick(d.placeNoun));
		}
		return data;
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
	},
	
	toggleFramed: function(forceFramed){
		var f = "framed";
		var framed = localStorage.getItem(f);
		if(!forceFramed && framed == "1"){
			f = framed = "";
		} else {
			framed = "1";
		}
		document.documentElement.className = f;
		document.getElementsByTagName('body')[0].className = f;
		document.getElementsByTagName('header')[0].className = f;
		document.getElementsByTagName('footer')[0].className = f;
		document.getElementById('container').className = f;
		this.folder.className = f;
		this.file.className = f;
		localStorage.setItem("framed", framed);
		this.framed = framed;
	}
	
}
