// Optional bootstrap when npm is unavailable in the execution environment.
// Installs only the pinned, integrity-checked PostgreSQL WASM test runtime.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
(async () => {
  const version=require('../package.json').devDependencies['@electric-sql/pglite'];
  const metadata=await fetch(`https://registry.npmjs.org/@electric-sql/pglite/${version}`).then(r=>{if(!r.ok)throw new Error(r.status);return r.json();});
  const compressed=Buffer.from(await fetch(metadata.dist.tarball).then(r=>{if(!r.ok)throw new Error(r.status);return r.arrayBuffer();}));
  const [algorithm,digest]=metadata.dist.integrity.split('-');
  if(crypto.createHash(algorithm).update(compressed).digest('base64')!==digest)throw new Error('Package integrity mismatch');
  const archive=zlib.gunzipSync(compressed);
  const destination=path.resolve(__dirname,'../.catalog-test-deps/pglite');
  for(let offset=0;offset+512<=archive.length;) {
    const header=archive.subarray(offset,offset+512);
    const name=header.subarray(0,100).toString().replace(/\0.*$/s,'');
    if(!name)break;
    const size=parseInt(header.subarray(124,136).toString().replace(/\0.*$/s,'').trim()||'0',8);
    const kind=header[156];
    const relative=name.replace(/^package\//,'');
    const target=path.resolve(destination,relative);
    if(target!==destination&&!target.startsWith(destination+path.sep))throw new Error('Unsafe package path');
    if(kind===0||kind===48){fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,archive.subarray(offset+512,offset+512+size));}
    offset+=512+Math.ceil(size/512)*512;
  }
  console.log(`PostgreSQL test runtime ready: @electric-sql/pglite ${version}`);
})().catch(error=>{console.error(error);process.exitCode=1;});
