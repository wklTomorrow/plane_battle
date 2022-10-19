
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        this.init()
    },
    
    onCollisionEnter: function (other, self) {
        if(self.tag == 10 && this.isDie == false){//hero
            this.isDie = true
            game.gameType = 3
            this.die()
            game.playSoundHeroDie()
        }
    },

    init:function(){
        this.node.active = true
        this.isDie = false
        this.normal()
    },

    normal:function(){
        var anim = this.getComponent(cc.Animation)
        anim.play('heroNormal')
    },

    die:function(){
        var anim = this.getComponent(cc.Animation)
        anim.play('heroDie')
        anim.over = function(){
            this.node.active = false
            game.gameOverOver()
        }.bind(this)
    },

    update (dt) {},
});
