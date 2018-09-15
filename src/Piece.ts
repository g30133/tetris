import * as C from './constants'
import { CellType } from './Board';

export type PieceColor = 'c' | 'y' | 'p' | 'g' | 'r' | 'b' | 'o'
export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
export type DirectionType = 's' |'e' | 'w'
export type rotateType = '0deg' | '90deg' | '180deg' | '270deg'

interface unitDelta {
    dr:number
    dc:number
}

class Piece {
    type:PieceType
    color:PieceColor
    unitIxs:number[] = []
    unitDeltas:unitDelta[] = []
    width:number
    height:number
    startRow:number
    startCol:number
    rotateAngle:number

    constructor(type:PieceType, color:PieceColor) {
        this.type = type
        this.color = color

        this.init()
    }

    private init() {
        switch(this.type) {
            case 'O':
                this.width = 2
                this.height = 2
                this.unitDeltas.push({ dr:0, dc:0 })
                this.unitDeltas.push({ dr:0, dc:1 })
                this.unitDeltas.push({ dr:1, dc:0 })
                this.unitDeltas.push({ dr:1, dc:1 })
            break
            case 'I':
                this.width = 1
                this.height = 4
                this.unitDeltas.push({ dr:0, dc:0 })
                this.unitDeltas.push({ dr:1, dc:0 })
                this.unitDeltas.push({ dr:2, dc:0 })
                this.unitDeltas.push({ dr:3, dc:0 })
            break
            case 'T':
                this.width = 3
                this.height = 2
                this.unitDeltas.push({ dr:0, dc:0 })
                this.unitDeltas.push({ dr:0, dc:1 })
                this.unitDeltas.push({ dr:0, dc:2 })
                this.unitDeltas.push({ dr:1, dc:1 })
            break
            case 'S':
                this.width = 3
                this.height = 2
                this.unitDeltas.push({ dr:0, dc:2 })
                this.unitDeltas.push({ dr:0, dc:1 })
                this.unitDeltas.push({ dr:1, dc:1 })
                this.unitDeltas.push({ dr:1, dc:0 })
            break
            case 'Z':
                this.width = 3
                this.height = 2
                this.unitDeltas.push({ dr:0, dc:0 })
                this.unitDeltas.push({ dr:0, dc:1 })
                this.unitDeltas.push({ dr:1, dc:1 })
                this.unitDeltas.push({ dr:1, dc:2 })
            break
            case 'J':
                this.width = 3
                this.height = 2
                this.unitDeltas.push({ dr:0, dc:0 })
                this.unitDeltas.push({ dr:1, dc:0 })
                this.unitDeltas.push({ dr:1, dc:1 })
                this.unitDeltas.push({ dr:1, dc:2 })
            break
            case 'L':
                this.width = 3
                this.height = 2
                this.unitDeltas.push({ dr:1, dc:0 })
                this.unitDeltas.push({ dr:1, dc:1 })
                this.unitDeltas.push({ dr:1, dc:2 })
                this.unitDeltas.push({ dr:0, dc:2 })
                break
            default:
        }
    }

    // move one cell to the direction
    public move(direction:DirectionType) {
        switch (direction) {
            case 's':
                this.startRow++
            break;
            case 'e':
                this.startCol++
            break;
            case 'w':
                this.startCol--
            break;
            default:
                console.log('UNEXPECTED DIRECTION:' + direction)
            break
        }
        console.log('this.rotateAngle:' + this.rotateAngle)
        this.setupPosition(this.startRow, this.startCol, this.rotateAngle)
    }

    public rotate(rotateAngle:number) {
        //should check if spaces are empty before rotating
        this.unitIxs = []
        for(let i = 0; i < this.unitDeltas.length; i++) {
            const delta = this.unitDeltas[i]
            switch(rotateAngle) {
                case 0: {
                    const r = this.startRow + delta.dr
                    const c = this.startCol + delta.dc
//                    if(board[C.NUM_COLS * r + c] === '.') {

                        if(r >= 0 && r < C.NUM_ROWS && c >= 0 && c < C.NUM_COLS) {
                            this.unitIxs.push(C.NUM_COLS * r + c)
                        }
                        this.rotateAngle = 0
//                    }
                }
                break
                case 90: {
                    const r = this.startRow + delta.dc
                    const c = this.startCol - delta.dr + (this.height - 1)
                    if(r >= 0 && r < C.NUM_ROWS && c >= 0 && c < C.NUM_COLS) {
                        this.unitIxs.push(C.NUM_COLS * r + c)
                    }
                    this.rotateAngle = 90
                }
                break
                case 180: {
                    const r = this.startRow - delta.dr + (this.height - 1)
                    const c = this.startCol - delta.dc + (this.width - 1)
                    if(r >= 0 && r < C.NUM_ROWS && c >= 0 && c < C.NUM_COLS) {
                        this.unitIxs.push(C.NUM_COLS * r + c)
                    }
                    this.rotateAngle = 180
                }
                break
                case 270: {
                    const r = this.startRow - delta.dc + (this.width - 1)
                    const c = this.startCol + delta.dr
                    if(r >= 0 && r < C.NUM_ROWS && c >= 0 && c < C.NUM_COLS) {
                        this.unitIxs.push(C.NUM_COLS * r + c)
                    }
                    this.rotateAngle = 270
                }
                break
                default: {
                    console.log('unexpected rotateAngle:' + rotateAngle)
                }
            }
        }
    }

