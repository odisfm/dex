import {Pokedex} from "pokeapi-js-wrapper";

export default new Pokedex({
    protocol: "https",
    versionPath: "/api/v2/",
    cache: true,
    timeout: 5 * 1000, // 5s
})
