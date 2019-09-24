(function(window){
    function Progress($progerssBar,$progressLine,$progerssDot){
        return new Progress.prototype.init($progerssBar,$progressLine,$progerssDot);
    }
    Progress.prototype={
        constructor:Progress,
        musicList:[],
        isMove:false,
        init:function ($progerssBar,$progressLine,$progerssDot) {
            this.$progressBar = $progerssBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progerssDot;
        },
        progressClick:function(callback){
            var $this = this;
            this.$progressBar.click(function(event){
                console.log("click");
                var maxLen = $(this).width();
                var normalLeft = $(this).offset().left;
                var eventLeft = event.pageX;
                var length = eventLeft - normalLeft;
                if( length < 0){
                   length = 0;
                }
                $this.$progressLine.css("width",length);
                $this.$progressDot.css("left",length);
                var value = length / maxLen;
                callback(value);
            });
        },
        progressMove:function(callback){
            var $this = this;
            var normalLeft = this.$progressBar.offset().left;
            var eventLeft;
            var maxLen = this.$progressBar.width();
            var length;
            this.$progressBar.mousedown(function(){
                console.log("mousedown");
                $this.isMove = true;
                $(document).mousemove(function(){
                    eventLeft = event.pageX;
                    length = eventLeft - normalLeft;
                    console.log(length);
                    if( length < 0){
                        length = 0;
                    }else if(length > maxLen){
                        length = maxLen;
                    }
                    console.log(length);
                    $this.$progressLine.css("width",length);
                    $this.$progressDot.css("left",length);
                });
            });
            $(document).mouseup(function () {
                console.log("mouseup");
                $(document).off("mousemove");
                $this.isMove = false;
                var value = (length)/maxLen;
                callback(value);
            });
        },
        progressChange:function(value){
            if(this.isMove){
                console.log("is move");
               return;
            }
            console.log("ok");
            this.$progressLine.css({
                width:value+"%"
            });
           this.$progressDot.css({
               left:value+"%"
           });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window)