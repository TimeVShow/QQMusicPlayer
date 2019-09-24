(function(window){
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype={
        constructor:Player,
        musicList:[],
        init:function ($audio) {
            this.$audio = $audio;
            this.audio=$audio.get(0);
        },
        currentIndex:-1,
        playMusic:function(index,music){
            if(this.currentIndex == index){
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
                this.$audio.attr("src",music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex:function(){
            var index;
           if(this.currentIndex < 0){
               index = 0;
           }else{
               index = this.currentIndex - 1;
           }
           return index;
        },
        nextIndex:function(){
            var index;
            if(this.currentIndex + 1 >= this.musicList.length){
                index =  0;
            }else{
                index = this.currentIndex + 1;
            }
            return index;
        },
        changeMusic:function(index){
            this.musicList.splice(index,1);
            if(index < this.currentIndex){
                this.currentIndex = this.currentIndex - 1;
            }
        },
        getMusicDuration:function(){
            return this.audio.duration;
        },
        getMusicCurrent:function(){
            return this.audio.currentTime;
        },
        updateTime:function(callback){
            var $this = this;
            this.$audio.on("timeupdate", function () {
                var duration = $this.audio.duration;
                var current = $this.audio.currentTime;
                var time = $this.formateTime(current, duration);
                callback(current,duration,time);
            });
        },
        formateTime:function(currentTime, duration) {
            var beginMin = parseInt(currentTime / 60);
            var beginSeconds = parseInt(currentTime % 60);
            var endMin = parseInt(duration / 60);
            var endSeconds = parseInt(duration % 60);
            if (beginMin < 10) {
                beginMin = "0" + beginMin;
            }
            if (beginSeconds < 10) {
                beginSeconds = "0" + beginSeconds;
            }
            return beginMin + ":" + beginSeconds;
        },
        musicSeekTo:function(value){
            if(isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        musicVoiceSeekTo:function(value){
            if(isNaN(value)) return;
            this.audio.volume = value;
        }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window)