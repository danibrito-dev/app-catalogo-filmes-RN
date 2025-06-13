import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Children, createContext, useCallback, useEffect, useState } from "react";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  runtime: string;
  release_date: string;
  vote_average: number;
};

type MovieContextData = {
  // função para guardar os IDs dos favoritos (array dos IDs no LocalStorage)
  favoriteMovies: number[];

  // função para buscar todos os filmes que favoritamos:
  allFavoriteMovies: Movie[];

  // função para adicionar o filme aos meus favoritos
  addFavoriteMovies: (movieId: number) => void

  // função para remover o filme dos meus favoritos
  removeFavoriteMovies: (movieId: number) => void
}


export const MovieContext = createContext<MovieContextData>( 
  {
    favoriteMovies: [],
    allFavoriteMovies: [],
    addFavoriteMovies: () => {},
    removeFavoriteMovies: () => {},
  }
)


type MovieProviderProps = {
  children: React.ReactNode;
}


// criar o provider
export function MovieProvider ({ children }: MovieProviderProps) {

  // armazenando os filmes favoritos:
  const [favoriteMovies, setFavoriteMovies] = useState<number[]>([])
  // buscar todos os filmes favoritos:
  const [allFavoriteMovies, setallFavoriteMovies] = useState<Movie[]>([])

  // função para fazer o carregamento prévio de todos os meus filmes favoritos no meu localStorage
  useEffect(() => {
      async function loadFavoriteMovies() {
        const favoriteMovies = await AsyncStorage.getItem("@FavoriteMovies")
      
        if (favoriteMovies) {
          setFavoriteMovies(JSON.parse(favoriteMovies))
        }
        
      }
    }, []
  )

  // função para adicionar os filmes:
  const addFavoriteMovies = useCallback(async (movieId: number) => {
    if (!favoriteMovies.includes(movieId)){
      const newFavoriteMovies = [...favoriteMovies, movieId];
      setFavoriteMovies(newFavoriteMovies)

      // salvando no localStorage:
      await AsyncStorage.setItem(
        "@FavoriteMovies", JSON.stringify(newFavoriteMovies)
      )
    }
  }, [favoriteMovies] 
  )

  // função para remover um filme favoritado
  const removeFavoriteMovies = useCallback(async (movieId: number) => {
      const newFavoriteMovies = favoriteMovies.filter((id) => id !== movieId);
      setFavoriteMovies(newFavoriteMovies)

      // salvando no localStorage:
      await AsyncStorage.setItem(
        "@FavoriteMovies", JSON.stringify(newFavoriteMovies)
      )
    }
  )

  const contextData: MovieContextData = {
    favoriteMovies,
    allFavoriteMovies,
    addFavoriteMovies,
    removeFavoriteMovies,
  }

  return (
    <MovieContext.Provider value={contextData} >
      {children}
    </MovieContext.Provider>
  )
}