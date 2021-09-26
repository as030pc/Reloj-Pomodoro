import React from "react"
function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60)
  const [breakTime, setBreakTime] = React.useState(5 * 60)
  const [sessionTime, setSessionTime] = React.useState(25 * 60)
  const [timerOn, setTimerOn] = React.useState(false)
  const [onBreak, setOnBreak] = React.useState(false)
  const [breakAudio] = React.useState(new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"))



  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)


    )

  }

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakTime <= 60 && amount < 0) {
        return
      }
      setBreakTime(prev => prev + amount)
    }
    else if (type === "session") {
      if (sessionTime <= 60 && amount < 0) {
        return
      }
      setSessionTime(prev => prev + amount)
      if (!timerOn)
        setDisplayTime(sessionTime + amount)
    }

  }

  const controlTime = () => {
    let second = 1000
    let date = new Date().getTime()
    let nextDate = new Date().getTime() + second
    let onBreakVariable = onBreak
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime()
        if (date > nextDate) {
          setDisplayTime(prev => {
            if (prev <= 0 && !onBreakVariable) {
              playAudio()
              onBreakVariable = true
              setOnBreak(true)
              return breakTime

            } else if (prev <= 0 && onBreakVariable) {
              playAudio()
              onBreakVariable = false
              setOnBreak(false)
              return sessionTime
            }
            return prev - 1
          })
          nextDate += second
        }
      }, 30)
      localStorage.clear()
      localStorage.setItem("interval-id", interval)
    }

    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"))
    }
    setTimerOn(!timerOn)

  }
  const resetTime = () => {
    setDisplayTime(25 * 60)
    setBreakTime(5 * 60)
    setSessionTime(25 * 60)

  }

  const playAudio = () => {
    breakAudio.currentTime = 0
    breakAudio.play()

  }



  return (
    <>
      <h1> Pomodoro Clock </h1>
      <div id = "config">
      
        <Lenght title={"Break lenght"} changeTime={changeTime} type={"break"} time={breakTime} formatTime={formatTime} />
        <Lenght title={"Session lenght"} changeTime={changeTime} type={"session"} time={sessionTime} formatTime={formatTime} />

      </div>


      <div id = "time">
        <h1 id="timer-label"> {onBreak ? "Break" : "Session"} </h1>
        <h2 id="time-left"> {formatTime(displayTime)}</h2>
        <button id="start_stop" onClick={controlTime}> {timerOn ? "Stop" : "Start"}</button>
        <button id="start_stop" onClick={resetTime}> Reset </button>

      </div>
    </>

  )
}

const Lenght = ({ title, changeTime, type, time, formatTime }) => {
  return (
    <>
      
      <div>
        <h3> {title} </h3>
        <h3> {formatTime(time)} </h3>
        <button onClick={() => changeTime(-60, type)}> Decrement</button>
        <button onClick={() => changeTime(60, type)}> Increment </button>
      </div>

    </>

  )
}

export default App;
