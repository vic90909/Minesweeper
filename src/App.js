import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';


// class App extends Component {
//   constructor(){
//     super();
// //setare this state
//     this.state={
//       monsters: []
//     }
//   }

//   componentDidMount(){
//     fetch('https://jsonplaceholder.typicode.com/users')
//     .then(Response=> Response.json())
//     .then(users=>this.setState({monsters:users}))
//   }
//  render(){
//   return (
//     <div className="App">
//       {
//         this.state.monsters.map(monster => 
//         <h1 key={monster.id}>{
//           monster.name
//           }</h1> )
//       }
//     </div>
//   );
//  }
// }

// Cell Class
class Cell extends React.Component {
  getValue() {
    const {value} = this.props;
    
    if (!value.isRevealed) {
      return this.props.value.isFlagged ? "🚩" :null;
    }
    if (value.isMine) {
      return "💣";
    }
    if (value.neighbour === 0) {
      return null;
    }
    
    return value.neighbour;
  }

  render() {
    const {value, onClick, cMenu} = this.props;
    let className =
      "cell" +
      (value.isRevealed ? "" : " hidden") +
      (value.isMine ? " is-mine" : "") +
      (value.isFlagged ? " is-flag" : "");

    return (
      <div
        onClick={onClick}
        className={className}
        onContextMenu={cMenu}
      >
        {this.getValue()}
      </div>
    );
  }
}
// class StopWatch extends React.Component{
//    state={
//        runninTime: 0,
//        isRunning: false
//    };
//    componentDidMount(){

//    }

//    handleStartStopClick=() => {
//        if(this.state.isRunning){
//             clearInterval(this.timerID);
//             this.setState({isRunning: false});
//        }else{
//            const startTime =Date.now() - this.runninTime;
//            this.timeID=setInterval(()=>{
//                 this.setState({
//                     runninTime:Date.now()-startTime, isRunning:true
//                 });
//            }, 100)
//        }
//    }

//    componentWillUnmount(){
//        clearInterval(this.timeID);
//    }
//    formatTime(t){
//        return (t/1000).toFixed(1);
//    }
//    render(){
       
//        return(
//             <div>{
//                 this.formatTime(this.state.runninTime)
//             }</div>
//        );
//    }
// };

class StopWatch extends React.Component{
    state={
        second:0,
        isRunning: false
        };
    
    componentDidMount(){
        if(this.state.isRunning===true){
        setInterval(()=>{
            return this.setState((state,props)=>{
                    return {
                        second: state.second+1
                    }
            });

        },1000)
    }
        else{
            return{
            second:0
        }
        }
    }
    render(){
        return (
        <h1>{this.state.second}</h1>
        )
    }
}
// Board Class
class Board extends React.Component {
  state = {
        boardData: this.initBoardData(this.props.height, this.props.width, this.props.mines),
        gameStatus: "Continua jocul!",
        mineCount: this.props.mines,
        time:0,
        interval:0,
        start:false,
        won:false,
        lost:false,
        score:0,
        
    };

    incrementTime=()=>{
        if(this.state.won===false && this.state.lost===false){
            this.setState(
                {
                    interval:setInterval(
                        ()=>{
                            this.setState({
                                time:this.state.time+1
                            })
                        },1000
                    )
                }
            )
        }else if(this.state.lost===true){
            this.setState(
                {
                    interval:setInterval(
                        ()=>{
                            this.setState({
                                time:0
                            })
                        },1000
                    )
                }
            )
        }else if(this.state.won===true){
            this.setState(
                {
                    interval:setInterval(
                        ()=>{
                            this.setState({
                                time:this.state.time
                            })
                        },1000
                    )
                }
            )
        }
    }
    /* Helper Functions */

    // get mines
    getMines(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isMine) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get Flags
    getFlags(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isFlagged) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get Hidden cells
    getHidden(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (!dataitem.isRevealed) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get random number given a dimension
    getRandomNumber(dimension) {
        // return Math.floor(Math.random() * dimension);
        return Math.floor((Math.random() * 1000) + 1) % dimension;
    }

    // Gets initial board data
    initBoardData(height, width, mines) {
        let data = this.createEmptyArray(height, width);
        data = this.plantMines(data, height, width, mines);
        data = this.getNeighbours(data, height, width);
        return data;
    }
    createEmptyArray(height, width) {
        let data = [];

        for (let i = 0; i < height; i++) {
            data.push([]);
            for (let j = 0; j < width; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                };
            }
        }
        return data;
    }

    // plant mines on the board
    plantMines(data, height, width, mines) {
        let randomx, randomy, minesPlanted = 0;

        while (minesPlanted < mines) {
            randomx = this.getRandomNumber(width);
            randomy = this.getRandomNumber(height);
            if (!(data[randomx][randomy].isMine)) {
                data[randomx][randomy].isMine = true;
                minesPlanted++;
            }
        }

        return (data);
    }

