const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const proto = protoLoader.loadSync("./greeter.proto");
const GreetService = grpc.loadPackageDefinition(proto).GreetService;


const client = new GreetService('localhost:50051',
    grpc.credentials.createInsecure())

const runGreet = () => {
    client.Greet({ greet: "Hey", greeterName: "Yousef" }, (error, res) => {
        if (error)
            return console.error("[Client] error: ", error)
        console.log("[Client] Greet result: ", res)
    })
}

const runLotsOfGreets = () => {
    const stream = client.LotsOfGreets((error, res) => {
        if (error)
            return console.error("[Client] error: ", error)
        console.log('[Client] LotsOfGreets response: ', res);
    })
    stream.write({ greet: "Hey", greeterName: "Yousef" })
    stream.write({ greet: "how was your day", greeterName: "Yousef" })
    stream.write({ greet: "Hope it was okay", greeterName: "Yousef" })
    stream.end()
}

const runLotsOfReplies = () => {
    const stream = client.LotsOfReplies({ greet: "Hey", greeterName: "Yousef" })

    stream.on('data', greet => {
        console.log('[Client] LotsOfReplies: ', greet);
    })

    stream.on('error', error => {
        console.error('[Client] error: ', error)
    })

    stream.on('end', () => {
        console.log('[Client] LotsOfReplies ended');
    })
}

const runConversation = () => {
    const stream = client.Conversation()

    stream.on('data', greet => {
        console.log('[Client] runConversation: ', greet);
    })

    stream.on('error', error => {
        console.error('[Client] error: ', error)
    })

    stream.on('end', () => {
        console.log('[Client] runConversation ended');
    })
    stream.write({ greet: "Hey", greeterName: "Yousef" })
    stream.write({ greet: "There are fine thanks", greeterName: "Yousef" });
    stream.end();
}


runGreet()
runLotsOfGreets()
runLotsOfReplies()
runConversation()