


const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const proto = protoLoader.loadSync("./greeter.proto");
const definition = grpc.loadPackageDefinition(proto);

const Greet = (call, callback) => {
    callback(null, { greetReply: `Hey ${call.request.greeterName}` });
};

const LotsOfGreets = (stream, callback) => {
    let greetCount = 0

    stream.on('data', greet => {
        console.log('[Server] LotsOfGreets: ', greet);
        greetCount++
    })

    stream.on('error', error => {
        console.error('[Server] error: ', error)
    })

    stream.on('end', () => {
        callback(null, { greetReply: `That was ${greetCount} greets!!` });
    })
};

const LotsOfReplies = (stream) => {
    console.log('[Server] LotsOfReplies ', stream.request);
    stream.write({ greetReply: `Hey ${stream.request.greeterName}` });
    stream.write({ greetReply: `did you attend TechTalks?` });
    stream.end();
};

const Conversation = (stream) => {

    stream.on('data', greet => {
        console.log('[Server] Conversation: ', greet);
        stream.write({ greetReply: `Hey ${greet.greeterName}, long time no see` })
        stream.write({ greetReply: `How are the kids?` })
    })

    stream.on('error', error => {
        console.error('[Server] error: ', error)
    })

    stream.on('end', () => {
        stream.end()
    })

}

const server = new grpc.Server();

server.addService(definition.GreetService.service, {
    Greet: Greet,
    LotsOfGreets: LotsOfGreets,
    LotsOfReplies: LotsOfReplies,
    Conversation: Conversation
});

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), port => {
    console.log(`Starting server `)
    server.start();
});