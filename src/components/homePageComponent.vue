<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCountriesStore } from '@/stores/countries';

const countriesStore = useCountriesStore();
const currentIndex = ref(0);
const options = ref([]);
const feedback = ref('');
const isAnswered = ref(false);

// Embaralha um array (Fisher-Yates shuffle)
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  return array;
}

const currentCountry = computed(() => {
  return countriesStore.countries[currentIndex.value];
});

const generateOptions = () => {
  if (!currentCountry.value) return;

  const correct = currentCountry.value;
  const incorrectOptions = [];

  while (incorrectOptions.length < 3) {
    const random = countriesStore.countries[Math.floor(Math.random() * countriesStore.countries.length)];
    if (random.name !== correct.name && !incorrectOptions.find(c => c.name === random.name)) {
      incorrectOptions.push(random);
    }
  }

  options.value = shuffle([correct, ...incorrectOptions]);
  isAnswered.value = false;
  feedback.value = '';
};

const selectOption = (option) => {
  if (isAnswered.value) return;

  if (option.name === currentCountry.value.name) {
    feedback.value = '✅ Correto!';
  } else {
    feedback.value = `❌ Errado! Era ${currentCountry.value.name.common}`;
  }

  isAnswered.value = true;
};

const nextQuestion = () => {
  if (currentIndex.value < countriesStore.countries.length - 1) {
    currentIndex.value++;
    generateOptions();
  } else {
    feedback.value = '🏁 Fim do jogo!';
  }
};

onMounted(async () => {
  await countriesStore.getAllCountries();
  generateOptions();
});
</script>

<template>
  <main v-if="currentCountry">
    <p class="e">{{ currentIndex }} de {{ countriesStore.countries.length }}</p>
    <div class="flag">
      <img :src="currentCountry.flags.png" alt="Bandeira" width="200" />
    </div>

    <ul>
      <li 
        v-for="option in options" 
        :key="option.name" 
        @click="selectOption(option)"
        style="cursor: pointer; padding: 10px; border: 1px solid #ccc; margin: 5px; background: #f9f9f9"
      >
        {{ option.name.common }}
      </li>
    </ul>

    <p class="f" v-if="feedback">{{ feedback }}</p>

    <button class="a" v-if="isAnswered && currentIndex < countriesStore.countries.length - 1" @click="nextQuestion">
      Próxima
    </button>

    <p v-else-if="isAnswered && currentIndex >= countriesStore.countries.length - 1">
      🏁 Fim do jogo!
    </p>
  </main>

  <p v-else>Carregando...</p>
</template>
<style>
    main{
        display: flex;
        flex-direction: column;
        padding-top: 2rem;
        gap: 1rem;
    }
    .flag{
        margin: 0 auto;
        width: 40%;
        
        & img{
            width: 100%;
            height: 45vh;
        }
    }

ul {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 40%;
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

ul li {
  text-align: center;
  padding: 10px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  cursor: pointer;
  width: 100%;
}
.f{
    text-align: center;
    font-size: 2rem;
}
.a{
    margin: 0 auto;
    text-align: center;
    width: 40% ;
    padding: 1rem 2rem;
    font-size: 1.5rem;
}
.e{
    text-align: center;
    font-size: 1.2rem;
}
</style>