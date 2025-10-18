import './App.css';
import zit from './components/zit.JPG'; 
import PrayerList from './components/PrayerList';
function App() {
  return (
    <div
      className="App d-flex   p-5 align-items-center"
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${zit})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='Mycontainer'>


      <PrayerList/>
<div class="footer-text">All rights reserved to Souhail ©</div>

      </div>
    </div>
  );
}

export default App;
