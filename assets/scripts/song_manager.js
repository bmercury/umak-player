(function(){
    var App = window.app || {};

    function SongManager(){
        this.song_db = {};
    }

    SongManager.prototype.addSongsToList = function(){
        var $ = window.jQuery;
        var $song_list = $("#song-list");
        $song_list.html("");

        for (var key in this.song_db) {
            if (!this.song_db.hasOwnProperty(key)) continue;
        
            var obj = this.song_db[key];
            var s = obj.song_id;

            $song_list.append("<li onclick='song_manager.loadSong("+key+")' id='song_id_"+key+"' data-umak-song_id='"+key+"'><span>"+obj.song_name+"</span><span class='right'>Length</span></li>");
        }
    }

    SongManager.prototype.saveSongsToDb = function(){
        localStorage.setItem('song_db', JSON.stringify(window.song_manager.song_db));
    }

    SongManager.prototype.loadSongsFromDb = function(){
        if(localStorage.getItem('song_db')!==null){
            return JSON.parse(localStorage.getItem('song_db'));
        }
        return false;
    }

    SongManager.prototype.loadSong = function(key){
        console.log(key);
        var song_data = this.song_db[key];
        
        var jsmediatags = window.jsmediatags;

        $("#song_player").attr('src', song_data.song_src);

        // window.open(song_data.song_src);
    }

    SongManager.prototype.addSongToLocalDb = function(event,target,file){
        
        var new_song = {};
        if (target.files && file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                new_song.song_name = file.name;
                new_song.song_src = file.path;
                new_song.song_id = Object.keys(song_manager.song_db).length+1;

                song_manager.song_db[Object.keys(song_manager.song_db).length+1] = new_song;
                song_manager.saveSongsToDb();
                song_manager.addSongsToList();
            }
            reader.readAsDataURL(file);
        }
    }

    App.SongManager = SongManager;
    window.App = App;

})(window);