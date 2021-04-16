# PyNFT Documentation

Welcome to PyNFT's documentation.

PyNFT stands for Python NFT as it is a python API for manipulating NFTables in python programs. Its use is very similar to NFT's as I tried to keep most of the flexibilty provided by the nft command line tool


## Quick disclaimer
>Information on functions, parameters and possible values can be found in this [quick references to nftables](https://wiki.nftables.org/wiki-nftables/index.php/Quick_reference-nftables_in_10_minutes#Extras)

>More Documentation:
[Debian man libnftables-json(5)](https://manpages.debian.org/unstable/libnftables1/libnftables-json.5.en.html)
[Ubuntu man nft(8)](http://manpages.ubuntu.com/manpages/bionic/man8/nft.8.html)
[libnftables-json](https://www.mankier.com/5/libnftables-json#Ruleset_Elements-Rule)
[nftables.py source code](https://git.netfilter.org/nftables/tree/py/nftables.py)

## Base Class

**PyNFT** is the core class from which can be called all of the API's functions.


## API Functions

All functions have the same prototype :  FunctionName(self, args, cmd)

- `self` shouldn't be given if calling the function from an instance of PyNFT
- `args` is a tuple of strings containing the arguments for the nft command
- `cmd` is only used by the shell implementation of PyNFT, it isn't used in the functions

Here is a list of functions implemented by PyNFT.
The arguments describe the strings that should be contained in the `args` parameter (string tuple).
White and *italic* parameters are **optional**.
Optional parameters that are not used **should be \"null\"**


### Tables

<!--
% nft list tables [<family>]
% nft list table [<family>] <name> [-n] [-a]
% nft (add | delete | flush) table [<family>] <name>
-->

- GetTable()
  - returns all tables
- GetTable(     `family`)
  - returns all tables from the *`family`* family
- GetTable(     `family`, `name`)
  - returns the table and it's content (chains & rules)
- AddTable(		`family`, `name`)
- DeleteTable(	`family`, `name`)
- FlushTable(	`family`, `name`)


### Chains

<!-- 
% nft (add | create) chain [<family>] <table> <name> [ { type <type> hook <hook> [device <device>] priority <priority> \; [policy <policy> \;] } ]
% nft (delete | list | flush) chain [<family>] <table> <name>
% nft rename chain [<family>] <table> <name> <newname>
-->

- AddChain(		`family`, `table`, `name`, `type`, `hook`, *device*, `priority`, *policy*)
- CreateChain(	`family`, `table`, `name`, `type`, `hook`, *device*, `priority`, *policy*)
- DeleteChain(	`family`, `table`, `name`)
- ListChain(	`family`, `table`, `name`)
- FlushChain(	`family`, `table`, `name`)
- RenameChain(	`family`, `table`, `name`, `newName`)


### Rules

<!--
% nft add rule [<family>] <table> <chain> <matches> <statements>
% nft insert rule [<family>] <table> <chain> [position <position>] <matches> <statements>
% nft replace rule [<family>] <table> <chain> [handle <handle>] <matches> <statements>
% nft delete rule [<family>] <table> <chain> [handle <handle>]
-->

- AddRule(		`family`, `table`, `chain`, `matches`, `statements`)
- InsertRule(	`family`, `table`, `chain`, *position*, `matches`, `statements`)
- ReplaceRule(`family`, `table`, `chain`, *handle*, `matches`, `statements`)
- DeleteRule(	`family`, `table`, `chain`, *handle*)



Hooks :
                                             Local
                                            process
                                              ^  |      .-----------.
                   .-----------.              |  |      |  Routing  |
                   |           |-----> input /    \---> |  Decision |----> output \
--> prerouting --->|  Routing  |                        .-----------.              \
                   | Decision  |                                                     --> postrouting
                   |           |                                                    /
                   |           |---------------> forward --------------------------- 
                   .-----------.



Python JSON decoding :
>>> import json
>>> def as_complex(dct):
...     if '__complex__' in dct:
...         return complex(dct['real'], dct['imag'])
...     return dct
...
>>> json.loads('{"__complex__": true, "real": 1, "imag": 2}', object_hook=as_complex)
(1+2j)

Python JSON encoding :
>>> import json
>>> class ComplexEncoder(json.JSONEncoder):
...     def default(self, obj):
...         if isinstance(obj, complex):
...             return [obj.real, obj.imag]
...         # Let the base class default method raise the TypeError
...         return json.JSONEncoder.default(self, obj)
...
>>> json.dumps(2 + 1j, cls=ComplexEncoder)
'[2.0, 1.0]'
>>> ComplexEncoder().encode(2 + 1j)
'[2.0, 1.0]'
>>> list(ComplexEncoder().iterencode(2 + 1j))
['[2.0', ', 1.0', ']']