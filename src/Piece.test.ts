import Piece from './Piece';
import Util from './Util'
import * as C from './constants'
import { CellType } from './Board';

describe('piece should render', () => {
    let board:CellType[]

    beforeEach(() => {
        board = []
        for (let i = 0; i < C.NUM_ROWS * C.NUM_COLS; i++) {
            board.push('.')
        }
    })

    describe('with 0deg rotation', () => {
        it('O', () => {
            const p = new Piece('O', 'r')
            p.setupPosition(1, 1, '0deg')
            p.emit(board)
            expect(board[1 * C.NUM_COLS + 1]).toBe('r')
            expect(board[1 * C.NUM_COLS + 2]).toBe('r')
            expect(board[2 * C.NUM_COLS + 1]).toBe('r')
            expect(board[2 * C.NUM_COLS + 2]).toBe('r')
        })

        it('I', () => {
            const p = new Piece('I', 'r')
            p.setupPosition(1, 1, '0deg')
            p.emit(board)
            Util.dumpBoard(board)

            expect(board[1 * C.NUM_COLS + 1]).toBe('r')
            expect(board[2 * C.NUM_COLS + 1]).toBe('r')
            expect(board[3 * C.NUM_COLS + 1]).toBe('r')
            expect(board[4 * C.NUM_COLS + 1]).toBe('r')
        })
    })

    describe('with 90deg rotation', () => {
        it('O', () => {
            const p = new Piece('O', 'r')
            p.setupPosition(1, 1, '90deg')
            p.emit(board)
            expect(board[1 * C.NUM_COLS + 1]).toBe('r')
            expect(board[1 * C.NUM_COLS + 2]).toBe('r')
            expect(board[2 * C.NUM_COLS + 1]).toBe('r')
            expect(board[2 * C.NUM_COLS + 2]).toBe('r')
        })

        it('I', () => {
            const p = new Piece('I', 'r')
            p.setupPosition(1, 1, '90deg')
            p.emit(board)
            Util.dumpBoard(board)
            expect(board[1 * C.NUM_COLS + 1]).toBe('r')
            expect(board[1 * C.NUM_COLS + 2]).toBe('r')
            expect(board[1 * C.NUM_COLS + 3]).toBe('r')
            expect(board[1 * C.NUM_COLS + 4]).toBe('r')
        })
    })
})