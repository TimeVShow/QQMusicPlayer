(function(window){
    function Lyric(path){
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype={
        constructor:Lyric,
        init:function (path) {
            this.path = path;
            this.times = [];
            this.lyrics = [];
            this.index = -1;
        },
        loadLyric:function(callBack){
            var $this = this;
            $.ajax({
                url: $this.path,
                dateType: "txt",
                success: function (data) {
                    $this.parseLyric(data);
                    callBack();
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        parseLyric:function(data){
            var $this = this;
            var arry = data.split("\n");
            var timeReg =/\[(\d*:\d*\.\d*)\]/;
            $.each(arry,function(index,ele){
                var content = ele.split("]")[1];
                if(content.length == 1) return true;
                var res = timeReg.exec(ele);
                if(res == null) return true;
                var timeStr = res[1];
                var res2 = timeStr.split(":");
                var Time = parseFloat(Number(parseInt(res2[0])*60 + parseFloat(res2[1])).toFixed(2));
                $this.times.push(Time);
                $this.lyrics.push(content);
            });
        },
        currentIndex:function(currentTime){
            while(currentTime > this.times[0]){
                this.index++;
                this.times.shift();//删除数组最前面的元素
            }
            return this.index;
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window)
