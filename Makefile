EXIT_ON_ERROR = set -e;

.PHONY: rails
rails:
	@bundle install
	@bin/rails db:migrate
	@bin/rails s -e development

.PHONY: rails-test
rails-test:
	@bin/rails test

.PHONY: vite
vite:
	@npm install
	@npm run dev

.PHONY: vite-test
vite-test:
	@npm test

.PHONY: dev
dev: rails vite

.PHONY: test
test: rails-test vite-test
