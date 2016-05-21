var Rng = {
	
	shuffle: function (v){
		for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
		return v;
	},
	
	symbol: function(n){
		n = n || (this.value(6) + 1);
		return ['\u2680', '\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685'][n];
	},
	
	pick: function(list){
		return list[this.value(list.length)];
	},
	
	pluck: function(list){
		var n = this.value(list.length);
		var k = list[n]; 
		list.splice(n, 1);
		return k;
	},
	
	// pick a list of unique items from a given large list
	// written to cope with very large lists
	pickList: function(list, total){
		var r = [];
		if(total >= list.length){
			r = list.slice();
			return this.shuffle(r);
		}
		var picked = {};
		while(total--){
			var n = this.value(list.length);
			while(picked[n]) n = (n + 1) % list.length;
			picked[n] = true;
			r.push(list[n]);
		}
		return r;
	},
	
	value: function(min, max){
		if(max){
			min = min || 0;
		} else if(min){
			max = min;
			min = 0;
		} else {
			// coin flip
			min = 0;
			max = 2;
		}
		return Math.floor(Math.random() * (max - min) + min);
	},
	
	roll: function(mod){
		return this.die(6)+this.die(6)+mod;
	},
	
	die: function(n){
		return Math.ceil(Math.random() * n);
	},
	
	/* Give 2 arrays to randomly pick an item based on the weights */
	wieght: function(items, weights, total){
		var i;
		var totalWeight = 0;
		for(i = 0; i < weights.length; i++) totalWeight += weights[i];
		var weighedItems = [];
		var currentItem = 0
		while(currentItem < items.length){
			for(i = 0; i < weights[currentItem]; i++)
				weighedItems[weighedItems.length] = items[currentItem];
			currentItem++;
		}
		if(total){
			var list = [];
			while(total--) list.push(weighedItems[Math.floor(Math.random()*totalWeight)]);
			return list;
		} else {
			return weighedItems[Math.floor(Math.random()*totalWeight)];
		}
	}
}