    public moveAllTheWayDown(fixed:CellType[]) {
        console.log('this.moveAllTheWayDown()')
        loop1:
        while(true) {
            for(let i = 0; i < this.unitIxs.length; i++) {
                if(this.unitIxs[i] + C.NUM_COLS > C.NUM_ROWS * C.NUM_COLS || fixed[this.unitIxs[i] + C.NUM_COLS] !== '.') {
                    break loop1
                }
            }
            this.move('s')
            console.log('this.unitIx[0]:' + this.unitIxs)
        }
    }

    public setupPosition(startRow:number, startCol:number, rotateAngle:number) {
        this.startRow = startRow
        this.startCol = startCol
        this.unitIxs = []
        this.rotate(rotateAngle)
    }


/*    public isContactingWall() {
        //right wall
        if((unitIx % C.NUM_COLS) >= C.NUM_COLS-1  && direction === 'e') {
            console.log('HIT RIGHT WALL')
            return true
        }

        //left wall
        if((unitIx % C.NUM_COLS) <= 0 && direction === 'w') {
            console.log('HIT LEFT WALL')
            return true
        }
    }
*/
    public isContactingFloor() {
        // checking against floor
        console.log('isContactingFloor')
        for(const unitIx of this.unitIxs) {
            console.log('unitIx:' + unitIx)
            //floor
            if(unitIx + C.NUM_COLS >= C.NUM_COLS * C.NUM_ROWS) {
                console.log('HIT FLOOR')
                return true
            }
        }
        return false
    }

    public isContactingFixed(fixed:CellType[]) {
        for(let i = 0; i < fixed.length; i++) {
            if(fixed[i] !== '.') {
              for(const pieceIx of this.unitIxs) {
                if(pieceIx === i - C.NUM_COLS) {
                    console.log('return true')
                    return true
                }
              }
            }
          }
        console.log('return false')
        return false
    }

    public isRotateable(fixed:CellType[], rotateAngle:number) {
        for(let i = 0; i < this.unitDeltas.length; i++) {
            const delta = this.unitDeltas[i]
            //check if each unit of the piece is inside of the board, if not, return false
            console.log('this.startCol + delta.dc:' + (this.startCol + delta.dc) % C.NUM_COLS)
            //checking is different for each rotateAngle
//            if((this.startCol + delta.dc) % C.NUM_COLS >= C.NUM_COLS - 1) {
//                console.log('a piece is outside of the board')
//                return false
//            }
            let index = 0
            switch(rotateAngle) {
                case 0: {
                    const r = this.startRow + delta.dr
                    const c = this.startCol + delta.dc
                    index = C.NUM_COLS * r + c
                    //TODO for each angle
                    if(c >= C.NUM_COLS) {
                        console.log('a piece is outside of the board')
                        return false
                    }
                }
                break
                case 90: {
                    const r = this.startRow + delta.dc
                    const c = this.startCol - delta.dr + (this.height - 1)
                    index = C.NUM_COLS * r + c
                    if(c >= C.NUM_COLS) {
                        console.log('a piece is outside of the board')
                        return false
                    }
                }
                break
                case 180: {
                    const r = this.startRow - delta.dr + (this.height - 1)
                    const c = this.startCol - delta.dc + (this.width - 1)
                    index = C.NUM_COLS * r + c
                    if(c >= C.NUM_COLS) {
                        console.log('a piece is outside of the board')
                        return false
                    }
                }
                break
                case 270: {
                    const r = this.startRow - delta.dc + (this.width - 1)
                    const c = this.startCol + delta.dr
                    index = C.NUM_COLS * r + c
                    if(c >= C.NUM_COLS) {
                        console.log('a piece is outside of the board')
                        return false
                    }
                }
                break
            }
            if(fixed[index] !== '.') {
                console.log('isRotateable() false:' + fixed[this.unitIxs[index]] + ' index:' + index)
                return false
            }
        }
        console.log('isRotateable() true')
        return true
    }

    public isMovableTo(fixed:CellType[], direction:DirectionType) {
        for(let i = 0; i < this.unitIxs.length; i++) {
            if(direction === 'w') {
                if((this.unitIxs[i] % C.NUM_COLS) <= 0 && direction === 'w') return false
                if(fixed[this.unitIxs[i] - 1] !== '.') return false
            } else if(direction === 'e') {
                if((this.unitIxs[i] % C.NUM_COLS) >= C.NUM_COLS-1  && direction === 'e') return false
                if(fixed[this.unitIxs[i] + 1] !== '.') return false
            }
        }
        return true
    }

    public emit(board:CellType[]) {
        for(let index = 0; index < this.unitIxs.length; index++) {
            board[this.unitIxs[index]] = this.color 
        }
    }
}
export default Piece