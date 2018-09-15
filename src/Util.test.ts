import Util from './Util'
import * as C from './constants'
import { CellType } from './Board';

describe('Util', () => {
    let board:CellType[]

    beforeEach(() => {
        board = []
        for (let i = 0; i < C.NUM_ROWS * C.NUM_COLS; i++) {
            board.push('.')
        }
    })

    describe('testing shiftBoardDown()', () => {
        it('with bottom row the only one filled', () => {
            console.log('with bottom row the only one filled')
            for(let i = (C.NUM_ROWS - 1) * C.NUM_COLS; i < C.NUM_ROWS * C.NUM_COLS; i++) {
                board[i] = 'r'
            }
            Util.dumpBoard(board)
            Util.shiftBoardDown(board, 20)
            Util.dumpBoard(board)
        })

        it('with bottom row filled and some of the ones above it', () => {
            console.log('with bottom row the only one filled')
            for(let i = (C.NUM_ROWS - 1) * C.NUM_COLS; i < C.NUM_ROWS * C.NUM_COLS; i++) {
                board[i] = 'r'
            }
            board[182] = 'r'
            board[185] = 'r'
            board[189] = 'r'
            Util.dumpBoard(board)
            Util.shiftBoardDown(board, 20)
            Util.dumpBoard(board)
        })

        it('with bottom and the one above filled and some of the ones above', () => {
            console.log('with bottom row the only one filled')
            for(let i = (C.NUM_ROWS - 2) * C.NUM_COLS; i < C.NUM_ROWS * C.NUM_COLS; i++) {
                board[i] = 'r'
            }
            board[172] = 'r'
            board[175] = 'r'
            board[179] = 'r'
            Util.dumpBoard(board)
            Util.shiftBoardDown(board, 18)
            Util.dumpBoard(board)
        })
    })
})