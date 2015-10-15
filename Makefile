.PHONY: server client deploy open logs

server:
	npm start

client:
	python client.py

deploy:
	git push heroku master

open:
	heroku open

logs:
	heroku logs
