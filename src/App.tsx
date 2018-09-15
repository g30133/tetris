import * as React from 'react';
import './App.css';

import * as C from './constants'
import Board, { CellType } from './Board'
import Piece, { PieceColor, PieceType, DirectionType } from './Piece';
import Util from './Util';
//import Util from './Util'

interface AppState {
  board: CellType[]
  currRotateIx: number
}

class App extends React.Component<any, AppState> {

  // instance variables
  currentPiece: Piece
  fixed: CellType[]
  pieceTypes: PieceType[]
  colorTypes: PieceColor[]
  direction: DirectionType
  numSupportedLoops: number

  constructor(props:any) {
    super(props)

    this.gameLoop = this.gameLoop.bind(this)

    this.state = {
      board: [],
      currRotateIx: 0
    }

    this.init()

  }

  private init() {
    for (let i = 0; i < C.NUM_ROWS * C.NUM_COLS; i++) {
      this.state.board.push('.')
    }

    this.direction = 's'
    this.pieceTypes = []

    this.pieceTypes.push('I')
    this.pieceTypes.push('J')
    this.pieceTypes.push('L')
    this.pieceTypes.push('O')
    this.pieceTypes.push('S')
    this.pieceTypes.push('T')
    this.pieceTypes.push('Z')

    this.colorTypes = []
    this.colorTypes.push('c')
    this.colorTypes.push('b')
    this.colorTypes.push('o')
    this.colorTypes.push('y')
    this.colorTypes.push('g')
    this.colorTypes.push('p')
    this.colorTypes.push('r')

    const index = Math.floor(Math.random() * this.pieceTypes.length)
    this.currentPiece = new Piece(this.pieceTypes[index], this.colorTypes[index])
    this.currentPiece.setupPosition(0, 5, this.state.currRotateIx)

    this.fixed = Array.from(this.state.board)

    this.numSupportedLoops = 0

    document.addEventListener('keydown', (event) => {
      if(event.key === 'ArrowLeft') {
        this.onKeyDown('w')
      } else if(event.key === 'ArrowRight') {
        this.onKeyDown('e')
      } else if(event.key === 'ArrowDown') {
        const newBoard = Array.from(this.fixed)
        if(this.isSupported() === false) {
          this.currentPiece.move('s')
          this.currentPiece.emit(newBoard)
          this.setState(prevState => {
            return {
              board: newBoard
            }
          })
        }
      } else if(event.key === 'ArrowUp') {        
        if(this.currentPiece.isRotateable(this.fixed, (this.state.currRotateIx + 90) % 360)) {
          const newBoard = Array.from(this.fixed)
          this.currentPiece.rotate((this.state.currRotateIx + 90) % 360)
          this.currentPiece.emit(newBoard)
          this.setState(prevState => {
            return {
              board: newBoard,
              currRotateIx: (prevState.currRotateIx + 90) % 360
            }
          }, () => {
            console.log('currRotateIx:' + this.state.currRotateIx)
          })
        }
      } else if(event.key === ' '){
        const newBoard = Array.from(this.fixed)
        this.currentPiece.moveAllTheWayDown(this.fixed)
        this.currentPiece.emit(newBoard)
        //we dont want the piece to be able to move if space is pressed
        this.numSupportedLoops = 3
        this.setState(prevState => {
          return {
            board: newBoard
          }
        })
      }
    })
  }

  componentDidMount() {
    this.gameLoop()
  }

  private onKeyDown(direction:DirectionType) {
    // TODO
//    this.direction = direction
    if(this.isSupported() === false || this.numSupportedLoops < 3) {
      if(this.currentPiece.isMovableTo(this.fixed, direction)) {
        console.log('isMovableTo:' + direction)
        this.currentPiece.move(direction)
      }
      const newBoard = Array.from(this.fixed)
      this.currentPiece.emit(newBoard)
//      Util.dumpBoard(newBoard)
      this.setState({
        board: newBoard
      })
    }
  }

  // returns true when current piece is supported by the floor or by other pieces
  //         false otherwise
  private isSupported():boolean {
    // TODO
    // 1. current piece against floor
    if(this.currentPiece.isContactingFloor()) return true
    if(this.currentPiece.isContactingFixed(this.fixed)) {
      return true
    }
    return false
  }

  private gameLoop() {
    console.log('currRotateIx:' + this.state.currRotateIx)
//    Util.dumpBoard(this.state.board)
    setTimeout(this.gameLoop, C.ANIMATION_DELAY)

    const newBoard = Array.from(this.fixed)
    
    if (this.isSupported()) {
      // if supported, piece should still be able t o move for a few turns
      // 1. move currentPiece into fixed
      if(this.direction === 's') {
        console.log('this.numSupportedLoops:' + this.numSupportedLoops)
        //trying with a variable numSupportedLoops, which keeps count of how many times the block has looped
        //through gameloop and hit is supported. if numSupportedLoops >= 3 set it to fixed
        if(this.numSupportedLoops >= 3) {
          this.numSupportedLoops = 0
          this.currentPiece.emit(this.fixed)
          this.setState({
            board: this.fixed
          }, () => {
            // 2. check fixed for any filled rows
            const filledRows = Util.checkFilledRows(this.fixed)
            console.log('filledIndexes.length:' + filledRows.length)
            if(filledRows.length > 0) {
              console.log('a row or more is filled')
              for(let i = 0; i < filledRows.length; i++) {
                for(let col = 0; col < C.NUM_COLS; col++) {
                  this.fixed[filledRows[i] * C.NUM_COLS + col] = '.'
                }
              }
              //shift board down
              console.log('filledRows!!!!!' + filledRows)
              for(let i = 0; i < filledRows.length; i++) {
                console.log('filledRows[i]:' + filledRows[i])
                Util.shiftBoardDown(this.fixed, filledRows[i])
              }
            }
            // 3. assign currentPiece a new Piece
            const index = Math.floor(Math.random() * this.pieceTypes.length)
            this.currentPiece = new Piece(this.pieceTypes[index], this.colorTypes[index])
            this.currentPiece.setupPosition(0, 5, this.state.currRotateIx)
          })
        } else {
          this.numSupportedLoops++
        }
      }
    } else {
      this.currentPiece.move('s')
      if(this.currentPiece.isRotateable(this.fixed, this.state.currRotateIx)) {
        this.currentPiece.rotate(this.state.currRotateIx)
      }
      this.currentPiece.emit(newBoard)
      this.setState({
        board: newBoard 
      })
    }
  }

  public render() {
    console.log('rerender()')
    return (
      <div className="app">
        <Board
          board={this.state.board}
        />

      </div>
    );
  }
}

export default App;