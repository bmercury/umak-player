(function(){
    window.song_manager = new App.SongManager();
    window.song_player = new App.SongPlayer();
    window.view_manager = new App.ViewManager();

    if(song_manager.getDb() !== false){
        song_manager.song_db = song_manager.getDb();

        var last_el = song_manager.song_db[Object.keys(song_manager.song_db)[Object.keys(song_manager.song_db).length-1]];
        if(Object.keys(song_manager.song_db).length>1){
            song_manager.new_song_id = last_el.song_id+1;
        }else{
            song_manager.new_song_id = 1;
        }
        song_manager.addSongsToList();
    }

    $("#song_upload").on('change',function(e){
        for(var i=0;i<e.currentTarget.files.length;i++){
            song_manager.addSongDb(e,e.currentTarget,e.currentTarget.files[i]);
        }
    });

    const YTPlayer = require('yt-player');
    window.yt_player = new YTPlayer('#visualizer-iframe');

})(window);