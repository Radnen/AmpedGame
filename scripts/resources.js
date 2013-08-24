/**
* Script: resources.js
* Written by: Andrew Helenius
* Updated: 8/23/2013
**/

/**
* Global Asset Manager:
* ============================================
*  - Automatically loads game assets.
*  - To access assets ues their name in one of
*    the objects below. Say it automatically
*    loads "face.png" use "Resources.images.face"
*    to access it. The code will search sub-
*    folders, "face.png" can be in any subfolder
*    of /images, but accessed no differently.
**/
var Resources = (function(){
	var Types = ["png", "bmp", "gif", "tga", "jpg", "wav", "flac", "rss", "rfn", "rws"];
	
	// public-access objects that hold loaded data:
	var Images = {}, Fonts = {}, Sounds = {}, Windowstyles = {};
	
	var array = []; // pointer to current loading array
	var func = null; // pointer to current loading function

	function IsValid(file) {
		return Contains(Types, function(i) { return i == file; });
	}
		
	function Load(path) {
		Foreach(GetDirectoryList(path), function(dir) {
			Load(path + "/" + dir);
		});
		
		Foreach(GetFileList(path), function(file) {
			var s = file.split('.');
			if (IsValid(s[s.length - 1])) {
				array[s[s.length - 2]] = func("." + path + "/" + file);
			}
		});
	}
	
	/**
	* LoadAll();
	*  - immediately loads all of the content into respective subfolders.
	**/
	function LoadAll() {
		var t = GetTime();
		LoadInto(Images, "./images", LoadImage);
		LoadInto(Sounds, "./sounds", LoadSound);
		LoadInto(Fonts, "./fonts", LoadFont);
		LoadInto(Windowstyles, "./windowstyles", LoadWindowStyle);
	}
		
	/**
	* LoadInto(arr : array, root : string, fun : function);
	*  - array: array or object to hold the files in.
	*  - path: the filepath of the root folder to start loading from.
	*  - func: any one of sphere's load functions.
	**/
	function LoadInto(arr, root, fun) {
		array = arr;
		func = fun;
		Load(root);
	}
	
	return {
		loadAll: LoadAll,
		loadInto: LoadInto,
		images: Images,
		fonts: Fonts,
		sounds: Sounds,
		windowstyles: Windowstyles
	}
})();
