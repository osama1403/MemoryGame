import { useCallback, useEffect, useRef, useState } from "react"
import images from './cards'
import{FaPlay,FaPause,FaRegSadTear,FaRegSmile} from 'react-icons/fa'

const levels = [{ name: 'Easy', count: 6 }, { name: 'Medium', count: 8 }, { name: 'Hard', count: 10 }]
function shuffle(array) {
  for (let i = 0; i < array.length; i++) {
    const rand = Math.floor(Math.random() * array.length)
    // swap
    const el = array[i];
    array[i] = array[rand]
    array[rand] = el
  }
  return array
}

function App() {

  const stepTime = 500
  const showTime = 2000
  const counterTime = 60
  let counterInterval = useRef(null)
  let timeout = useRef(null)

  const [level, setLevel] = useState(levels[0])
  const [levelListOpen, setLevelListOpen] = useState(false)
  const [type, setType] = useState('shapes')
  const [gameState, setGameState] = useState('STOPPED')
  const [counter, setCounter] = useState(counterTime)
  const [showCards, setShowCards] = useState(true)
  const [canClick, setCanClick] = useState(true)
  const [cards, setCards] = useState([])
  const [tempCard, setTempCard] = useState(null)
  const [tempCard2, setTempCard2] = useState(null)
  const [matchedCards, setMatchedCards] = useState([])
  const [typesListOpen, setTypesListOpen] = useState(false)
  const [runCounter, setRunCounter] = useState(false)

  const newGame = useCallback(() => {
    setGameState('STOPPED')
    setCounter(counter)
    setRunCounter(false)
    setTempCard(null)
    setShowCards(true)
    setMatchedCards([])
  }, [])


  useEffect(() => {
    const cardset = []
    for (let i = 0; i < level.count; i++) {
      cardset.push({ img: images[type][i], id: i })
      cardset.push({ img: images[type][i], id: i })
    }
    setCards(cardset)
    newGame()
  }, [level, type])


  const handlePlay = () => {
    if (gameState === 'STOPPED') {
      setGameState('RUNNING')
      setShowCards(false)
      timeout.current = setTimeout(() => {
        shuffleAndShow()
      }, stepTime);
      console.log("timeout is ");
      console.log(timeout.current);
    } else {
      console.log('timeout clear');
      console.log(timeout.current);
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
      if (counterInterval.current) {
        clearInterval(counterInterval.current)
      }
      setRunCounter(false)
      setCounter(counter)
      newGame()
    }
  }

  const shuffleAndShow = () => {
    setCards(shuffle(cards))
    setShowCards(true)
    timeout.current = setTimeout(() => {
      setShowCards(false)
      startCounter()
    }, showTime);
  }


  const startCounter = () => {
    setRunCounter(true)
  }


  useEffect(() => {
    if (runCounter) {
      counterInterval.current = setInterval(() => {
        if (counter > 1) {
          setCounter(p => p - 1)
        } else {
          setCounter(p => p - 1)
          endGame()
        }
      }, 1000);
    }
    return (() => { clearInterval(counterInterval.current) })
  }, [runCounter, counter])



  const endGame = () => {
    if (counterInterval.current) {
      clearInterval(counterInterval.current)
    }
    setGameState('LOSE')
    setRunCounter(false)
    setShowCards(true)
  }

  const winGame = () => {
    if (counterInterval.current) {
      clearInterval(counterInterval.current)
    }
    setRunCounter(false)
    setGameState('WIN')
    setShowCards(true)
  }

  const cardClick = (i) => {
    if (gameState === 'RUNNING' && canClick) {

      if (tempCard !== null) {
        if (tempCard === i) {
          setTempCard(null)
        } else if (cards[i]?.id === cards[tempCard]?.id) {
          console.log(matchedCards.length);
          setMatchedCards(p => {
            let newArr = [...p]
            newArr.push(cards[i]?.id)
            return (newArr)
          })
          setTempCard(null)
        } else {
          setTempCard2(i)
          setCanClick(false)
          timeout.current = setTimeout(() => {
            setTempCard2(null)
            setTempCard(null)
            setCanClick(true)
          }, 2 * stepTime);

        }

      } else {
        if (!matchedCards.includes(cards[i].id)) {
          setTempCard(i)
        }
      }
    }
  }

  useEffect(() => {
    if (gameState === 'RUNNING' && matchedCards.length === level?.count) {
      winGame()
    }
  }, [matchedCards])

  useEffect(() => {
    console.log(gameState);
  }, [gameState])

  useEffect(() => {
    console.log(counter);
  }, [counter])


  return (

    <main className="h-screen bg-emerald-900 grid grid-cols-1 grid-rows-1 justify-center items-center p-2 md:p-10 ">

      <div className="w-full max-w-2xl flex flex-col max-h-full mx-auto border-2 border-yellow-500 p-2 rounded-xl ">

        <div className="w-full rounded-md bg-emerald-700 flex items-center justify-between flex-wrap">


          <div className=" flex items-center flex-wrap  p-2 gap-2">

            {/* level select */}
            <div className="px-10 relative bg-blue-500 py-2 flex items-center justify-center text-white cursor-pointer rounded-lg" onClick={() => { setLevelListOpen(p => !p) }}>
              <span className="text-xl font-bold" >{level.name}</span>

              <div className={`absolute z-10 overflow-hidden w-full ${levelListOpen ? 'h-[108px]' : 'h-0'} bg-blue-500 top-full mt-2 transition-all duration-200 flex flex-col items-center rounded-lg`}>
                {
                  levels.map((el, idx) => {
                    return (
                      <div key={idx} className="w-full p-1 flex justify-center hover:bg-blue-400 cursor-pointer" onClick={() => { setLevel(el) }}>
                        <span className="text-xl font-bold">{el.name}</span>
                      </div>
                    )
                  })
                }

              </div>
            </div>

            {/* clock */}
            <p className={`px-4 py-2  text-xl rounded-lg  font-bold  text-white ${counter <= 10 ? 'bg-red-600' : 'bg-blue-500'}`}>
              {`${(counter / 60) < 10 ? '0' : ''}${Math.floor(counter / 60)}:${(counter % 60) < 10 ? '0' : ''}${(counter % 60)}`}
            </p>
            {/* play Button */}
            <button className={`rounded-full w-10 h-10 text- flex items-center justify-center p-2 ${gameState === 'WIN' ? 'text-green-500' : gameState==='LOSE'?'text-red-500':'text-black'} bg-white`} onClick={handlePlay}>{gameState === 'STOPPED' ? <FaPlay className="ml-[2px]"/> : gameState === 'RUNNING' ? <FaPause/> : gameState === 'WIN' ? <FaRegSmile className="text-xl"/> : <FaRegSadTear className="text-xl"/>}</button>

          </div>

          <div className="flex items-center p-2 gap-2">

            <p className="px-4 py-2 text-white text-xl rounded-lg  font-bold bg-blue-500">{`${matchedCards.length}/${level.count}`}</p>

            <div className=" relative bg-purple-500 p-2 rounded-full cursor-pointer " onClick={() => { setTypesListOpen(p => !p) }}>
              <img src={images[type][0]} alt="" className="w-10 h-10 rounded-full" />

              <div className={`absolute left-0 z-10 overflow-hidden w-full  ${typesListOpen ? 'h-[168px]' : 'h-0'} bg-purple-500 top-full mt-1 transition-all duration-200 flex flex-col rounded-full`}>
                {
                  Object.keys(images).map((el, idx) => {
                    return (
                      <div className="p-2 cursor-pointer hover:bg-white rounded-full" onClick={() => { setType(el) }}>
                        <img key={idx} src={images[el][0]} alt="" className="w-10 h-10 rounded-full" />
                      </div>
                      
                    )
                  })
                }

              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 min-h-40 rounded-md bg-emerald-600 py-6 px-2 grid grow">

          <div className={` w-full mx-auto grid ${level.name==='Hard'?'grid-cols-5 max-w-96':'max-w-80 grid-cols-4'} gap-2`}>

            {cards.length > 0 &&
              cards?.map((el, idx) => {
                return (
                  <div className="card-container cursor-pointer" onClick={() => { cardClick(idx) }}>
                    <div className={`card aspect-square ${(showCards || matchedCards.includes(el.id) || tempCard === idx || tempCard2 === idx) ? 'rotatey0' : 'rotatey180'}`}>
                      <img src={el.img} alt="" className="w-full h-full cardface block object-cover " />
                      <div className="w-full h-full cardface back bg-gradient-to-b from-zinc-600 to-zinc-900 border border-zinc-500"></div>
                    </div>
                  </div>
                )

              })
            }
          </div>

        </div>

      </div>
    </main>

  )
}

export default App
