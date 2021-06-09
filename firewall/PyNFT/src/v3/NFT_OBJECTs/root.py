#!/usr/bin/env python3


from typing import Any, _GenericAlias
from meta import Options


class NFT_OBJ(Options):

	objname : str = "nftables"


	def bake(self, other:list=None) -> str:
		i = 0
		subres = None
		tobake = other if other != None else self
		res = "[ *head ]" if (other != None) else \
			  "{ *head }" if (self.objname == "") else \
			  "{ \"" + self.objname + "\": { *head } }"
	
		for name in tobake._fields:
			item = tobake.__getattribute__(name)

			if (tobake == self):
				self.__check_attr_type(tobake, name, item)

			if issubclass(type(item), NFT_OBJ):
				subres = item.bake() + ", "
			elif (type(item) == list):
				subres = self.bake(other=item) + ", "
			elif (item != None and (tobake != self or tobake._fields[i] != "objname")):
				subres = "\"" + str(item) + "\", "

			if (subres != None):
				res = res[:res.index("*head")] + "\"" + self._fields[i] + "\": " + subres + res[res.index("*head"):] \
					if tobake == self else \
					res[:res.index("*head")] + subres + res[res.index("*head"):]
				subres = None
			
			i = i + 1

		return self.__cleanup(res)


	def __check_attr_type(self, tobake:Any, name:str, item:Any) -> int:
		value = tobake.__annotations__[name]
		if isinstance(value, _GenericAlias):
			if not isinstance(item, value.__args__):
				raise TypeError(f"{name} attribute must be set to an instance of one of the following types {value.__args__}")
		elif isinstance(value, type):
			if (type(item) != value):
				raise TypeError(f"{name} attribute must be set to an instance of {value}")
		else:
			# comparing attribute type with other than instance of type or Union
			raise ValueError("check_attr_type() internal error")
		return 0


	def __cleanup(self, input:str) -> str:
		res = input.replace("*head", "")
		res = res.replace(",  ]", " ]")
		res = res.replace(",  }", " }")
		res = res.replace("__", "-")
		return res