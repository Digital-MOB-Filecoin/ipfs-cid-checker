import importer from 'ipfs-unixfs-importer';
import exporter from 'ipfs-unixfs-exporter';
import Ipld from 'ipld';
import Block from 'ipld-block';
import Repo from 'ipfs-repo';
import last from 'it-last';
import BlockService from 'ipfs-block-service';
import * as fs from 'fs';

function getFileSize(file) {
  let stats = fs.statSync(file);
  return stats.size;
}

// The purpose of this app is to expose a problem in 
// the IPFS importer/exporter, related to rawLeaves = false (CIDs with codec != 'raw').
// NOTE: Run this app with 'npm install' followed by 'node index.js'.
(async () => {

  // initialize
  console.log('Initialize IPFS repo ...');
  const repo = new Repo('ipfs-repo');
  await repo.init({});
  await repo.open();
  let blockService = new BlockService(repo);
  let ipld = new Ipld({ blockService: blockService });
  console.log('IPFS repo initialized');
  
  let rawLeavesOption = false;

  const source = [{
    path: 'testfile',
    content: fs.createReadStream('testfile')
  }]

  const entry = await last(
    importer(
      source,
      {
        put: async (data, { cid }) => {
          const block = new Block(data, cid);
          return blockService.put(block);
        },
      },
      { 
        cidVersion: 1,
        hashAlg: 'blake2b-256',
        rawLeaves: rawLeavesOption,
      },
    ),
  );

  console.log('Import results:');
  console.log(entry);

  // try to export the bytes previously pushed
  const result = await exporter(entry.cid, ipld);

  let exportedBytes = Buffer.from("");
  for await (const buf of result.content()) {
    exportedBytes = Buffer.concat([exportedBytes, buf]);
  }

  // write it to a file
  fs.writeFileSync("testfile.export", exportedBytes);

  console.log('imported file size: ', getFileSize('testfile'));
  console.log('entry.size: ' + entry.size);
  console.log('exported file size: ', getFileSize('testfile.export'));

  

})();
