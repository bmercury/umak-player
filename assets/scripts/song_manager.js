(function(){
    var App = window.App || {};

    function SongManager(){
        this.song_db = {};
    }

    SongManager.prototype.addSongsToList = function(){
        var $song_list = $("#song-list");
        $song_list.html("");

        for (var key in this.song_db) {
            if (!this.song_db.hasOwnProperty(key)) continue;
        
            var obj = this.song_db[key];

            var seconds = Math.floor(obj.song_duration);
            var minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);

            $song_list.append("<li onclick='song_manager.readSong("+key+")' id='song_id_"+key+"' data-umak-song_id='"+key+"'><span>"+obj.song_name+"</span><span class='right'>"+minutes+":"+((seconds < 10) ? ("0" + seconds) : seconds)+"</span></li>");
        }
    }

    SongManager.prototype.updateDb = function(){
        localStorage.setItem('song_db', JSON.stringify(window.song_manager.song_db));
    }

    SongManager.prototype.getDb = function(){
        if(localStorage.getItem('song_db')!==null){
            return JSON.parse(localStorage.getItem('song_db'));
        }
        return false;
    }

    SongManager.prototype.readSong = function(id){
        song_player.playSong(this.song_db[id].song_src, id);
    }

    SongManager.prototype.addSongDb = function(event,target,file){

        var jsmediatags = window.jsmediatags;
        var song_tags = {};
        jsmediatags.read(file,{
            onSuccess: (tag) => {
                song_tags.album = tag.tags.album;
                song_tags.track = tag.tags.track;
                song_tags.title = tag.tags.title;
                console.log(tag);
              },
              onError: (error) => {
                console.log('Error');
                console.log(error);
              }
        });
        
        var new_song = {};

        console.log(song_tags);
        if (target.files && file) {
            var reader = new FileReader();
            reader.onload = function (event) {     
                new_song.song_name = file.name;
                new_song.song_src = file.path;
                
                var duration_meter = document.createElement('audio');
                duration_meter.src = file.path;

                duration_meter.addEventListener('loadedmetadata', function() {
                    new_song.song_duration = duration_meter.duration;
                    new_song.song_id = Object.keys(song_manager.song_db).length+1;
    
                    song_manager.song_db[Object.keys(song_manager.song_db).length+1] = new_song;
                    song_manager.updateDb();
                    song_manager.addSongsToList();
                });
            }
            reader.readAsDataURL(file);
        }
    }

    SongManager.prototype.hasSong = function(song_id){
        if (song_id in this.song_db){
            return true;
        }else return false;
    }

    App.SongManager = SongManager;
    window.App = App;

})(window);