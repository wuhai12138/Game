/**
 * Created by L on 2016/4/14.
 */
var GamingLayer = cc.LayerColor.extend({
    _back01:null,
    _back02:null,
    _hero:null,
    _winSize:null,
    _moveTo:null,
    _moveToTest:null,
    _backHeight:null,
    _isNormal:true,

    init:function(){
        this._super();
        //
        this._winSize = cc.Director.getInstance().getWinSize();
        this._back01 = new cc.Sprite.create(s_GamingBack);
        this._back01.setAnchorPoint(0,0);
        this._back01.setPosition(cc.p(0,0));
        this.addChild(this._back01,1);
        this._back02 = new cc.Sprite.create(s_GamingBack);
        this._back02.setAnchorPoint(0,0);
        this._back02.setPosition(cc.p(0,1512));
        this.addChild(this._back02,1);
        


        //this.schedule(this.updateGame,5.0);
        this._moveTo = cc.MoveTo.create(26.0, cc.p(0, -2000));
        this._back01.runAction(this._moveTo);
        this._moveToTest = cc.MoveTo.create(26.0,cc.p(0,-488));
        this._back02.runAction(this._moveToTest);
        this._hero = new  cc.Sprite.create(s_Hero);
        this._hero.setAnchorPoint(0.5,0);
        this._hero.setPosition(this._winSize.width / 2,0);
        this.addChild(this._hero,2);

        // var gamingScene = MyScene.create();// 创建结束场景
        // cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2,gamingScene));  // 场景转换代码

        
        

        

        //
        // // 创建一个标签用于显示“GameOver”字符串
        // // 第一个参数是内容，第二个是字体，第三个是字体大小
        // var _label = cc.LabelTTF.create("GameOver","Thonburi",40);
        // cc.log("Start !!");
        // // 设置位置
        // _label.setPosition(cc.p(winSize.width/2,winSize.height/2));
        //
        //this.addChild(_label);
        return true;
    },
    // updateGame:function () {
    //     this._moveTo = cc.MoveTo.create(6.0,cc.p(this._winSize.width / 2, - 201));
    //     this._back.runAction(this._moveTo);
    //     if(this._back.height<=-200){
    //         this._back.setPositionY(0);
    //     }
    // }
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