import * as React from 'react';
import './App.css';

import * as C from './constants'
import Board, { CellType } from './Board'
import Piece, { PieceColor, PieceType, DirectionType } from './Piece';
import Util from './Util';

interface AppState {
  board: CellType[]
  currRotateIx: number
}

interface PlayerInfo {
  name: string
  score: number
}

class App extends React.Component<any, AppState> {

  
  // instance variables
  currentPiece: Piece
  fixed: CellType[]
  pieceTypes: PieceType[]
  colorTypes: PieceColor[]
  direction: DirectionType
  score: number
  isGameOver: boolean
  numSupportedLoops: number
  topThreePlayers: PlayerInfo[]

  constructor(props:any) {
    super(props)
    this.onDownClicked = this.onDownClicked.bind(this)
    this.onSpaceClicked = this.onSpaceClicked.bind(this)
    this.onRotateClicked = this.onRotateClicked.bind(this)

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

    //remove this later when implement server side
    this.topThreePlayers = []
    this.topThreePlayers.push({name: 'Geo', score: 100})
    this.topThreePlayers.push({name: 'Jaimie', score: 90})
    this.topThreePlayers.push({name: 'Jae', score: 80})
  
    this.score = 0
    this.isGameOver = false
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
    this.currentPiece.setupPosition(C.STARTING_ROW, C.STARTING_COL, this.state.currRotateIx)

    this.fixed = Array.from(this.state.board)

    this.numSupportedLoops = 0

    document.addEventListener('keydown', (event) => {
      if(event.key === 'ArrowLeft') {
        if(this.currentPiece.startRow >= 0) this.onKeyDown('w')
      } else if(event.key === 'ArrowRight') {
        if(this.currentPiece.startRow >= 0) this.onKeyDown('e')
      } else if(event.key === 'ArrowDown') {
        this.onDownClicked()
      } else if(event.key === 'ArrowUp') {        
        this.onRotateClicked()
      } else if(event.key === ' '){
        this.onSpaceClicked()
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

  private onRotateClicked() {
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
  }

  private onDownClicked() {
    const newBoard = Array.from(this.fixed)
    if(this.isSupported() === false) {
      this.score += 1
      this.currentPiece.move('s')
      this.currentPiece.emit(newBoard)
      this.setState(prevState => {
        return {
          board: newBoard
        }
      })
    }
  }

  private onSpaceClicked() {
    const newBoard = Array.from(this.fixed)
    this.score += this.currentPiece.moveAllTheWayDown(this.fixed) * 2
    this.currentPiece.emit(newBoard)
    //we dont want the piece to be able to move if space is pressed
    this.numSupportedLoops = 3
    this.setState(prevState => {
      return {
        board: newBoard
      }
    })
  }

  // returns true when current piece is supported by the floor or by other pieces
  //         false otherwise
  private isSupported():boolean {
    // TODO
    // 1. current piece against floor
    if(this.currentPiece.isContactingFloor()) return true
    if(this.currentPiece.isContactingFixed(this.fixed)) {
      console.log('__________: ' + JSON.stringify(this.currentPiece))
      return true
    }
    return false
  }

  private checkGameOver():boolean {
    console.log('checkGameOver piece unitIx:' + this.currentPiece.unitIxs)
    for(let i = 0; i < this.currentPiece.unitIxs.length; i++) {
      if(this.currentPiece.unitIxs[i] < 0) {
        console.log('game is over')
        return true
      }
    }
    return false
  }

  private gameLoop() {
    Util.dumpBoard(this.state.board)
    console.log('currRotateIx:' + this.state.currRotateIx)
//    Util.dumpBoard(this.state.board)
    if(this.isGameOver) {
      const result = document.querySelector('.result')
      if(result !== null) result.classList.remove('hidden')
      return
    }
    setTimeout(this.gameLoop, C.ANIMATION_DELAY)

    const newBoard = Array.from(this.fixed)
    
    if (this.isSupported()) {
      if(this.checkGameOver()) {
        //GAME OVER
        this.isGameOver = true
        return
      }
      // if supported, piece should still be able t o move for a few turns
      // 1. move currentPiece into fixed
      if(this.direction === 's') {
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
              this.score += 100 * filledRows.length
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
            this.currentPiece.setupPosition(C.STARTING_ROW, C.STARTING_COL, this.state.currRotateIx)
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
        <div className='score'>Score: {this.score}</div>
        <div className='buttons'>
          <div className='button left' onClick={() => {this.onKeyDown('w')}}> &lt; </div>
          <div className='button down' onClick={this.onDownClicked}> V </div>
          <div className='button right' onClick={() => {this.onKeyDown('e')}}> &gt; </div>
          <div className='button rotate' onClick={this.onRotateClicked}> Rotate </div>
          <div className='button name'>Geo</div>
          <div className='button space' onClick={this.onSpaceClicked}> Fall </div>
        </div>
        <div className='result hidden'>
          <h1>Leaderboard</h1>
          <br/><br/>
          Leader  [{this.topThreePlayers[0].name} ({this.topThreePlayers[0].score})]
          <br/><br/>
          2nd [{this.topThreePlayers[1].name} ({this.topThreePlayers[1].score})]
          <br/><br/>
          3rd [{this.topThreePlayers[2].name} ({this.topThreePlayers[2].score})]
        </div>
      </div>
    );
  }
}

export default App;