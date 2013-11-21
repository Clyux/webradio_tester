test-cov:
	karma start karma.conf.js --no-auto-watch --single-run

coveralls:
	cat ./coverage/*/lcov.info | ./node_modules/coveralls/bin/coveralls.js