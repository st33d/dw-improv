// adapted from http://donjon.bin.sh/code/name/
// there's some rather horrific assignment shenanigans going on in the original code
// - watch out when porting

var Markov = {
	
	nameSet:{},
	chainCache:{},
	
	// generator function
	getName: function(type, data) {
		if(!this.nameSet[type]) this.nameSet[type] = data;
		var chain; if (chain = this.markovChain(type)) {
			return this.markovName(chain);
		}
		return '';
	},
	
	// generate multiple
	// - butchered this 
	getNameList: function(type, n_of) {
		var list = [];
		var i;
		for (i = 0; i < n_of; i++) {
			list.push(this.getName(type));
		}
		return list;
	},
	
	// get markov chain by type
	markovChain: function  (type) {
		var chain;
		if (chain = this.chainCache[type]) {
			return chain;
		} else {
			var list;
			if (list = this.nameSet[type]) {
				var chain;
				if (chain = this.constructChain(list)) {
					this.chainCache[type] = chain;
					return chain;
				}
			}
		}
		return false;
	},
	
	// construct markov chain from list of names
	constructChain: function(list) {
		var chain = {};

		var i; for (i = 0; i < list.length; i++) {
			var names = list[i].split(/\s+/);
			chain = this.incrChain(chain,'parts',names.length);
			
			var j; for (j = 0; j < names.length; j++) {
				var name = names[j];
				chain = this.incrChain(chain,'name_len',name.length);
				
				var c = name.substr(0,1);
				chain = this.incrChain(chain,'initial',c);
				
				var string = name.substr(1);
				var last_c = c;
				
				while (string.length > 0) {
					var c = string.substr(0,1);
					chain = this.incrChain(chain,last_c,c);

					string = string.substr(1);
					last_c = c;
				}
			}
		}
		return this.scaleChain(chain);
	},
	
	incrChain: function(chain, key, token) {
		if(chain[key]) {
			if(chain[key][token]) {
				chain[key][token]++;
			} else {
				chain[key][token] = 1;
			}
		} else {
			chain[key] = {};
			chain[key][token] = 1;
		}
		return chain;
	},
	
	scaleChain: function (chain) {
		var table_len = {};
		var key;
		for (key in chain) {
			table_len[key] = 0;
			var token;
			for (token in chain[key]) {
				var count = chain[key][token];
				var weighted = Math.floor(Math.pow(count,1.3));
				chain[key][token] = weighted;
				table_len[key] += weighted;
			}
		}
		chain['table_len'] = table_len;
		return chain;
	},
	
	// construct name from markov chain
	markovName: function(chain) {
		var parts = this.selectLink(chain,'parts');
		var names = [];

		var i;
		for (i = 0; i < parts; i++) {
			var name_len = this.selectLink(chain,'name_len');
			var c = this.selectLink(chain,'initial');
			var name = c;
			var last_c = c;
			while (name.length < name_len) {
				c = this.selectLink(chain,last_c);
				name += c;
				last_c = c;
			}
			names.push(name);
		}
		return names.join(' ');
	},
	
	selectLink: function(chain, key) {
		var len = chain['table_len'][key];
		var idx = Math.floor(Math.random() * len);

		var t = 0;
		for (token in chain[key]) {
			t += chain[key][token];
			if (idx < t) { return token; }
		}
		return '-';
	}
	
};