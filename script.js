// Seu código para carregar o conteúdo da página continua aqui...
document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('.navbar a');
    const content = document.querySelector('.content');

    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            // Remove 'active' class from all menu items
            menuItems.forEach(link => link.classList.remove('active'));
            // Add 'active' class to the clicked menu item
            this.classList.add('active');
            // Obter o nome da página baseado no item clicado
            let page = this.id; // Use o ID do item como nome do arquivo
            // Carregar conteúdo do arquivo HTML correspondente
            fetch(`${page}.html`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(data => {
                    content.innerHTML = data; // Atualiza o conteúdo com o HTML carregado
                    if (page === 'water') {
                        initializeWaterJS(); // Chama a função para configurar o comportamento da água
                    } 
                    if (page === 'dieta') {
                        initializeDietJS(); // Chama a função para configurar o comportamento da dieta
                    } 
                    if (page === 'calendario') {
                        initializeCalendarioJS(); // Chama a função para configurar o comportamento do exercício
                    }
                    if (page === 'treinos') {
                        initializeTreinosJS(); // Chama a função para configurar o comportamento do treino
                    }
                    if (page === 'perfil') {
                        initializeProfileJS(); // Chama a função para configurar o comportamento do perfil
                    }
                })
                .catch(error => {
                    console.error('Houve um problema com a requisição fetch:', error);
                    content.innerHTML = `<p>Erro ao carregar o conteúdo da página.</p>`;
                });
        });
    });

    // Carregar a página inicial automaticamente
    const homeItem = document.getElementById("home"); // Obtenha o elemento home
    homeItem.click(); // Simule um clique no item home
});

function initializeProfileJS() {
    // Carregar dados do localStorage ao iniciar
    loadData();

    function enableEdit(fieldId) {
        document.getElementById(fieldId).disabled = false;
        document.getElementById(fieldId).focus();
    }

    function saveData() {
        const height = parseFloat(document.getElementById("height").value) / 100; // Convertendo para metros
        const weight = parseFloat(document.getElementById("weight").value);
        
        // Calcula IMC
        const imc = (weight / (height * height)).toFixed(2);
        document.getElementById("imcValue").textContent = imc;

        // Categorias de IMC
        let category = "";
        if (imc < 18.5) {
            category = "Abaixo do peso";
        } else if (imc >= 18.5 && imc <= 24.9) {
            category = "Peso normal";
        } else if (imc >= 25 && imc <= 29.9) {
            category = "Sobrepeso";
        } else {
            category = "Obesidade";
        }
        document.getElementById("imcCategory").textContent = category;

        // Salvar dados no localStorage
        localStorage.setItem('name', document.getElementById("name").value);
        localStorage.setItem('age', document.getElementById("age").value);
        localStorage.setItem('height', document.getElementById("height").value);
        localStorage.setItem('weight', document.getElementById("weight").value);
        localStorage.setItem('imcValue', imc);
        localStorage.setItem('imcCategory', category);

        // Desabilita os campos de input após salvar
        document.getElementById("name").disabled = true;
        document.getElementById("age").disabled = true;
        document.getElementById("height").disabled = true;
        document.getElementById("weight").disabled = true;
    }

    function loadData() {
        // Carregar dados do localStorage
        document.getElementById("name").value = localStorage.getItem('name') || 'Seu Nome';
        document.getElementById("age").value = localStorage.getItem('age') || '25';
        document.getElementById("height").value = localStorage.getItem('height') || '170';
        document.getElementById("weight").value = localStorage.getItem('weight') || '70';
        document.getElementById("imcValue").textContent = localStorage.getItem('imcValue') || '-';
        document.getElementById("imcCategory").textContent = localStorage.getItem('imcCategory') || '-';
    }

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const fieldId = this.previousElementSibling.id;
            enableEdit(fieldId);
        });
    });

    document.querySelector('button[onclick="saveData()"]').addEventListener('click', saveData);
}

