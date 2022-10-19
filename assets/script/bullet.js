
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {

    },

    onCollisionEnter: function (other, self) {
        if(self.tag == 11){//子弹
            game.onBulletKilled(self.node)
        }
        if(other.tag == 1){//敌机1
            var js = other.node.getComponent('enemy_1')
            if(js && js.isDie == false){
                js.hit()
            }
        }else if(other.tag == 2){//敌机2
            var js = other.node.getComponent('enemy_2')
            if(js && js.isDie == false){
                js.hit()
            }
        }else if(other.tag == 3){//敌机3
            var js = other.node.getComponent('enemy_3')
            if(js && js.isDie == false){
                js.hit()
            }
        }
        cc.log('碰撞了')
    },

    update (dt) {
        if(game.gameType == 1 || game.gameType == 3){
            this.node.y = this.node.y + 8
        }
        if(this.node.y >= 590){
            game.onBulletKilled(this.node)
        }
    },
});
