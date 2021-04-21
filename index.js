const search = document.querySelector('#search'),
      submit = document.querySelector('#submit'),
      random = document.querySelector('#random'),
      mealsEl = document.querySelector('#meals'),
      resultHeading = document.querySelector('#result-heading'),
      singleMeals = document.querySelector('#single-meals')


//MEALS FUNCTIONS 
const mealsHandler = (data)=>{
    data.meals === null?resultHeading.innerHTML = `<p style="color:red;font-size:20px">There are no search results for ${search.value} </p>`
                       :mealsEl.innerHTML = data.meals.map(meal=> 
                       `<div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                            </div>
                       </div>`).join('')
}
//ALERT MEALS FUNCTION
const resultHeadingAlert = element=>{
    element.innerHTML = `<h3>Please enter a serch term</h3>`
    setTimeout(()=>{
        element.innerHTML = ''
    },3000)  
}
//ADD MEAL TO DOM
const addMealToDOM = meal=>{
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
          ingredients.push(
            `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
          );
        } else {
          break;
        }
    }
    singleMeals.innerHTML = `<div class="single-meal">
                                <h1>${meal.strMeal}</h1>
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                                <div class="single-meal-info">
                                ${meal.strCategory&&`<p>${meal.strCategory}</p>`}
                                ${meal.strArea&&`<p>${meal.strArea}</p>`||''}
                                </div>
                                <div class="main">
                                <p>${meal.strInstructions}</p>
                                <h2>Ingredients</h2>
                                <ul>
                                    ${ingredients.map(rx=>`<li>${rx}</li>`).join('')}                                      
                                </ul>
                                </div>
                            </div>`
}

//FETCH MEAL BY ID
const getMealById = mealID=>{
    mealID.trim()?fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0]
        addMealToDOM(meal)
    })
    :resultHeadingAlert(resultHeading)
}

//FETCH RANDOM MEAL FROM API
const getRandomMeal = () =>{
    mealsEl.innerHTML = ''
    resultHeading.innerHTML = ''
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data =>{
        const meal = data.meals[0]
        addMealToDOM(meal)
    })
}

//SEARCH MEAL AND FETCH FROM API
const searchMeal = (e)=>{
e.preventDefault()
//clear single meal
singleMeals.innerHTML = ''
//get search term (search from search value)
const term = search.value

term.trim()?fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
           .then(res => res.json())
           .then(data => {
            resultHeading.innerHTML = `<h2>Search results for '${term}' :</h2>`
            mealsHandler(data)
            search.value = ''
           })
           :resultHeadingAlert(resultHeading)

}






//EVENTLISNTERS 
submit.addEventListener('submit',searchMeal)
random.addEventListener('click',getRandomMeal)
mealsEl.addEventListener('click', e =>{
    const mealInfo = e.path || (e.composedPath && e.composedPath())
    let newMeals = mealInfo.find(item=>{
       if(item.classList){
           return item.classList.contains('meal-info')
       }else{
           return false
       }
    })
    if(newMeals){
        const mealID = newMeals.getAttribute('data-mealid')
        getMealById(mealID)
    }
})


