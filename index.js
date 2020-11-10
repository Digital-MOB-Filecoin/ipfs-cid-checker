
import importer from 'ipfs-unixfs-importer';
import exporter from 'ipfs-unixfs-exporter';

//import CID from 'cids';
import Ipld from 'ipld';
import Block from 'ipld-block';
import Repo from 'ipfs-repo';
import last from 'it-last';
import BlockService from 'ipfs-block-service';

function Log(msg) {
  document.write(msg + '<br>');
}

(async () => {
  // hard code the full bytes of 
  // `bafk2bzacebhlhbcnhmvover42qq5bx773c522skieho6nhtbz7d2ow3f4sw24` 
  // as base64 (here are the first few)

  // initialize
  Log('Initialize ipfs repo ...');

  const repo = new Repo('./ipfs-repo');
  
  await repo.init({});
  await repo.open();

  Log('ipfs-repo is ready');

  let blockService = new BlockService(repo);
  let ipld = new Ipld({ blockService: blockService });
  
  // hard code the full bytes of 
  // `bafk2bzacebhlhbcnhmvover42qq5bx773c522skieho6nhtbz7d2ow3f4sw24` 
  // as base64 (here are the first few)
  const data_sw24 = 'iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAe1BMVEUAkP////8Ajv8Aif8Ai/8Aiv8Ah/8Akf/s9v/0+v/D3//5/f/c7f/T6P+lz//o9P+z1/8el/+HwP+82//j8f+dy//M5P9frv/b.......';
  //
  // Push `data_sw24` into an importer sink under the CID 
  //`bafk2bzacebhlhbcnhmvover42qq5bx773c522skieho6nhtbz7d2ow3f4sw24`
  //

  let Cid;

  const entry = await last(
    importer(
      [{ data_sw24 }],
      {
        put: async (data, { cid }) => {
          Cid = cid;
          const block = new Block(data, cid);
          return blockService.put(block);
        },
      },
      {
      },
    ),
  );

  //
  // Try to export the bytes previously pushed using the same code we 
  // generate for the action on the blue down array
  //
  Log('Cid: ' + Cid);

  const result = await exporter(Cid, ipld);
  Log('Export: ' + JSON.stringify(result));

  
})();



// import a file and export it again
/*const importer = require('ipfs-unixfs-importer')
const exporter = require('ipfs-unixfs-exporter')
 
const files = []
 
for await (const file of importer([{
  path: '/foo/bar.txt',
  content: new Uint8Array([0, 1, 2, 3])
}], ipld)) {
  files.push(file)
}
 
console.info(files[0].cid) // Qmbaz
 
const entry = await exporter(files[0].cid, ipld)
 
console.info(entry.cid) // Qmqux
console.info(entry.path) // Qmbaz/foo/bar.txt
console.info(entry.name) // bar.txt
console.info(entry.unixfs.fileSize()) // 4
 
// stream content from unixfs node
const size = entry.unixfs.fileSize()
const bytes = new Uint8Array(size)
let offset = 0
 
for await (const buf of entry.content()) {
  bytes.set(buf, offset)
  offset += chunk.length
}
 
console.info(bytes) // 0, 1, 2, 3
*/
