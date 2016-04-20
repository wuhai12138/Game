/**
 * Created by L on 2016/4/14.
 */
var GamingLayer = cc.LayerColor.extend({
    _hero:null,
    _winSize:null,
    //背景
    _back01:null,
    _back02:null,
    _backCircle:null,
    _backHeight:null,
    //英雄
    _heroIdle:null,
    _heroRun:null,
    _heroJump:null,
    _frame:null,
    _runState:0,
    _jumpLock:0,
    //敌人
    _enemy:null,
    //倒计时
    _downLabel:null,

    init:function(){
        this._super();
        //装敌人
        this._enemy = [];

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
        //背景定时器
        this.schedule(this.loopBackGround,0);

        // 添加增加敌机的定时器
        this.schedule(this.addTarget,0.8);
        // 添加碰撞检测，不加第二个参数，默认为每帧执行一次
        this.schedule(this.updateGame);

        //鲸鱼
        // this._hero = new cc.Sprite.create(s_Hero);
        // this._hero.setPosition(this._winSize.width / 2,65);
        // this.addChild(this._hero,2);

        //将层设置为可触摸
        this.setTouchEnabled(true);

        //动画帧
        var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        //第一个参数plist文件，第二个参数plist对应的png图片
        var frameCache = spriteFrameCache.addSpriteFrames(s_TestAnimationPlist, s_TestAnimationPng);
        //将所有帧存入一个数组
        var animFrames = [];

        //Idle
        //采用循环添加动画的每一帧
        for (var i=1;i<=24;i++) {
            var frame =spriteFrameCache.getSpriteFrame("4IDLE00" + i + ".png");
            if (frame) {
                animFrames.push(frame);
            }
        }
        //创建动画，设置播放间隔
        this._heroIdle = cc.Animate.create(cc.Animation.create(animFrames,0.1));
        //Run
        animFrames = [];
        for(var i=1;i<=18;i++){
            var frame =spriteFrameCache.getSpriteFrame("4RUN00" + i + ".png");
            if (frame) {
                animFrames.push(frame);
            }
        }
        this._heroRun = cc.Animate.create(cc.Animation.create(animFrames,0.1));
        //Jump
        animFrames = [];
        for(var i=1;i<=9;i++){
            var frame =spriteFrameCache.getSpriteFrame("4JUMP00" + i + ".png");
            if (frame) {
                animFrames.push(frame);
            }
        }
        this._heroJump = cc.Animate.create(cc.Animation.create(animFrames,0.1));

        //

        // var animation = cc.Animation.create(animFrames, 0.1);
        // var animate = cc.Animate.create(animation);
        // animation.setDelayPerUnit(0.1);
        //设置动画播放完成是否保持在第一帧，true为保持在第一帧，false为保持在最后一帧
        //animation.setRestoreOriginalFrame(false);
        // 单独显示一个动画
        this._hero = cc.Sprite.createWithSpriteFrame(spriteFrameCache.getSpriteFrame("4IDLE001.png"));//plist里面对于的图片名称
        this._hero.setScale(0.8,0.8);
        this._hero.setPosition(cc.p(100,100));
        this.addChild(this._hero,2);
        this.testIdle();

        // //倒计时
        // var to1 = cc.ProgressTo.create(30, this._winSize.height - 40);
        // var left = cc.ProgressTimer.create(cc.Sprite.create(s_progressBar));
        // left.setType(cc.PROGRESS_TIMER_TYPE_BAR);
        // left.setBarChangeRate(cc.p(0, 1));
        // left.setMidpoint(cc.p(0, this._winSize.height - 20));
        // this.addChild(left,2);
        // left.setPosition(20,200);
        // left.runAction(cc.RepeatForever.create(to1));

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
            this.testRun();
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
        this.testIdle();
    },

    onTouchesBegan:function(touches,event){
        var touch = touches[0];
        var location = touch.getLocation();
        if(cc.rectContainsPoint(this._hero.getBoundingBox(),location)){
            this.onClickFlag = true;
        }
    },
    testIdle: function() {
            switch (this.runState) {
                case 1:
                    //原本向右，则保持原本的动画不变
                    break;
                case 2:
                    //原本向左，则停止向右的动作，变为向左
                    this._hero.stopAllActions();
                    this._hero.runAction(cc.RepeatForever.create(this._heroIdle));
                    //this.sprite.runAction(cc.animate(this.runRightAnimation).repeatForever());
                    break;
                default :
                    this._hero.runAction(cc.RepeatForever.create(this._heroIdle));
                    //this.sprite.runAction(cc.animate(this.runRightAnimation).repeatForever());
                    break;
            }
            this.runState = 1;

    },
    testRun: function(){
            switch (this.runState) {
                case 1:
                    //原本向右，则停止向左的动作，变为向右
                    this._hero.stopAllActions();
                    this._hero.stopAction();
                    this._hero.runAction(cc.RepeatForever.create(this._heroRun));
                    //this._hero.runAction(cc.animate(this.runLeftAnimation).repeatForever());
                    break;
                case 2:
                    //原本向左，则保持原本的动画不变
                    break;
                default :
                    this._hero.runAction(cc.RepeatForever.create(this._heroRun));
                    //this._hero.runAction(cc.animate(this.runLeftAnimation).repeatForever());
                    break;
            }
            this.runState = 2;

    },
    testJump: function(){
        //检测jump是否加锁
        if(!this.jumpLock){
            this.jumpLock = 1;
            this._hero.stopAllActions();
            switch (this.runState){
                case 1:
                    //改变动作
                    this._hero.runAction(cc.RepeatForever.create(this._heroJump));
                    // this._hero.runAction(cc.animate(this.jumpRightAnimation));
                    setTimeout(function(){
                        this._hero.runAction(cc.RepeatForever.create(this._heroJump));
                        //this._hero.runAction(cc.animate(this.runRightAnimation).repeatForever());
                        this.jumpLock = 0;
                    }.bind(this),1000)
                    break;
                case 2:
                    //改变动作
                    this._hero.runAction(cc.RepeatForever.create(this._heroJump));
                    //this._hero.runAction(cc.animate(this.jumpLeftAnimation));
                    setTimeout(function(){
                        this._hero.runAction(cc.RepeatForever.create(this._heroJump));
                        //this._hero.runAction(cc.animate(this.runLeftAnimation).repeatForever());
                        this.jumpLock = 0;
                    }.bind(this),1000)
                    break;
                default :
                    break;
            }
        }
    },

    addTarget:function(){

        var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        var frameCache = spriteFrameCache.addSpriteFrames(s_TestEnemyPlist, s_TestEnemyPng);
        var str = "enemy" + Math.floor(Math.random() * 10 + 1) + ".png";
        var frame =spriteFrameCache.getSpriteFrame(str);
        var target = cc.Sprite.createWithSpriteFrame(frame);

        var winSize = cc.Director.getInstance().getWinSize();


        //设置敌人随机出现的X轴的值
        var minX = target.getContentSize().width/2;
        var maxX = winSize.width - target.getContentSize().width/2;
        var rangeX = maxX - minX;
        var actualX = Math.random() * rangeX + minX;
        // 在一定范围内随机敌人的速度
        var minDuration = 5;
        var maxDuration = 8;
        var rangeDuration = maxDuration - minDuration;
        var actualDuration = Math.random() * rangeDuration + minDuration;

        target.setScale(0.4,0.4);
        target.setPosition(cc.p(actualX, winSize.height + target.getContentSize().height/2));

        var actionMove = cc.MoveTo.create(actualDuration ,cc.p(actualX, 0 - target.getContentSize().height));
        var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinished,this);

        target.runAction(cc.Sequence.create(actionMove,actionMoveDone));

        this.addChild(target,1);
        this._enemy.push(target);
    },
    updateGame:function(){
        var targets2Delete = [];
        //获取英雄的碰撞矩形
        var planeRect = this._hero.getBoundingBox();

        var i ;
        //遍历屏幕上的每个敌人
        for( i in this._enemy ){
            //console.log("targetIterator");
            var target = this._enemy[ i ];
            // 获得敌人的碰撞矩形
            var targetRect = target.getBoundingBox();

            if(cc.rectIntersectsRect(planeRect, targetRect)){
                this.testJump();
                targets2Delete.push(target);

            }
        }
        //删除发生碰撞的每个敌人
        for( i in targets2Delete){
            var target = targets2Delete[ i ];

            var index = this._enemy.indexOf(target);
            if (index > -1) {
                this._enemy.splice(index, 1);
            }

            this.removeChild(target);
        }

        targets2Delete = null;

    },
    //倒计时
    countDown:function () {
        var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        var frameCache = spriteFrameCache.addSpriteFrames(s_TestCountdownPlist, s_TestCountdownPng);
        var i;
        var str = "IDLE000" + i + ".png";
        var frame =spriteFrameCache.getSpriteFrame(str);
        var target = cc.Sprite.createWithSpriteFrame(frame);
    }

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