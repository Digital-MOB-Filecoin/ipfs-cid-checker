import importer from 'ipfs-unixfs-importer';
import exporter from 'ipfs-unixfs-exporter';
import Ipld from 'ipld';
import Block from 'ipld-block';
import Repo from 'ipfs-repo';
import last from 'it-last';
import BlockService from 'ipfs-block-service';
import getWorkingCID from './CidThatWorks.js';
import getNotWorkingCID from './CidThatFails.js';
import * as fs from 'fs';
import textEncoding from 'text-encoding';


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
  
  // test with an working CID: bafk2bzacebhlhbcnhmvover42qq5bx773c522skieho6nhtbz7d2ow3f4sw24
  // ** uncomment the following lines to test **
  //let importedData = new Buffer(getWorkingCID(), 'base64');
  //let rawLeavesOption = true;
  
  // test with a CID that fails: bafykbzaceb7xzlm65omwugcavfxxcxclhnwamjbcodz5rz4kbyhenq7m4pivg
  let importedData = new Buffer(getNotWorkingCID(), 'base64');
  let rawLeavesOption = false;

  const entry = await last(
    importer(
      [{ content: importedData }],
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

  // at this point, by using the notWorkingCID, the result of the import will show a different CID name
  console.log('Import results:');
  console.log(entry);

  // try to export the bytes previously pushed
  const result = await exporter(entry.cid, ipld);

  // see the result of the export
  // console.log('Exported: ' + JSON.stringify(result));

  // stream the content of unixfs node after export
  const size = entry.size;
  const exportedBytes = new Uint8Array(size);
  let offset = 0;
  for await (const buf of result.content()) {
    exportedBytes.set(buf, offset)
    offset += buf.length
  }

  // log the content of unixfs node after export
  console.log(exportedBytes);

  // write it to a file
  fs.writeFileSync("Exported" + result.name + ".txt", exportedBytes);

  var exportedData = new textEncoding.TextDecoder("utf-8").decode(exportedBytes);
  
  // compare the bytes from unixfs node with 
  // console.log('importedData = ' + importedData);
  // console.log('exportedData = ' + exportedData);
  if (importedData == exportedData) {
    console.log('Success');
  } else {
    console.log('Failed');
  }
  
})();

/*
Notice the padded bytes after export:

-> last bytes of CID that fails (base64 encoded):
W8NK8w8YxDdlzb11SE0nKsu0za4HF7UMYtf+znddUnJOvArTaZ8hpwpnDDxwIgQD9yzJ/TsZTb0qIjU9qvq5CKK

-> last bytes of CID that fails (base64 encoded), after being exported:
W8NK8w8YxDdlzb11SE0nKsu0za4HF7UMYtf+znddUnJOvArTaZ8hpwpnDDxwIgQD9yzJ/TsZTb0qIjU9qvq5CKK
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
*/