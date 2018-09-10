import * as React from 'react';
import { shallow } from 'enzyme';
import * as C from './constants'
import Board, { CellType } from './Board'
import Util from './Util'

describe('board', () => {
    const board:CellType[] = []
    let wrapper:any = null
  
    beforeEach(() => {
      for (let i = 0; i < C.NUM_ROWS * C.NUM_COLS; i++) {
        board.push('.')
      }
      board[C.NUM_COLS * 19 + 9] = 'r'
  
      wrapper = shallow(<Board board={board}/>)
    })
  
    describe.skip('should render', () => {
      it('a red cell', () => {
        Util.dumpBoard(board)
        expect(wrapper.find('.r')).toHaveLength(1)
      })
    })
  })