#!/usr/bin/env python3

from unittest import TestCase

from pynft.objects import TABLE
from pynft.enumerations import ADDR_FAMILY
from pynft.executor import Executor


executor = Executor()


class TestObjects(TestCase):

	def test_type_checking(self):
		self.assertEqual(1, 1)
	
	def test_JSON_generation(self):
		self.assertEqual(1, 1)
	
	def test_CMD_execution(self):
		self.assertEqual(1, 1)