    // get number of neighbouring mines for each board cell
    getNeighbours(data, height, width) {
        let updatedData = data, index = 0;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j].isMine !== true) {
                    let mine = 0;
                    const area = this.traverseBoard(data[i][j].x, data[i][j].y, data);
                    area.map(value => {
                        if (value.isMine) {
                            mine++;
                        }
                    });
                    if (mine === 0) {
                        updatedData[i][j].isEmpty = true;
                    }
                    updatedData[i][j].neighbour = mine;
                }
            }
        }

        return (updatedData);
    };

    // looks for neighbouring cells and returns them
    traverseBoard(x, y, data) {
        const el = [];

        //up
        if (x > 0) {
            el.push(data[x - 1][y]);
        }

        //down
        if (x < this.props.height - 1) {
            el.push(data[x + 1][y]);
        }

        //left
        if (y > 0) {
            el.push(data[x][y - 1]);
        }

        //right
        if (y < this.props.width - 1) {
            el.push(data[x][y + 1]);
        }

        // top left
        if (x > 0 && y > 0) {
            el.push(data[x - 1][y - 1]);
        }

        // top right
        if (x > 0 && y < this.props.width - 1) {
            el.push(data[x - 1][y + 1]);
        }

        // bottom right
        if (x < this.props.height - 1 && y < this.props.width - 1) {
            el.push(data[x + 1][y + 1]);
        }

        // bottom left
        if (x < this.props.height - 1 && y > 0) {
            el.push(data[x + 1][y - 1]);
        }

        return el;
    }

    // reveals the whole board
    revealBoard() {
        let updatedData = this.state.boardData;
        updatedData.map((datarow) => {
            datarow.map((dataitem) => {
                dataitem.isRevealed = true;
            });
        });
        this.setState({
            boardData: updatedData
        })
    }

    /* reveal logic for empty cell */
    revealEmpty(x, y, data) {
        let area = this.traverseBoard(x, y, data);
        area.map(value => {
            if (!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.isMine)) {
                data[value.x][value.y].isRevealed = true;
                if (value.isEmpty) {
                    this.revealEmpty(value.x, value.y, data);
                }
            }
        });
        return data;

    }

    // Handle User Events

    _handleCellClick(x, y) {

        if(this.state.start===false){
            this.setState({
                start:true
            })
            this.incrementTime()
        }
        // check if revealed. return if true.
        if (this.state.boardData[x][y].isRevealed || this.state.boardData[x][y].isFlagged) return null;

        // check if mine. game over if true
        if (this.state.boardData[x][y].isMine) {
            this.setState({gameStatus: "Imi pare rau, ai pierdut, dar bravo pentru incercare!!"});
            this.setState({time:0,lost:true,score:0})
            this.revealBoard();
            alert("Sfarsit de joc!");
            clearInterval(this.state.interval);
        }

        let updatedData = this.state.boardData;
        updatedData[x][y].isFlagged = false;
        updatedData[x][y].isRevealed = true;

        if (updatedData[x][y].isEmpty) {
            updatedData = this.revealEmpty(x, y, updatedData);
        }

        if (this.getHidden(updatedData).length === this.props.mines) {
            const val = 1000-this.state.time
            this.setState({mineCount: 0, gameStatus: "Esti Castigator!!!",won:true,score:val,time:0})
            this.revealBoard();
            alert("Esti Castigator!!!");
            clearInterval(this.state.interval);
            // this.incrementTime();
        }

        this.setState({
            boardData: updatedData,
            mineCount: this.props.mines - this.getFlags(updatedData).length,
        });
    }

    _handleContextMenu(e, x, y) {
        e.preventDefault();
        let updatedData = this.state.boardData;
        let mines = this.state.mineCount;

        // check if already revealed
        if (updatedData[x][y].isRevealed) return;

        if (updatedData[x][y].isFlagged) {
            updatedData[x][y].isFlagged = false;
            mines++;
        } else {
            updatedData[x][y].isFlagged = true;
            mines--;
        }

        if (mines === 0) {
            const mineArray = this.getMines(updatedData);
            const FlagArray = this.getFlags(updatedData);
            if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {
                const val = 1000-this.state.time
                this.setState({mineCount: 0, gameStatus: "Esti Castigator!!!",score:val,time:0,won:true});
                this.revealBoard();
                alert("Esti Castigator!!!");
                // this.incrementTime();
                clearInterval(this.state.interval)
                
            }
        }

        this.setState({
            boardData: updatedData,
            mineCount: mines,
        });
    }

    renderBoard(data) {
        return data.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            onClick={() => this._handleCellClick(dataitem.x, dataitem.y)}
                            cMenu={(e) => this._handleContextMenu(e, dataitem.x, dataitem.y)}
                            value={dataitem}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>);
            })
        });

    }

  render() {
        return (
            <div className="board">
                <div className="game-info">
        <h1 className="info">
            {this.state.gameStatus}
            </h1>
                    <span className="info">Mine Ramase: {this.state.mineCount}</span>
                    <span className="info">Timp: {this.state.time}</span>
                    <span className="info">Scor: {this.state.score}</span>

                </div>
                {
                    
                    this.renderBoard(this.state.boardData)
                }
            </div>
        );
    }
}

// Game Class
class Game extends React.Component {
  state = {
    // height 8, width 8, mines 10
    height: 20,
    width: 20,
    mines: 5,
    
  };

  render() {
    const { height, width, mines,isRunning } = this.state;
    return (
      <div className="game">
        
        <Board height={height} width={width} mines={mines} />
      </div>
    );
  }
}

// Cell.propTypes = {
//   value: PropTypes.func
// }

// ReactDOM.render(<Game />, document.getElementById("root"));
export default Game;


