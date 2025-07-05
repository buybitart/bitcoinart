const WebScoket = require("ws")
const ExampleService = require("../services/example.service")
const AuctionService = require("../services/auction.service")
const UserService = require("../services/user.service")
const TokenService = require("../services/token.service")

function messageAllWebsockets(wsArr, msg) {
    if (!wsArr) return;
    wsArr.forEach(ws => {
        if (ws.readyState === 1) ws.send(JSON.stringify(msg));
    });
}

class DependencyContainer {
    constructor(){
        this.dependencies = new Map()

    }

    add(name, dependency){
        this.dependencies.set(name, dependency)
    }

    get(name){
        if(!this.dependencies.has(name))
            throw new Error(`dependency not found ${name}`)

        return this.dependencies.get(name)
    }
}
const map = new Map()
map.set("test",ExampleService)
map.set("auctionService", AuctionService)
map.set("userService", UserService)
map.set("tokenService", TokenService)
const dependencyContainer = new DependencyContainer()
map.forEach((val, key) => dependencyContainer.add(key, val))


module.exports = { messageAllWebsockets, dependencyContainer }