function initializeWaterJS() {
    const waterInput = document.getElementById("waterInput");
    const addWaterBtn = document.getElementById("addWater");
    const resetWaterBtn = document.getElementById("resetWater");
    const liters = document.getElementById("liters");
    const percentage = document.getElementById("percentage");
    const remained = document.getElementById("remained");
    const goalInput = document.getElementById("goal");

    // Carregar dados do localStorage ao iniciar
    let totalDrunk = parseInt(localStorage.getItem('totalDrunk')) || 0;
    let goal = parseInt(localStorage.getItem('goal')) || parseInt(goalInput.value);

    updateCup();

    // Atualiza a meta quando o usuário altera o valor no input
    goalInput.value = goal; // Define o valor da meta a partir do localStorage
    goalInput.addEventListener("input", function () {
        goal = parseInt(this.value);
        localStorage.setItem('goal', goal); // Salva a nova meta no localStorage
        updateCup(); // Atualiza a visualização ao alterar a meta
    });

    // Aumenta a quantidade de água consumida
    addWaterBtn.addEventListener("click", function () {
        const waterAmount = parseInt(waterInput.value);
        if (waterAmount > 0) {
            totalDrunk += waterAmount;
            localStorage.setItem('totalDrunk', totalDrunk); // Salva a quantidade total consumida no localStorage
            updateCup();
        }
    });

    // Reseta a quantidade de água bebida
    resetWaterBtn.addEventListener("click", function () {
        totalDrunk = 0;
        localStorage.setItem('totalDrunk', totalDrunk); // Reseta o valor no localStorage
        liters.innerText = ''; // Limpa a mensagem de litros
        updateCup();
    });

    // Função para atualizar a visualização
    function updateCup() {
        const percentageDrunk = (totalDrunk / goal) * 100;

        // Atualiza a porcentagem
        if (totalDrunk === 0) {
            percentage.style.visibility = "hidden";
            percentage.innerText = '';
        } else {
            percentage.style.visibility = "visible";
            percentage.innerText = `${Math.min(percentageDrunk, 100).toFixed(1)}%`;
        }

        // Atualiza o restante de litros
        if (totalDrunk >= goal) {
            liters.innerText = `Meta atingida! Volte amanhã.`;
        } else {
            remained.style.visibility = "visible";
            const remaining = goal - totalDrunk;
            const remainingLiters = (remaining / 1000).toFixed(1); // Conversão para litros com uma casa decimal
            liters.innerText = `${remainingLiters}L Restantes`; // Alterando para L
        }
    }
}

