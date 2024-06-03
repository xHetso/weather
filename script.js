let weather = {
    dayTranslations: {
        "понедельник": "Дүйсенбі",
        "вторник": "Сейсенбі",
        "среда": "Сәрсенбі",
        "четверг": "Бейсенбі",
        "пятница": "Жұма",
        "суббота": "Сенбі",
        "воскресенье": "Жексенбі"
    },
    "apikey": "1a375e0ead34c7e75ad73b562d47af85",
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&lang=kk&appid=" + this.apikey)
            .then((Response) => Response.json())
            .then((data) => this.displayWeather(data));

        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&lang=kk&appid=" + this.apikey)
            .then((Response) => Response.json())
            .then((data) => this.displayForecast(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        const descriptions = {
            "clear sky": "Ауа райы ашық",
            "few clouds": "Бірнеше бұлт",
            "scattered clouds": "Шашылған бұлттар",
            "broken clouds": "Бұзылған бұлттар",
            "overcast clouds": "Бұлтты",
            "mist": "Тұманды",
            "fog": "Тұманды",
            "light rain": "Жеңіл жаңбыр",
            "moderate rain": "Қалыпты жаңбыр",
            "heavy intensity rain": "Қатты жаңбыр",
            "light snow": "Жеңіл қар",
            "moderate snow": "Қалыпты қару",
            "heavy snow": "Қалың қар",
            "thunderstorm with rain": "Жаңбырмен бірге найзағай",
            "thunderstorm with heavy rain": "найзағай және жаңбыр болады",
            "thunderstorm with light rain": "жеңіл жаңбыр найзағай болады",
            "thunderstorm": "найзағайлы"
        };        

        const kazakhDescription = descriptions[description] || description;

        let recommendation = "";
        if (description.includes("rain")) {
            recommendation = "Жаңбыр жауады, өзіңізбен бірге қолшатыр алуыңыз ұсынылады.";
        } else if (description.includes("cloud")) {
            recommendation = "Бұлттар қалыңдап кеткен тұр, өзіңізбен бірге қолшатыр алғаныңыз дұрыс шығар.";
        } else if (description.includes("clear sky")) {
            recommendation = "Жаяу серуендеу үшін тамаша ауа-райы! Көзілдірікті және күннен қорғайтын кремді ұмытпаңыз.";
        } else {
            recommendation = "Ауа-райынан ләззат алыңыз!";
        }

        document.querySelector(".city").innerText = name + "-дағы Ауа-райы";
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = kazakhDescription;
        document.querySelector(".recommendation").innerText = recommendation;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Ылғалдылық: " + humidity + "%";
        document.querySelector(".wind").innerText = "Жел жылдамдығы: " + speed + " км/сағ";
        document.querySelector(".weather").classList.remove("loading");

        let backgroundImage = "";
        switch (description) {
            case "clear sky":
                backgroundImage = "url('https://source.unsplash.com/1600x900/?sunny')";
                break;
            case "few clouds":
            case "scattered clouds":
            case "broken clouds":
            case "overcast clouds":
                backgroundImage = "url('https://source.unsplash.com/1600x900/?cloudy')";
                break;
            case "mist":
            case "fog":
                backgroundImage = "url('https://source.unsplash.com/1600x900/?fog')";
                break;
            case "light rain":
            case "moderate rain":
            case "heavy intensity rain":
                backgroundImage = "url('https://source.unsplash.com/1600x900/?rain')";
                break;
            case "light snow":
            case "moderate snow":
            case "heavy snow":
                backgroundImage = "url('https://source.unsplash.com/1600x900/?snow')";
                break;
            case "thunderstorm with rain":
            case "thunderstorm with heavy rain":
            case "thunderstorm with light rain":
            case "thunderstorm":
                backgroundImage = "url('https://source.unsplash.com/1600x900/?thunderstorm')";
                break;
            default:
                backgroundImage = "url('https://source.unsplash.com/1600x900/?weather')";
        }
        document.body.style.backgroundImage = backgroundImage;
    },

    displayForecast: function (data) {
        const forecastEl = document.querySelector(".forecast");
        forecastEl.innerHTML = ""; // Очищаем предыдущий прогноз
    
        const today = new Date();
        const currentDay = today.toLocaleDateString("kk-KZ", { weekday: 'long', timeZone: 'Asia/Almaty' });
        console.log(today)
    
        const days = {};
    
        // Группируем прогноз по дням
        data.list.forEach((item) => {
            const date = new Date(item.dt_txt);
            const day = date.toLocaleDateString("kk-KZ", { weekday: 'long', timeZone: 'Asia/Almaty' });
            
            // Преобразуем день недели
            const translatedDay = this.dayTranslations[day] || day;
    
            if (translatedDay !== currentDay && !days[translatedDay]) {
                days[translatedDay] = item; // Используем первую запись для каждого дня
            }
        });
    
        // Отображаем прогноз на следующие 6 дней, исключая сегодня
        const dayKeys = Object.keys(days).slice(1, 7);
        console.log(`Daykeys: ${dayKeys}`)
        dayKeys.forEach((day) => {
            const forecastData = days[day];
            const { icon } = forecastData.weather[0];
            const { temp } = forecastData.main;
    
            const dayEl = document.createElement("div");
            dayEl.classList.add("forecast-day");
    
            dayEl.innerHTML = `
            <h3 style="color: white;">${day}</h3>
            <img src="https://openweathermap.org/img/wn/${icon}.png" class="icon" />
            <div class="temp" style="color: white;">${temp.toFixed(1)}°C</div>
        `;
    
            forecastEl.appendChild(dayEl);
        });
    },
    

    search: function () {
        this.fetchWeather(document.querySelector(".searchbar").value);
    }
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document.querySelector(".searchbar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
});

// Выводим текущий день недели в консоль
const today = new Date();
const dayOfWeek = today.toLocaleDateString("kk-KZ", { weekday: 'long' });
console.log("Сегодня:", dayOfWeek);

weather.fetchWeather("uralsk");
