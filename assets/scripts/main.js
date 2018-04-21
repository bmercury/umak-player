(function(){
    window.song_manager = new App.SongManager();
    window.song_player = new App.SongPlayer();

    if(song_manager.getDb() !== false){
        song_manager.song_db = song_manager.getDb();
        song_manager.addSongsToList();
    }

    $("#song_upload").on('change',function(e){
        for(var i=0;i<e.currentTarget.files.length;i++){
            song_manager.addSongDb(e,e.currentTarget,e.currentTarget.files[i]);
        }
    });

})(window);