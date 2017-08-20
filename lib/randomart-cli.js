'use strict';

const argv = require('minimist')(process.argv.slice(2), { alias: { h: 'help', v: 'version' } });

Object.keys(argv).forEach(option => {
  switch (option) {
    case 'h':
      console.log('-h or --help called');
      process.exit(0);
      break;

    case 'v':
      console.log('-v or --version called');
      process.exit(0);
      break;
  }
});
