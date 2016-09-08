var fastdb = angular.module("fastDbModule", []);

fastdb.constant("DB", {
	name: "idrf",
	version: 1.0
});
fastdb.constant("STORE", "keyvaluepairs");

fastdb.factory("$fastdb", function (DB, STORE, $q){
	var db;
	var request = indexedDB.open(DB.name, DB.version);

	request.onerror = function (event){
		console.error("An error happened ");
		throw new Error(event);
	}

	request.onupgradeneeded = function(event) {
		db = event.target.result;
		console.warn("UPGRADING TO " + DB.version);
		// Create an objectStore for this database
		var objectStore = db.createObjectStore(STORE, {keyPath: "key"});
	}

	request.onsuccess = function(event){
		db = event.target.result;
		console.info("CONECTED TO " + DB.name);
	}

	return {
		setItem : function(key, value) {
			var defered = $q.defer();
			var tx = db.transaction([STORE], "readwrite");
			var store = tx.objectStore(STORE);
			if(key === ""){
				console.warn("--- EMPTY KEY USED ---");
			}

			var request = store.put(value, key);
			request.onerror = function(event){ 
				defered.reject(event);
			}
			request.onsuccess = function(event){ 
				defered.resolve(value);
			}
			return defered.promise;
		},


		entries : function(){
			var defered = $q.defer();
			var tx = db.transaction([STORE], "readonly");
			var store = tx.objectStore(STORE);
			var request = store.openCursor();
			var entries = {};

			request.onerror = function(event){ 
				defered.reject(event);
			}
			request.onsuccess = function(event){ 
				var cursor = request.result;
				if (cursor){
					entries[cursor.key] = cursor.value;
					cursor.continue();
				}else{
					defered.resolve(entries);
				}
			}

			return defered.promise;				
		},

		getItem : function(key) {
			var defered = $q.defer();
			var tx = db.transaction([STORE], "readonly");
			var store = tx.objectStore(STORE);
			var request = store.get(key);

			request.onerror = function(event){ 
				defered.reject(event);
			}

			request.onsuccess = function(event){ 
				var result = event.target.result;
				defered.resolve(result); 
			}

			return defered.promise;
		},

		clear : function (){
			var defered = $q.defer();
			var tx = db.transaction([STORE], "readwrite");
			var store = tx.objectStore(STORE);

			var request = store.clear();
			request.onerror = function(event){ 
				defered.reject(event);
			}
			request.onsuccess = function(event){ 
				defered.resolve(event);
			}
			return defered.promise;
		},

		removeItem : function (key){
			var defered = $q.defer();
			var tx = db.transaction([STORE], "readwrite");
			var store = tx.objectStore(STORE);
			var request = store.delete(key);

			request.onerror = function(event){ 
				defered.reject(event);
			}
			request.onsuccess = function(event){ 
				defered.resolve(event);
			}
			return defered.promise;
		},

		length : function(){
			var defered = $q.defer();
			var tx = db.transaction([STORE], "readonly");
			var store = tx.objectStore(STORE);
			var request = store.openCursor();
			var total = 0;

			request.onerror = function(event){ 
				defered.reject(event);
			}
			request.onsuccess = function(event){ 
				var cursor = request.result;
				if (cursor){
					total += 1;
					cursor.continue();
				}else{
					defered.resolve(total);
				}
			}

			return defered.promise;					
		},

		keys : function(){
			var defered = $q.defer();
			var tx = db.transaction([STORE], "readonly");
			var store = tx.objectStore(STORE);
			var request = store.openCursor();
			var keys = [];

			request.onerror = function(event){ 
				defered.reject(event);
			}

			request.onsuccess = function(event){ 
				var cursor = request.result;
				if (cursor){
					keys.push(cursor.key);
					cursor.continue();
				}else{
					defered.resolve(keys);
				}
			}
			return defered.promise;	
		},

		key : function(n){
			var defered = $q.defer();
			var tx = db.transaction([STORE], "readonly");
			var store = tx.objectStore(STORE);
			var request = store.openCursor();
			var i = 0;

			request.onerror = function(event){ 
				defered.reject(event) 
			}

			request.onsuccess = function(event){ 
				var cursor = request.result;
				if (cursor){
					if(i == n){
						defered.resolve(cursor.key);
					}else{
						i += 1;
						cursor.continue();
					}
				}else{
					// position n does not hold anything meaningfull
					defered.resolve(null);
				}
			}

			return defered.promise;
		}
	}
});
