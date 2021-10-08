#!/usr/bin/env python3

from unittest import TestCase

from	pynft.executor		import Executor
import	pynft.enumerations	as ENUM
import	pynft.objects		as OBJ
import	pynft.commands		as CMD


pynft = Executor()


class TestObjects(TestCase):

	def test_type_checking(self):
		table_1 = OBJ.TABLE(family="a very illegal string", name="table_1")
		res = pynft.execute(CMD.ADD(add=table_1), "add_table_1")
		self.assertEqual(res['rc'], -1)

	def test_JSON_generation(self):
		table_1 = OBJ.TABLE(family=ENUM.ADDR_FAMILY.INET, name="table_1")
		self.assertEqual(table_1.bake(), '{ "table": { "name": "table_1", "family": "inet" } }')
	
	def test_CMD_execution(self):
		table_1 = OBJ.TABLE(family=ENUM.ADDR_FAMILY.INET, name="table_1")
		res = pynft.execute(CMD.ADD(add=table_1), "add_table_1")
		self.assertEqual(res['rc'], 0)
