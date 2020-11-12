# ipfs-cid-checker

Run:
 - 'npm install'
 - 'node index.js'

# Findings:

1. The IPFS-unixfs generates a CID of "testfile" that is different than the one generated by "lotus client import" command. 
2. The size returned by import is different than the size of the original file. 

See the logs bellow:

# import/export 'testfile' using ipfs-unixfs
```
Import results:
{
  cid: CID(bafykbzacebb3vl4i3bfmy52pjg5232546maxbufmwe2egvgf7xa7xg2m4p27c),
  path: 'testfile',
  unixfs: Data {
    type: 'file',
    data: undefined,
    hashType: undefined,
    fanout: undefined,
    blockSizes: [
      262144, 262144,
      262144, 262144,
      262144, 262144,
      262144, 262144,
        1024
    ],
    mode: 420
  },
  size: 2098774
}
imported file size:  2098176
exported file size:  2098176
entry.size: 2098774
```
```
CID Inspector (bafykbzacebb3vl4i3bfmy52pjg5232546maxbufmwe2egvgf7xa7xg2m4p27c)

HUMAN READABLE CID
base32 - cidv1 - dag-pb - (blake2b-256 : 256 : 43BAAF88D84ACC774F49BBADEBBCF30170D0ACB1344354C5FDC1FB9B4CE3F5F1)
MULTIBASE - VERSION - MULTICODEC - MULTIHASH (NAME : SIZE : DIGEST IN HEX)
MULTIBASE
PREFIX: b
NAME: base32
MULTICODEC
CODE: 0x70
NAME: dag-pb
MULTIHASH
CODE: 0xb220
NAME: blake2b-256
BITS: 256
DIGEST (HEX): 43BAAF88D84ACC774F49BBADEBBCF30170D0ACB1344354C5FDC1FB9B4CE3F5F1
CIDV1 (BASE32)
bafykbzacebb3vl4i3bfmy52pjg5232546maxbufmwe2egvgf7xa7xg2m4p27c
```

# import 'testfile' using Lotus
```
ubuntu@retrievalproxy:~/proxy-retrieval/files$ sha256sum testfile
3ad5b0c95e6f115b089c1986d46d7267474dcbefc7c65ff7f65a53301d20701a  testfile
ubuntu@retrievalproxy:~/proxy-retrieval/files$ lotus client import testfile
Import 107, Root bafykbzaceb7xzlm65omwugcavfxxcxclhnwamjbcodz5rz4kbyhenq7m4pivg
```
```
CID Inspector (bafykbzaceb7xzlm65omwugcavfxxcxclhnwamjbcodz5rz4kbyhenq7m4pivg)

HUMAN READABLE CID
base32 - cidv1 - dag-pb - (blake2b-256 : 256 : 7F7CAD9EEB996A1840A96F715C4B3B6C06242270F3D8E78A0E0E46C3ECE3D153)
MULTIBASE - VERSION - MULTICODEC - MULTIHASH (NAME : SIZE : DIGEST IN HEX)
MULTIBASE
PREFIX: b
NAME: base32
MULTICODEC
CODE: 0x70
NAME: dag-pb
MULTIHASH
CODE: 0xb220
NAME: blake2b-256
BITS: 256
DIGEST (HEX): 7F7CAD9EEB996A1840A96F715C4B3B6C06242270F3D8E78A0E0E46C3ECE3D153
CIDV1 (BASE32)
bafykbzaceb7xzlm65omwugcavfxxcxclhnwamjbcodz5rz4kbyhenq7m4pivg
```

lotus version
Daemon:  1.1.2+git.d4cdc6d33.dirty+api0.17.0
Local: lotus version 1.1.2+git.d4cdc6d33.dirty
