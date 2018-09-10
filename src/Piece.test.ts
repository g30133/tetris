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
            p.setupPosition(1, 1, 0)
            p.emit(board)
            expect(board[1 * C.NUM_COLS + 1]).toBe('r')
            expect(board[1 * C.NUM_COLS + 2]).toBe('r')
            expect(board[2 * C.NUM_COLS + 1]).toBe('r')
            expect(board[2 * C.NUM_COLS + 2]).toBe('r')
        })

        it('I', () => {
            const p = new Piece('I', 'r')
            p.setupPosition(1, 1, 0)
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
            p.setupPosition(1, 1, 90)
            p.emit(board)
            expect(board[1 * C.NUM_COLS + 1]).toBe('r')
            expect(board[1 * C.NUM_COLS + 2]).toBe('r')
            expect(board[2 * C.NUM_COLS + 1]).toBe('r')
            expect(board[2 * C.NUM_COLS + 2]).toBe('r')
        })

        it('I', () => {
            const p = new Piece('I', 'r')
            p.setupPosition(1, 1, 90)
            p.emit(board)
            Util.dumpBoard(board)
            expect(board[1 * C.NUM_COLS + 1]).toBe('r')
            expect(board[1 * C.NUM_COLS + 2]).toBe('r')
            expect(board[1 * C.NUM_COLS + 3]).toBe('r')
            expect(board[1 * C.NUM_COLS + 4]).toBe('r')
        })
    })
})

describe('testing collision', () => {
    //TODO
    let board:CellType[]
    let fixed:CellType[]
    beforeEach(() => {
        board = []
        for (let i = 0; i < C.NUM_ROWS * C.NUM_COLS; i++) {
            board.push('.')
        }

        fixed = []
        for(let i = 0; i < C.NUM_ROWS * C.NUM_COLS; i++) {
            fixed.push('.')
        }
        for(let i = 0; i <= C.NUM_ROWS * C.NUM_COLS - C.NUM_COLS; i += C.NUM_COLS) {
            fixed[i] = 'r'
        }
        Util.dumpBoard(fixed)
    })
    it('testing piece collision against floor', () => {
        Util.dumpBoard(fixed)
        const p = new Piece('O', 'r')
        p.setupPosition(C.NUM_ROWS - 2, 4, 0)
        p.emit(board)
        Util.dumpBoard(board)
        expect(p.isContactingFloor()).toBe(true)
    })

    it.skip('testing collision piece against walls', () => {
        fixed = []
        const p = new Piece('O', 'r')
        p.setupPosition(4, 0, 0)
        p.emit(board)
        expect(p.isContactingFloor()).toBe(true)
    })
    it.skip('testing collision piece against walls', () => {
        fixed = []
        const p = new Piece('O', 'r')
        p.setupPosition(4, 8, 0)
        p.emit(board)
        Util.dumpBoard(board)
        expect(p.isContactingFloor()).toBe(true)
    })
})