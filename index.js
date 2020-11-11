
import importer from 'ipfs-unixfs-importer';
import exporter from 'ipfs-unixfs-exporter';
import Ipld from 'ipld';
import Block from 'ipld-block';
import Repo from 'ipfs-repo';
import last from 'it-last';
import BlockService from 'ipfs-block-service';
//import {workingCID} from './workingCID';
import getNotWorkingCID from './notWorkingCID.js';

import * as base64 from 'base-64';


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
  
  // hard code the full bytes of 
  // `bafk2bzacebhlhbcnhmvover42qq5bx773c522skieho6nhtbz7d2ow3f4sw24` as base64
  const workingCID = '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\
  RAAAAABJRU5ErkJgggA=';

//bafk2bzacebhlhbcnhmvover42qq5bx773c522skieho6nhtbz7d2ow3f4sw24
  let decodedData = new Buffer(workingCID, 'base64');
  
//bafykbzaceb7xzlm65omwugcavfxxcxclhnwamjbcodz5rz4kbyhenq7m4pivg
  //let decodedData = new Buffer(getNotWorkingCID(), 'base64');

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
        rawLeaves: true,
      },
    ),
  );

  Log(entry);

  // try to export the bytes previously pushed using the same code we 
  // generate for the action on the blue down array
  const result = await exporter(entry.cid, ipld);
  //Log('Exported: ' + JSON.stringify(result));
  
})();
