'use strict';

(function() {
  const _ = require('lodash');
  const crypto = require('crypto');

  const defaultSymbols = {
    '-2': 'E', // end
    '-1': 'S', // start
    '0': ' ',
    '1': '.',
    '2': 'o',
    '3': '+',
    '4': '=',
    '5': '*',
    '6': 'B',
    '7': 'O',
    '8': 'X',
    '9': '@',
    '10': '%',
    '11': '&',
    '12': '#',
    '13': '/',
    '14': '^'
  };

  const special = { end: -2, start: -1, empty: 0 };

  // width == X AXIS
  // height == Y AXIS
  const defaultBounds = { width: 17, height: 9 };

  /*
   * break down of the board array and how it maps to generated output
   *
   * my brain wants this to be 9 rows of 17 columns,
   * not 17 rows of 9 columns, mirror imaged
   *
   *      TOP                        BOTTOM
   *       +----- Y AXIS / HEIGHT -----+
   * LEFT  |0  1  2  3   4  5  6   7  8|          LEFT
   * +---+ +---------------------------+       +---------@
   * |  0| [0, 0, 0, 0,  0, 0, 0,  0, 0],      |         |
   * X  1| [0, 0, 0, 0,  0, 0, 0,  0, 0],      |         |
   *    2| [0, 0, 1, 0,  0, 0, 0,  0, 0],      |  .      |
   * A  3| [0, 2, 0, 1,  0, 0, 0,  0, 0],      | o .     |
   * X  4| [1, 0, 4, 0,  0, 0, 0,  0, 1],      |. =     .|
   * I  5| [0, 5, 0, 2,  0, 0, 1,  2, 1],      | * o  .o.|
   * S  6| [3, 0, 3, 0,  1, 1, 0, -2, 4],      |+ + .. E=| B
   *    7| [0, 2, 1, 2,  1, 0, 0,  1, 3],    T | o.o.  .+| O
   * /  8| [1, 1, 0, 2, -1, 0, 0,  1, 0],    O |.. oS  . | T
   *    9| [2, 1, 2, 0,  0, 0, 0,  0, 0],    P |o.o      | T
   * W 10| [2, 3, 0, 0,  0, 0, 0,  0, 0],      |o+       | O
   * I 11| [1, 0, 2, 0,  0, 0, 0,  0, 0],      |. o      | M
   * D 12| [0, 1, 0, 0,  0, 0, 0,  0, 0],      | .       |
   * H 14| [0, 0, 0, 0,  0, 0, 0,  0, 0],      |         |
   * | 15| [0, 0, 0, 0,  0, 0, 0,  0, 0],      |         |
   * | 16| [0, 0, 0, 0,  0, 0, 0,  0, 0]       |         |
   * +---+                                     #---------+
   * RIGHT                                        RIGHT
   *
   * // rendered output - match the @ and # corners together
   * +------ TOP ------#
   * |    . + .oo.     |
   * |   o * o..+ .    |
   * |  . = +. o o     |
   * |   . o oo        |
   * |      ..S        |
   * |      .          |
   * |     .           |
   * |     oE..        |
   * |    ..=+         |
   * @---- BOTTOM -----+
   */
  const createBoard = (bounds, value) => {
    let result = [];

    for (let i = 0; i < bounds.width; i++) {
      result[i] = [];

      for (let j = 0; j < bounds.height; j++) {
        result[i][j] = value;
      }
    }

    return result;
  };

  const generateBoard = (data, options) => {
    options = options || {};
    const bounds = options.bounds || defaultBounds;
    let board = createBoard(bounds, special.empty);
    let x = Math.floor(bounds.width / 2);
    let y = Math.floor(bounds.height / 2);

    board[x][y] = special.start;

    _.each(data, function(b) {
      for (let s = 0; s < 8; s += 2) {
        const d = (b >> s) & 3;

        switch (d) {
          case 0: // up
          case 1:
            if (y > 0) {
              y--;
            }
            break;

          case 2: // down
          case 3:
            if (y < bounds.height - 1) {
              y++;
            }
            break;
        }
        switch (d) {
          case 0: // left
          case 2:
            if (x > 0) {
              x--;
            }
            break;

          case 1: // right
          case 3:
            if (x < bounds.width - 1) {
              x++;
            }
            break;
        }

        if (board[x][y] >= special.empty) {
          board[x][y]++;
        }
       }
    });

    board[x][y] = special.end;

    return { board: board, bounds: bounds };
  };

  const boardToString = (board, options) => {
    options = options || {};
    const symbols = options.symbols || defaultSymbols;
    const width = board.bounds.width;
    const height = board.bounds.height;
    let result = [];

    for (let i = 0; i < height; i++) {
      result[i] = [];

      for (let j = 0; j < width; j++) {
        result[i][j] = symbols[board.board[j][i]] || symbols[special.empty];
      }

      result[i] = result[i].join('');
    }

    return result.join('\n');
  };

  const randomart = (data, options) => {
    data = data || crypto.pseudoRandomBytes(16);
    options = options || {};
//    return generateBoard(data, options);
   return boardToString(generateBoard(data, options), options);
  };

  module.exports = randomart;
})();
