import * as C from "./constants"
import { CellType } from './Board'

class Util {
    public static dumpBoard(board:CellType[]) {
        //console.log(`dumpBoard(${board})`)
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
}

export default Util