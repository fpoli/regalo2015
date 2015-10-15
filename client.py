#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import random
import time

state_url = "https://giove.herokuapp.com/robot/state"
action_url = "https://giove.herokuapp.com/robot/action"
session = requests.session()
errors = False
state = {}

def get_state():
	print "Get state"
	try:
		res = session.get(state_url)
		if res.status_code == 200:
			return res.json()
		else:
			print "Error HTTP {0} {1}".format(res.status_code, res.text)
			errors = True
	except requests.ConnectionError as e:
		print "Error at get_state. {0}".format(e)
		errors = True
	return {}

def send_move(direction):
	print "Send move:", direction
	try:
		res = session.get(action_url, params={"move": direction})
		if res.status_code == 200:
			print res.text
		else:
			print "Error HTTP {0} {1}".format(res.status_code, res.text)
			errors = True
	except requests.exceptions.RequestException as e:
		print "Error at send_move. {0}".format(e)
		errors = True

### MAIN ###

state = get_state()
while not errors:
	# Move
	direction = random.choice(["left", "right", "up", "down"])
	send_move(direction)
	
	# Read state
	state = get_state()
	print "Position: ({0}, {1})".format(
		state["robot"]["position"]["x"],
		state["robot"]["position"]["y"]
	)
	print "Memory: {0}".format(state["robot"]["memory"])
	
	# Wait
	time.sleep(100)
