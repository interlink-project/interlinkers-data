SHELL := /bin/bash
# include .env
# export $(shell sed 's/=.*//' .env)

ifeq (service,$(firstword $(MAKECMDGOALS)))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(RUN_ARGS):;@:)
endif

.PHONY: help
help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: run
run: ## run "make run"
	./START.sh

#.PHONY: prod
# prod: ## build and run "make prod"
#	docker-compose -f docker-compose.prod.yml up --build

.PHONY: service
service: ## build and run specific service "make service etherpad"
	docker-compose build $(RUN_ARGS)
	docker-compose up $(RUN_ARGS)