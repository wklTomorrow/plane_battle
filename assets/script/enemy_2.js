
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.init()
    },

    init:function(){
        this.hp = 5
        this.isDie = false
        this.speed = 150 + Math.random() * 200
        this.normal()
    },

    normal:function(){
        var anim = this.getComponent(cc.Animation)
        anim.play('enemyNormal_2')
    },

    hit:function(){
        this.hp--
        if(this.hp <= 0){
            this.isDie = true
            game.playSoundEnemyDie()
            this.die()
            return
        }
        var anim = this.getComponent(cc.Animation)
        anim.over = function(){
            this.normal()
        }.bind(this)
        anim.play('enemyHit_2')
    },

    die:function(){
        var anim = this.getComponent(cc.Animation)
        anim.over = function(){
            game.onEnemyKilled(this.node,2)
            game.addScore(300)
        }
        anim.play('enemyDie_2')
    },

    update (dt) {
        if(this.isDie) return
        if(game.gameType == 1 || game.gameType == 3){
            this.node.y = this.node.y - this.speed * dt
        }
        if(this.node.y <= -654){
            game.onEnemyKilled(this.node,2)
        }
    },
});