function initializeDietJS() {
    const addMealBtn = document.getElementById("addMeal");
    const dicasAlimentosBtn = document.getElementById("dicasAlimentos");
    const resetDayBtn = document.getElementById("resetDay");
    const mealSummary = document.getElementById("mealSummary");
    const totalProteinas = document.getElementById("totalProteinas");
    const totalCalorias = document.getElementById("totalCalorias");
    const totalGordura = document.getElementById("totalGordura");
    const totalCarboidratos = document.getElementById("totalCarboidratos");
    const totalCusto = document.getElementById("totalCusto");

    // Recupera dados do localStorage
    const dailyTotal = JSON.parse(localStorage.getItem('dailyTotal')) || {
        proteinas: 0,
        calorias: 0,
        gordura: 0,
        carboidratos: 0,
        custo: 0,
    };

    // Atualiza a UI com os totais recuperados
    totalProteinas.innerText = dailyTotal.proteinas;
    totalCalorias.innerText = dailyTotal.calorias;
    totalGordura.innerText = dailyTotal.gordura.toFixed(2);
    totalCarboidratos.innerText = dailyTotal.carboidratos;
    totalCusto.innerText = dailyTotal.custo.toFixed(2);

    // Restaura o resumo diário
    const savedMeals = JSON.parse(localStorage.getItem('meals')) || [];
    savedMeals.forEach((meal, index) => {
        const mealEntry = document.createElement("div");
        mealEntry.innerHTML = `<p style="border: 1px solid var(--tertiary-color); border-radius: 8px; padding: 8px 8px;">
            <strong style="color: var(--tertiary-color);font-size: 1.2em;">${meal.food}:</strong> 
            <br>Proteínas: ${meal.proteinas}g, Calorias: ${meal.calorias}kcal, 
            <br>Gordura: ${meal.gordura}g, Carboidratos: ${meal.carboidratos}g, 
            <br><i>Custo: R$ ${meal.custo.toFixed(2)}</i>
            <br><button class="remove-btn" data-index="${index}">Remover</button>
        </p><br>`;
        mealSummary.appendChild(mealEntry);

        // Adiciona a funcionalidade de remoção
        const removeBtn = mealEntry.querySelector(".remove-btn");
        removeBtn.addEventListener("click", function () {
            removeMeal(index, meal);
        });
    });

    // Função para remover refeição
    function removeMeal(index, meal) {
        // Atualiza os totais
        dailyTotal.proteinas -= meal.proteinas;
        dailyTotal.calorias -= meal.calorias;
        dailyTotal.gordura -= meal.gordura;
        dailyTotal.carboidratos -= meal.carboidratos;
        dailyTotal.custo -= meal.custo;

        // Remove a refeição do array
        savedMeals.splice(index, 1);

        // Salva os dados no localStorage
        localStorage.setItem('dailyTotal', JSON.stringify(dailyTotal));
        localStorage.setItem('meals', JSON.stringify(savedMeals));

        // Atualiza a UI
        totalProteinas.innerText = dailyTotal.proteinas;
        totalCalorias.innerText = dailyTotal.calorias;
        totalGordura.innerText = dailyTotal.gordura.toFixed(2);
        totalCarboidratos.innerText = dailyTotal.carboidratos;
        totalCusto.innerText = dailyTotal.custo.toFixed(2);

        // Atualiza o resumo diário
        mealSummary.innerHTML = "";
        savedMeals.forEach((meal, index) => {
            const mealEntry = document.createElement("div");
            mealEntry.innerHTML = `<p style="border: 1px solid var(--tertiary-color); border-radius: 8px; padding: 8px 8px;">
                <strong style="color: var(--tertiary-color);font-size: 1.2em;">${meal.food}:</strong> 
                <br>Proteínas: ${meal.proteinas}g, Calorias: ${meal.calorias}kcal, 
                <br>Gordura: ${meal.gordura}g, Carboidratos: ${meal.carboidratos}g, 
                <br><i>Custo: R$ ${meal.custo.toFixed(2)}</i>
                <button class="remove-btn" data-index="${index}">Remover</button>
            </p><br>`;
            mealSummary.appendChild(mealEntry);

            // Adiciona a funcionalidade de remoção para o novo item
            const removeBtn = mealEntry.querySelector(".remove-btn");
            removeBtn.addEventListener("click", function () {
                removeMeal(index, meal);
            });
        });
    }

    addMealBtn.addEventListener("click", function () {
        const food = document.getElementById("food").value.trim();
        const proteinas = parseFloat(document.getElementById("proteinas").value) || 0;
        const calorias = parseFloat(document.getElementById("calorias").value) || 0;
        const gordura = parseFloat(document.getElementById("gordura").value) || 0;
        const carboidratos = parseFloat(document.getElementById("carboidratos").value) || 0;
        const custo = parseFloat(document.getElementById("custo").value) || 0;

        if (food === "") {
            alert("Por favor, preencha o nome do alimento.");
            return;
        }

        const mealEntry = {
            food,
            proteinas,
            calorias,
            gordura,
            carboidratos,
            custo
        };

        // Atualiza os totais
        dailyTotal.proteinas += proteinas;
        dailyTotal.calorias += calorias;
        dailyTotal.gordura += gordura;
        dailyTotal.carboidratos += carboidratos;
        dailyTotal.custo += custo;

        // Salva os dados
        savedMeals.push(mealEntry);
        localStorage.setItem('dailyTotal', JSON.stringify(dailyTotal));
        localStorage.setItem('meals', JSON.stringify(savedMeals));

        // Atualiza a UI
        totalProteinas.innerText = dailyTotal.proteinas;
        totalCalorias.innerText = dailyTotal.calorias;
        totalGordura.innerText = dailyTotal.gordura.toFixed(2);
        totalCarboidratos.innerText = dailyTotal.carboidratos;
        totalCusto.innerText = dailyTotal.custo.toFixed(2);

        // Exibe a entrada da refeição
        const mealDiv = document.createElement("div");
        mealDiv.innerHTML = `<p style="border: 1px solid var(--tertiary-color); border-radius: 8px; padding: 8px 8px;">
            <strong style="color: var(--tertiary-color);font-size: 1.2em;">${food}:</strong> 
            <br>Proteínas: ${proteinas}g, Calorias: ${calorias}kcal, 
            <br>Gordura: ${gordura}g, Carboidratos: ${carboidratos}g, 
            <br><i>Custo: R$ ${custo.toFixed(2)}</i>
            <button class="remove-btn" data-index="${savedMeals.length - 1}">Remover</button>
        </p><br>`;
        mealSummary.appendChild(mealDiv);

        // Adiciona a funcionalidade de remoção para o novo item
        const removeBtn = mealDiv.querySelector(".remove-btn");
        removeBtn.addEventListener("click", function () {
            removeMeal(savedMeals.length - 1, mealEntry);
        });
    });

    resetDayBtn.addEventListener("click", function () {
        // Zera os totais
        localStorage.removeItem('dailyTotal');
        localStorage.removeItem('meals');
        dailyTotal.proteinas = 0;
        dailyTotal.calorias = 0;
        dailyTotal.gordura = 0;
        dailyTotal.carboidratos = 0;
        dailyTotal.custo = 0;

        totalProteinas.innerText = dailyTotal.proteinas;
        totalCalorias.innerText = dailyTotal.calorias;
        totalGordura.innerText = dailyTotal.gordura.toFixed(2);
        totalCarboidratos.innerText = dailyTotal.carboidratos;
        totalCusto.innerText = dailyTotal.custo.toFixed(2);
        
        mealSummary.innerHTML = ""; // Limpa o Resumo Diário
    });

    // Função para abrir o modal de Dicas de Alimentos
    const foodModal = document.getElementById("foodModal");
    const closeModal = document.querySelector(".close");
    const foodList = document.getElementById("foodList");

  // Lista de alimentos
  const alimentos = [
    { nome: "Abacate", proteinas: 2, carboidratos: 9, gordura: 15, calorias: 160 },
    
    { nome: "Arroz Integral", proteinas: 2.6, carboidratos: 23, gordura: 0.9, calorias: 111 },
    { nome: "Atum", proteinas: 23, carboidratos: 0, gordura: 0.5, calorias: 109 },
    { nome: "Aveia", proteinas: 13.2, carboidratos: 68.5, gordura: 7, calorias: 389 },
    { nome: "Banana", proteinas: 1.3, carboidratos: 27, gordura: 0.3, calorias: 105 },
    { nome: "Batata Doce", proteinas: 2, carboidratos: 20, gordura: 0.1, calorias: 86 },
    { nome: "Brócolis", proteinas: 2.8, carboidratos: 7, gordura: 0.4, calorias: 35 },
    { nome: "Frango", proteinas: 31, carboidratos: 0, gordura: 3.6, calorias: 165 },
    { nome: "Iogurte Natural", proteinas: 10, carboidratos: 12, gordura: 3.3, calorias: 88 },
    { nome: "Lentilha", proteinas: 9, carboidratos: 20, gordura: 0.4, calorias: 116 },
    { nome: "Macarrão Integral", proteinas: 7, carboidratos: 30, gordura: 1.6, calorias: 150 },
    { nome: "Manga", proteinas: 0.8, carboidratos: 15, gordura: 0.4, calorias: 60 },
    { nome: "Morango", proteinas: 0.7, carboidratos: 7.7, gordura: 0.3, calorias: 32 },
    { nome: "Ovo", proteinas: 13, carboidratos: 1, gordura: 10, calorias: 155 },
    { nome: "Peito de Peru", proteinas: 20.4, carboidratos: 1.2, gordura: 1.3, calorias: 100 },
    { nome: "Pepino", proteinas: 0.6, carboidratos: 3.6, gordura: 0.1, calorias: 16 },
    { nome: "Queijo Cottage", proteinas: 11, carboidratos: 3, gordura: 4.3, calorias: 98 },
    { nome: "Quinoa", proteinas: 4.4, carboidratos: 21, gordura: 1.9, calorias: 120 },
    { nome: "Salmão", proteinas: 20, carboidratos: 0, gordura: 13, calorias: 206 },
    { nome: "Tofu", proteinas: 8, carboidratos: 2, gordura: 5, calorias: 76 },
    { nome: "Uva", proteinas: 0.6, carboidratos: 17, gordura: 0.2, calorias: 69 },
];

dicasAlimentosBtn.addEventListener("click", function () {
    foodModal.style.display = "block";
    foodList.innerHTML = "";

    alimentos.forEach((alimento) => {
        const foodItem = document.createElement("div");
        foodItem.classList.add("food-item");

        foodItem.innerHTML = `
            <p><strong>${alimento.nome}</strong></p>
            <input type="number" class="gramas-input" placeholder="gramas" min="1">
            <button class="add-btn">ADD</button>
        `;

        const gramasInput = foodItem.querySelector(".gramas-input");
        const addBtn = foodItem.querySelector(".add-btn");

        gramasInput.addEventListener("input", () => {
            const gramas = parseFloat(gramasInput.value) || 100;
            const fator = gramas / 100;

            // Calcula os valores baseados na quantidade de gramas
            alimento.proteinasAtual = (alimento.proteinas * fator).toFixed(2);
            alimento.carboidratosAtual = (alimento.carboidratos * fator).toFixed(2);
            alimento.gorduraAtual = (alimento.gordura * fator).toFixed(2);
            alimento.caloriasAtual = (alimento.calorias * fator).toFixed(2);
        });

        addBtn.addEventListener("click", () => {
            document.getElementById("food").value = alimento.nome;
            document.getElementById("proteinas").value = alimento.proteinasAtual;
            document.getElementById("calorias").value = alimento.caloriasAtual;
            document.getElementById("gordura").value = alimento.gorduraAtual;
            document.getElementById("carboidratos").value = alimento.carboidratosAtual;
            foodModal.style.display = "none";
        });

        foodList.appendChild(foodItem);
    });
});

closeModal.addEventListener("click", function () {
    foodModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target === foodModal) {
        foodModal.style.display = "none";
    }
});
}

