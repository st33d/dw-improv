
var Ref = function(name, parent, d){
	this.name = name;
	this.parent = parent;
	this.d = d || 0;
	this.contents = [];
	this.data = null;
	this.func = null;
	this.backup = null;
	this.render = null;
}

Ref.prototype.load = function(obj, cacheUpdate){
	var r;

	for(var k in obj){
		var v = obj[k];
		r = new Ref(k, this, this.d + 1);

		if(typeof v === 'function'){
			// function acting on data-set
			r.func = v;
			v = true;
		}

		if(v === true){
			// load data
			Menu.loading++;
			var id = r.id();
			var backup = localStorage.getItem(id);
			if(backup) r.backup = JSON.parse(backup);

			if(cacheUpdate || !r.backup){
				$.ajax({
					url: r.url(),
					dataType: 'text',
					context: r,
					cache: true,
					error: function(XMLHttpRequest, textStatus, errorThrown){
						console.log('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
						if(this.backup){
							console.log("back up "+this.id());
							this.data = this.backup;
							if(--Menu.loading == 0) Menu.onLoaded();
						}
					},
					success: function(data){
						var id = this.id();
						this.data = data.split("\n");
						console.log("loaded "+id);
						localStorage.setItem(id, JSON.stringify(this.data));
						if(--Menu.loading == 0) Menu.onLoaded();
					}
				});
			} else {
				console.log("back up "+id);
				r.data = r.backup;
				--Menu.loading;
			}
		} else if(v){
			r.load(v, cacheUpdate);
		}
		if(v) this.contents.push(r);
	}
	if(!this.parent && Menu.loading == 0) Menu.onLoaded();
}

Ref.prototype.html = function(isRoot){
	var str = "";
	var m = this.method;
	var pad = "&nbsp;&nbsp;";
	if(this.contents.length){
		if(isRoot){
			str = "<ul>";
		} else {
			str = "<li class='header'>"+
				this.method(this.chars(pad, this.d - 1)+this.name, "\u279b")+
				"<ul id='"
				+this.id()
				+"' style='display: none;'>";
		}
		for(var i = 0; i < this.contents.length; i++){
			str += this.contents[i].html();
		}
		str = str + "</ul>";
		if(!isRoot) str += "</li>";
		return str;
	} else {
		return "<li>"+
			this.method(
				this.chars(pad, this.d - 1)+this.name,
				(this.func != null ? Rng.symbol() : null)
			)+
			"</li>";
	}
}

Ref.prototype.chars = function(token, n){
	n = n || 0;
	var str = "";
	while(n-- > 0){
		str += token
	}
	return str;
}

Ref.prototype.method = function(name, symbol){
	name = name || this.name;
	var str =
		"<a href='javascript:Menu.open(\""+
		this.id()+
		"\");'"+
		(this.data != null ? " class='item'" : "")+
		(this.data != null ? " id='"+this.id()+"'" : "")+
		">"+
		name+
		(symbol ? " "+symbol : "")+
		"</a>";
	return str;
}

// Set up data to render and flush memory
Ref.prototype.setRender = function(str){
	this.render = str;
	this.data = this.backup = null;
}

Ref.prototype.url = function(){
	var str = this.name;
	var p = this.parent;
	while(p){
		str = p.name + "/" + str;
		p = p.parent;
	}
	if(this.contents.length) str += "/";
	else str += ".txt";
	return str;
}

Ref.prototype.id = function(){
	var str = this.name;
	var p = this.parent;
	while(p){
		str = p.name + idSeparate + str;
		p = p.parent;
	}
	if(this.contents.length) str += idSeparate;
	return str;
}
