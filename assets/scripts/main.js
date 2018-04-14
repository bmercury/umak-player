(function(){
    window.song_manager = new App.SongManager();
    if(song_manager.loadSongsFromDb() !== false){
        song_manager.song_db = song_manager.loadSongsFromDb();
        song_manager.addSongsToList();
    }

    $("#song_upload").on('change',function(e){
        for(var i=0;i<e.currentTarget.files.length;i++){
            song_manager.addSongToLocalDb(e,e.currentTarget,e.currentTarget.files[i]);
        }
    });

})(window);