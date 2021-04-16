# PyNFT Documentation

Welcome to PyNFT's documentation.

PyNFT stands for Python NFT as it is a python overlay for manipulating NFTables. Its use is very similar to NFT's as I tried to keep most of the flexibilty provided by the nft command line tool



## NFTables documentation
>Information on functions, parameters and possible values can be found in this [quick references to nftables](https://wiki.nftables.org/wiki-nftables/index.php/Quick_reference-nftables_in_10_minutes#Extras)

>More Documentation:
[Debian man libnftables-json(5)](https://manpages.debian.org/unstable/libnftables1/libnftables-json.5.en.html)
[Ubuntu man nft(8)](http://manpages.ubuntu.com/manpages/bionic/man8/nft.8.html)
[libnftables-json](https://www.mankier.com/5/libnftables-json#Ruleset_Elements-Rule)
[nftables.py source code](https://git.netfilter.org/nftables/tree/py/nftables.py)



## Base Class

>**pynft** is the name of the module.
>**Executor** is the core class from which can be called the module's functions.



## Executor Functions

Here is a list of functions implemented by PyNFT.
For more informations on Customization Methods, please refer to the NFTables Documentation.

- *Italic* parameters are **optional**.
- All function parameters are **string**s for now.
<!-- This will change in the future with the arrival of NamedTuple function objects -->
<!-- Arguments will later be typed with ENUM overriding classes to secure the entries -->
- All functions return None in case of invalid command syntax or type. As this is abstracted in Executor functions, it should already be dealt with by pynft.
- All functions return a **dict** containing 4 values:
	- *cmd*		=> the name of the called pynft command (string)
	- *rc*		=> the return code (int), 0 == all good
	- *output*	=> the output (dict)
	- *error*	=> the error output if (*rc* != 0)


### Customization Methods

#### Ruleset

- PrintRuleset(*indentOutput*)
	- Prints the result of '*nft list ruleset*' to stdout
	- **indentOutput** default value = 2
- GetRuleset()
	- Returns the ruleset in JSON format


#### Tables

<!--
% nft list tables [<family>]
% nft list table [<family>] <name> [-n] [-a]
% nft (add | delete | flush) table [<family>] <name>
-->

- GetTable(*tableFamily*, *tableName*)
	- **tableFamily** and **tableName** default to **"all"**
	- Calling GetTable with no arguments returns all Tables in JSON format
	- Calling GetTable with 1 argument (tableFamily) returns all Tables from that family in JSON format
	- Calling GetTable with both arguments returns the specified Table with its content (Chains and Rules) in JSON format

- AddTable(`tableFamily`, `tableName`)
	- As **tableFamily** is a string for now, possible values are limited.
	- Refer to nft documentation for more information
	- Adds a Table to the Ruleset

- FlushTable(`tableFamily`, `tableName`)
	- Deletes all Chains and Rules within the specified Table

- DeleteTable(`tableFamily`, `tableIdentifier`)
	- **tableIdentifier** MUST be the table's handle or its name
	- If **tableIdentifier** is the table's handle it SHOULD be a numeric only string (ex: "42")
	- Deletes the specified Table from the Ruleset


#### Chains

<!-- 
% nft (add | create) chain [<family>] <table> <name> [ { type <type> hook <hook> [device <device>] priority <priority> \; [policy <policy> \;] } ]
% nft (delete | list | flush) chain [<family>] <table> <name>
% nft rename chain [<family>] <table> <name> <newname>
-->

- GetChain(`tableFamily`, `tableName`, `chainName`)
	- Returns the specified Chain with the Rules it contains in JSON format

- AddChain(`tableFamily`, `tableName`, `chainName`, *chainType*, *chainHook*, *chainPriority*, *chainPolicy*)
	- default value for **chainType** is *filter*
	- default value for **chainHook** is *prerouting*
	- default value for **chainPriority** is *0*
	- default value for **chainPolicy** is *accept*

- RenameChain(`tableFamily`, `tableName`, `chainName`, `chainNewName`)
	- Renames the specified Chain

- FlushChain(`tableFamily`, `tableName`, `chainName`)
	- Deletes all Rules within the specified Chain

- DeleteChain(`tableFamily`, `tableName`, `chainIdentifier`)
	- **chainIdentifier** MUST be the chain's handle or its name
	- If **chainIdentifier** is the chain's handle it SHOULD be a numeric only string (ex: "42")


#### Rules

<!--
% nft add rule [<family>] <table> <chain> <matches> <statements>
% nft insert rule [<family>] <table> <chain> [position <position>] <matches> <statements>
% nft replace rule [<family>] <table> <chain> [handle <handle>] <matches> <statements>
% nft delete rule [<family>] <table> <chain> [handle <handle>]
-->

- AddRule()
	- Work in progress
- InsertRule()
	- Work in progress
- ReplaceRule()
	- Work in progress
- DeleteRule(`tableFamily`, `tableName`, `chainName`, `ruleHandle`)
	- Deletes the specified Rule



### Shortcuts

Shortcuts should abstract nft rule creation in Flask API

- BanMacSaddr(`addr`)
	- Adds rule to default chain in default table to block MAC source address **addr**
- UnbanMacSaddr(`addr`)
	- Work in progress
	- Deletes rule in default chain in default table blocking MAC source address **addr** if it exists

- BanIpSaddr(`addr`)
	- Adds rule to default chain in default table to block IP source address **addr**
- UnbanIpSaddr(`addr`)
	- Work in progress
	- Deletes rule in default chain in default table blocking IP source address **addr** if it exists










<!-- OTHER INFORMATION -->
<!-- 
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
-->