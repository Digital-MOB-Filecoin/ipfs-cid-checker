
import importer from 'ipfs-unixfs-importer';
import exporter from 'ipfs-unixfs-exporter';
import Ipld from 'ipld';
import Block from 'ipld-block';
import Repo from 'ipfs-repo';
import last from 'it-last';
import BlockService from 'ipfs-block-service';


function Log(msg) {
  document.write(msg + '<br>');
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
  const dataSw24 = 'iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAe1BMVEUAkP////8Ajv8Aif8Ai/8Aiv8Ah/8Akf/s9v/0+v/D3//5/f/c7f/T6P+lz//o9P+z1/8el/+HwP+82//j8f+dy//M5P9frv/b.......';
 
  // put the bytes into an importer sink under the CID 
  // `bafk2bzacebhlhbcnhmvover42qq5bx773c522skieho6nhtbz7d2ow3f4sw24`
  let importedCID;
  const entry = await last(
    importer(
      [{ dataSw24 }],
      {
        put: async (data, { cid }) => {
          importedCID = cid;
          const block = new Block(data, cid);
          return blockService.put(block);
        },
      },
      {//options
      },
    ),
  );
  Log('Imported CID: ' + importedCID);

  // try to export the bytes previously pushed using the same code we 
  // generate for the action on the blue down array
  const result = await exporter(importedCID, ipld);
  Log('Exported: ' + JSON.stringify(result));
})();