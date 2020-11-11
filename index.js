import importer from 'ipfs-unixfs-importer';
import exporter from 'ipfs-unixfs-exporter';
import Ipld from 'ipld';
import Block from 'ipld-block';
import Repo from 'ipfs-repo';
import last from 'it-last';
import BlockService from 'ipfs-block-service';
import getWorkingCID from './workingCID.js';
import getNotWorkingCID from './notWorkingCID.js';

// The purpose of this app is to expose a problem in the IPFS importer/exporter
// NOTE: Run this app with 'node index.js'

function Log(msg) {
  //document.write(msg + '<br>');
  console.log(msg);
}

(async () => {

  // initialize
  Log('Initialize IPFS repo ...');
  const repo = new Repo('ipfs-repo');
  await repo.init({});
  await repo.open();
  let blockService = new BlockService(repo);
  let ipld = new Ipld({ blockService: blockService });
  Log('IPFS repo initialized');
  
  //bafk2bzacebhlhbcnhmvover42qq5bx773c522skieho6nhtbz7d2ow3f4sw24 <- working CID
  let decodedData = new Buffer(getWorkingCID(), 'base64');
  let rawLeavesOption = true;
  
  //bafykbzaceb7xzlm65omwugcavfxxcxclhnwamjbcodz5rz4kbyhenq7m4pivg <- not working CID
  /*
  let decodedData = new Buffer(getNotWorkingCID(), 'base64');
  let rawLeavesOption = false;
  */

  const entry = await last(
    importer(
      [{ content: decodedData }],
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

  // at this point, by using the notWorkingCID, the result of the import will show a different CID
  Log('Import results:');
  Log(entry);

  // try to export the bytes previously pushed
  const result = await exporter(entry.cid, ipld);

  // see the result of the export
  // Log('Exported: ' + JSON.stringify(result));
  
})();
