#!/usr/bin/env python3

from typing import get_type_hints
from command_objects import *


filter_table = TABLE(name="spiderman", family=1)
# problem_table = TABLE(name="filter_table", handle=[])
# input_chain = CHAIN(family=["ip", "ip6"], table=filter_table.name, name="input")
# add_filter_table = CMD_ADD(add=[filter_table, TABLE(name="my_table", family="inet")])

# print(input_chain.bake())
# print(add_filter_table.bake())
# print(filter_table.bake())

print(filter_table.bake())
# print(problem_table.bake())

# i = 0
# while (i < len(filter_table)):
# 	print(filter_table[i])
# 	i = i + 1