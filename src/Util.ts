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
        for(let i = (rowIx+1) * C.NUM_COLS - 1; i >= C.NUM_COLS; i--) {
            fixed[i] = fixed[i-C.NUM_COLS]
        }
    }

    public static async loadScoresFromServer() {
        console.log('loading scores (download) from server')
        const response = await fetch('http://g30server.herokuapp.com/tetrisScores/loadall')
        const json = await response.json()
        console.log(JSON.stringify(json));
        return json
    }
  
    public static async saveScoreToServer(score:number, name:string) {
        const response = await fetch(
            'http://g30server.herokuapp.com/tetrisScores/save',
            {
                method: 'POST',
                body: JSON.stringify({name:name, score:score}),
                headers:{ 'Content-Type': 'application/json'}
            })
        const json = await response.json()
        return json
    }

    public static async clearScoresOnServer() {
        const response = await fetch('http://g30server.herokuapp.com/tetrisScores', {method: 'DELETE'})
        const json = await response.json()
        return json
    }
}

export default Util