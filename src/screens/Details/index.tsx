import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../services/api";
import { BookmarkSimple, CalendarBlank, CaretLeft, Clock, Star } from "phosphor-react-native";

//criar a tipagem MovieDetails
type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  runtime: string;
  release_date: string;
  vote_average: number;
};

type RouterProps = {
  movieId: number;
};

export function Details() {

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading ] = useState(false)
  const route = useRoute()
  // const { movieId } = route.params as RouterProps;
  const movieId = (route.params).movieID;

  const navigation = useNavigation();

  // criar "useEffect" para buscar o movie
  useEffect( () => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        // console.log(route)
        // let x = (route.params).movieID
        // console.log(x)
        // console.log("-----")
        // console.log(movieId)
        // console.log(route.params.movieID)
        // const response = await api.get(`/movie/${x}`);
        const response = await api.get(`/movie/${movieId}`);
        // const response = await api.get(`/movie/${movieId}`);
        // console.log(JSON.stringify(response.data, null, 2));
        setMovieDetails(response.data);
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    };
    fetchMovieDetails();
  }, [movieId]);

  function getYear(data: string) {
    const ano = new Date(data).getFullYear();
    return ano;
  }
  
  return(
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CaretLeft color="#fff" size={32} weight="thin" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Detalhes</Text>

        <TouchableOpacity>
          <BookmarkSimple color="#fff" size={32} weight="thin" />
        </TouchableOpacity>
      </View>
      
        {loading && <ActivityIndicator size="large" color="#FFF" /> }
        {!loading && <>
        
          <View>
            <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movieDetails?.backdrop_path}`,
                }}
                style={styles.detailsImage}
              />

            <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`,
                }}
                style={styles.detailsPosterImage}
              />
              <Text style={styles.titleMovie}>{movieDetails?.title}</Text>
              <View style={styles.description}>
                <View style={styles.descriptionGroup}>
                  <CalendarBlank color="#92929d" size={25} weight="thin" />
                  <Text style={styles.descriptionText} >
                    {getYear(movieDetails?.release_date)}
                  </Text>
                </View>
              

                <View style={styles.descriptionGroup}>
                  <Clock color="#92929d" size={25} weight="thin" />
                  <Text style={styles.descriptionText} >
                    {`${movieDetails?.runtime} minutos`}
                  </Text>
                </View>

                <View style={styles.descriptionGroup}>
                  <Star
                  color={
                    movieDetails?.vote_average.toFixed(2) >= "7"
                      ? "#FF8700"
                      : "#92929D"
                  }
                  size={25}
                  weight={
                    movieDetails?.vote_average.toFixed(2) >= "7"
                      ? "duotone"
                      : "thin"
                  }
                />
                  <Text 
                    style={[movieDetails?.vote_average.toFixed(2) >= "7" ? styles.descriptionText1 : styles.descriptionText]} 
                  >
                    {movieDetails?.vote_average.toFixed(1)}
                  </Text>            
                </View>

              </View>
          </View>

          <View style={styles.about}>
            <Text style={styles.aboutText}>Sinopse</Text>
            <Text style={styles.aboutText}>
              {movieDetails?.overview === ""
                ? "Ops! Parece que esse filme ainda não tem sinopse :-("
                : movieDetails?.overview}
            </Text>
          </View>
        
        </> }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  header: {
    paddingTop: 30,
    height: 115,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  detailsImage: {
    position: "absolute",
    width: "100%",
    height: 210,

  },
  detailsPosterImage: {
    width: 100,
    height: 160,
    borderRadius: 16,
    left: 29,
    right: 251,
    top: 140,
  },
  titleMovie: {
    position: "absolute",
    height: 50,
    left: 140,
    right: 32,
    top: 240,
    color: "#fff",
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "700",
  },
  description: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 170,
  },
  descriptionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  descriptionText: {
    marginRight: 10,
    color: "#92929D",
  },
  descriptionText1: {
    marginRight: 10,
    color: "#FF8700",
  },
  about: {
    padding: 20,
  },
  aboutText: {
    color: "#fff",
    textAlign: "justify",
  },
});