import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import api from "@/plugins/axios";


export const useCountriesStore = defineStore('countries', () => {
    const countries = ref([])


    const getAllCountries = async()=>{
        const response = await api.get('/all?fields=name,flags')
        countries.value = response.data;
    }

    return{
        countries,
        getAllCountries
    }
})