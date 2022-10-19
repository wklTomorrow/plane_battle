
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.init()
    },

    init:function(){
        this.hp = 8
        this.isDie = false
        this.normal()
        this.speed = 100 + Math.random() * 150
    },

    normal:function(){
        var anim = this.getComponent(cc.Animation)
        anim.play('enemyNormal_3')
    },

    hit:function(){
        this.hp--
        if(this.hp <= 0){
            game.playSoundEnemyDie()
            this.isDie = true
            this.die()
            return
        }
        var anim = this.getComponent(cc.Animation)
        anim.over = function(){
            this.normal()
        }.bind(this)
        anim.play('enemyHit_3')
    },

    die:function(){
        var anim = this.getComponent(cc.Animation)
        anim.over = function(){
            game.onEnemyKilled(this.node,3)
            game.addScore(500)
        }
        anim.play('enemyDie_3')
    },

    update (dt) {
        if(this.isDie) return
        if(game.gameType == 1 || game.gameType == 3){
            this.node.y = this.node.y - this.speed * dt
        }
        if(this.node.y <= -715){
            game.onEnemyKilled(this.node,3)
        }
    },
});
