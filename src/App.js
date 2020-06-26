import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
  const link = `https://opentdb.com/api.php?amount=1`

  const intro_block = document.querySelector(".intro")
  const game_block = document.querySelector(".game")
  const result_block = document.querySelector(".result")
  const finish_block = document.querySelector(".finish")

  const [question, setQuestion] = useState("")
  const [answers, setAnswers] = useState([])

  const [questionCount, setQuestionCount] = useState(1)
  const [playerCount, setPlayerCount] = useState(0)

  const answers_extra = document.querySelector(".answers_row_extra")
  const finish_title = document.querySelector(".finish_title")
  const result_text = document.querySelector(".result_text")


  useEffect(() => {
    updateQuestion()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  async function updateQuestion() {
    await fetch(link)
    .then(data => data = data.json())
    .then(function(response) {
      setQuestion(decodeURIComponent(response.results[0].question).replace(/&quot;/g,'"').replace(/&#039;/g,'"'))

      console.log(question)
      setAnswers(`${response.results[0].correct_answer.toString()},`);
      setAnswers(oldArray => [oldArray.concat(response.results[0].incorrect_answers)]);
      setAnswers(answers => answers = answers[0].split(","))
    })


    const question_title = document.querySelector(".question_title")
    question_title.innerText = question;
    const question_number = document.querySelector(".question_number")
    question_number.innerText = `Question #${questionCount}`

    setTimeout(() => {
      if(questionCount === 1) {
        setQuestionCount(2)
      } 
    }, 700)
    

    if(answers.length === 2) {
      answers_extra.style.display = "none"
      const numbers = [0,1]
      const randomNumber = Math.floor(Math.random() * 2)
      const neededString = `.answer_${randomNumber}`
      const neededBlock = document.querySelector(neededString)
      neededBlock.classList.remove("correct")
      neededBlock.classList.remove("wrong")
      neededBlock.classList.add("correct")
      neededBlock.innerText = `${answers[0]}`
      numbers.splice(numbers.indexOf(randomNumber),numbers.indexOf(randomNumber) + 1 )
      const leftNumber = Number(numbers[0])
      const wrongString = `.answer_${leftNumber}`
      const wrongBlock = document.querySelector(wrongString)
      wrongBlock.classList.remove("correct")
      wrongBlock.classList.remove("wrong")
      wrongBlock.classList.add("wrong")
      wrongBlock.innerText = `${answers[1]}`
    } else {
      let numbers = [0,1,2,3]
      let randomNumber = Math.floor(Math.random() * 4)
      let neededString = `.answer_${randomNumber}`
      let neededBlock = document.querySelector(neededString)
      neededBlock.classList.remove("correct")
      neededBlock.classList.remove("wrong")
      neededBlock.classList.add("correct")
      neededBlock.innerText = `${answers[0]}`
      numbers = numbers.filter(function(entry) { return numbers.indexOf(entry) !== numbers.indexOf(randomNumber) });
      for(let i = 0; i < numbers.length; i++) {
        let currentString = `.answer_${numbers[i]}`
        let currentBlock = document.querySelector(currentString)
        currentBlock.classList.remove("correct")
        currentBlock.classList.remove("wrong")
        currentBlock.classList.add("wrong")
        currentBlock.innerText = `${answers[i+1]}`
      }
    }
  }

  function checkAnswer (e) {
    if(e.target.classList.contains("correct")) {
      setPlayerCount(playerCount => playerCount = playerCount+1)
      if(playerCount === 0) {
        result_text.innerText = `Correct! Your Score - 1`
      } else {
        result_text.innerText = `Correct! Your Score - ${playerCount}`
      }
    } else {
      result_text.innerText = `Wrong! Your Score - ${playerCount}`
    }

    
    setQuestionCount(questionCount => questionCount = questionCount+1)
    

    game_block.style.opacity="0"
    result_block.style.opacity="1"

    setTimeout(() => {
      game_block.style.display="none"
      result_block.style.display="block"
      updateQuestion()
    }, 500 )

    if(questionCount === 11) {
      setTimeout(() => {
        finishGame()
      }, 2000)
    } else {
      setTimeout(() => {
        game_block.style.opacity="1"
        result_block.style.opacity="0"
      }, 2000)
  
      setTimeout(() => {
        game_block.style.display="block"
        result_block.style.display="none"
      }, 2500)
    }
    

    
  }

  function startGame () {
    updateQuestion()

    intro_block.style.opacity="0"
    game_block.style.opacity="1"

    setTimeout(() => {
      intro_block.style.display="none"
      game_block.style.display="block"
    }, 500 )
  }

  function finishGame () {
    finish_title.innerText = `Game finished! Final Score - ${playerCount}`

    result_block.style.opacity="0"
    finish_block.style.opacity="1"

    setTimeout(() => {
      result_block.style.display="none"
      finish_block.style.display="block"
    }, 500 )
  }

  function restartGame () {
    setQuestionCount(1)
    setPlayerCount(0)

    intro_block.style.opacity="1"
    finish_block.style.opacity="0"

    setTimeout(() => {
      intro_block.style.display="block"
      finish_block.style.display="none"
    }, 500 )
  }






  return (
    <div className="App">
      <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet"></link>


      <div className="title">Quiz Game</div>

      <div className="intro">
        <div className="intro_title">Game consists of 10 random questions. <br></br> Are you ready?</div>
        <button className="intro_button" onClick={startGame}>Begin Game</button>
      </div>

      <div className="game">
        <div className="question_number">Question #1</div>
        <div className="question_title">Who am I?</div>
        <div className="answers">
          <div className="answers_row">
            <div className="answer answer_0" onClick={checkAnswer}>Peter Fleming</div>
            <div className="answer answer_1" onClick={checkAnswer}>Peter Fleming</div>
          </div>
          <div className="answers_row_extra">
            <div className="answer answer_2" onClick={checkAnswer}>Peter Fleming</div>
            <div className="answer answer_3" onClick={checkAnswer}>Peter Fleming</div>
          </div>
        </div>
      </div>

      <div className="result">
        <div className="result_text">Correct! Your score - 228</div>
      </div>

      <div className="finish">
        <div className="finish_title">Game finished! Your score - 228</div>
        <button className="finish_button" onClick={restartGame}>Restart</button>
      </div>
    </div>
  );
}

export default App;