function initializeCalendarioJS() {
    const calendar = document.getElementById('calendar');
    const monthTitle = document.getElementById('month-title');
    const trainingSelect = document.getElementById('training-select');
    const registerTrainingBtn = document.getElementById('register-training');
    const registeredTrainingsDiv = document.getElementById('registered-trainings');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDays = JSON.parse(localStorage.getItem('selectedDays')) || {};
    let currentlySelectedDay = null;

    function createCalendar(month, year) {
        calendar.innerHTML = '';
        monthTitle.innerText = `${getMonthName(month)} ${year}`;
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const dayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        for (let i = 0; i < dayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            calendar.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.innerText = day;

            const fullDate = `${day}/${month + 1}/${year}`;

            if (selectedDays[fullDate]) {
                dayElement.classList.add('registered');
            }

            if (
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear()
            ) {
                dayElement.classList.add('selected');
                currentlySelectedDay = dayElement;
                displayTrainingsForDay(fullDate);
            }

            dayElement.addEventListener('click', function () {
                if (currentlySelectedDay) {
                    currentlySelectedDay.classList.remove('selected');
                }

                currentlySelectedDay = dayElement;
                currentlySelectedDay.classList.add('selected');
                displayTrainingsForDay(fullDate);
            });

            calendar.appendChild(dayElement);
        }
    }

    function displayTrainingsForDay(fullDate) {
        const trainingsForDay = selectedDays[fullDate];
        if (trainingsForDay) {
            registeredTrainingsDiv.innerHTML = `<h3>Treinos Registrados:</h3>${trainingsForDay.map(training => `<div>${fullDate}: ${training}</div>`).join('')}`;
        } else {
            registeredTrainingsDiv.innerHTML = '<h3>Nenhum treino registrado para este dia.</h3>';
        }
    }

    registerTrainingBtn.addEventListener('click', function () {
        if (currentlySelectedDay) {
            const selectedDay = currentlySelectedDay.innerText;
            const fullDate = `${selectedDay}/${currentMonth + 1}/${currentYear}`;
            const training = trainingSelect.value;

            if (!selectedDays[fullDate]) {
                selectedDays[fullDate] = [];
            }
            selectedDays[fullDate].push(training);

            localStorage.setItem('selectedDays', JSON.stringify(selectedDays));

            currentlySelectedDay.classList.add('registered');
            currentlySelectedDay.classList.remove('selected');
            currentlySelectedDay = null;

            displayTrainingsForDay(fullDate);
        } else {
            alert("Por favor, selecione um dia para registrar o treino.");
        }
    });

    function getMonthName(month) {
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return monthNames[month];
    }

    prevMonthBtn.addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        createCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        createCalendar(currentMonth, currentYear);
    });

    createCalendar(currentMonth, currentYear);
}

