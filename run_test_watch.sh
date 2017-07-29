#!/bin/bash

# This is a workaround for cygwin and just another way to run npm run test:watch.
# For some reason node process hangs on cancelation if this is run via npm scripts.
mocha --compilers js:babel-core/register\
      --require ./test/setup.js\
      --watch\
      --watch-extensions jsx\
      {test,src}/**/*_test.js*\
      --colors
