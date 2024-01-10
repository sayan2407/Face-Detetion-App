import './App.css';
import Footer from './components/Footer/Footer';
import Topbar from './components/Topbar/Topbar';
import VideoPlayer from './components/video/VideoPlayer';

function App() {
  return (
    <div className="App">
      <Topbar/>
     <VideoPlayer/>
     <Footer/>
    </div>
  );
}

export default App;
