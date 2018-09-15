import * as C from "./constants"
import { CellType } from './Board'

class Util {
    public static dumpBoard(board:CellType[]) {
        let dump:string = ''
        for (let cellIx = 0; cellIx < C.NUM_ROWS*C.NUM_COLS; cellIx++) {
            if (cellIx % C.NUM_COLS === 0) {
                dump += '\n'
            }
            dump += board[cellIx]
        }
        console.log(dump)
    }

    public static clearBoard(board:CellType[]) {
        // TODO
        console.log('clearBoard')
        for(let cellIx = 0; cellIx < board.length; cellIx++) {
          board[cellIx] =  '.' as CellType
        }
    }

    public static checkFilledRows(fixed:CellType[]) {
        let filledRowsIndexes:number[] = []
        for(let rowIx = 0; rowIx < C.NUM_ROWS; rowIx++) {
            let isFilled = true
            for(let colIx = 0; colIx < C.NUM_COLS; colIx++) {
                const index = rowIx * C.NUM_COLS + colIx
                if(fixed[index] === '.') {
                    isFilled = false
                    break
                }
            }
            if(isFilled) {
                filledRowsIndexes.push(rowIx)
            }
        }
        return filledRowsIndexes
    }

    public static shiftBoardDown(fixed:CellType[], rowIx:number) {
        console.log('shiftBoardDown()')
        for(let i = (rowIx+1) * C.NUM_COLS - 1; i >= C.NUM_COLS; i--) {
            fixed[i] = fixed[i-C.NUM_COLS]
        }
    }
}

export default Util