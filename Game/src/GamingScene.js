/**
 * Created by L on 2016/4/14.
 */
var GamingLayer = cc.LayerColor.extend({
    _back:null,
    _back01:null,
    _back02:null,
    _backCircle:null,
    _hero:null,
    _winSize:null,
    _moveTo:null,
    _moveToTest:null,
    _backHeight:null,
    _isNormal:true,

    init:function(){
        this._super();
        this.setColor(cc.c4(38,122,222,213));
        this._winSize = cc.Director.getInstance().getWinSize();
        //循环背景
        this._back01 =new Background();
        this._back01.setAnchorPoint(0,0);
        this._back01.setPosition(cc.p(0,0));
        this.addChild(this._back01,1);
        this._back02 =new Background();
        this._back02.y = 1510;
        this._back02.setAnchorPoint(0,0);
        this._back02.setPosition(cc.p(0,-1510));
        this.addChild(this._back02,1);
        //定时器 
        this.schedule(this.loopBackGround,0);

        //鲸鱼
        this._hero = new cc.Sprite.create(s_Hero);
        //this._hero.setAnchorPoint(0.5,0.5);
        this._hero.setPosition(this._winSize.width / 2,65);
        this.addChild(this._hero,2);

        //将层设置为可触摸
        this.setTouchEnabled(true);
        // var gamingScene = MyScene.create();// 创建结束场景
        // cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2,gamingScene));  // 场景转换代码

        return true;
    },
    //背景循环
    loopBackGround:function(dt){
    this._back01.update(0,-1510,0);
    this._back02.update(0,0,1510);
    },
    
    //控制
    onTouchesMoved:function(touches,event){
        var touch = touches[0];
        var location = touch.getLocation();
        if(this.onClickFlag){
            this._hero.setPosition(location);
        }
        if(this._hero.x<40)
            this._hero.x=40;
        if(this._hero.x>this._winSize.width - 40)
            this._hero.x=this._winSize.width - 40;
        if(this._hero.y<40)
            this._hero.y=40;
        if(this._hero.y>this._winSize.height - 40)
            this._hero.y=this._winSize.height - 40;
    },

    onTouchesEnded:function(touches, event){
        this.onClickFlag = false;
    },

    onTouchesBegan:function(touches,event){
        var touch = touches[0];
        var location = touch.getLocation();
        if(cc.rectContainsPoint(this._hero.getBoundingBox(),location)){
            this.onClickFlag = true;
        }
    },

})
//这个方法创建了GamingLayer层，并调用这个层的init方法进行初始化
GamingLayer.create = function(){
    var gamingLayer = new GamingLayer();
    if(gamingLayer && gamingLayer.init()){
        return GamingLayer;
    }
    return null;
}

var GamingScene = cc.Scene.extend({
    _layer:null,
    onEnter:function () {
        this._super();
        var layer = new GamingLayer();
        this.addChild(layer);
        layer.init();
    }
})
//这个方法创建了GameOverScene场景，并调用这个场景的init方法进行初始化
GamingScene.create = function(){
    var scene = new GamingScene();
    if(scene && scene.init()){
        return scene;
    }
    return null;
}
var Background = cc.Sprite.extend({
    y:null,
    x:null,
    ctor:function(){
        this._super();
        this.initWithFile(s_GamingBack);//赋予图片元素
        // this._back = new cc.Sprite.create(s_GamingBack);
        // this._back.setAnchorPoint(0,0);

    },
    update: function (x,y,y1) {
        this.x=x;
        this.y-=1;
        if(this.y<y){
            this.y=y1;
        }
        this.setPosition(this.x,this.y);

    }
});