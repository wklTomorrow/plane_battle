
cc.Class({
    extends: cc.Component,

    properties: {
        bg_1:cc.Node,
        bg_2:cc.Node,
        gameReady:cc.Node,
        gamePlaying:cc.Node,
        gamePause:cc.Node,
        gameOver:cc.Node,
        hero:cc.Node,
        pre_bullet:cc.Prefab,
        pre_enemy_1:cc.Prefab,
        pre_enemy_2:cc.Prefab,
        pre_enemy_3:cc.Prefab,
        lab_score:cc.Label,
        lab_bestScore:cc.Label,
        bgm:cc.AudioClip,
        soundDieEnemy:cc.AudioClip,
        soundDieHero:cc.AudioClip,
    },

    onLoad () {
        window.game = this

        // 开启碰撞检测系统，未开启时无法检测
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;

        this.isBgMove = false
        this.bg_1.y = 0
        this.bg_2.y = this.bg_1.y + this.bg_1.height
        this.setTouch()
        this.gameReady.active = true
        this.gamePlaying.active = false
        this.gamePause.active = false
        this.gameOver.active = false

        this.gamePause.zIndex = 2
        this.gameOver.zIndex = 2
        this.bulletTime = 0
        this.enemyTime = 0
        this.bulletPool = new cc.NodePool()
        this.enemyPool_1 = new cc.NodePool()
        this.enemyPool_2 = new cc.NodePool()
        this.enemyPool_3 = new cc.NodePool()

        this.gameType = 0//(0:ready,1:playing,2:pause,3:over)
        this.randomNUm = [60,90,100]
        this.scoreNum = 0
        this.bestScoreNum = cc.sys.localStorage.getItem('bestScore_1')
        if(this.bestScoreNum == null){
            this.bestScoreNum = 0
        }
        this.addScore(0)

        this.gameTime = 0

        cc.audioEngine.play(this.bgm, true, 1);
    },

    setTouch:function(){
        this.node.on('touchstart', function (event) {
            console.log('touchstart')
            if(this.gameType == 0){
                this.gameType = 1
            }
            this.gameReady.active = false
            this.gamePlaying.active = true
            this.isBgMove = true
        }, this)

        this.node.on('touchmove', function (event) {
            //console.log('touchmove')
            var pos_hero = this.hero.getPosition()
            var pos_move = event.getDelta()
            var pos_end = cc.v2(pos_hero.x + pos_move.x,pos_hero.y + pos_move.y)
            if(pos_end.x < -290){
                pos_end.x = -290
            }else if(pos_end.x > 290){
                pos_end.x = 290
            }
            if(pos_end.y < -533){
                pos_end.y = -533
            }else if(pos_end.y > 533){
                pos_end.y = 533
            }
            this.hero.setPosition(pos_end)
        }, this)

        this.node.on('touchend', function (event) {
            console.log('touchend')
        }, this)
    },

    addScore:function(score){
        this.scoreNum = this.scoreNum + score
        this.lab_score.string = this.scoreNum
        if(this.bestScoreNum < this.scoreNum){
            this.bestScoreNum = this.scoreNum
            cc.sys.localStorage.setItem('bestScore_1', this.bestScoreNum)
        }
        this.lab_bestScore.string = this.bestScoreNum
    },

    playSoundEnemyDie:function(){
        cc.audioEngine.play(this.soundDieEnemy, false, 1);
    },

    playSoundHeroDie:function(){
        cc.audioEngine.play(this.soundDieHero, false, 1);
    },

    gameOverOver:function(){
        this.gameOver.active = true
        this.gamePause.active = false
    },

    clickBtn:function(sender,str){
        if(str == 'pause'){
            cc.log('点击了暂停按钮')
            this.gameType = 2
            this.gamePause.active = true
        }else if(str == 'continue'){
            cc.log('点击了继续按钮')
            this.gameType = 1
            this.gamePause.active = false
        }else if(str == 'reStart'){
            cc.log('点击了重新开始按钮')
            this.gameTime = 0
            this.scoreNum = 0
            this.addScore(0)
            this.gameType = 1
            this.gameOver.active = false
            this.gamePause.active = false
            this.removeAllBullet()
            this.removeAllEnemy()
            this.hero.setPosition(cc.v2(0,-350))
            var js = this.hero.getComponent('hero')
            if(js){
                js.init()
            }
        }else if(str == 'backHome'){
            cc.log('点击了返回主页按钮')
            this.gameTime = 0
            this.scoreNum = 0
            this.addScore(0)
            this.gameType = 0
            this.gameOver.active = false
            this.gamePause.active = false
            this.gamePlaying.active = false
            this.gameReady.active = true
            this.isBgMove = false
            this.removeAllBullet()
            this.removeAllEnemy()
            this.hero.setPosition(cc.v2(0,-350))
            var js = this.hero.getComponent('hero')
            if(js){
                js.init()
            }
        }
    },

    setBg:function(){
        this.bg_1.y = this.bg_1.y - 2
        this.bg_2.y = this.bg_2.y - 2
        if(this.bg_1.y <= -this.bg_1.height){
            this.bg_1.y = this.bg_2.y + this.bg_1.height
        }
        if(this.bg_2.y <= -this.bg_1.height){
            this.bg_2.y = this.bg_1.y + this.bg_1.height
        }
    },

    creatBullet:function(){
        let bullet = null;
        if (this.bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bullet = this.bulletPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bullet = cc.instantiate(this.pre_bullet)
        }
        bullet.parent = this.node
        var pos = this.hero.getPosition()
        bullet.setPosition(cc.v2(pos.x,pos.y + this.hero.height / 2 + 5))
    },

    createnemy:function(enemyType){
        let enemy = null
        var str = ''
        var pos_enemy = cc.v2(0,0)
        if(enemyType == 1){//创建敌机1
            if (this.enemyPool_1.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                enemy = this.enemyPool_1.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                enemy = cc.instantiate(this.pre_enemy_1)
            }
            str = 'enemy_1'
            pos_enemy.x = -320 + Math.random() * 640
            pos_enemy.y = 666 + Math.random() * 200
        }else if(enemyType == 2){//创建敌机2
            if (this.enemyPool_2.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                enemy = this.enemyPool_2.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                enemy = cc.instantiate(this.pre_enemy_2)
            }
            str = 'enemy_2'
            pos_enemy.x = -320 + Math.random() * 640
            pos_enemy.y = 666 + Math.random() * 200
        }else if(enemyType == 3){//创建敌机3
            if (this.enemyPool_3.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                enemy = this.enemyPool_3.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                enemy = cc.instantiate(this.pre_enemy_3)
            }
            str = 'enemy_3'
            pos_enemy.x = -300 + Math.random() * 600
            pos_enemy.y = 740 + Math.random() * 200
        }
       
        enemy.parent = this.node
        var js = enemy.getComponent(str)
        if(js){
            js.init()
        }
        enemy.setPosition(pos_enemy)
    },

    onBulletKilled: function (bullet) {
        // enemy 应该是一个 cc.Node
        this.bulletPool.put(bullet); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    },

    onEnemyKilled: function (enemy,enemyType) {
        if(enemyType == 1){
            this.enemyPool_1.put(enemy)
        }else if(enemyType == 2){
            this.enemyPool_2.put(enemy)
        }else if(enemyType == 3){
            this.enemyPool_3.put(enemy)
        }
    },

    removeAllBullet:function(){
        var children = this.node.children
        for (let i = children.length - 1; i >= 0; i--) {
            var js = children[i].getComponent('bullet')
            if(js){
               this.onBulletKilled(children[i]) 
            }
        }
    },

    removeAllEnemy:function(){
        var children = this.node.children
        for (let i = children.length - 1; i >= 0; i--) {
            if(children[i].getComponent('enemy_1')){
               this.onEnemyKilled(children[i],1) 
            }else if(children[i].getComponent('enemy_2')){
                this.onEnemyKilled(children[i],2) 
            }else if(children[i].getComponent('enemy_3')){
                this.onEnemyKilled(children[i],3) 
            }
        }
    },

    update (dt) {
        if(this.isBgMove){
            this.setBg()
        }

        var randomNumEnemy = 5
        if(this.gameType == 1){
            this.gameTime++
            if(this.gameTime % 300 == 0){
                randomNumEnemy = randomNumEnemy + Math.round(this.gameTime / 300)
                if(randomNumEnemy > 20){
                    randomNumEnemy = 20
                }
                this.randomNUm[0] = this.randomNUm[0] - 2
                this.randomNUm[1] = this.randomNUm[1] - 1
                if(this.randomNUm[0] < 40){
                    this.randomNUm[0] = 40
                }
                if(this.randomNUm[1] < 75){
                    this.randomNUm[1] = 75
                }
            }
        }

        this.bulletTime++
        if(this.bulletTime == 8){
            this.bulletTime = 0
            if(this.gameType == 1){
                this.creatBullet()
            }
        }

        this.enemyTime++
        if(this.enemyTime == 120){
            this.enemyTime = 0
            var num_random = Math.floor(Math.random() * randomNumEnemy) + 1
            for (let i = 0; i < num_random; i++) {
                if(this.gameType == 1 || game.gameType == 3){//playing
                    var num = Math.random() * 100
                    if(num < this.randomNUm[0]){
                        this.createnemy(1)
                    }else if(num < this.randomNUm[1]){
                        this.createnemy(2)
                    }else if(num < this.randomNUm[2]){
                        this.createnemy(3)
                    }
                }
            }
           
        }
        
        cc.log(this.node.children.length)
       
    },
});
