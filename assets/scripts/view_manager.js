(function(){
    'use strict';
    var App = window.App || {};

    function ViewManager(){
        this.views = {
            0: 'view_main',
            1: '',
            2: '',
            3: '',
            4: 'view_about',
        };
        this.current_view = 0;
    }

    ViewManager.prototype.switchView = function(new_view_id){
        if(new_view_id !== this.current_view){
            $("#"+this.views[this.current_view]).addClass('view_hidden');
            $("#navbar_"+this.current_view).removeClass('link-active');
            $("#"+this.views[new_view_id]).removeClass('view_hidden');
            $("#navbar_"+new_view_id).addClass('link-active');
            this.current_view = new_view_id;
        }
    }

    App.ViewManager = ViewManager;
    window.App = App;

})(window);