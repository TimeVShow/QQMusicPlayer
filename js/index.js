$(function() {

    $(".content_list").mCustomScrollbar();
    //动态添加的元素不能直接设置点击事件，要通过事件委托来进行工作
    initEvents();
    var progress;
    var voiceProgress;
    var $audio = $("audio");
    var player = new Player($audio);
    var lyric;
    var modeIndex = 0;
    initProgress();
    function initProgress(){
        var $progressBar = $(".music_progress_info_bar");
        var $progressLine = $(".music_progress_line");
        var $progerssDot = $(".music_progress_dot");
        progress = new Progress($progressBar, $progressLine, $progerssDot);
        progress.progressClick(function(value){
            player.musicSeekTo(value);
        });
        progress.progressMove(function(value){
            player.musicSeekTo(value);
        });
        var $progressVoiceBar = $(".music_voice_info_bar");
        var $progressVoiceLine = $(".music_voice_line");
        var $progerssVoiceDot = $(".music_voice_dot");
        voiceProgress = new Progress($progressVoiceBar, $progressVoiceLine, $progerssVoiceDot);
        voiceProgress.progressClick(function(value){
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function(value){
            player.musicVoiceSeekTo(value);
        });
    }
    player.updateTime(function(currentTime,duration,time){
        $(".music_progress_currentTime").text(time);
        var value = currentTime / duration * 100;
        console.log(value);
        progress.progressChange(value);
        var index = lyric.currentIndex(currentTime);
        var $item = $(".song_Lyric li").eq(index);
        $item.addClass("cur");
        $item.siblings().removeClass("cur");
        if(index < 2) return;
        $(".song_Lyric ul").css({
            marginTop:((-index+2) * 30)
        });
        if(currentTime >= duration){
           $(".music_next").trigger("click");
        }
    });
    function initEvents() {
        get_player_list();
        $(".content_list").delegate(".list_music", "mouseenter", function () {
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            $(this).find(".list_time span").stop().fadeOut(100);
        });
        $(".content_list").delegate(".list_music", "mouseleave", function () {
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time span").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeOut(100);
        });
        $(".content_list").delegate(".list_check", "click", function () {
            $(this).toggleClass("list_checked");
        });
        var $musicPlay = $(".music_play");
        $(".content_list").delegate(".list_menu_play", "click", function () {
            $item = $(this).parents(".list_music");
            $(this).toggleClass("list_menu_play2");
            $(this).parents(".list_music").siblings().find(".list_menu_play").removeClass("list_menu_play2");
            $(this).parents(".list_music").siblings().find("div").css("color", "rgba(255,255,255,0.5)");
            if ($(this).attr("class").indexOf("list_menu_play2") != -1) {
                $musicPlay.addClass("music_play2");
                $(this).parents(".list_music").find("div").css("color", "#fff");

            } else {
                $musicPlay.removeClass("music_play2");
                $(this).parents(".list_music").find("div").css("color", "rgba(255,255,255,0.5)");
            }
            $(this).parents(".list_music").find(".list_number").toggleClass("list_number2");
            $(this).parents(".list_music").siblings().find(".list_number").removeClass("list_number2");
            changeMusicInfo($item.get(0).music);
            changeMusicLyric($item.get(0).music);
            player.playMusic($item.get(0).index, $item.get(0).music);
        });
        $(".music_prev").click(function () {
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        });
        $musicPlay.click(function () {
            if (player.currentIndex == -1) {
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            } else {
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        });
        $(".music_next").click(function () {
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
        });
        $(".content_list").delegate(".list_menu_del", "click", function () {
            var $item = $(this).parents(".list_music");
            if ($item.get(0).index == player.currentIndex) {
                $(".music_next").trigger("click");
            }
            $item.remove();
            player.changeMusic($item.get(0).index);
            $(".list_music").each(function (index, ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index + 1);
            });
        });
        $(".music_voice_icon").click(function(){
            $(this).toggleClass("music_voice_icon2");
            if($(this).attr("class").indexOf("music_voice_icon2") != -1){
                player.musicVoiceSeekTo(0);
            }else{
                player.musicVoiceSeekTo(1);
            }
        });
        $(".music_mode").click(function(){
            modeIndex = (modeIndex+1)%4;
            $(this).addClass("music_mode"+modeIndex);
            $(this).removeClass("music_mode"+((modeIndex+3)%4));
        });
        $(".music_fav").click(function(){
            $(this).toggleClass("music_fav2");
        });
        $(".music_only").click(function(){
            $(this).toggleClass("music_only2");
        });
    }

    /*
   $(".list_music").hover(function(){
        //企业开发常用find找到所有的后代元素
        $(this).find(".list_menu").stop().fadeIn(100);
        $(this).find(".list_time a").stop().fadeIn(100);
        $(this).find(".list_time span").stop().fadeOut(100);
    },function(){
        $(this).find(".list_menu").stop().fadeout(100);
        $(this).find(".list_time span").stop().fadein(100);
        $(this).find(".list_time a").stop().fadeout(100);
    });
     */
    function get_player_list() {
        $.ajax({
            url: "./source/musiclist.json",
            dateType: "json",
            success: function (data) {
                player.musicList = data;
                var $musicList = $(".content_list ul");
                $.each(data, function (index, ele) {
                    var $item = createMusicItem(index, ele);
                    $musicList.append($item);
                });
                initMusicInfo(data);
                initMusicLyric(data[0]);
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    function createMusicItem(index, ele) {
        var $item = $("                    <li class='list_music'>\n                            <div class=\"list_check\"><i></i></div>\n                            <div class=\"list_number\">" + (index + 1) + "</div>\n                            <div class=\"list_name\">" + ele.name + "\n                                <div class=\"list_menu\">\n                                    <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n                                    <a href=\"javascript:;\" title=\"添加\"></a>\n                                    <a href=\"javascript:;\" title=\"下载\"></a>\n                                    <a href=\"javascript:;\" title=\"分享\"></a>\n                                </div>\n                            </div>\n                            <div class=\"list_singer\">" + ele.singer + "</div>\n                            <div class=\"list_time\">\n                                <span>" + ele.time + "</span>\n                                <a href=\"javascript:;\" title=\"删除\" class='list_menu_del'></a>\n                            </div>\n                        </li>\n");
        $item.get(0).index = index;
        $item.get(0).music = ele;
        return $item;
    }

    function initMusicInfo(data) {
        changeMusicInfo(data[0]);
    }
    function initMusicLyric(data){
       lyric = new Lyric(data.link_lrc);
       var $lyricContainer = $(".song_Lyric ul");
       lyric.loadLyric(function(){
           $.each(lyric.lyrics,function(index,ele){
                var $item = $("<li>"+ele+"</li>");
                $lyricContainer.append($item);
           });
       });
    }
    function changeMusicInfo(data) {
        $(".song_info_pic img").attr("src", data.cover);
        $(".song_info_name a").text(data.name);
        $(".song_info_singer a").text(data.singer);
        $(".song_info_album a").text(data.album);
        $(".mask_bg").css("background", "url(\"" + data.cover + "\") no-repeat center center");
        $(".music_progress_name").text(data.name + " / " + data.album);
        $(".music_progress_duration").text(" / " + data.time);
    }
    function changeMusicLyric(data) {
        var $lyricContainer = $(".song_Lyric ul li");
        $lyricContainer.remove();
        initMusicLyric(data);
    }
})