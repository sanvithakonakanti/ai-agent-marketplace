const dns = require('dns');
const net = require('net');
const uri = 'mongodb+srv://aimarketplaceuser:visionprotectors@ai-marketplace.nji1hrv.mongodb.net/ai-marketplace?retryWrites=true&w=majority';
const hostMatch = uri.match(/mongodb\+srv:\/\/[^@]+@([^\/]+)\//);
if (!hostMatch) {
  console.error('Could not parse Mongo URI host');
  process.exit(1);
}
const host = hostMatch[1];
console.log('Parsed host domain:', host);
const srv = `_mongodb._tcp.${host}`;
console.log('Resolving SRV:', srv);

dns.resolveSrv(srv, (err, addresses) => {
  if (err) {
    console.error('SRV resolve failed:', err.code || err.message);
    process.exit(2);
  }
  console.log('Resolved SRV addresses:', addresses);

  let i = 0;
  const tryConnect = () => {
    if (i >= addresses.length) {
      console.error('All SRV connect attempts failed');
      process.exit(3);
    }
    const a = addresses[i++];
    console.log(`Trying connect to ${a.name}:${a.port} ...`);
    const s = net.createConnection({ host: a.name, port: a.port, timeout: 5000 }, () => {
      console.log('TCP connect successful to', a.name, a.port);
      s.end();
      process.exit(0);
    });

    s.on('error', (e) => {
      console.error('TCP connect error to', a.name, a.port, e.code || e.message);
      s.destroy();
      tryConnect();
    });

    s.on('timeout', () => {
      console.error('TCP connect timeout to', a.name, a.port);
      s.destroy();
      tryConnect();
    });
  };

  tryConnect();
});
