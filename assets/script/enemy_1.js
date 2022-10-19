
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.init()
    },

    init:function(){
        this.isDie = false
        this.speed = 200 + Math.random() * 300
        var anim = this.getComponent(cc.Animation)
        anim.play('enemyNormal_1')
    },

    hit:function(){
        this.isDie = true
        game.playSoundEnemyDie()
        var anim = this.getComponent(cc.Animation)
        anim.play('enemyDie_1')
        anim.over = function(){
            game.onEnemyKilled(this.node,1)
            game.addScore(100)
        }
    },

    update (dt) {
        if(this.isDie) return
        if(game.gameType == 1 || game.gameType == 3){
            this.node.y = this.node.y - this.speed * dt
        }
        if(this.node.y <= -654){
            game.onEnemyKilled(this.node,1)
        }
    },
});
