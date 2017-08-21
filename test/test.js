'use strict';

/*
 * output should match:
 *
 * $ ssh-keygen -E md5 -lvf ~/.ssh/id_dsa.pub
 * 1024 MD5:48:22:9d:e1:e5:13:76:c7:76:12:b8:ac:be:89:7d:6a test@key.com (DSA)
 * +---[DSA 1024]----+
 * |    . + .oo.     |
 * |   o * o..+ .    |
 * |  . = +. o o     |
 * |   . o oo        |
 * |      ..S        |
 * |      .          |
 * |     .           |
 * |     oE..        |
 * |    ..=+         |
 * +------[MD5]------+
 */

const randomart = require('../lib/randomart.js');

console.log(
  randomart([
    0x48,
    0x22,
    0x9d,
    0xe1,
    0xe5,
    0x13,
    0x76,
    0xc7,
    0x76,
    0x12,
    0xb8,
    0xac,
    0xbe,
    0x89,
    0x7d,
    0x6a
  ])
);
