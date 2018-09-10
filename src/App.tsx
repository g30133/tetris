import * as React from 'react';
import './App.css';

import * as C from './constants'
import Board, { CellType } from './Board'
import Piece, { PieceType, DirectionType } from './Piece';
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
  direction:DirectionType

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

    const index = Math.floor(Math.random() * this.pieceTypes.length)
    this.currentPiece = new Piece(this.pieceTypes[index], 'r')
    this.currentPiece.setupPosition(0, 5, this.state.currRotateIx)

    this.fixed = Array.from(this.state.board)

    document.addEventListener('keydown', (event) => {
      if(event.key === 'ArrowLeft') {
        this.onKeyDown('w')
      } else if(event.key === 'ArrowRight') {
        this.onKeyDown('e')
      } else if(event.key === 'ArrowDown') {
        //TODO MAKE PIECE MOVE ALL THE WAY DOWN
      } else if(event.key === 'ArrowUp') {
        //rotate is not happening instantly like move!!! fix!!!
        this.setState(prevState => {
          return {
            currRotateIx: (prevState.currRotateIx + 90) % 360
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
    if(this.isSupported() === false) {
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
//    Util.dumpBoard(this.state.board)
    setTimeout(this.gameLoop, C.ANIMATION_DELAY)

    const newBoard = Array.from(this.fixed)
    
    if (this.isSupported()) {
      // 1. move currentPiece into fixed
      if(this.direction === 's') {
        this.currentPiece.emit(this.fixed)
        this.setState({
          board: this.fixed
        }, () => {
          // 2. assign currentPiece a new Piece
          const index = Math.floor(Math.random() * this.pieceTypes.length)
          this.currentPiece = new Piece(this.pieceTypes[index], 'r')
          this.currentPiece.setupPosition(0, 5, this.state.currRotateIx)
        })
      }
    }
    else {
      this.currentPiece.move('s')
      this.currentPiece.rotate(this.state.currRotateIx)
      this.currentPiece.emit(newBoard)
      this.setState({
        board: newBoard
      })
    }
  }

  public render() {
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