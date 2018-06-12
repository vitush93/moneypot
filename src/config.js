// ignored config.local.js overrides the default configuration
import local from './config.local'; // export default {}

const config = {
    ipfs: {
        init: true,
        start: true,
        EXPERIMENTAL: {
            pubsub: true
        },
        config: {
            Addresses: {
                Swarm: [
                    // personal servers
                    '/dns4/slackuj.cz/tcp/443/wss/p2p-webrtc-star'
                    // '/ip4/127.0.0.1/tcp/443/wss/p2p-webrtc-star'

                    // public servers
                    // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
                    // '/dns4/ws-star-signal-2.servep2p.com/tcp/443/wss/p2p-websocket-star',
                    // '/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star' 
                ]
            }
        }
    },

    orbitdb: {
        directory: './orbitdb',
        options: {

        }
    },

    eventlog: {
        name: 'event-log',
        options: {
            write: ['*'],
            sync: true,
            create: true,
            replicate: true,
            localOnly: false
        }
    }
}

export default { ...config, ...local }