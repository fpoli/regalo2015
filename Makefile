
.PHONY: server 
server:
	@node main.js

.PHONY: client
client:
	@python client.py
