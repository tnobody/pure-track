import { InjectionKey, inject } from "vue";
import Pocketbase from 'pocketbase'
import { fail } from "../helper/fail";

export const PockebaseInjectionKey = Symbol() as InjectionKey<Pocketbase>


export const usePocketbase = () => {
    return inject(PockebaseInjectionKey) ?? fail("Pcketbase not porvided");
}