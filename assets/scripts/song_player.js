(function(){
    'use strict';
    var App = window.App || {};

    function SongPlayer(){
        this.current_song_id = -1;
        this.loop_enabled = true;
        this.random_enabled = false;
        this.current_song_audio = null;

        this.pause_button = $("#button_pause");
        this.play_button = $("#button_play");
        this.stop_button = $("#button_stop");
        this.previous_button = $("#button_previous");
        this.next_button = $("#button_next");
        this.loop_button = $("#button_loop");
        this.random_button = $("#button_random");

        this.pause_button.hide();
        this.stop_button.hide();
    }

    SongPlayer.prototype.nextSong = function(){

        if(this.random_enabled){
            var random_song = Math.floor(Math.random() * Object.keys(song_manager.song_db).length) + 1;
            if(song_manager.hasSong(random_song)){
                song_manager.readSong(random_song);
            }else{
                song_manager.readSong(1);
            }
        }else{
            if(song_manager.hasSong(this.current_song_id+1)){
                song_manager.readSong(this.current_song_id+1);
            }else{
                if(this.loop_enabled){
                    song_manager.readSong(song_manager.new_song_id = song_manager.song_db[Object.keys(song_manager.song_db)[0]].song_id);
                }
            }
        }

    }

    SongPlayer.prototype.previousSong = function(){

        if(this.random_enabled){
            var random_song = (Math.floor(Math.random() * song_manager.new_song_id) + 1);
            if(song_manager.hasSong(random_song)){
                song_manager.readSong(random_song);
            }else{
                song_manager.readSong(Object.keys(song_manager.song_db)[0]);
            }
        }else{
            if(song_manager.hasSong(this.current_song_id-1)){
                song_manager.readSong(this.current_song_id-1);
            }else{
                if(this.loop_enabled){
                    song_manager.readSong(song_manager.new_song_id-1);
                }
            }
        }
    }

    SongPlayer.prototype.playSong = function(src, id, type){

        if(type === 0){
            yt_player.stop();
            $("#visualizer-iframe").addClass('hidden');
            resumeVisualizer();
            
            if(id === this.current_song_id || id === undefined){
                this.current_song_audio.play();
                this.play_button.hide();
                this.pause_button.show();
            }else{
                if(this.current_song_audio!==null){
                    this.current_song_audio.pause();
                }
                console.log('call this');
                this.current_song_audio = document.createElement('audio');
                console.log(this.current_song_audio);
                this.current_song_audio.addEventListener("ended", function(){
                    window.song_player.nextSong();
                });
                this.current_song_audio.src = src;
                this.play_button.hide();
                this.pause_button.show();
        
                this.current_song_id = id;
    
                initVisualizer(this.current_song_audio);
        
                if(document.querySelector(".song_selected")!==null){
                    var el = $(".song_selected");
                    el.removeClass('song_selected');
                }
                $("#song_id_"+id).addClass('song_selected');
            }
        }

        if(type === 1){
            stopVisualizer();
            $("#visualizer-iframe").removeClass('hidden');
            yt_player.load(src);
            yt_player.setVolume(100);
            yt_player.on('ended', () => {
                song_player.nextSong();
            });
            yt_player.play();

            this.current_song_id = id;

            if(document.querySelector(".song_selected")!==null){
                var el = $(".song_selected");
                el.removeClass('song_selected');
            }
            $("#song_id_"+id).addClass('song_selected');
        }

    }

    SongPlayer.prototype.stopSong = function(){
        if(this.current_song_audio!==null){
            this.current_song_audio.pause();
            this.current_song_audio.currentTime = 0;
        }

        if(document.querySelector(".song_selected")!==null){
            var el = $(".song_selected");
            el.removeClass('song_selected');
        }
    }

    SongPlayer.prototype.pauseSong = function(){
        if(this.current_song_audio!==null){
            this.current_song_audio.pause();
            this.play_button.show();
            this.pause_button.hide();
        }
    }

    SongPlayer.prototype.toggleLoop = function(){
        if(this.loop_enabled){
            this.loop_enabled = false;
            $(this.loop_button).removeClass('button-playback-active');
        }else{
            this.loop_enabled = true;
            $(this.loop_button).addClass('button-playback-active');
        }
    }

    SongPlayer.prototype.toggleRandom = function(){
        if(this.random_enabled){
            this.random_enabled = false;
            $(this.random_button).removeClass('button-playback-active');
        }else{
            this.random_enabled = true;
            $(this.random_button).addClass('button-playback-active');
        }
    }

    App.SongPlayer = SongPlayer;
    window.App = App;
})(window);