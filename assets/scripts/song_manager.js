(function(){
    var App = window.App || {};

    function SongManager(){
        this.song_db = {};
        this.new_song_id = 1;
    }

    SongManager.prototype.addSongsToList = function(){
        var $song_list = $("#song-list");
        $song_list.html("");

        for (var key in this.song_db) {
            if (!this.song_db.hasOwnProperty(key)) continue;
        
            var obj = this.song_db[key];

            if(obj.type === 'file'){
                var seconds = Math.floor(obj.song_duration);
                var minutes = Math.floor(seconds / 60);
                seconds = Math.floor(seconds % 60);
                $song_list.append("<li onclick='song_manager.readSong("+key+")' id='song_id_"+key+"' data-umak-song_id='"+key+"'><span>"+obj.song_name+"</span><span class='right'>"+minutes+":"+((seconds < 10) ? ("0" + seconds) : seconds)+"</span></li>");
            }else{
                $song_list.append("<li onclick='song_manager.readSong("+key+")' id='song_id_"+key+"' data-umak-song_id='"+key+"'><span>"+obj.song_name+"</span><span class='right'>"+obj.song_src+"</span></li>");
            }

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
        var type = song_manager.song_db[id].type;

        if(type === 'file'){
            song_player.playSong(this.song_db[id].song_src, id, 0);
    
            var obj = this.song_db[id];
            $("#song_album").html(obj.tags.album);
            $("#song_track").html(obj.tags.track);
            $("#song_title").html(obj.tags.title);
        }

        if(type === 'online'){
            console.log("Read id "+id)
            song_player.playSong(this.song_db[id].song_src, id, 1);
            $("#song_album").html('Unknown');
            $("#song_track").html('Unknown');
            $("#song_title").html('Unknown');
        }
    }

    SongManager.prototype.addSongDb = function(event,target,file){
        console.log(this.new_song_id);

        var jsmediatags = window.jsmediatags;
        var song_tags = {};
        jsmediatags.read(file,{
            onSuccess: (tag) => {
                song_tags.album = tag.tags.album;
                song_tags.track = tag.tags.track;
                song_tags.title = tag.tags.title;
              },
              onError: (error) => {
                console.log('Error');
                console.log(error);
              }
        });
        
        var new_song = {};

        if (target.files && file) {
            var reader = new FileReader();
            reader.onload = function (event) {     
                new_song.song_name = file.name;
                new_song.song_src = file.path;
                new_song.type = 'file';
                new_song.tags = song_tags;
                
                var duration_meter = document.createElement('audio');
                duration_meter.src = file.path;

                duration_meter.addEventListener('loadedmetadata', function() {
                    new_song.song_duration = duration_meter.duration;
                    new_song.song_id = song_manager.new_song_id;
                    song_manager.song_db[song_manager.new_song_id] = new_song;
                    song_manager.new_song_id++;
                    song_manager.updateDb();
                    song_manager.addSongsToList();
                });
            }
            reader.readAsDataURL(file);
        }
    }

    SongManager.prototype.addOnlineSongDb = function(url){
        var new_song = {};
        new_song.song_name = "An online song";
        new_song.song_src = url;
        new_song.type = 'online';
        new_song.song_id = this.new_song_id;
        song_manager.song_db[this.new_song_id] = new_song;
        this.new_song_id++;
        song_manager.updateDb();
        song_manager.addSongsToList();
    }

    SongManager.prototype.hasSong = function(song_id){
        if (song_id in this.song_db){
            return true;
        }else return false;
    }

    SongManager.prototype.deleteCurrent = function(){
        var id = song_player.current_song_id;

        song_player.stopSong();
        stopVisualizer();

        delete this.song_db[id];
        this.updateDb();
        this.addSongsToList();
        yt_player.stop();
    }

    SongManager.prototype.deleteAll = function(){
        song_player.stopSong();

        this.song_db = {};
        this.updateDb();
        this.addSongsToList();
        yt_player.stop();
    }

    SongManager.prototype.startOnlineFileUpload = function(){
        const prompt = require('electron-prompt');
        var url;
        prompt({
            title: 'Youtube file addition',
            label: 'Video ID:',
            inputAttrs: { // attrs to be set if using 'input'
                type: 'url'
            }
        })
        .then((r) => {
            url = r;
            
            song_manager.addOnlineSongDb(url);

        })
        .catch(console.error);
    }

    App.SongManager = SongManager;
    window.App = App;

})(window);