function initializeTreinosJS() {
    const workoutNameInput = document.getElementById("workoutName");
    const exercisesContainer = document.getElementById("exercisesContainer");
    const registeredWorkoutsDiv = document.getElementById("registeredWorkouts");

    function removeExercise(event) {
        event.target.parentElement.remove();
    }

    document.getElementById("addExercise").addEventListener("click", function () {
        const newExercise = document.createElement("div");
        newExercise.classList.add("exercise-input");

        const exerciseInput = `
            <input type="text" placeholder="Nome do exercício" class="exercise-name">
            <input type="number" class="series-reps" placeholder="Séries" min="1">
            <input type="number" class="series-reps" placeholder="Repetições" min="1">
            <button class="remove-exercise">Remover</button>
        `;

        newExercise.innerHTML = exerciseInput;
        exercisesContainer.appendChild(newExercise);
        newExercise.querySelector('.remove-exercise').addEventListener("click", removeExercise);
    });

    document.querySelector('.remove-exercise').addEventListener("click", removeExercise);

    function saveWorkoutsToLocalStorage() {
        const workoutList = [];
        document.querySelectorAll(".training-item").forEach(workout => {
            workoutList.push(workout.querySelector(".workout-text").textContent);
        });
        localStorage.setItem("registeredWorkouts", JSON.stringify(workoutList));
    }

    function loadWorkoutsFromLocalStorage() {
        const savedWorkouts = JSON.parse(localStorage.getItem("registeredWorkouts")) || [];
        savedWorkouts.forEach(workoutText => {
            addWorkoutToUI(workoutText);
        });
    }

    function addWorkoutToUI(workoutText) {
        const workoutEntry = document.createElement("div");
        workoutEntry.className = "training-item";
    
        // Separar o título do treino e os exercícios
        const [workoutName, exercisesText] = workoutText.split(":");
        const exercisesList = exercisesText ? exercisesText.split(", ") : [];
    
        // Adiciona o título do treino
        const workoutTitleSpan = document.createElement("span");
        workoutTitleSpan.className = "workout-title";
        workoutTitleSpan.textContent = workoutName.trim();
        workoutEntry.appendChild(workoutTitleSpan);
    
        // Adiciona a lista de exercícios, cada um em uma linha
        const exercisesContainer = document.createElement("div");
        exercisesContainer.className = "workout-exercises";
        exercisesList.forEach(exercise => {
            const exerciseItem = document.createElement("div");
            exerciseItem.className = "exercise-item";
            exerciseItem.textContent = exercise.trim();
            exercisesContainer.appendChild(exerciseItem);
        });
        workoutEntry.appendChild(exercisesContainer);
    
        // Adiciona o botão de remoção
        const removeButton = document.createElement("button");
        removeButton.className = "remove-training";
        removeButton.textContent = " Remover ";
        removeButton.addEventListener("click", function () {
            workoutEntry.remove();
            saveWorkoutsToLocalStorage();
        });
    
        workoutEntry.appendChild(removeButton);
        registeredWorkoutsDiv.appendChild(workoutEntry);
    }

    document.getElementById("saveWorkout").addEventListener("click", function () {
        const workoutName = workoutNameInput.value.trim();
        const exercises = Array.from(document.querySelectorAll(".exercise-input")).map((exercise) => {
            const exerciseName = exercise.querySelector(".exercise-name").value.trim();
            const series = exercise.querySelectorAll(".series-reps")[0].value || 0;
            const reps = exercise.querySelectorAll(".series-reps")[1].value || 0;

            if (exerciseName) {
                return `${exerciseName} - ${series} Séries - ${reps} Repetições`;
            }
            return null;
        }).filter(exercise => exercise);

        if (workoutName === "" || exercises.length === 0) {
            alert("Por favor, nomeie seu treino e adicione pelo menos um exercício válido.");
            return;
        }

        const workoutText = `${workoutName}: ${exercises.join(", ")}`;
        addWorkoutToUI(workoutText);
        saveWorkoutsToLocalStorage();

        workoutNameInput.value = "";
        exercisesContainer.innerHTML = `
            <div class="exercise-input">
                <input type="text" placeholder="Nome do exercício" class="exercise-name">
                <input type="number" class="series-reps" placeholder="Séries" min="1">
                <input type="number" class="series-reps" placeholder="Repetições" min="1">
                <button class="remove-exercise">Remover</button>
            </div>
        `;

        document.querySelector('.remove-exercise').addEventListener("click", removeExercise);
    });

    loadWorkoutsFromLocalStorage();
}


