<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { auth } from "@/firebase/config";

const city = ref("");
const weatherData = ref(null);
const apiKey = ref("81c9e78421183c65ddf5831f74c5b711");
const citiesSuggestions = ref([
  "Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said", 
  "Suez", "Luxor", "Aswan", "Tanta", "Mansoura", "Mahalla", 
  "Hurghada", "Sharm El Sheikh", "Dahab", "Ismailia", "Faiyum"
]);
const getData = async (lat = null, lon = null) => {
  let url = "";
  if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey.value}&units=metric`;
  } else if (city.value) {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${city.value}&appid=${apiKey.value}&units=metric`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=Cairo&appid=${apiKey.value}&units=metric`;
    city.value = "Cairo";
  }

  try {
    const response = await axios.get(url);
    weatherData.value = response.data;
    city.value = response.data.city.name;
  } catch (error) {
    console.error("خطأ في جلب البيانات:", error);
  }
};

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getData(latitude, longitude); 
      },
      () => { getData(); }
    );
  } else {
    getData();
  }
});

const getDayName = (fullText) => {
  const date = new Date(fullText);
  return date.toLocaleDateString("en", { weekday: "long" });
};
</script>

<template>
  <div class="main-wrapper">
    <header>
      <div class="row align-items-center">
        <h1 id="h1" class="col-md-3 text-left col-6 order-md-1 order-1">Weather Forecast</h1>

        <div class="col-md-3 col-6 order-md-3 order-3">
          <input 
            type="search" 
            v-model="city" 
            @input="handleInput"
            @change="getData" 
            class="form-control city-select" 
            placeholder="Search City..." 
            list="cities-list"
          >
          
          <datalist id="cities-list">
            <option v-for="cityName in citiesSuggestions" :key="cityName" :value="cityName"></option>
          </datalist>
        </div>

        <div class="col-md-3 mx-auto col-6 order-4 order-md-2" id="city-display">
          {{ city }}
        </div>

        <div class="col-md-3 text-right px-4 col-6 order-2 order-md-4">
          <img id="image1" src="https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-d-weather-icon-with-sun-cloud-and-raindrops-png-image_14853731.png" alt="logo">
        </div>
      </div>
    </header>

    <div class="container py-4">
      <p class="welcome-text" v-if="auth?.currentUser">Welcome, {{ auth.currentUser.email }}</p>

      <div v-if="weatherData">
        <div class="row">
          <div class="col-12">
            <div class="dayCard" id="one">
              <div class="top-row">
                <h4 id="day1-name">{{ getDayName(weatherData.list[0].dt_txt) }}</h4>
                <p id="day1-temp">{{ Math.round(weatherData.list[0].main.temp) }}°C</p>
                <img :src="`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`" id="day1-icon" alt="icon">
              </div>
              <div class="bottom-row">
                <p>Max: <span id="day1-max">{{ Math.round(weatherData.list[0].main.temp_max) }}°C</span> | Min: <span id="day1-min">{{ Math.round(weatherData.list[0].main.temp_min) }}°C</span></p>
                <p id="day1-condition">{{ weatherData.list[0].weather[0].description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div v-for="index in [8, 16, 24, 32]" :key="index" class="col-md-5 col-12 dayCard small-card">
            <div class="top-row">
              <h4 class="day-name">{{ getDayName(weatherData.list[index].dt_txt) }}</h4>
              <p class="day-temp">{{ Math.round(weatherData.list[index].main.temp) }}°C</p>
              <img :src="`https://openweathermap.org/img/wn/${weatherData.list[index].weather[0].icon}@2x.png`" class="day-icon" alt="icon">
            </div>
            <div class="bottom-row">
              <p>Max: <span>{{ Math.round(weatherData.list[index].main.temp_max) }}°C</span> | Min: <span>{{ Math.round(weatherData.list[index].main.temp_min) }}°C</span></p>
              <p class="condition-text">{{ weatherData.list[index].weather[0].description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center p-5">
        <div class="spinner-border text-light" role="status"></div>
        <p class="mt-2 text-white">Loading weather data...</p>
      </div>
    </div>

    <footer class="text-white pt-4 pb-3">
        <div class="container text-center">
            <hr style="background-color: white">
            <p>© 2026 Weather App. All rights reserved.</p>
            <div class="social-icons mb-3">
                <img src="https://www.pngall.com/wp-content/uploads/17/Facebook-Logo-Circle-Creation-PNG.png" width="30" class="mx-2">
                <img src="https://png.pngtree.com/png-clipart/20190516/original/pngtree-twitter-icon-logo-png-image_3560523.png" width="30" class="mx-2">
            </div>
            <p class="small">{{ auth?.currentUser?.email || 'youssef.frontend2025@gmail.com' }}</p>
        </div>
    </footer>
  </div>
</template>

<style scoped>
/* التنسيق العام والخلفية المتحركة */
.main-wrapper {
  background-image: url("https://www.almarrakchi.com/wp-content/uploads/2023/06/201027024114-1024x680.jpg");
  background-size: 200% 100%;
  background-position: 0% 0%;
  background-repeat: no-repeat;
  animation: moveRightToLeft 20s linear infinite;
  min-height: 100vh;
  color: white;
}

@keyframes moveRightToLeft {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 0%; }
}

/* الهيدر */
header {
  background: rgba(255, 255, 255, 0.15);
  padding: 15px 25px;
  border-radius: 0 0 20px 20px;
  backdrop-filter: blur(5px);
}

#h1 { font-size: 1.8rem; font-weight: bold; }

#city-display {
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
}

.city-select {
  border-radius: 25px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

#image1 { width: 100px; }

/* البطاقات */
.dayCard {
  border-radius: 15px;
  color: white;
  text-align: left;
  padding: 15px;
  margin-bottom: 10px;
}

/* البطاقة الكبيرة */
#one {
  background-color: rgba(255, 255, 255, 0.2);
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

/* البطاقات الصغيرة */
.small-card {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.small-card:hover {
  box-shadow: 0 6px 15px rgba(0,0,0,0.4);
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
}

/* توزيع العناصر داخل الكروت */
.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
}

/* درجات الحرارة والأيقونات */
#day1-temp { font-size: 2.5rem; font-weight: bold; }
.day-temp { font-size: 1.8rem; font-weight: bold; }
#day1-icon { width: 100px; }
.day-icon { width: 80px; }
#day1-condition, .condition-text { font-style: italic; }

/* Responsiveness */
@media (min-width: 990px) {
  .small-card {
    margin: 10px 30px 10px 43px;
  }
}

.welcome-text { font-size: 1.1rem; margin-bottom: 20px; }
</style>