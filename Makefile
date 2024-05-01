SHELL := /bin/bash


diagram:
	d2 architecture.d2 architecture.svg -t 300 --layout elk --sketch
