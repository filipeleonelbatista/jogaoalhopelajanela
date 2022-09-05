import styles from './App.module.css'
import alho from './assets/alho.png'
import janela from './assets/janela.png'
import mamadeira from './assets/mamadeira.png'
import mesa from './assets/mesa.png'
import papeis from './assets/dica.png'

import brilhoAudio from './assets/brilho.mp3'
import jogaoalhoAudio from './assets/jogaoalho.mp3'
import mamadaAudio from './assets/mamada.mp3'
import vidroAudio from './assets/vidro.mp3'

import { useEffect, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

import { isMobile } from 'react-device-detect';

function AppComponent() {

  const glassBroken = new Audio(vidroAudio);
  const mamada = new Audio(mamadaAudio);
  const dica = new Audio(jogaoalhoAudio);
  const brilho = new Audio(brilhoAudio);

  const [isBroken, setIsBroken] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const [start, setStart] = useState(new Date(Date.now()))
  const [result, setResult] = useState('')


  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    })
  }))

  const [{ }, drop] = useDrop(() => ({
    accept: "image",
    drop: () => brokeWindow()
  }))

  const handleShare = async () => {
    try {
      const sharableContent = {
        title: `Completei em ${result} o jogo do alho venha conhecer em https://jogaoalhopelajanela.vercel.app`,
        text: `Completei em ${result} o jogo do alho venha conhecer em https://jogaoalhopelajanela.vercel.app`,
      };
      await navigator.share(sharableContent);
    } catch (err) {
      console.log("Error: " + err);
    }
    console.log("MDN compartilhado com sucesso!");
  };

  function handleRefresh() {
    window.location.reload(true);
  }

  const brokeWindow = () => {
    setIsBroken(true)
    glassBroken.play();
    setTimeout(() => {
      brilho.play();
      setTimeout(() => {
        setShowResults(true);
        setTimeout(() => {
          mamada.play();
        }, 500)
      }, 500)
    }, 2000)
  }

  useEffect(() => {

    const diff = Date.now() - start;

    console.log(start)

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(diff / (1000 * 60));
    const secs = Math.floor(diff / 1000);

    const h = hours;
    const m = mins - hours * 60;
    const s = secs - mins * 60;

    setResult(`${h} horas, ${m} minutos ${s} segundos`)

  }, [showResults])

  return (
    <div className={styles.container}>
      {
        showResults && (
          <div className={styles.resultContainer}>
            <h2>Voce levou</h2>
            <h3>{result}</h3>
            <p>Para completar o jogo do alho</p>
            <div className={styles.buttonContainer}>
              <button className={styles.butonShare} onClick={handleShare}>Compartilhar</button>
              <button className={styles.butonRetry} onClick={handleRefresh}>Reiniciar</button>
            </div>
          </div>
        )
      }
      <img src={mesa} className={styles.mesa} alt="" />
      {
        !isBroken &&
        <div ref={drag} className={styles.alho} style={isDragging ? { cursor: 'grabbing', opacity: 0 } : { cursor: 'grab' }} >
          <img src={alho} alt="" styles={{ opacity: 0 }} />
        </div>
      }
      <div ref={drop} className={styles.janela}>
        <img src={janela} alt="" />
      </div>
      {
        showResults && <div className={styles.mamadeira} style={{ cursor: 'pointer' }} onClick={() => mamada.play()}>
          <img src={mamadeira} alt="" />
        </div>
      }
      <div className={styles.papeis} style={{ cursor: 'pointer' }} onClick={() => dica.play()}>
        <img src={papeis} alt="" />
      </div>
    </div >
  )
}

function App() {
  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <AppComponent />
    </DndProvider>
  )
}

export default App
