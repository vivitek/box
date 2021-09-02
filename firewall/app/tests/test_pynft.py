#!/usr/bin/env python3

from unittest import TestCase

from pynft.objects import TABLE
from pynft.enumerations import ADDR_FAMILY
from pynft.executor import Executor


executor = Executor()


#
#	Executor Tests
#

class TestExecutor(TestCase):

	def something(self):
		self.assertEqual(1, 1)


#
#	NFT_OBJ Tests
#

class TestObjects(TestCase):

	def test_type_checking(self):
		self.assertEqual(1, 1)
		# try:
		# test_table = TABLE(family=ADDR_FAMILY.INET)
		# except TypeError: