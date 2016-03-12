
var Ref = function(name, parent){
	this.name = name;
	this.parent = parent;
	this.contents = [];
	this.data = null;
	this.func = null;
}

Ref.prototype.load = function(obj){
	var r;
	for(var k in obj){
		var v = obj[k];
		r = new Ref(k, this);
		
		if(typeof v === 'function'){
			// function acting on data-set
			r.func = v;
			v = true;
		}
			
		if(v === true){
			// load data
			Menu.loading++;
			$.ajax({
				url: r.url(),
				dataType: 'text',
				context: r,
				error: function(XMLHttpRequest, textStatus, errorThrown){
					console.log('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
				},
				success: function(data){
					this.data = data.split("\n");
					if(--Menu.loading == 0){
						Menu.onLoaded();
					}
				}
			});
		} else if(v){
			r.load(v);
		}
		if(v) this.contents.push(r);
	}
}

Ref.prototype.html = function(isRoot){
	var str = "";
	if(this.contents.length){
		if(isRoot){
			str = "<ul>";
		} else {
			str = "<li><b>"+this.method()+"</b><ul id='"+this.id()+"' style='display: none;'>";
		}
		for(var i = 0; i < this.contents.length; i++){
			str += this.contents[i].html();
		}
		str = str + "</ul>";
		if(!isRoot) str += "</li>";
		return str;
	} else {
		return "<li>"+this.method()+"</li>";
	}
}

Ref.prototype.method = function(){
	var str =
		"<a href='javascript:Menu.open(\""+
		this.id()+
		"\");'"+
		(this.data != null ? " class='item'" : "")+
		">"+
		this.name+
		(this.func != null ? " "+Rng.symbol() : "")+
		"</a>";
	return str;
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
